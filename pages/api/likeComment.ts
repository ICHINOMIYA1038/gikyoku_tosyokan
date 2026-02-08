import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { commentId, isParent } = req.body;

  if (!commentId || typeof isParent !== "boolean") {
    return res.status(400).json({ error: "commentId and isParent are required" });
  }

  try {
    let updated;
    if (isParent) {
      updated = await prisma.parentComment.update({
        where: { id: commentId },
        data: { likes: { increment: 1 } },
        select: { id: true, likes: true },
      });
    } else {
      updated = await prisma.childComment.update({
        where: { id: commentId },
        data: { likes: { increment: 1 } },
        select: { id: true, likes: true },
      });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ error: "いいねの処理中にエラーが発生しました" });
  }
}
