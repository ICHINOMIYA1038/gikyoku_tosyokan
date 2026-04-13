import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

/**
 * 会場名サジェストAPI
 * 既存の上演告知・劇団情報から会場名を候補として返す
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const q = (req.query.q as string || '').trim();
  if (q.length < 1) return res.status(200).json([]);

  // 過去の告知から会場名を取得
  const announcements = await prisma.announcement.findMany({
    where: {
      venue: { contains: q, mode: 'insensitive' },
    },
    select: { venue: true },
    distinct: ['venue'],
    take: 10,
  });

  const venues = announcements
    .map((a) => a.venue)
    .filter((v): v is string => !!v);

  // 重複除去してソート
  const unique = Array.from(new Set(venues)).sort().slice(0, 10);

  res.setHeader('Cache-Control', 'public, s-maxage=3600');
  return res.status(200).json(unique);
}
