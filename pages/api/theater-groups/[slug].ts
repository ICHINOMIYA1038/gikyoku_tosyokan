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

  try {
    const { slug } = req.query;

    const theaterGroup = await prisma.theaterGroup.findUnique({
      where: { slug: slug as string },
      include: {
        universities: {
          include: {
            university: {
              select: {
                id: true,
                name: true,
                slug: true,
                universityType: true,
                prefecture: true,
                region: true,
              },
            },
          },
        },
      },
    });

    if (!theaterGroup) {
      return res.status(404).json({ error: 'Theater group not found' });
    }

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(theaterGroup);
  } catch (error) {
    console.error('Error fetching theater group:', error);
    res.status(500).json({ error: 'Failed to fetch theater group' });
  }
}
