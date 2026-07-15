import type { NextApiRequest, NextApiResponse } from 'next';
import type { Readable } from 'node:stream';
import { prisma } from '@/lib/prisma';
import { stripe, stripeWebhookSecret } from '@/lib/stripe';
import { notifySlack, slackSection } from '@/lib/slack';
import type Stripe from 'stripe';

// Stripe Webhook は生のリクエストボディが必要なので Next.js のパーサを無効化する。
export const config = { api: { bodyParser: false } };

async function readRaw(readable: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const c of readable) chunks.push(typeof c === 'string' ? Buffer.from(c) : c);
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  if (typeof sig !== 'string') return res.status(400).send('Missing signature');

  let event: Stripe.Event;
  try {
    const raw = await readRaw(req);
    event = stripe().webhooks.constructEvent(raw, sig, stripeWebhookSecret());
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[stripe-webhook] signature verification failed:', msg);
    return res.status(400).send(`Webhook Error: ${msg}`);
  }

  // === Idempotency: 同じ event.id を二度処理しない ===
  // event.id を PK にした INSERT が unique 制約違反なら「処理済み」として早期 return。
  try {
    await prisma.stripeEvent.create({
      data: {
        id: event.id,
        type: event.type,
        eventCreated: new Date(event.created * 1000),
      },
    });
  } catch (err) {
    // P2002 = unique constraint violation → 重複イベント。200 で ACK して Stripe の再送を止める。
    if (typeof err === 'object' && err !== null && (err as { code?: string }).code === 'P2002') {
      console.info('[stripe-webhook] duplicate event ignored:', event.id, event.type);
      return res.json({ received: true, duplicate: true });
    }
    throw err;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        // Checkout 完了直後: subscription はまだ subscription.created で作られる。
        // ここでは customerId ↔ userId の紐付けを念のため確認する程度。
        const s = event.data.object as Stripe.Checkout.Session;
        const userId = s.metadata?.tomoshibiUserId;
        if (userId && typeof s.customer === 'string') {
          await prisma.user.updateMany({
            where: { id: userId, stripeCustomerId: null },
            data: { stripeCustomerId: s.customer },
          });
        }
        break;
      }
      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription;
        await syncSubscription(sub);
        // 新規 Pro 加入通知 (fire-and-forget)
        void notifyProSubscribed(sub);
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        // 解約予約 (cancel_at_period_end 遷移) を検知
        const prev = (event.data as { previous_attributes?: { cancel_at_period_end?: boolean } }).previous_attributes;
        const becameCanceled = sub.cancel_at_period_end === true && prev?.cancel_at_period_end === false;
        await syncSubscription(sub);
        if (becameCanceled) void notifyProCanceled(sub);
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await downgradeToFree(sub);
        // 期間終了による最終削除の通知
        void notifyProEnded(sub);
        break;
      }
      case 'invoice.payment_failed': {
        // 支払い失敗時のログ。次回リトライで復活する可能性があるため即座には downgrade しない。
        // 最終的に subscription.deleted か status='canceled' に遷移するのを待つ。
        const inv = event.data.object as Stripe.Invoice;
        console.warn('[stripe-webhook] invoice.payment_failed', {
          customer: inv.customer,
          subscription: (inv as unknown as { subscription?: string }).subscription,
        });
        break;
      }
      default:
        // 未処理イベントは無視 (Stripe は 200 を期待する)
        break;
    }
    return res.json({ received: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[stripe-webhook] handler error:', msg, 'event:', event.type);
    // Stripe 側にリトライさせるため 500 を返す
    return res.status(500).json({ error: msg });
  }
}

/**
 * subscription から userId を決定する。
 * 攻撃防御: metadata.tomoshibiUserId を無条件に信用せず、必ず stripeCustomerId で DB を引き、
 * 一致するユーザーが居ることを確認する (metadata と DB の customerId の cross-check)。
 * どちらかが欠けている・不整合の場合は処理を中断してアラート。
 */
async function resolveUserIdSafely(sub: Stripe.Subscription): Promise<string | null> {
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
  const metadataUserId = sub.metadata?.tomoshibiUserId ?? null;

  const byCustomer = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
    select: { id: true },
  });

  // どちらも無い → 未知の customer。ログのみ。
  if (!byCustomer && !metadataUserId) {
    console.warn('[stripe-webhook] no user for subscription', sub.id, 'customer', customerId);
    return null;
  }

  // metadata がある & customer 引きもある → 一致必須。
  if (byCustomer && metadataUserId && byCustomer.id !== metadataUserId) {
    console.error('[stripe-webhook] MISMATCH between metadata userId and customer-lookup', {
      subId: sub.id,
      customerId,
      metadataUserId,
      dbUserId: byCustomer.id,
    });
    return null; // 詐称の可能性あり → 更新しない
  }

  // 通常経路
  return byCustomer?.id ?? null;
}

async function syncSubscription(sub: Stripe.Subscription) {
  const uid = await resolveUserIdSafely(sub);
  if (!uid) return;
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;

  // canceled は明示的に downgrade へ回す (順序逆転で古い updated が active を復活させないため)。
  if (sub.status === 'canceled') {
    await downgradeUser(uid);
    return;
  }

  const activeStatuses: Stripe.Subscription.Status[] = ['active', 'trialing', 'past_due'];
  const isActive = activeStatuses.includes(sub.status);
  // 2026-06-24.dahlia 以降、current_period_end は subscription.items.data[0] に移動している。
  // 旧位置 (sub.current_period_end) も後方互換で残っている可能性があるため両方見る。
  const item = sub.items?.data?.[0] as unknown as { current_period_end?: number } | undefined;
  const periodEndSec =
    item?.current_period_end ??
    (sub as unknown as { current_period_end?: number }).current_period_end;
  const expiresAt = periodEndSec ? new Date(periodEndSec * 1000) : null;

  await prisma.user.update({
    where: { id: uid },
    data: {
      tomoshibiPlan: isActive ? 'pro' : 'free',
      tomoshibiPlanExpiresAt: isActive ? expiresAt : null,
      stripeCustomerId: customerId,
      stripeSubscriptionId: sub.id,
    },
  });
}

async function downgradeToFree(sub: Stripe.Subscription) {
  const uid = await resolveUserIdSafely(sub);
  if (!uid) return;
  await downgradeUser(uid);
}

async function downgradeUser(uid: string) {
  await prisma.user.update({
    where: { id: uid },
    // stripeCustomerId は保持 (再開時に同じ Customer を使うため)。
    // stripeSubscriptionId のみクリア。
    data: { tomoshibiPlan: 'free', tomoshibiPlanExpiresAt: null, stripeSubscriptionId: null },
  });
}

/**
 * Slack 通知ヘルパ (fire-and-forget 前提)。
 * user 情報 (メール・氏名) を追加取得し、リッチな通知メッセージを送る。
 */
async function userSummary(sub: Stripe.Subscription): Promise<{ name: string; email: string | null }> {
  const uid = await resolveUserIdSafely(sub);
  if (!uid) return { name: '(未知のユーザー)', email: null };
  const u = await prisma.user.findUnique({
    where: { id: uid },
    select: { name: true, email: true, displayName: true },
  }).catch(() => null);
  const name = u?.displayName ?? u?.name ?? '(名前未設定)';
  return { name, email: u?.email ?? null };
}

async function proStats(): Promise<{ proCount: number; mrrJpy: number }> {
  const proCount = await prisma.user.count({
    where: { tomoshibiPlan: 'pro', tomoshibiPlanExpiresAt: { gt: new Date() } },
  }).catch(() => 0);
  return { proCount, mrrJpy: proCount * 300 };
}

async function notifyProSubscribed(sub: Stripe.Subscription): Promise<void> {
  const { name, email } = await userSummary(sub);
  const { proCount, mrrJpy } = await proStats();
  const emailLine = email ? `\nメール: ${email}` : '';
  await notifySlack({
    text: `💰 Pro プラン加入: ${name}`,
    iconEmoji: ':moneybag:',
    blocks: [
      slackSection(
        `*💰 Pro プラン加入*\n氏名: ${name}${emailLine}\nサブスク ID: \`${sub.id}\`\n月額: ¥300\n現在の Pro 会員: *${proCount}* 人 / MRR: *¥${mrrJpy.toLocaleString('ja-JP')}*`
      ),
    ],
  });
}

async function notifyProCanceled(sub: Stripe.Subscription): Promise<void> {
  const { name, email } = await userSummary(sub);
  const item = sub.items?.data?.[0] as unknown as { current_period_end?: number } | undefined;
  const periodEndSec = item?.current_period_end ?? (sub as unknown as { current_period_end?: number }).current_period_end;
  const endDate = periodEndSec ? new Date(periodEndSec * 1000).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }) : '不明';
  const emailLine = email ? `\nメール: ${email}` : '';
  await notifySlack({
    text: `😢 Pro プラン解約予約: ${name}`,
    iconEmoji: ':disappointed:',
    blocks: [
      slackSection(
        `*😢 Pro プラン解約 (期間終了時)*\n氏名: ${name}${emailLine}\n利用終了予定: *${endDate}*\nサブスク ID: \`${sub.id}\``
      ),
    ],
  });
}

async function notifyProEnded(sub: Stripe.Subscription): Promise<void> {
  const { name, email } = await userSummary(sub);
  const { proCount, mrrJpy } = await proStats();
  const emailLine = email ? `\nメール: ${email}` : '';
  await notifySlack({
    text: `👋 Pro プラン利用終了: ${name}`,
    iconEmoji: ':wave:',
    blocks: [
      slackSection(
        `*👋 Pro プラン利用終了 (Free へ戻る)*\n氏名: ${name}${emailLine}\nサブスク ID: \`${sub.id}\`\n現在の Pro 会員: *${proCount}* 人 / MRR: *¥${mrrJpy.toLocaleString('ja-JP')}*`
      ),
    ],
  });
}
