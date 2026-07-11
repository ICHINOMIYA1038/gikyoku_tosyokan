import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const { category, tag, q, limit } = req.query;
  const take = Math.min(Number(limit) || 100, 200);

  const where: any = { published: true };
  if (category && typeof category === "string") {
    where.category = { slug: category };
  }
  if (tag && typeof tag === "string") {
    where.tags = { has: tag };
  }
  if (q && typeof q === "string") {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { summary: { contains: q, mode: "insensitive" } },
    ];
  }

  const [categories, menus] = await Promise.all([
    prisma.theaterMenuCategory.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: { _count: { select: { menus: { where: { published: true } } } } },
    }),
    prisma.theaterMenu.findMany({
      where,
      take,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        imageUrl: true,
        tags: true,
        duration: true,
        minPeople: true,
        maxPeople: true,
        difficulty: true,
        category: { select: { slug: true, name: true } },
      },
    }),
  ]);

  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  res.status(200).json({
    categories: categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      icon: c.icon,
      count: c._count.menus,
    })),
    menus,
  });
}
