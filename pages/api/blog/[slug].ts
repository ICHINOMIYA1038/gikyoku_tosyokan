import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const slug = req.query.slug as string;

  if (req.method === 'GET') {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(200).json(post);
  }

  if (req.method === 'PUT') {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing) {
      return res.status(404).json({ error: 'Not found' });
    }

    const { title, content, description, tags, publishedAt, published } = req.body;

    const post = await prisma.blogPost.update({
      where: { slug },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(description !== undefined && { description }),
        ...(tags !== undefined && { tags }),
        ...(publishedAt !== undefined && { publishedAt: new Date(publishedAt) }),
        ...(published !== undefined && { published }),
      },
    });
    return res.status(200).json(post);
  }

  if (req.method === 'DELETE') {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing) {
      return res.status(404).json({ error: 'Not found' });
    }

    await prisma.blogPost.delete({ where: { slug } });
    return res.status(200).json({ message: 'Deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
