// pages/api/createAuthor.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // キャッシュヘッダーを設定（1時間キャッシュ）
      res.setHeader(
        "Cache-Control",
        "public, max-age=600, s-maxage=21600, stale-while-revalidate=86400"
      );

      const posts = await prisma.post.findMany({
        take: 20, // 上位20件に制限
        orderBy: {
          access: {
            _count: "desc",
          },
        },
        select: {
          id: true,
          title: true,
          image_url: true,
          man: true,
          woman: true,
          totalNumber: true,
          playtime: true,
          averageRating: true,
          _count: {
            select: { access: true, comments: true },
          },
          author: {
            select: { id: true, name: true },
          },
          categories: {
            select: { id: true, name: true },
          },
        },
      });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
