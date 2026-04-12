import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth, requireAuth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // ログインユーザーのお気に入りID一覧を返す
    const session = await getAuth(req, res);
    if (!session) return res.status(200).json({ postIds: [] });

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      select: { postId: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ postIds: favorites.map((f) => f.postId) });
  }

  if (req.method === 'POST') {
    // お気に入りトグル
    const session = await requireAuth(req, res);
    if (!session) return;

    const { postId } = req.body;
    if (!postId || typeof postId !== 'number') {
      return res.status(400).json({ error: '不正なpostIdです' });
    }

    const existing = await prisma.favorite.findUnique({
      where: { userId_postId: { userId: session.user.id, postId } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return res.status(200).json({ favorited: false, postId });
    } else {
      await prisma.favorite.create({
        data: { userId: session.user.id, postId },
      });
      return res.status(200).json({ favorited: true, postId });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
