import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const admin = await requireAdminApi(req, res);
  if (!admin) return;

  const { id, status } = req.body as { id?: number; status?: string };
  if (!id || !status) return res.status(400).json({ error: "id / status は必須" });
  if (!["PENDING", "RESOLVED", "DISMISSED"].includes(status)) {
    return res.status(400).json({ error: "不正な status" });
  }

  await prisma.report.update({
    where: { id },
    data: {
      status: status as "PENDING" | "RESOLVED" | "DISMISSED",
      resolvedAt: status === "PENDING" ? null : new Date(),
    },
  });
  return res.status(200).json({ ok: true });
}
