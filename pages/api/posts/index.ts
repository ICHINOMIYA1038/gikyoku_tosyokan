// pages/api/createAuthor.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // キャッシュヘッダーを設定
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=3600, stale-while-revalidate=7200"
      );
      
      const posts = await prisma.post.findMany({
        orderBy: {
          id: "asc", 
        },
        select: {
          id: true,
          title: true,
          playtime: true,
          man: true,
          woman: true,
          others: true,
          totalNumber: true,
          synopsis: true,
          image_url: true,
          author_id: true,
          _count: {
            select: { access: true },
          },
          author: {
            select: {
              id: true,
              name: true,
              group: true
            }
          },
          categories: {
            select: {
              id: true,
              name: true
            }
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
