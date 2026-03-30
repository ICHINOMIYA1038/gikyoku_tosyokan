import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { q } = req.query;
  if (!q || typeof q !== 'string' || q.length < 2) {
    return res.status(200).json([]);
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        title: { contains: q },
      },
      select: {
        id: true,
        title: true,
        author: { select: { name: true } },
      },
      take: 10,
      orderBy: { id: 'asc' },
    });

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Error suggesting posts:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
