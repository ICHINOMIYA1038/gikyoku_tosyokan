// pages/api/createAuthor.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name } = req.body;
    try {
      const newCategory = await prisma.category.create({
        data: { name },
      });
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  finally {
    await prisma.$disconnect(); // リクエスト処理の最後で接続を切断
  }} else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
