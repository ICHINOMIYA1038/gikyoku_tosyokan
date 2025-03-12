import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  if (req.method === "POST") {
    const { author, content, isParent, targetid } = req.body;

    try {
      let comment;
      if (isParent) {
        // 親コメントを作成
        comment = await prisma.parentComment.create({
          data: {
            author,
            deleted: false,
            content,
            post: { connect: { id: targetid } },
          },
        });
      } else {
        // 子コメントを作成
        comment = await prisma.childComment.create({
          data: {
            author,
            content,
            deleted: false,
            parentComment: { connect: { id: targetid } },
          },
        });
      }

      // 新しいコメントの詳細を返す
      res.status(201).json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "コメントの投稿中にエラーが発生しました" });
    } finally {
      await prisma.$disconnect(); // リクエスト処理の最後で接続を切断
    }
  } else {
    // POST以外のHTTPメソッドに対する処理を追加する場合はここに記述
    res.status(405).json({ error: "このメソッドは許可されていません" });
  }
}
