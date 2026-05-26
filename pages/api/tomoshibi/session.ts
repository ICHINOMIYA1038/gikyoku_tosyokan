import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { applyTomoshibiCors } from '@/lib/tomoshibi-cors';

/**
 * tomoshibi 用の軽量セッション確認エンドポイント。
 * NextAuth 標準の /api/auth/session には CORS ヘッダが付かないため、
 * クロスサブドメインから叩く用に専用ルートを用意する。
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (applyTomoshibiCors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  res.setHeader('Cache-Control', 'no-store');
  if (!session?.user?.id) return res.json({ user: null });
  return res.json({
    user: {
      id: session.user.id,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
    },
  });
}
