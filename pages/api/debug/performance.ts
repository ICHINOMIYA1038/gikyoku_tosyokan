import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const results: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database_url: process.env.DATABASE_URL ? 'Set' : 'Not set',
    prisma_url: process.env.POSTGRES_PRISMA_URL ? 'Set' : 'Not set',
    tests: []
  };

  try {
    // 1. データベース接続テスト
    const connectStart = Date.now();
    await prisma.$connect();
    const connectTime = Date.now() - connectStart;
    results.tests.push({
      name: 'Database Connection',
      duration: `${connectTime}ms`,
      status: 'success'
    });

    // 2. 単純なクエリのテスト
    const simpleStart = Date.now();
    const authorCount = await prisma.author.count();
    const simpleTime = Date.now() - simpleStart;
    results.tests.push({
      name: 'Simple Count Query (authors)',
      duration: `${simpleTime}ms`,
      result: `${authorCount} authors`,
      status: simpleTime < 100 ? 'good' : simpleTime < 500 ? 'warning' : 'slow'
    });

    // 3. ニュース取得テスト
    const newsStart = Date.now();
    const news = await prisma.news.findMany({
      take: 10,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        date: true,
        title: true,
      },
    });
    const newsTime = Date.now() - newsStart;
    results.tests.push({
      name: 'News Query (10 items)',
      duration: `${newsTime}ms`,
      result: `${news.length} items`,
      status: newsTime < 100 ? 'good' : newsTime < 500 ? 'warning' : 'slow'
    });

    // 4. 作者取得テスト
    const authorsStart = Date.now();
    const authors = await prisma.author.findMany({
      take: 50,
      select: {
        id: true,
        name: true,
        group: true,
      },
      orderBy: { name: 'asc' },
    });
    const authorsTime = Date.now() - authorsStart;
    results.tests.push({
      name: 'Authors Query (50 items)',
      duration: `${authorsTime}ms`,
      result: `${authors.length} items`,
      status: authorsTime < 200 ? 'good' : authorsTime < 1000 ? 'warning' : 'slow'
    });

    // 5. 投稿取得テスト（重い可能性）
    const postsStart = Date.now();
    const posts = await prisma.post.findMany({
      take: 20,
      select: {
        id: true,
        title: true,
        averageRating: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { averageRating: 'desc' },
        { id: 'desc' },
      ],
    });
    const postsTime = Date.now() - postsStart;
    results.tests.push({
      name: 'Posts Query with Author (20 items)',
      duration: `${postsTime}ms`,
      result: `${posts.length} items`,
      status: postsTime < 300 ? 'good' : postsTime < 1500 ? 'warning' : 'slow'
    });

    // 6. カテゴリ取得テスト
    const categoriesStart = Date.now();
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
      orderBy: { name: 'asc' },
    });
    const categoriesTime = Date.now() - categoriesStart;
    results.tests.push({
      name: 'Categories Query with Count',
      duration: `${categoriesTime}ms`,
      result: `${categories.length} items`,
      status: categoriesTime < 200 ? 'good' : categoriesTime < 1000 ? 'warning' : 'slow'
    });

    // 7. 並列実行テスト（TOPページと同じ）
    const parallelStart = Date.now();
    const [pNews, pAuthors, pPosts, pCategories] = await Promise.all([
      prisma.news.findMany({
        take: 10,
        orderBy: { date: 'desc' },
        select: { id: true, date: true, title: true },
      }),
      prisma.author.findMany({
        take: 50,
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
      prisma.post.findMany({
        take: 20,
        select: {
          id: true,
          title: true,
          author: { select: { id: true, name: true } },
        },
        orderBy: [{ averageRating: 'desc' }, { id: 'desc' }],
      }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { posts: true } },
        },
        orderBy: { name: 'asc' },
      }),
    ]);
    const parallelTime = Date.now() - parallelStart;
    results.tests.push({
      name: 'Parallel Queries (TOP page simulation)',
      duration: `${parallelTime}ms`,
      status: parallelTime < 500 ? 'good' : parallelTime < 2000 ? 'warning' : 'slow',
      breakdown: {
        news: pNews.length,
        authors: pAuthors.length,
        posts: pPosts.length,
        categories: pCategories.length,
      }
    });

    // 8. データベースの統計情報
    const tableStats = await prisma.$queryRaw`
      SELECT 
        schemaname,
        tablename,
        n_live_tup as row_count,
        n_dead_tup as dead_rows,
        last_autovacuum
      FROM pg_stat_user_tables
      WHERE schemaname = 'public'
      ORDER BY n_live_tup DESC
      LIMIT 10
    `;
    results.database_stats = tableStats;

    // 総合評価
    const totalTime = results.tests.reduce((sum: number, test: any) => {
      const time = parseInt(test.duration);
      return sum + (isNaN(time) ? 0 : time);
    }, 0);

    results.summary = {
      total_test_time: `${totalTime}ms`,
      slowest_query: results.tests.reduce((slowest: any, test: any) => {
        const time = parseInt(test.duration);
        const slowestTime = parseInt(slowest.duration || '0');
        return time > slowestTime ? test : slowest;
      }, {}),
      recommendations: []
    };

    // 推奨事項
    if (connectTime > 1000) {
      results.summary.recommendations.push('データベース接続が遅い: 接続プールの設定を確認');
    }
    if (parallelTime > 2000) {
      results.summary.recommendations.push('並列クエリが遅い: インデックスの追加を検討');
    }
    if (postsTime > 1500) {
      results.summary.recommendations.push('投稿クエリが遅い: averageRatingのインデックスを確認');
    }

    res.status(200).json(results);
  } catch (error) {
    results.error = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json(results);
  }
}