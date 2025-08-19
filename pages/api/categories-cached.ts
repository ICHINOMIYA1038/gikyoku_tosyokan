import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getCached, setCached } from '@/lib/cache';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 強力なキャッシュヘッダーを設定（5分）
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=600'
  );

  const cacheKey = 'categories-list';
  
  try {
    // キャッシュチェック
    const cached = getCached(cacheKey);
    if (cached) {
      return res.status(200).json({
        categories: cached,
        cached: true,
        timestamp: new Date().toISOString(),
      });
    }

    // カテゴリー取得（最小限のフィールド）
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        posts: {
          _count: 'desc',
        },
      },
      take: 30, // 最大30カテゴリー
    });

    // カテゴリーデータをフォーマット
    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      postCount: category._count.posts,
    }));

    // キャッシュに保存
    setCached(cacheKey, formattedCategories);

    return res.status(200).json({
      categories: formattedCategories,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Categories API error:', error);
    
    // エラー時でも最小限のレスポンスを返す
    return res.status(200).json({
      categories: [],
      error: true,
      cached: false,
    });
  }
}