import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

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
      minPlaytime = "-1",
      maxPlaytime = "5",
      sort_by,
      sortDirection,
      categories,
      page = "1",
      per = "8",
    } = req.query;

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

    const perPage = parseIntSafe(per as string, 8);
    const skip =
      (parseIntSafe(page as string, 1) - 1) * parseIntSafe(per as string, 8);

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
    
    const minPlay = playTimeConvertToOption(parseIntSafe(minPlaytime as string, -1));
    const maxPlay = playTimeConvertToOption(parseIntSafe(maxPlaytime as string, 5));
    if (minPlay > -100 || maxPlay < 9999) {
      whereCondition.playtime = {};
      if (minPlay > -100) whereCondition.playtime.gte = minPlay;
      if (maxPlay < 9999) whereCondition.playtime.lte = maxPlay;
    }

    // キーワード検索（最適化: insensitiveモードを削除）
    if (keyword && keyword !== "") {
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

    // 最初にデータ取得（カウントは別途）
    const searchResults = await prisma.post.findMany({
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
        others: true,
        totalNumber: true,
        playtime: true,
        averageRating: true,
        author: {
          select: {
            id: true,
            name: true,
            group: true,
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

    // カウントクエリを非同期で実行（結果待ちしない）
    const totalResultsCountPromise = prisma.post.count({ where: whereCondition });
    
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

    return res.status(200).json(response);
  } catch (error) {
    console.error("Search API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

function playTimeConvertToOption(option: number) {
  if (option == -1) {
    return -100;
  } else if (option == 0) {
    return 0;
  } else if (option == 1) {
    return 30;
  } else if (option == 2) {
    return 60;
  } else if (option == 3) {
    return 90;
  } else if (option == 4) {
    return 120;
  } else if (option == 5) {
    return 9999;
  } else {
    return 9999;
  }
}