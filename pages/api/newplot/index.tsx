// pages/api/newplot.ts

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const {
      title,
      synopsis,
      man,
      content,
      woman,
      others,
      totalNumber,
      playtime,
      link_to_plot,
      categories,
      authorName,
    } = req.body;

    const author = await prisma.author.upsert({
      where: { name: authorName },
      update: {},
      create: { name: authorName },
    });

    // カテゴリの情報を取得または作成
    // カテゴリの情報を取得または作成
    const categoryRecords = await Promise.all(
      categories.map(async (category: any) => {
        const existingCategory = await prisma.category.findUnique({
          where: { name: category },
        });

        return existingCategory
          ? existingCategory
          : prisma.category.create({ data: { name: category } });
      })
    );

    // Post レコードを作成
    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: author.id } },
        man,
        woman,
        others,
        totalNumber,
        playtime,
        synopsis,
        link_to_plot,
        categories: {
          connect: categoryRecords.map((category) => ({ id: category.id })),
        },
      },
    });

    return res.status(201).json({ success: true, post });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
