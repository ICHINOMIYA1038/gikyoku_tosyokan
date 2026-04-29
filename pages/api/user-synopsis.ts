import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

const MAX_LENGTH = 500;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const postId = parseInt(req.query.postId as string);
  if (isNaN(postId)) return res.status(400).json({ error: "Invalid postId" });

  if (req.method === "GET") {
    const synopses = await prisma.userSynopsis.findMany({
      where: { postId, status: "approved" },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: { select: { name: true, displayName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    return res.status(200).json(synopses);
  }

  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ error: "ログインが必要です" });
    }

    const { content } = req.body;
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return res.status(400).json({ error: "内容を入力してください" });
    }
    if (content.length > MAX_LENGTH) {
      return res.status(400).json({ error: `${MAX_LENGTH}文字以内で入力してください` });
    }

    const existing = await prisma.userSynopsis.findFirst({
      where: { postId, userId: session.user.id },
    });
    if (existing) {
      return res.status(409).json({ error: "この作品には既に投稿済みです" });
    }

    const synopsis = await prisma.userSynopsis.create({
      data: { content: content.trim(), postId, userId: session.user.id },
    });

    return res.status(201).json({ message: "投稿しました。運営確認後に表示されます。", id: synopsis.id });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
