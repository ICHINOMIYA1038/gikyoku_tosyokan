import type { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireRole(req, res, ["ADMIN"]);
  if (!session) return;

  if (req.method === "GET") {
    const status = (req.query.status as string) || "pending";
    const synopses = await prisma.userSynopsis.findMany({
      where: { status },
      include: {
        post: { select: { id: true, title: true } },
        user: { select: { name: true, displayName: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return res.status(200).json(synopses);
  }

  if (req.method === "PATCH") {
    const { id, status } = req.body;
    if (!id || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const updated = await prisma.userSynopsis.update({
      where: { id: Number(id) },
      data: { status },
    });

    return res.status(200).json(updated);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
