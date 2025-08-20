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
        include: {
          _count: {
            select: { access: true },
          },
          author: true, // Include the associated Author records
          categories: true,
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
