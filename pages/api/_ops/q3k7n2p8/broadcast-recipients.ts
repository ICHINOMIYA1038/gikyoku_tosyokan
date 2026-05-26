/**
 * 案内メール送信先候補一覧。
 * 配信OFFのユーザーは除外（誤送信防止）。検索クエリで絞り込み可能。
 */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const admin = await requireAdminApi(req, res);
  if (!admin) return;

  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const where: Record<string, unknown> = {
    emailOptIn: true,
    email: { not: null },
  };
  if (q) {
    where.OR = [
      { email: { contains: q, mode: "insensitive" } },
      { displayName: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
      { groupName: { contains: q, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      email: true,
      displayName: true,
      name: true,
      groupName: true,
    },
  });

  return res.status(200).json({ users });
}
