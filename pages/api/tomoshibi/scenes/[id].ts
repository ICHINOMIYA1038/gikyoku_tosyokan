import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import {
  applyTomoshibiCors,
  validateSceneData,
  MAX_NAME_LEN,
} from '@/lib/tomoshibi-cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (applyTomoshibiCors(req, res)) return;

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: 'ログインが必要です' });
  const userId = session.user.id;

  const id = req.query.id;
  if (typeof id !== 'string') return res.status(400).json({ error: 'id is required' });

  const owned = await prisma.tomoshibiScene.findFirst({ where: { id, userId }, select: { id: true } });
  if (!owned) return res.status(404).json({ error: 'シーンが見つかりません' });

  if (req.method === 'GET') {
    const scene = await prisma.tomoshibiScene.findUnique({
      where: { id },
      select: { id: true, name: true, data: true, updatedAt: true, createdAt: true },
    });
    res.setHeader('Cache-Control', 'no-store');
    return res.json(scene);
  }

  if (req.method === 'PUT') {
    const { name, data } = (req.body ?? {}) as { name?: unknown; data?: unknown };
    const patch: { name?: string; data?: object } = {};
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim() || name.length > MAX_NAME_LEN) {
        return res.status(400).json({ error: '名前は1〜60文字で指定してください' });
      }
      patch.name = name.trim();
    }
    if (data !== undefined) {
      const v = validateSceneData(data);
      if (!v.ok) return res.status(413).json({ error: v.error });
      patch.data = data as object;
    }
    const updated = await prisma.tomoshibiScene.update({
      where: { id },
      data: patch,
      select: { id: true, name: true, updatedAt: true },
    });
    return res.json(updated);
  }

  if (req.method === 'DELETE') {
    await prisma.tomoshibiScene.delete({ where: { id } });
    return res.status(204).end();
  }

  res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
  return res.status(405).json({ error: 'Method Not Allowed' });
}
