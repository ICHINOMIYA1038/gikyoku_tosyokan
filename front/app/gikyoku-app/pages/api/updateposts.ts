import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const postId = req.query.id as string; // ポストのIDをクエリパラメータから取得する

    const {
      title,
      content,
      authorId,
      man,
      woman,
      others,
      totalNumber,
      playtime,
      synopsis,
      image_url,
      categories, // カテゴリーをIDの配列として扱うことを想定しています
      amazon_text_url,
      amazon_img_url,
      amazon_img_text_url,
      link_to_plot,
      buy_link,
      ISBN_13,
    } = req.body;

    try {
      const updatedPost = await prisma.post.update({
        where: {
          id: parseInt(postId), // 更新するポストのID
        },
        data: {
          title,
          content,
          author: { connect: { id: authorId } }, // 既存の著者のIDと関連付ける
          man,
          woman,
          others,
          totalNumber,
          playtime,
          synopsis,
          image_url,
          categories: {
            set: categories, // カテゴリーを新しいIDの配列で置き換える
          },
          amazon_text_url,
          amazon_img_url,
          amazon_img_text_url,
          link_to_plot,
          buy_link,
          ISBN_13,
        },
      });

      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
