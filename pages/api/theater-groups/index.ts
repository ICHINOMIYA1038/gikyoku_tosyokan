import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { Region, TheaterGroupType, Prisma } from '@prisma/client';

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
      groupType,
      universitySlug,
      keyword,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 100);
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.TheaterGroupWhereInput = {
      isActive: true,
    };

    if (keyword) {
      where.name = { contains: keyword as string };
    }
    if (groupType && Object.values(TheaterGroupType).includes(groupType as TheaterGroupType)) {
      where.groupType = groupType as TheaterGroupType;
    }

    // Filter by university-related fields via the join table
    if (region || prefecture || universitySlug) {
      const universityFilter: Prisma.UniversityWhereInput = {};
      if (region && Object.values(Region).includes(region as Region)) {
        universityFilter.region = region as Region;
      }
      if (prefecture) {
        universityFilter.prefecture = prefecture as string;
      }
      if (universitySlug) {
        universityFilter.slug = universitySlug as string;
      }
      where.universities = {
        some: {
          university: universityFilter,
        },
      };
    }

    const [theaterGroups, total] = await Promise.all([
      prisma.theaterGroup.findMany({
        where,
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
          universities: {
            include: {
              university: {
                select: {
                  name: true,
                  slug: true,
                  prefecture: true,
                  region: true,
                },
              },
            },
          },
        },
        orderBy: { name: 'asc' },
        skip,
        take: limitNum,
      }),
      prisma.theaterGroup.count({ where }),
    ]);

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

    res.status(200).json({
      theaterGroups,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error('Error fetching theater groups:', error);
    res.status(500).json({ error: 'Failed to fetch theater groups' });
  }
}
