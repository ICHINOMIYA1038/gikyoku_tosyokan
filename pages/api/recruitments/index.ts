import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth, requireAuth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const {
      page = '1',
      limit = '20',
      prefecture,
      role,
      experience,
      q,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 50);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { status: 'ACTIVE' };
    if (prefecture) where.OR = [
      { venue: { contains: prefecture as string } },
      { rehearsalLocation: { contains: prefecture as string } },
      { theaterGroup: { prefecture: prefecture as string } },
    ];
    if (role) where.rolesWanted = { has: role as string };
    if (experience && experience !== 'ANY') where.experienceLevel = experience;
    if (q) where.AND = [
      { OR: [
        { title: { contains: q as string, mode: 'insensitive' } },
        { description: { contains: q as string, mode: 'insensitive' } },
        { theaterGroupName: { contains: q as string, mode: 'insensitive' } },
      ]},
    ];

    const [recruitments, total] = await Promise.all([
      prisma.recruitment.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          poster: { select: { id: true, name: true, displayName: true, image: true, avatarUrl: true } },
          theaterGroup: { select: { id: true, name: true, slug: true, prefecture: true, groupType: true } },
          _count: { select: { applications: true } },
        },
      }),
      prisma.recruitment.count({ where }),
    ]);

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json({
      recruitments: recruitments.map((r) => ({
        ...r,
        publishedAt: r.publishedAt.toISOString(),
        startDate: r.startDate?.toISOString() || null,
        endDate: r.endDate?.toISOString() || null,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        expiresAt: r.expiresAt?.toISOString() || null,
        applicationCount: r._count.applications,
      })),
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  }

  if (req.method === 'POST') {
    const session = await requireAuth(req, res);
    if (!session) return;

    const {
      title, description, theaterGroupId, theaterGroupName,
      rolesWanted, experienceLevel, genderRequirement,
      ageRangeMin, ageRangeMax, feeStructure,
      rehearsalFrequency, rehearsalLocation,
      venue, startDate, endDate, images, contactMethod,
    } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ error: 'タイトルと募集内容は必須です' });
    }
    if (!rolesWanted || !Array.isArray(rolesWanted) || rolesWanted.length === 0) {
      return res.status(400).json({ error: '募集する役割を1つ以上選択してください' });
    }

    const recruitment = await prisma.recruitment.create({
      data: {
        title,
        description,
        postedBy: session.user.id,
        theaterGroupId: theaterGroupId || null,
        theaterGroupName: theaterGroupName || null,
        rolesWanted,
        experienceLevel: experienceLevel || 'ANY',
        genderRequirement: genderRequirement || null,
        ageRangeMin: ageRangeMin ? parseInt(ageRangeMin) : null,
        ageRangeMax: ageRangeMax ? parseInt(ageRangeMax) : null,
        feeStructure: feeStructure || null,
        rehearsalFrequency: rehearsalFrequency || null,
        rehearsalLocation: rehearsalLocation || null,
        venue: venue || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        images: images || [],
        contactMethod: contactMethod || null,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3ヶ月で自動期限切れ
      },
    });

    return res.status(201).json(recruitment);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
