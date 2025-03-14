import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
          return { access: { _count: sortDirection === "1" ? "desc" : "asc" } };
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

    const whereCondition = {
      OR: [
        {
          author: {
            name: {
              contains: keyword as string,
            },
          },
        },
        {
          title: {
            contains: keyword as string,
          },
        },
        {
          content: {
            contains: keyword as string,
          },
        },
        {
          synopsis: {
            contains: keyword as string,
          },
        },
      ],
      man: {
        gte: parseIntSafe(minMaleCount as string, -1),
        lte: parseIntSafe(maxMaleCount as string, 9999),
      },
      woman: {
        gte: parseIntSafe(minFemaleCount as string, -1),
        lte: parseIntSafe(maxFemaleCount as string, 9999),
      },
      totalNumber: {
        gte: parseIntSafe(minTotalCount as string, -1),
        lte: parseIntSafe(maxTotalCount as string, 9999),
      },
      playtime: {
        gte: playTimeConvertToOption(parseIntSafe(minPlaytime as string, -1)),
        lte: playTimeConvertToOption(parseIntSafe(maxPlaytime as string, 5)),
      },
      ...(ids.length > 0
        ? {
            AND: ids.map((id: any) => ({
              categories: {
                some: {
                  id: {
                    equals: id,
                  },
                },
              },
            })),
          }
        : {}),
    };

    const [totalResultsCount, searchResults] = await Promise.all([
      prisma.post.count({ where: whereCondition }),
      prisma.post.findMany({
        where: whereCondition,
        orderBy: sortField,
        take: perPage,
        skip: skip,
        include: {
          author: true,
          categories: true,
          ratings: { select: { id: true } },
        },
      }),
    ]);

    const limit_page = Math.ceil(totalResultsCount / perPage);
    const response = {
      searchResults,
      pagination: {
        count: totalResultsCount,
        current: page,
        per: per,
        limit_page,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
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
