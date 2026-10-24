import { prisma } from "@/lib/prisma";

export default async (req: any, res: any) => {
  if (req.method === "POST") {
    const postId = parseInt(req.query.id);
    const star = Number(req.body?.star);
    // 星は1〜5の整数だけ受け付ける（それ以外を保存すると平均が壊れる）
    if (!Number.isInteger(postId) || !Number.isInteger(star) || star < 1 || star > 5) {
      return res.status(400).json({ error: "Invalid rating." });
    }
    const target = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
    if (!target) {
      return res.status(404).json({ error: "Post not found." });
    }
    const ipAddress =
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress;
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
      return res.status(400).json({ error: "You can only rate once a day." });
    }

    // 評価を作成
    const rating = await prisma.rating.create({
      data: {
        star: star,
        ipAddress: ipAddress,
        postId: postId,
      },
    });

    // 投稿の星の平均値を計算
    const aggregateRating = await prisma.rating.aggregate({
      _avg: {
        star: true,
      },
      // 以前の不具合で入った範囲外の値（0 や 6）は平均に入れない
      where: {
        postId: postId,
        star: { gte: 1, lte: 5 },
      },
    });

    const averageRating = aggregateRating._avg.star; // スターの評価を使用

    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        averageRating: averageRating,
      },
    });

    res.status(201).json(rating);
  } else {
    res.status(405).end();
  }
};
