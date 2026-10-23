import { parse } from "papaparse";
import csvData from "../public/quiz.csv";

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type QuizRow = {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctAnswer: string;
};

// public/quiz.csv の全問題
function loadQuizQuestions(): QuizQuestion[] {
  const parsedData = parse<QuizRow>(csvData, {
    header: true,
    skipEmptyLines: true,
  });

  return parsedData.data.map((row) => ({
    question: row.question,
    options: [row.option1, row.option2, row.option3, row.option4],
    correctAnswer: row.correctAnswer,
  }));
}

// 全問題からランダムに count 問を選ぶ
export function getRandomQuizQuestions(count: number): QuizQuestion[] {
  const shuffledData = loadQuizQuestions();
  for (let i = shuffledData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
  }
  return shuffledData.slice(0, count);
}
