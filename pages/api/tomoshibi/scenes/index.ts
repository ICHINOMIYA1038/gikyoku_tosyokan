import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import {
  applyTomoshibiCors,
  validateSceneData,
  MAX_SCENES_PER_USER,
  MAX_NAME_LEN,
} from '@/lib/tomoshibi-cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (applyTomoshibiCors(req, res)) return;

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: 'ログインが必要です' });
  const userId = session.user.id;

  if (req.method === 'GET') {
    const items = await prisma.tomoshibiScene.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, name: true, updatedAt: true, createdAt: true },
    });
    res.setHeader('Cache-Control', 'no-store');
    return res.json({ items });
  }

  if (req.method === 'POST') {
    const { name, data } = (req.body ?? {}) as { name?: unknown; data?: unknown };
    if (typeof name !== 'string' || !name.trim() || name.length > MAX_NAME_LEN) {
      return res.status(400).json({ error: '名前は1〜60文字で指定してください' });
    }
    const v = validateSceneData(data);
    if (!v.ok) return res.status(413).json({ error: v.error });

    const count = await prisma.tomoshibiScene.count({ where: { userId } });
    if (count >= MAX_SCENES_PER_USER) {
      return res.status(403).json({ error: `保存できるシーンは${MAX_SCENES_PER_USER}件までです` });
    }

    const created = await prisma.tomoshibiScene.create({
      data: { userId, name: name.trim(), data: data as object },
      select: { id: true, name: true, updatedAt: true },
    });
    return res.status(201).json(created);
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS');
  return res.status(405).json({ error: 'Method Not Allowed' });
}
