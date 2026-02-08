import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const posts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        tags: true,
        publishedAt: true,
        published: true,
      },
    });
    return res.status(200).json(posts);
  }

  if (req.method === 'POST') {
    const { title, slug, content, description, tags, publishedAt } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'title, slug, content are required' });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        description: description || null,
        tags: tags || [],
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        published: true,
      },
    });
    return res.status(201).json(post);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
