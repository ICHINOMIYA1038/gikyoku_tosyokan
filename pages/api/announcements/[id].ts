import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

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
      });

      if (!announcement) {
        return res.status(404).json({ error: 'Announcement not found' });
      }

      // ビュー数を増やす
      await prisma.announcement.update({
        where: { id: announcementId },
        data: { views: { increment: 1 } },
      });

      res.status(200).json(announcement);
    } catch (error) {
      console.error('Error fetching announcement:', error);
      res.status(500).json({ error: 'Failed to fetch announcement' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // IPアドレスチェック（投稿者のみ削除可能）
      const ipAddress =
        req.headers['x-real-ip'] as string ||
        req.headers['x-forwarded-for'] as string ||
        req.socket.remoteAddress;

      const announcement = await prisma.announcement.findUnique({
        where: { id: announcementId },
      });

      if (!announcement) {
        return res.status(404).json({ error: 'Announcement not found' });
      }

      if (announcement.ipAddress !== ipAddress) {
        return res.status(403).json({ error: 'Unauthorized to delete this announcement' });
      }

      await prisma.announcement.delete({
        where: { id: announcementId },
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