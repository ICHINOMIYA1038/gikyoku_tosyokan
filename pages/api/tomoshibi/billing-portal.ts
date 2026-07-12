import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { applyTomoshibiCors } from '@/lib/tomoshibi-cors';
import { stripe, tomoshibiAppUrl } from '@/lib/stripe';

/**
 * Stripe Customer Portal のセッションを作成する。
 * ログイン済みの Pro ユーザーがここに飛ばされ、Stripe ホスト側で解約・支払い方法変更・領収書再発行を行う。
 * 特商法・利用規約で「サービス内から解約可能」と明記した実体はこれ。
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (applyTomoshibiCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: 'ログインが必要です' });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });
  if (!user?.stripeCustomerId) {
    return res.status(400).json({ error: 'Stripe 顧客情報が見つかりません', code: 'NO_CUSTOMER' });
  }

  const portal = await stripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${tomoshibiAppUrl()}/pro`,
  });

  return res.json({ url: portal.url });
}
