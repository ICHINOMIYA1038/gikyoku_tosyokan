import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getCached, setCached } from '@/lib/cache';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // キャッシュヘッダーを設定（2分）
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=120, stale-while-revalidate=300'
  );

  const {
    keyword = '',
    page = '1',
    per = '8',
  } = req.query;

  const cacheKey = `search:${keyword}:${page}:${per}`;
  
  try {
    // キャッシュチェック（キーワード検索のみ）
    if (keyword) {
      const cached = getCached(cacheKey);
      if (cached) {
        return res.status(200).json({
          ...cached,
          cached: true,
          timestamp: new Date().toISOString(),
        });
      }
    }

    const perPage = Math.min(parseInt(per as string, 10) || 8, 20); // 最大20件
    const pageNum = parseInt(page as string, 10) || 1;
    const skip = (pageNum - 1) * perPage;

    // 検索条件（シンプル化）
    const whereCondition: any = {};
    if (keyword) {
      whereCondition.OR = [
        {
          title: {
            contains: keyword as string,
            mode: 'insensitive',
          },
        },
        {
          author: {
            name: {
              contains: keyword as string,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // タイムアウトを防ぐために並列実行
    const [totalCount, posts] = await Promise.all([
      prisma.post.count({ where: whereCondition }),
      prisma.post.findMany({
        where: whereCondition,
        select: {
          id: true,
          title: true,
          image_url: true,
          man: true,
          woman: true,
          totalNumber: true,
          playtime: true,
          averageRating: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          averageRating: 'desc',
        },
        take: perPage,
        skip: skip,
      }),
    ]);

    const result = {
      searchResults: posts,
      pagination: {
        count: totalCount,
        current: pageNum,
        per: perPage,
        limit_page: Math.ceil(totalCount / perPage),
      },
    };

    // キャッシュに保存
    if (keyword) {
      setCached(cacheKey, result);
    }

    return res.status(200).json({
      ...result,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Search API error:', error);
    
    // エラー時でも最小限のレスポンスを返す
    return res.status(200).json({
      searchResults: [],
      pagination: {
        count: 0,
        current: 1,
        per: 8,
        limit_page: 0,
      },
      error: true,
      cached: false,
    });
  }
}