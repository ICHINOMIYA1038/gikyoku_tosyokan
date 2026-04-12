import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * localStorage のお気に入りをDBに一括同期するAPI
 * ログイン直後に1回だけ呼ばれる想定
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await requireAuth(req, res);
  if (!session) return;

  const { postIds } = req.body;
  if (!Array.isArray(postIds) || postIds.length === 0) {
    return res.status(400).json({ error: '不正なpostIdsです' });
  }

  // 安全制限: 最大100件
  const safeIds = postIds.slice(0, 100).filter((id: unknown) => typeof id === 'number');

  await prisma.favorite.createMany({
    data: safeIds.map((postId: number) => ({
      userId: session.user.id,
      postId,
    })),
    skipDuplicates: true,
  });

  // 同期後の最新リストを返す
  const updated = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    select: { postId: true },
    orderBy: { createdAt: 'desc' },
  });

  return res.status(200).json({ postIds: updated.map((f) => f.postId) });
}
