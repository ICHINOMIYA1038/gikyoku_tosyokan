import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req:any, res:any) => {
  if (req.method === 'POST') {
    const { postId, star } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // ユーザーが今日既に評価を登録しているか確認
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const existingRating = await prisma.rating.findFirst({
      where: {
        ipAddress,
        postId,
        createdAt: {
          gte: today,
        },
      },
    });

    if (existingRating) {
      return res.status(400).json({ error: 'You can only rate once a day.' });
    }

    // 評価を作成
    const rating = await prisma.rating.create({
      data: {
        star,
        ipAddress,
        postId,
      },
    });

    // 投稿の星の平均値を計算
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        averageRating: {
          set: await prisma.rating.aggregate({
            avg: {
              star: true,
            },
            where: {
              postId,
            },
          }),
        },
      },
    });

    res.status(201).json(rating);
  } else {
    res.status(405).end();
  }

  await prisma.$disconnect();
};
