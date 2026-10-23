import { NextApiRequest, NextApiResponse } from "next";
import { getRandomQuizQuestions } from "@/lib/quiz";

export default (req: NextApiRequest, res: NextApiResponse) => {
  // ランダムに10個のデータを選択
  res.status(200).json(getRandomQuizQuestions(10));
};
