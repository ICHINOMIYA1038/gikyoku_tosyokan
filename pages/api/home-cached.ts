import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

// 軽量化されたホームページAPI（Vercelタイムアウト対策）
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 強力なキャッシュヘッダーを設定
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=3600'
  );

  try {
    // タイムアウトを防ぐため、最小限のデータのみ取得
    const [news, posts, categories, authorsCount] = await Promise.all([
      // ニュース: 最新5件のみ
      prisma.news.findMany({
        take: 5,
        orderBy: { date: 'desc' },
        select: {
          id: true,
          title: true,
          url: true,
          category: true,
          date: true,
        },
      }),
      
      // 投稿: 人気上位10件のみ、最小限のフィールド
      prisma.post.findMany({
        take: 10,
        select: {
          id: true,
          title: true,
          image_url: true,
          averageRating: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { averageRating: 'desc' },
      }),
      
      // カテゴリ: 名前とIDのみ
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
        take: 20,
      }),
      
      // 作者: カウントのみ
      prisma.author.count(),
    ]);

    // 日付のフォーマット
    const formattedNews = news.map((item) => ({
      ...item,
      date: item.date.toISOString(),
    }));

    return res.status(200).json({
      news: formattedNews,
      posts,
      categories,
      authorsCount,
      cached: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Home API error:', error);
    
    // エラー時でも最小限のレスポンスを返す
    return res.status(200).json({
      news: [],
      posts: [],
      categories: [],
      authorsCount: 0,
      error: true,
      cached: false,
    });
  }
}