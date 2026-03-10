import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { postId } = req.body;
  if (!postId || typeof postId !== "number") {
    return res.status(400).json({ error: "Invalid postId" });
  }

  try {
    const ipAddress =
      (req.headers["x-real-ip"] as string) ||
      (req.headers["x-forwarded-for"] as string) ||
      "unknown";

    const currentDate = new Date();
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    const existingAccess = await prisma.access.findFirst({
      where: { ipAddress, postId, date },
    });

    if (!existingAccess) {
      await prisma.access.create({
        data: { ipAddress, postId, date },
      });
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Failed to record access:", error);
    res.status(200).json({ ok: true });
  }
}
