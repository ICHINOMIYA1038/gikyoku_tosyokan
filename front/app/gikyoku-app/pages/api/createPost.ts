import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Post as PostType } from "@prisma/client";

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
      website1,
      website2,
      website3,
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
          website1,
          website2,
          website3,
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
