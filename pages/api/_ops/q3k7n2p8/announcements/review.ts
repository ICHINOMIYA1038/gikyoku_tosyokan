import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const admin = await requireAdminApi(req, res);
  if (!admin) return;

  const { id, action, reason } = req.body as { id?: number; action?: string; reason?: string };
  if (!id || (action !== "approve" && action !== "reject")) {
    return res.status(400).json({ error: "id / action は必須" });
  }

  await prisma.announcement.update({
    where: { id },
    data: {
      status: action === "approve" ? "approved" : "rejected",
      rejectionReason: action === "reject" ? (reason || null) : null,
      reviewedAt: new Date(),
    },
  });
  return res.status(200).json({ ok: true });
}
