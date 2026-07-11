import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  const slug = String(req.query.slug || "");
  const menu = await prisma.theaterMenu.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!menu || !menu.published) return res.status(404).json({ error: "not_found" });

  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  res.status(200).json({ menu });
}
