//categoryの一覧を取得するAPIを作成する。

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const categories = await prisma.category.findMany({
        orderBy: {
          id: "asc",
        },
      });
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

function calculateDaysBetweenDates(begin: any, end: any) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const millisBetween = end - begin;
  return millisBetween / millisecondsPerDay;
}
