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

    const university = await prisma.university.findUnique({
      where: { slug: slug as string },
      include: {
        theaterGroups: {
          include: {
            theaterGroup: {
              select: {
                id: true,
                name: true,
                slug: true,
                groupType: true,
                description: true,
                memberCount: true,
                website: true,
                twitter: true,
                instagram: true,
                corich: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(university);
  } catch (error) {
    console.error('Error fetching university:', error);
    res.status(500).json({ error: 'Failed to fetch university' });
  }
}
