import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { Region, UniversityType, Prisma } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const {
      page = '1',
      limit = '50',
      region,
      prefecture,
      universityType,
      keyword,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 100);
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.UniversityWhereInput = {};

    if (region && Object.values(Region).includes(region as Region)) {
      where.region = region as Region;
    }
    if (prefecture) {
      where.prefecture = prefecture as string;
    }
    if (universityType && Object.values(UniversityType).includes(universityType as UniversityType)) {
      where.universityType = universityType as UniversityType;
    }
    if (keyword) {
      where.name = { contains: keyword as string };
    }

    const [universities, total] = await Promise.all([
      prisma.university.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          universityType: true,
          prefecture: true,
          region: true,
          _count: { select: { theaterGroups: true } },
        },
        orderBy: { name: 'asc' },
        skip,
        take: limitNum,
      }),
      prisma.university.count({ where }),
    ]);

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

    res.status(200).json({
      universities,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
}
