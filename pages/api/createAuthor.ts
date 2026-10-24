// pages/api/createAuthor.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from '@/lib/admin-guard';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 管理画面だけが使う API。管理者のログインがないと何もしない
  if (!(await requireAdminApi(req, res))) return;

  if (req.method === "POST") {
    const { name, website, group, profile, masterpiece } = req.body;
    try {
      const newAuthor = await prisma.author.create({
        data: { name, website, group, profile, masterpiece },
      });
      res.status(201).json(newAuthor);
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
