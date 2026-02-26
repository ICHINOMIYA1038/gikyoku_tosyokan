import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const comments = await prisma.parentComment.findMany({
      where: { deleted: false },
      orderBy: { date: "desc" },
      take: 6,
      select: {
        id: true,
        content: true,
        author: true,
        date: true,
        likes: true,
        commentType: true,
        post: {
          select: {
            id: true,
            title: true,
            author: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const formatted = comments.map((c) => ({
      id: c.id,
      content: c.content.length > 80 ? c.content.substring(0, 80) + "..." : c.content,
      author: c.author,
      date: c.date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      likes: c.likes,
      commentType: c.commentType,
      postId: c.post.id,
      postTitle: c.post.title,
      postAuthor: c.post.author.name,
    }));

    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    res.status(200).json(formatted);
  } catch (error) {
    console.error("Recent comments error:", error);
    res.status(500).json({ error: "コメントの取得に失敗しました" });
  }
}
