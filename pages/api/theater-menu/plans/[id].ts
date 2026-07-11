import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = String(req.query.id || "");
  const plan = await prisma.lessonPlan.findUnique({ where: { id } });
  if (!plan) return res.status(404).json({ error: "not_found" });

  const session = await getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    // 公開されているか本人のみ閲覧可能
    if (!plan.isPublic && (!session || session.user.id !== plan.userId)) {
      return res.status(403).json({ error: "forbidden" });
    }
    const full = await prisma.lessonPlan.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { order: "asc" },
          include: {
            menu: {
              select: {
                id: true,
                slug: true,
                title: true,
                summary: true,
                duration: true,
                minPeople: true,
                maxPeople: true,
                difficulty: true,
                category: { select: { slug: true, name: true } },
              },
            },
          },
        },
      },
    });
    return res.status(200).json({ plan: full });
  }

  // 書き込み系は所有者のみ
  if (!session || session.user.id !== plan.userId) {
    return res.status(403).json({ error: "forbidden" });
  }

  if (req.method === "PUT") {
    const { title, description, isPublic, items } = req.body || {};
    const updated = await prisma.$transaction(async (tx) => {
      const p = await tx.lessonPlan.update({
        where: { id },
        data: {
          title: title ?? plan.title,
          description: description ?? plan.description,
          isPublic: isPublic ?? plan.isPublic,
        },
      });
      if (Array.isArray(items)) {
        await tx.lessonPlanItem.deleteMany({ where: { planId: id } });
        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          await tx.lessonPlanItem.create({
            data: {
              planId: id,
              menuId: Number(it.menuId),
              order: i,
              customDuration: it.customDuration ? Number(it.customDuration) : null,
              notes: it.notes || null,
            },
          });
        }
      }
      return p;
    });
    return res.status(200).json({ plan: updated });
  }

  if (req.method === "DELETE") {
    await prisma.lessonPlan.delete({ where: { id } });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).end();
}
