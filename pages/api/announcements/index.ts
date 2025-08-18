import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 20 } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const [announcements, total] = await Promise.all([
        prisma.announcement.findMany({
          select: {
            id: true,
            title: true,
            content: true,
            performanceDate: true,
            venue: true,
            ticketPrice: true,
            contactInfo: true,
            authorName: true,
            createdAt: true,
            views: true,
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum,
        }),
        prisma.announcement.count(),
      ]);

      // キャッシュヘッダーを設定（1分間キャッシュ）
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      
      res.status(200).json({
        announcements,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      });
    } catch (error) {
      console.error('Error fetching announcements:', error);
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        title,
        content,
        performanceDate,
        venue,
        ticketPrice,
        contactInfo,
        authorName,
      } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'タイトルと内容は必須です' });
      }

      const ipAddress =
        req.headers['x-real-ip'] as string ||
        req.headers['x-forwarded-for'] as string ||
        req.socket.remoteAddress;

      const announcement = await prisma.announcement.create({
        data: {
          title,
          content,
          performanceDate: performanceDate ? new Date(performanceDate) : null,
          venue,
          ticketPrice,
          contactInfo,
          authorName: authorName || '名無しさん',
          ipAddress,
        },
      });

      res.status(201).json(announcement);
    } catch (error) {
      console.error('Error creating announcement:', error);
      res.status(500).json({ error: 'Failed to create announcement' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}