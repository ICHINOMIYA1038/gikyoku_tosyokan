import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { postId, reaction } = req.body;

  const VALID_REACTIONS = ["泣けた", "笑えた", "考えさせられた", "感動した", "演じたい", "おすすめ"];

  if (!postId || !reaction || !VALID_REACTIONS.includes(reaction)) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const comment = await prisma.parentComment.create({
      data: {
        author: "名無しさん",
        content: reaction,
        deleted: false,
        commentType: "リアクション",
        post: { connect: { id: postId } },
      },
    });

    // Count all reactions for this post
    const counts = await prisma.parentComment.groupBy({
      by: ['content'],
      where: { post_id: postId, commentType: "リアクション", deleted: false },
      _count: true,
    });

    const countMap: Record<string, number> = {};
    counts.forEach((c: any) => { countMap[c.content] = c._count; });

    res.status(201).json({ ok: true, counts: countMap });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save reaction" });
  }
}
