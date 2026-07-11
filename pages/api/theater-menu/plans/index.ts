import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "認証が必要です" });
  const userId = session.user.id;

  if (req.method === "GET") {
    const plans = await prisma.lessonPlan.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { items: true } } },
    });
    return res.status(200).json({ plans });
  }

  if (req.method === "POST") {
    const { title, description, isPublic } = req.body || {};
    if (!title) return res.status(400).json({ error: "title必須" });
    const plan = await prisma.lessonPlan.create({
      data: {
        userId,
        title,
        description: description || null,
        isPublic: !!isPublic,
      },
    });
    return res.status(200).json({ plan });
  }

  return res.status(405).end();
}
