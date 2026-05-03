import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: 'ログインが必要です' });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) return res.status(401).json({ error: 'ユーザーが見つかりません' });

  const userId = user.id;

  if (req.method === 'GET') {
    const toolType = req.query.toolType as string;
    if (!toolType) return res.status(400).json({ error: 'toolType is required' });

    const items = await prisma.userToolData.findMany({
      where: { userId, toolType },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, name: true, data: true, updatedAt: true },
    });

    res.setHeader('Cache-Control', 'no-store');
    return res.json({ items });
  }

  if (req.method === 'POST') {
    const { toolType, name, data } = req.body;
    if (!toolType || !name || !data) {
      return res.status(400).json({ error: 'toolType, name, data are required' });
    }

    // 同じユーザー・ツール・名前のデータがあれば更新、なければ作成
    const existing = await prisma.userToolData.findFirst({
      where: { userId, toolType, name },
    });

    if (existing) {
      const updated = await prisma.userToolData.update({
        where: { id: existing.id },
        data: { data: JSON.stringify(data) },
      });
      return res.json({ item: updated, action: 'updated' });
    }

    const created = await prisma.userToolData.create({
      data: { userId, toolType, name, data: JSON.stringify(data) },
    });
    return res.json({ item: created, action: 'created' });
  }

  if (req.method === 'DELETE') {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'id is required' });

    // 自分のデータのみ削除可能
    const item = await prisma.userToolData.findFirst({ where: { id, userId } });
    if (!item) return res.status(404).json({ error: 'not found' });

    await prisma.userToolData.delete({ where: { id } });
    return res.json({ deleted: true });
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
