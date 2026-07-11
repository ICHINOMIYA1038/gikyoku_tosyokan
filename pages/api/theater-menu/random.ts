import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

/**
 * ランダム抽出API。
 * - ?category=etude で「エチュードのお題を1つランダムに」
 * - ?count=5 で5件まとめ引き
 * 将来のモバイルアプリの「サイコロ」機能で利用予定
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const { category, count } = req.query;
  const take = Math.min(Number(count) || 1, 20);

  const where: any = { published: true };
  if (category && typeof category === "string") {
    where.category = { slug: category };
  }

  const total = await prisma.theaterMenu.count({ where });
  if (total === 0) {
    return res.status(200).json({ menus: [] });
  }

  const picks = new Set<number>();
  while (picks.size < Math.min(take, total)) {
    picks.add(Math.floor(Math.random() * total));
  }

  const menus = await Promise.all(
    Array.from(picks).map((skip) =>
      prisma.theaterMenu.findFirst({
        where,
        skip,
        orderBy: { id: "asc" },
        include: { category: { select: { slug: true, name: true } } },
      })
    )
  );

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ menus: menus.filter(Boolean) });
}
