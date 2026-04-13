import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth, requireAuth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;

  if (req.method === 'GET') {
    const recruitment = await prisma.recruitment.findUnique({
      where: { id },
      include: {
        poster: { select: { id: true, name: true, displayName: true, image: true, avatarUrl: true, bio: true, groupName: true } },
        theaterGroup: { select: { id: true, name: true, slug: true, prefecture: true, groupType: true, website: true, twitter: true } },
        _count: { select: { applications: true } },
      },
    });

    if (!recruitment) return res.status(404).json({ error: '募集が見つかりません' });

    // 閲覧数を増やす
    await prisma.recruitment.update({ where: { id }, data: { views: { increment: 1 } } });

    return res.status(200).json({
      ...recruitment,
      publishedAt: recruitment.publishedAt.toISOString(),
      startDate: recruitment.startDate?.toISOString() || null,
      endDate: recruitment.endDate?.toISOString() || null,
      expiresAt: recruitment.expiresAt?.toISOString() || null,
      createdAt: recruitment.createdAt.toISOString(),
      updatedAt: recruitment.updatedAt.toISOString(),
      applicationCount: recruitment._count.applications,
    });
  }

  if (req.method === 'PATCH') {
    const session = await requireAuth(req, res);
    if (!session) return;

    const recruitment = await prisma.recruitment.findUnique({ where: { id }, select: { postedBy: true } });
    if (!recruitment) return res.status(404).json({ error: '募集が見つかりません' });
    if (recruitment.postedBy !== session.user.id && session.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'この募集を編集する権限がありません' });
    }

    const { status, ...updateData } = req.body;
    const data: any = {};
    if (status) data.status = status;
    if (updateData.title) data.title = updateData.title;
    if (updateData.description) data.description = updateData.description;

    const updated = await prisma.recruitment.update({ where: { id }, data });
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    const session = await requireAuth(req, res);
    if (!session) return;

    const recruitment = await prisma.recruitment.findUnique({ where: { id }, select: { postedBy: true } });
    if (!recruitment) return res.status(404).json({ error: '募集が見つかりません' });
    if (recruitment.postedBy !== session.user.id && session.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'この募集を削除する権限がありません' });
    }

    await prisma.recruitment.delete({ where: { id } });
    return res.status(200).json({ deleted: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
