import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "ログインが必要です" });
  const userId = session.user.id;

  if (req.method === "POST") {
    const menuId = Number(req.body?.menuId);
    if (!menuId) return res.status(400).json({ error: "menuId必須" });
    await prisma.theaterMenuFavorite.upsert({
      where: { userId_menuId: { userId, menuId } },
      create: { userId, menuId },
      update: {},
    });
    return res.status(200).json({ favorited: true });
  }
  if (req.method === "DELETE") {
    const menuId = Number(req.query.menuId);
    if (!menuId) return res.status(400).json({ error: "menuId必須" });
    await prisma.theaterMenuFavorite.deleteMany({ where: { userId, menuId } });
    return res.status(200).json({ favorited: false });
  }
  if (req.method === "GET") {
    // 自分のお気に入り menuId 一覧
    const favs = await prisma.theaterMenuFavorite.findMany({
      where: { userId },
      select: { menuId: true },
    });
    return res.status(200).json({ menuIds: favs.map((f) => f.menuId) });
  }
  return res.status(405).end();
}
