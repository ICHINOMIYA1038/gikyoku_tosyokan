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
      if (isParent) {
        const comment = await prisma.parentComment.create({
          data: {
            author: "author",
            deleted: false,
            content: "content",
            post: { connect: { id: 1 } },
          },
        });
        console.log(comment);
        // 親コメントを作成
      } else {
        // 子コメントを作成
        const comment = await prisma.childComment.create({
          data: {
            author,
            content,
            deleted: false,
            parentComment: { connect: { id: targetid } },
          },
        });
        console.log(comment);
      }

      res.status(201).json({ message: "コメントが投稿されました" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "コメントの投稿中にエラーが発生しました" });
    }
  } else {
    // POST以外のHTTPメソッドに対する処理を追加する場合はここに記述
    res.status(405).json({ error: "このメソッドは許可されていません" });
  }
}
