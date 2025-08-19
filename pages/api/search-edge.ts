import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

export const config = {
  runtime: "edge",
};

const prismaEdge = new PrismaClient({
  datasourceUrl: process.env.POSTGRES_PRISMA_URL,
});

function parseCategories(categories: any) {
  if (!categories || categories.length === 0) {
    return [];
  }
  const parsedCategories = categories.split(",").map((category: any) => {
    const number = Number(category.trim());
    return !isNaN(number) ? number : undefined;
  });
  return parsedCategories.filter((category: any) => category !== undefined);
}

function playTimeConvertToOption(option: number) {
  if (option == -1) return -100;
  else if (option == 0) return 0;
  else if (option == 1) return 30;
  else if (option == 2) return 60;
  else if (option == 3) return 90;
  else if (option == 4) return 120;
  else if (option == 5) return 9999;
  else return 9999;
}

export default async function handler(req: NextRequest) {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { searchParams } = new URL(req.url);
  
  const keyword = searchParams.get("keyword") || "";
  const minMaleCount = parseInt(searchParams.get("minMaleCount") || "-1");
  const maxMaleCount = parseInt(searchParams.get("maxMaleCount") || "9999");
  const minFemaleCount = parseInt(searchParams.get("minFemaleCount") || "-1");
  const maxFemaleCount = parseInt(searchParams.get("maxFemaleCount") || "9999");
  const minTotalCount = parseInt(searchParams.get("minTotalCount") || "-1");
  const maxTotalCount = parseInt(searchParams.get("maxTotalCount") || "9999");
  const minPlaytime = parseInt(searchParams.get("minPlaytime") || "-1");
  const maxPlaytime = parseInt(searchParams.get("maxPlaytime") || "5");
  const sort_by = searchParams.get("sort_by");
  const sortDirection = searchParams.get("sortDirection");
  const categories = searchParams.get("categories");
  const page = parseInt(searchParams.get("page") || "1");
  const per = parseInt(searchParams.get("per") || "8");

  const ids = parseCategories(categories);

  const getSortField = (sortValue: any) => {
    switch (sortValue) {
      case "1": return { id: sortDirection === "1" ? "desc" : "asc" };
      case "2": return { access: { _count: sortDirection === "1" ? "desc" : "asc" } };
      case "3": return { man: sortDirection === "1" ? "desc" : "asc" };
      case "4": return { woman: sortDirection === "1" ? "desc" : "asc" };
      case "5": return { totalNumber: sortDirection === "1" ? "desc" : "asc" };
      case "6": return { playtime: sortDirection === "1" ? "desc" : "asc" };
      default: return { id: sortDirection === "1" ? "desc" : "asc" };
    }
  };

  const sortField = getSortField(sort_by);
  const skip = (page - 1) * per;

  try {
    const whereCondition: any = {
      man: { gte: minMaleCount, lte: maxMaleCount },
      woman: { gte: minFemaleCount, lte: maxFemaleCount },
      totalNumber: { gte: minTotalCount, lte: maxTotalCount },
      playtime: {
        gte: playTimeConvertToOption(minPlaytime),
        lte: playTimeConvertToOption(maxPlaytime),
      },
    };

    if (keyword) {
      whereCondition.OR = [
        { title: { contains: keyword } },
        { synopsis: { contains: keyword } },
      ];
    }

    if (ids.length > 0) {
      whereCondition.categories = {
        some: { id: { in: ids } },
      };
    }

    const searchResults = await prismaEdge.post.findMany({
      where: whereCondition,
      orderBy: sortField,
      take: per,
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
        author_id: true,
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

    const formattedResults = searchResults.map(post => ({
      ...post,
      ratings: [],
      _count: { ratings: 0, access: 0 },
    }));

    const totalResultsCount = page === 1 
      ? await prismaEdge.post.count({ where: whereCondition })
      : page * per + per;

    const limit_page = Math.ceil(totalResultsCount / per);

    const response = {
      searchResults: formattedResults,
      pagination: {
        count: totalResultsCount,
        current: page.toString(),
        per: per.toString(),
        limit_page,
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Search API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}