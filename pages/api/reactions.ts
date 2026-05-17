import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const postId = parseInt(req.query.postId as string);
  if (isNaN(postId)) return res.status(400).json({ error: "Invalid postId" });

  try {
    const counts = await prisma.parentComment.groupBy({
      by: ['content'],
      where: { post_id: postId, commentType: "リアクション", deleted: false },
      _count: true,
    });

    const countMap: Record<string, number> = {};
    counts.forEach((c: any) => { countMap[c.content] = c._count; });

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    res.status(200).json(countMap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed" });
  }
}
