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

  const cacheKey = 'authors-list';
  
  try {
    // キャッシュチェック
    const cached = getCached(cacheKey);
    if (cached) {
      return res.status(200).json({
        authors: cached,
        cached: true,
        timestamp: new Date().toISOString(),
      });
    }

    // 作者取得（最小限のフィールド、作品数が多い順）
    const authors = await prisma.author.findMany({
      select: {
        id: true,
        name: true,
        group: true,
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
      take: 100, // 最大100作者
    });

    // 作者データをフォーマット
    const formattedAuthors = authors.map(author => ({
      id: author.id,
      name: author.name,
      group: author.group,
      postCount: author._count.posts,
    }));

    // キャッシュに保存
    setCached(cacheKey, formattedAuthors);

    return res.status(200).json({
      authors: formattedAuthors,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Authors API error:', error);
    
    // エラー時でも最小限のレスポンスを返す
    return res.status(200).json({
      authors: [],
      error: true,
      cached: false,
    });
  }
}