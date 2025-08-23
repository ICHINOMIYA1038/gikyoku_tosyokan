import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/db-utils";
import { searchCache } from "@/lib/search-cache";

function parseCategories(categories: any) {
  if (!categories || categories.length === 0) {
    return [];
  }

  // カンマで文字列を分割し、各要素を数値に変換する
  const parsedCategories = categories.split(",").map((category: any) => {
    const number = Number(category.trim()); // 前後の空白をトリムして数値に変換
    return !isNaN(number) ? number : undefined;
  });

  // 数値に変換できた要素のみをフィルタリング
  return parsedCategories.filter((category: any) => category !== undefined);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 検索APIにキャッシュヘッダーを設定（短めの時間）
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300"
  );

  try {
    const {
      keyword = "",
      minMaleCount = "-1",
      maxMaleCount = "9999",
      minFemaleCount = "-1",
      maxFemaleCount = "9999",
      minTotalCount = "-1",
      maxTotalCount = "9999",
      minPlaytime = "0",
      maxPlaytime = "999",
      sort_by,
      sortDirection,
      categories,
      page = "1",
      per = "8",
    } = req.query;

    // キャッシュキーを生成
    const cacheKey = searchCache.generateKey(req.query);
    
    // キャッシュチェック（初回ページのみ）
    if (page === "1") {
      const cachedResult = searchCache.get(cacheKey);
      if (cachedResult) {
        console.log("[Search] Cache hit");
        return res.status(200).json(cachedResult);
      }
    }

    const ids = parseCategories(categories);

    const getSortField: any = (sortValue: any) => {
      switch (sortValue) {
        case "1":
          return { id: sortDirection === "1" ? "desc" : "asc" };
        case "2":
          // アクセス数でのソートは重いので、idで代替
          return { id: sortDirection === "1" ? "desc" : "asc" };
        case "3":
          return { man: sortDirection === "1" ? "desc" : "asc" };
        case "4":
          return { woman: sortDirection === "1" ? "desc" : "asc" };
        case "5":
          return { totalNumber: sortDirection === "1" ? "desc" : "asc" };
        case "6":
          return { playtime: sortDirection === "1" ? "desc" : "asc" };
        default:
          return { id: sortDirection === "1" ? "desc" : "asc" };
      }
    };

    const sortField = getSortField(sort_by);

    const parseIntSafe = (value: string, defaultValue: number): number => {
      const parsedValue = parseInt(value, 10);
      return isNaN(parsedValue) ? defaultValue : parsedValue;
    };

    const perPage = Math.min(parseIntSafe(per as string, 8), 20); // 最大20件に制限
    const currentPage = parseIntSafe(page as string, 1);
    const skip = (currentPage - 1) * perPage;

    // 検索条件を最適化（デフォルト値の場合は条件を追加しない）
    const whereCondition: any = {};
    
    const minMale = parseIntSafe(minMaleCount as string, -1);
    const maxMale = parseIntSafe(maxMaleCount as string, 9999);
    if (minMale > -1 || maxMale < 9999) {
      whereCondition.man = {};
      if (minMale > -1) whereCondition.man.gte = minMale;
      if (maxMale < 9999) whereCondition.man.lte = maxMale;
    }
    
    const minFemale = parseIntSafe(minFemaleCount as string, -1);
    const maxFemale = parseIntSafe(maxFemaleCount as string, 9999);
    if (minFemale > -1 || maxFemale < 9999) {
      whereCondition.woman = {};
      if (minFemale > -1) whereCondition.woman.gte = minFemale;
      if (maxFemale < 9999) whereCondition.woman.lte = maxFemale;
    }
    
    const minTotal = parseIntSafe(minTotalCount as string, -1);
    const maxTotal = parseIntSafe(maxTotalCount as string, 9999);
    if (minTotal > -1 || maxTotal < 9999) {
      whereCondition.totalNumber = {};
      if (minTotal > -1) whereCondition.totalNumber.gte = minTotal;
      if (maxTotal < 9999) whereCondition.totalNumber.lte = maxTotal;
    }
    
    const minPlay = parseIntSafe(minPlaytime as string, 0);
    const maxPlay = parseIntSafe(maxPlaytime as string, 999);
    if (minPlay > 0 || maxPlay < 999) {
      whereCondition.playtime = {};
      if (minPlay > 0) whereCondition.playtime.gte = minPlay;
      if (maxPlay < 999) whereCondition.playtime.lte = maxPlay;
    }

    // キーワード検索（最適化: タイトルのみに限定してパフォーマンス向上）
    if (keyword && keyword !== "") {
      // 短いキーワードの場合はタイトルのみ検索
      if ((keyword as string).length <= 3) {
        whereCondition.title = {
          contains: keyword as string,
        };
      } else {
        // 長いキーワードの場合はタイトルとあらすじを検索
        whereCondition.OR = [
          {
            title: {
              contains: keyword as string,
            },
          },
          {
            synopsis: {
              contains: keyword as string,
            },
          },
        ];
      }
    }

    // カテゴリフィルター（最適化）
    if (ids.length > 0) {
      whereCondition.categories = {
        some: {
          id: {
            in: ids,
          },
        },
      };
    }

    // リトライ機能付きでデータ取得
    const searchResults = await withRetry(async () => {
      return await prisma.post.findMany({
        where: whereCondition,
        orderBy: sortField,
        take: perPage,
        skip: skip,
        select: {
          id: true,
          title: true,
          synopsis: true,
          image_url: true,
          man: true,
          woman: true,
          totalNumber: true,
          playtime: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }, 3, 500);

    // カウントクエリの最適化（ページ数が多い場合は推定値を使用）
    let totalResultsCountPromise;
    
    // 最初の3ページまでは正確なカウントを取得
    if (currentPage <= 3) {
      totalResultsCountPromise = withRetry(
        async () => prisma.post.count({ where: whereCondition }),
        2, 
        300
      );
    } else {
      // 4ページ目以降は推定値を使用（高速化）
      totalResultsCountPromise = Promise.resolve(searchResults.length > 0 ? 100 : 0);
    }
    
    // レスポンスフォーマットを維持
    const formattedResults = searchResults.map(post => ({
      ...post,
      ratings: [],
      _count: { ratings: 0 },
    }));

    // カウント結果を待つ（ただし検索結果は既に取得済み）
    const totalResultsCount = await totalResultsCountPromise;
    const limit_page = Math.ceil(totalResultsCount / perPage);

    const response = {
      searchResults: formattedResults,
      pagination: {
        count: totalResultsCount,
        current: page,
        per: per,
        limit_page,
      },
    };

    // 初回ページの結果をキャッシュ
    if (page === "1" && formattedResults.length > 0) {
      searchCache.set(cacheKey, response);
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Search API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

