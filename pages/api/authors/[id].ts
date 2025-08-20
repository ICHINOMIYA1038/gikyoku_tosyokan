// pages/api/authors/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;

    try {
      const author = await prisma.author.findUnique({
        where: {
          id: Number(id),
        },
        include: { posts: { include: { author: true } } },
      });

      if (!author) {
        res.status(404).json({ error: "Author not found" });
      } else {
        res.status(200).json(author);
      }
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
