// pages/api/authors/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;
    const startTime = Date.now();

    try {
      // キャッシュヘッダーを設定（1時間キャッシュ）
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=3600, stale-while-revalidate=7200"
      );
      
      const queryStart = Date.now();
      const author = await prisma.author.findUnique({
        where: {
          id: Number(id),
        },
        include: { 
          posts: {
            select: {
              id: true,
              title: true,
              playtime: true,
              man: true,
              woman: true,
              totalNumber: true,
              synopsis: true,
              image_url: true
            }
          } 
        },
      });

      const queryTime = Date.now() - queryStart;
      
      if (!author) {
        res.status(404).json({ error: "Author not found" });
      } else {
        const totalTime = Date.now() - startTime;
        res.setHeader("X-Query-Time", queryTime.toString());
        res.setHeader("X-Total-Time", totalTime.toString());
        res.status(200).json(author);
      }
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
