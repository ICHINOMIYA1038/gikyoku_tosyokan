import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { applyTomoshibiCors, isProActive } from '@/lib/tomoshibi-cors';
import { stripe, stripePriceId, tomoshibiAppUrl } from '@/lib/stripe';

/**
 * tomoshibi Pro プラン用 Stripe Checkout セッション作成エンドポイント。
 * ログイン済ユーザーからのみ POST を受け付け、Checkout の URL を返す。
 * フロント (tomoshibi) はレスポンスの url に遷移する。
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (applyTomoshibiCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: 'ログインが必要です' });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, email: true, name: true,
      stripeCustomerId: true,
      tomoshibiPlan: true, tomoshibiPlanExpiresAt: true,
    },
  });
  if (!user) return res.status(404).json({ error: 'ユーザーが見つかりません' });
  if (isProActive(user.tomoshibiPlan, user.tomoshibiPlanExpiresAt)) {
    return res.status(400).json({ error: '既に Pro プランに加入済みです', code: 'ALREADY_PRO' });
  }

  const s = stripe();

  // Stripe Customer を先に作成 or 既存を再利用。
  // メタデータに userId を持たせておくと Webhook 側で照合できる。
  let customerId = user.stripeCustomerId ?? null;
  if (!customerId) {
    const created = await s.customers.create({
      email: user.email ?? undefined,
      name: user.name ?? undefined,
      metadata: { tomoshibiUserId: user.id },
    });
    customerId = created.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }

  const appUrl = tomoshibiAppUrl();
  const checkout = await s.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: stripePriceId(), quantity: 1 }],
    success_url: `${appUrl}/pro/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/pro/cancel`,
    // Webhook で照合する用の情報
    subscription_data: { metadata: { tomoshibiUserId: user.id } },
    metadata: { tomoshibiUserId: user.id },
    // 個人事業主・小規模 SaaS でよく使う設定
    allow_promotion_codes: true,
    // 領収書用メールを自動送信 (Stripe デフォルト設定に従う)
    locale: 'ja',
  });

  if (!checkout.url) return res.status(500).json({ error: 'Checkout URL を取得できませんでした' });
  return res.json({ url: checkout.url });
}
