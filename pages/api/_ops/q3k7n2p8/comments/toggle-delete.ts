import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const admin = await requireAdminApi(req, res);
  if (!admin) return;

  const { type, id, deleted } = req.body as { type?: string; id?: number; deleted?: boolean };
  if (!type || !id || typeof deleted !== "boolean") {
    return res.status(400).json({ error: "type / id / deleted は必須" });
  }

  if (type === "parent") {
    await prisma.parentComment.update({ where: { id }, data: { deleted } });
  } else if (type === "child") {
    await prisma.childComment.update({ where: { id }, data: { deleted } });
  } else {
    return res.status(400).json({ error: "type は parent / child" });
  }
  return res.status(200).json({ ok: true });
}
