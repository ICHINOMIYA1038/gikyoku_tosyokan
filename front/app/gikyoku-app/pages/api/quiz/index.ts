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

  // ランダムに10個のデータを選択
  const randomQuizData = getRandomQuizQuestions(quizData, 10);

  res.status(200).json(randomQuizData);
};

// ランダムに10個のデータを選択する関数
function getRandomQuizQuestions(data: any, count: any) {
  const shuffledData = [...data];
  for (let i = shuffledData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
  }
  return shuffledData.slice(0, count);
}
