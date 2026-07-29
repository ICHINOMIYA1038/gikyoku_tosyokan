import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth, requireAuth } from '@/lib/auth';

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

      const where = { status: 'approved', deletedAt: null } as const;
      const [announcements, total] = await Promise.all([
        prisma.announcement.findMany({
          where,
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
            theaterGroupName: true,
            scriptTitle: true,
            postId: true,
            post: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum,
        }),
        prisma.announcement.count({ where }),
      ]);

      // キャッシュヘッダーを設定（1分間キャッシュ）
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

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
    // ログイン必須
    const session = await requireAuth(req, res);
    if (!session) return;

    try {
      const {
        title,
        content,
        performanceDate,
        venue,
        ticketPrice,
        contactInfo,
        postId,
        theaterGroupName,
        scriptTitle,
        images,
      } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'タイトルと内容は必須です' });
      }

      const ipAddress =
        req.headers['x-real-ip'] as string ||
        req.headers['x-forwarded-for'] as string ||
        req.socket.remoteAddress;

      // postIdが指定されている場合、存在確認
      if (postId) {
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
          return res.status(400).json({ error: '指定された作品が見つかりません' });
        }
      }

      // ログインユーザーのdisplayNameを使用
      const userId = session.user.id;
      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { displayName: true, name: true },
      });
      const displayAuthor = dbUser?.displayName || dbUser?.name || session.user.name || 'ユーザー';

      const announcement = await prisma.announcement.create({
        data: {
          title,
          content,
          performanceDate: performanceDate ? new Date(performanceDate) : null,
          venue,
          ticketPrice,
          contactInfo,
          authorName: displayAuthor,
          ipAddress,
          userId,
          postId: postId ? parseInt(postId) : null,
          theaterGroupName: theaterGroupName || null,
          images: images || [],
          scriptTitle: scriptTitle || null,
          status: 'approved',
          reviewedAt: new Date(),
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
