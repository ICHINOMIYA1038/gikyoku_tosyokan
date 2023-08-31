import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      minMaleCount = "0",
      maxMaleCount = "9999",
      minFemaleCount = "0",
      maxFemaleCount = "9999",
      minTotalCount = "0",
      maxTotalCount = "9999",
      minPlaytime = "0",
      maxPlaytime = "5",
      sort_by = "",
      sortDirection = "",
      tags = "",
      page = "1",
      per = "8",
    } = req.query;

    const parseIntSafe = (value: string, defaultValue: number): number => {
      const parsedValue = parseInt(value, 10);
      return isNaN(parsedValue) ? defaultValue : parsedValue;
    };

    const searchResults = await prisma.post.findMany({
      where: {
        title: {
          contains: keyword as string,
        },
        man: {
          gte: parseIntSafe(minMaleCount as string, 0),
          lte: parseIntSafe(maxMaleCount as string, 9999),
        },
        woman: {
          gte: parseIntSafe(minFemaleCount as string, 0),
          lte: parseIntSafe(maxFemaleCount as string, 9999),
        },
        totalNumber: {
          gte: parseIntSafe(minTotalCount as string, 0),
          lte: parseIntSafe(maxTotalCount as string, 9999),
        },
        playtime: {
          gte: playTimeConvertToOption(parseIntSafe(minPlaytime as string, 0)),
          lte: playTimeConvertToOption(parseIntSafe(maxPlaytime as string, 4)),
        },
        // Add more conditions as needed for sorting, tags, etc.
      },
      orderBy: {
        // Define the sorting order based on the sort_by and sortDirection parameters.
        // Use switch cases or if conditions to map the sort_by and sortDirection values to actual field names and directions.
      },
      take: parseIntSafe(per as string, 8),
      skip:
        (parseIntSafe(page as string, 1) - 1) * parseIntSafe(per as string, 8),
      // Add tags filtering if needed.
    });

    return res.status(200).json(searchResults);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}

function playTimeConvertToOption(option: number) {
  if (option == 0) {
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
