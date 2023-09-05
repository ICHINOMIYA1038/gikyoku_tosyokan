import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
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
      categories, // Assuming you want to handle categories as an array of IDs
      amazon_text_url,
      amazon_img_url,
      amazon_img_text_url,
      link_to_plot,
      buy_link,
      ISBN_13,
    } = req.body;
    try {
      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          author: { connect: { id: authorId } }, // Assuming authorId is the ID of an existing author
          man,
          woman,
          others,
          totalNumber,
          playtime,
          synopsis,
          image_url,
          categories: {
            connect: categories.map((categoryId: any) => ({ id: categoryId })),
          }, // Connect categories by their IDs
          amazon_text_url,
          amazon_img_url,
          amazon_img_text_url,
          link_to_plot,
          buy_link,
          ISBN_13,
        },
      });
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
