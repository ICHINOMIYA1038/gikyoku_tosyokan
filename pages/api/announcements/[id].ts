import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const announcementId = parseInt(id as string);

  if (isNaN(announcementId)) {
    return res.status(400).json({ error: 'Invalid announcement ID' });
  }

  if (req.method === 'GET') {
    try {
      const announcement = await prisma.announcement.findUnique({
        where: { id: announcementId },
        include: {
          post: { select: { id: true, title: true } },
        },
      });

      if (!announcement || announcement.deletedAt) {
        return res.status(404).json({ error: 'Announcement not found' });
      }

      // 未承認は本人のみ閲覧可
      if (announcement.status !== 'approved') {
        const session = await getAuth(req, res);
        if (!session || session.user.id !== announcement.userId) {
          return res.status(404).json({ error: 'Announcement not found' });
        }
      }

      if (announcement.status === 'approved') {
        await prisma.announcement.update({
          where: { id: announcementId },
          data: { views: { increment: 1 } },
        });
      }

      res.status(200).json(announcement);
    } catch (error) {
      console.error('Error fetching announcement:', error);
      res.status(500).json({ error: 'Failed to fetch announcement' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const session = await getAuth(req, res);
      if (!session) {
        return res.status(401).json({ error: 'ログインが必要です' });
      }

      const announcement = await prisma.announcement.findUnique({
        where: { id: announcementId },
      });

      if (!announcement || announcement.deletedAt) {
        return res.status(404).json({ error: 'Announcement not found' });
      }

      if (announcement.userId !== session.user.id) {
        return res.status(403).json({ error: 'この投稿を削除する権限がありません' });
      }

      await prisma.announcement.update({
        where: { id: announcementId },
        data: { deletedAt: new Date(), deletedBy: 'self' },
      });

      res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      res.status(500).json({ error: 'Failed to delete announcement' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
