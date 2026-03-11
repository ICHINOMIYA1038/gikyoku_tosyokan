import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

const VALID_REACTIONS = ["泣けた", "笑えた", "考えさせられた", "感動した", "演じたい", "おすすめ"];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const reaction = req.query.reaction as string;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

  if (reaction && !VALID_REACTIONS.includes(reaction)) {
    return res.status(400).json({ error: "Invalid reaction type" });
  }

  try {
    const where: any = {
      commentType: "リアクション",
      deleted: false,
    };
    if (reaction) {
      where.content = reaction;
    }

    // Get post IDs ranked by reaction count
    const ranked = await prisma.parentComment.groupBy({
      by: ["post_id"],
      where,
      _count: true,
      orderBy: { _count: { post_id: "desc" } },
      take: limit,
    });

    if (ranked.length === 0) {
      res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
      return res.status(200).json([]);
    }

    const postIds = ranked.map((r) => r.post_id);

    // Fetch post details
    const posts = await prisma.post.findMany({
      where: { id: { in: postIds } },
      select: {
        id: true,
        title: true,
        image_url: true,
        playtime: true,
        totalNumber: true,
        averageRating: true,
        author: { select: { id: true, name: true } },
        categories: { select: { id: true, name: true } },
      },
    });

    // Get reaction breakdown per post
    const breakdowns = await prisma.parentComment.groupBy({
      by: ["post_id", "content"],
      where: {
        post_id: { in: postIds },
        commentType: "リアクション",
        deleted: false,
      },
      _count: true,
    });

    const postMap = new Map(posts.map((p) => [p.id, p]));
    const reactionMap = new Map<number, Record<string, number>>();
    breakdowns.forEach((b: any) => {
      if (!reactionMap.has(b.post_id)) reactionMap.set(b.post_id, {});
      reactionMap.get(b.post_id)![b.content] = b._count;
    });

    // Build ranked results preserving order
    const countMap = new Map(ranked.map((r) => [r.post_id, r._count]));
    const results = postIds
      .map((id) => {
        const post = postMap.get(id);
        if (!post) return null;
        return {
          ...post,
          reactionCount: countMap.get(id) || 0,
          reactions: reactionMap.get(id) || {},
        };
      })
      .filter(Boolean);

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch ranking" });
  }
}
