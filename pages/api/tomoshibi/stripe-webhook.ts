import type { NextApiRequest, NextApiResponse } from 'next';
import type { Readable } from 'node:stream';
import { prisma } from '@/lib/prisma';
import { stripe, stripeWebhookSecret } from '@/lib/stripe';
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
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        await syncSubscription(sub);
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await downgradeToFree(sub);
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

async function syncSubscription(sub: Stripe.Subscription) {
  const userId = sub.metadata?.tomoshibiUserId;
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;

  // userId は subscription.metadata から取得できる (checkout 時に付与)。
  // 万一メタデータに無ければ customerId から逆引き。
  let uid: string | undefined = userId;
  if (!uid) {
    const u = await prisma.user.findUnique({ where: { stripeCustomerId: customerId }, select: { id: true } });
    uid = u?.id ?? undefined;
  }
  if (!uid) {
    console.warn('[stripe-webhook] no user for subscription', sub.id, 'customer', customerId);
    return;
  }

  // アクティブとみなすステータス: active / trialing。past_due は暫定 Pro のままにする(グレースピリオド)。
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
  const userId = sub.metadata?.tomoshibiUserId;
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
  const uid = userId ?? (await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
    select: { id: true },
  }))?.id;
  if (!uid) return;
  await prisma.user.update({
    where: { id: uid },
    data: { tomoshibiPlan: 'free', tomoshibiPlanExpiresAt: null, stripeSubscriptionId: null },
  });
}
