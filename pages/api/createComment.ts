import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { author, content, isParent, targetid, commentType } = req.body;

    try {
      let comment;
      if (isParent) {
        // 親コメントを作成
        comment = await prisma.parentComment.create({
          data: {
            author,
            deleted: false,
            content,
            commentType: commentType || null,
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

      // 日時をJSTフォーマットして返す
      const jst = new Date((comment as any).date.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
      const formatted = `${jst.getFullYear()}/${jst.getMonth() + 1}/${jst.getDate()} ${jst.getHours()}:${jst.getMinutes()}`;
      res.status(201).json({ ...comment, date: formatted });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "コメントの投稿中にエラーが発生しました" });
    }
  } else {
    res.status(405).json({ error: "このメソッドは許可されていません" });
  }
}
