import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "papaparse";
import fs from "fs";

// ファイルを同期的に読み込む
const csvData = fs.readFileSync("./public/quiz.csv", "utf-8");

export default (req: NextApiRequest, res: NextApiResponse) => {
  // CSVをパース
  const parsedData = parse(csvData, {
    header: true,
    skipEmptyLines: true,
  });

  // パースされたCSVデータをJSON形式に変換
  const quizData = parsedData.data.map(
    (row: {
      question: any;
      option1: any;
      option2: any;
      option3: any;
      option4: any;
      correctAnswer: any;
    }) => ({
      question: row.question,
      options: [row.option1, row.option2, row.option3, row.option4],
      correctAnswer: row.correctAnswer,
    })
  );

  res.status(200).json(quizData);
};
