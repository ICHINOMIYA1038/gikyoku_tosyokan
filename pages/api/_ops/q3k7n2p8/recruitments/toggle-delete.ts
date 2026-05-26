import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const admin = await requireAdminApi(req, res);
  if (!admin) return;

  const { id, deleted } = req.body as { id?: string; deleted?: boolean };
  if (!id || typeof deleted !== "boolean") {
    return res.status(400).json({ error: "id / deleted は必須" });
  }

  await prisma.recruitment.update({
    where: { id },
    data: { deletedAt: deleted ? new Date() : null },
  });
  return res.status(200).json({ ok: true });
}
