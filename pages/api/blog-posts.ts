import { NextApiRequest, NextApiResponse } from 'next';
import { getPostsByLanguagePaginated } from '@/lib/blog';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const lang = typeof req.query.lang === 'string' ? req.query.lang : 'ja';
  const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
  const perPage = 20;

  try {
    const { posts, total } = await getPostsByLanguagePaginated(lang, page, perPage);
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ posts, total, page, perPage });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
