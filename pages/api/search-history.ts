import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth, requireAuth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // 検索履歴を保存
    const session = await getAuth(req, res);
    if (!session) return res.status(200).json({ saved: false });

    const { query, resultCount } = req.body;
    if (!query || typeof query !== 'object') {
      return res.status(400).json({ error: '不正なクエリです' });
    }

    // 直近1分以内の同一クエリは保存しない
    const recent = await prisma.searchHistory.findFirst({
      where: {
        userId: session.user.id,
        createdAt: { gte: new Date(Date.now() - 60000) },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (recent && JSON.stringify(recent.query) === JSON.stringify(query)) {
      return res.status(200).json({ saved: false, duplicate: true });
    }

    await prisma.searchHistory.create({
      data: {
        userId: session.user.id,
        query,
        resultCount: resultCount ?? null,
      },
    });

    // 古い履歴を削除（最新50件のみ保持）
    const histories = await prisma.searchHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });
    if (histories.length > 50) {
      const deleteIds = histories.slice(50).map((h) => h.id);
      await prisma.searchHistory.deleteMany({ where: { id: { in: deleteIds } } });
    }

    return res.status(201).json({ saved: true });
  }

  if (req.method === 'GET') {
    // 検索履歴を取得
    const session = await requireAuth(req, res);
    if (!session) return;

    const histories = await prisma.searchHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { id: true, query: true, resultCount: true, createdAt: true },
    });

    return res.status(200).json(histories.map((h) => ({
      ...h,
      createdAt: h.createdAt.toISOString(),
    })));
  }

  if (req.method === 'DELETE') {
    // 検索履歴を全削除
    const session = await requireAuth(req, res);
    if (!session) return;

    await prisma.searchHistory.deleteMany({ where: { userId: session.user.id } });
    return res.status(200).json({ deleted: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
