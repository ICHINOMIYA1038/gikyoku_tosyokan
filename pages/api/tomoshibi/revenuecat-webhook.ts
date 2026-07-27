import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { revenueCatWebhookSecret, REVENUECAT_PRO_ENTITLEMENT_ID } from '@/lib/revenuecat';
import { notifySlack, slackSection } from '@/lib/slack';

/**
 * tomoshibiモバイルアプリ (App Store IAP) のPro購読状態をRevenueCat経由で同期する。
 * Web版のStripe Webhook (stripe-webhook.ts) と同じ User.tomoshibiPlan /
 * tomoshibiPlanExpiresAt を更新する — 購読経路に関わらずプランのソースは一本化される。
 *
 * 認証: RevenueCatダッシュボードで設定した固定のAuthorizationヘッダー値を照合する
 * (署名検証ではなく共有シークレット方式。RevenueCat Webhookの標準仕様)。
 *
 * app_user_id は、モバイルアプリが Purchases.logIn(<gikyokutosyokan の User.id>) で
 * 明示的に設定したものを前提とする。ログイン前 (匿名ID) での購入は想定していない。
 */

interface RevenueCatEventPayload {
  id: string;
  type: string;
  app_user_id: string;
  product_id?: string;
  entitlement_ids?: string[] | null;
  expiration_at_ms?: number | null;
  event_timestamp_ms: number;
  environment?: string;
}

// これらのイベントは「Pro Entitlementが有効な状態」を表す。
const PRO_GRANTING_TYPES = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'UNCANCELLATION',
  'PRODUCT_CHANGE',
  'SUBSCRIPTION_EXTENDED',
  'TRANSFER',
  'TEMPORARY_ENTITLEMENT_GRANT',
]);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  // 環境変数未設定など設定ミスもJSONで返す (Next.jsの汎用500 HTMLページに
  // フォールバックすると原因の切り分けが難しくなるため)。
  let expectedAuth: string;
  try {
    expectedAuth = `Bearer ${revenueCatWebhookSecret()}`;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[revenuecat-webhook] config error:', msg);
    return res.status(500).json({ error: msg });
  }

  const auth = req.headers['authorization'];
  if (auth !== expectedAuth) {
    return res.status(401).send('Unauthorized');
  }

  const body = req.body as { api_version?: string; event?: RevenueCatEventPayload };
  const event = body?.event;
  if (!event) return res.status(400).send('Missing event');

  // RevenueCatダッシュボードの「Send Test Webhook」用。DBに触れず即ACK。
  if (event.type === 'TEST') {
    return res.json({ received: true, test: true });
  }

  // === Idempotency: 同じ event.id を二度処理しない (stripe-webhook.ts と同じ方式) ===
  try {
    await prisma.revenueCatEvent.create({
      data: {
        id: event.id,
        type: event.type,
        eventCreated: new Date(event.event_timestamp_ms),
      },
    });
  } catch (err) {
    if (typeof err === 'object' && err !== null && (err as { code?: string }).code === 'P2002') {
      console.info('[revenuecat-webhook] duplicate event ignored:', event.id, event.type);
      return res.json({ received: true, duplicate: true });
    }
    throw err;
  }

  try {
    const userId = event.app_user_id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, displayName: true, email: true },
    });
    if (!user) {
      console.warn(
        '[revenuecat-webhook] unknown app_user_id (purchased before Sign In?):',
        userId,
        event.type
      );
      return res.json({ received: true, unknownUser: true });
    }

    const hasProEntitlement = (event.entitlement_ids ?? []).includes(REVENUECAT_PRO_ENTITLEMENT_ID);

    if (event.type === 'EXPIRATION') {
      await prisma.user.update({
        where: { id: userId },
        data: { tomoshibiPlan: 'free', tomoshibiPlanExpiresAt: null },
      });
      await notifyProEnded(user);
    } else if (PRO_GRANTING_TYPES.has(event.type) && hasProEntitlement) {
      const expiresAt = event.expiration_at_ms ? new Date(event.expiration_at_ms) : null;
      await prisma.user.update({
        where: { id: userId },
        data: { tomoshibiPlan: 'pro', tomoshibiPlanExpiresAt: expiresAt },
      });
      if (event.type === 'INITIAL_PURCHASE') await notifyProSubscribed(user);
    } else if (event.type === 'CANCELLATION') {
      // 自動更新がオフになっただけ。期限まではProが有効なので即downgradeしない
      // (期限到来時に別途 EXPIRATION イベントが飛んでくる)。
      await notifyProCanceled(user, event.expiration_at_ms ?? null);
    }
    // BILLING_ISSUE 等、上記以外はプラン状態を変更しない (ログのみ)。

    return res.json({ received: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[revenuecat-webhook] handler error:', msg, 'event:', event.type);
    return res.status(500).json({ error: msg });
  }
}

interface NotifyUser {
  name: string | null;
  displayName: string | null;
  email: string | null;
}

function displayNameOf(u: NotifyUser): string {
  return u.displayName ?? u.name ?? '(名前未設定)';
}

async function proStats(): Promise<{ proCount: number; mrrJpy: number }> {
  const proCount = await prisma.user
    .count({ where: { tomoshibiPlan: 'pro', tomoshibiPlanExpiresAt: { gt: new Date() } } })
    .catch(() => 0);
  return { proCount, mrrJpy: proCount * 300 };
}

async function notifyProSubscribed(u: NotifyUser): Promise<void> {
  const { proCount, mrrJpy } = await proStats();
  const emailLine = u.email ? `\nメール: ${u.email}` : '';
  await notifySlack({
    text: `💰 Pro プラン加入 (App Store): ${displayNameOf(u)}`,
    iconEmoji: ':moneybag:',
    blocks: [
      slackSection(
        `*💰 Pro プラン加入 (App Store)*\n氏名: ${displayNameOf(u)}${emailLine}\n月額: ¥300\n現在の Pro 会員: *${proCount}* 人 / MRR: *¥${mrrJpy.toLocaleString('ja-JP')}*`
      ),
    ],
  });
}

async function notifyProCanceled(u: NotifyUser, expirationAtMs: number | null): Promise<void> {
  const endDate = expirationAtMs
    ? new Date(expirationAtMs).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
    : '不明';
  const emailLine = u.email ? `\nメール: ${u.email}` : '';
  await notifySlack({
    text: `😢 Pro プラン解約予約 (App Store): ${displayNameOf(u)}`,
    iconEmoji: ':disappointed:',
    blocks: [
      slackSection(
        `*😢 Pro プラン解約 (App Store, 期間終了時)*\n氏名: ${displayNameOf(u)}${emailLine}\n利用終了予定: *${endDate}*`
      ),
    ],
  });
}

async function notifyProEnded(u: NotifyUser): Promise<void> {
  const { proCount, mrrJpy } = await proStats();
  const emailLine = u.email ? `\nメール: ${u.email}` : '';
  await notifySlack({
    text: `👋 Pro プラン利用終了 (App Store): ${displayNameOf(u)}`,
    iconEmoji: ':wave:',
    blocks: [
      slackSection(
        `*👋 Pro プラン利用終了 (App Store, Free へ戻る)*\n氏名: ${displayNameOf(u)}${emailLine}\n現在の Pro 会員: *${proCount}* 人 / MRR: *¥${mrrJpy.toLocaleString('ja-JP')}*`
      ),
    ],
  });
}
