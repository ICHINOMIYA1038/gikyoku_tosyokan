// pages/index.js

import React, { useState, useEffect } from "react";
import { BsCircle } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import {
  FacebookIcon,
  FacebookShareButton,
  HatenaIcon,
  HatenaShareButton,
  LineIcon,
  LineShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import QuizHeader from "@/components/quiz/puiz-header";

export const QUIZ_TITLE = 0;
export const QUIZ_QUESTION = 1;
export const QUIZ_ANSWER_CORRECT = 2;
export const QUIZ_ANSWER_WRONG = 3;
export const QUIZ_END = 4;
export const QUIZ_TIME_OVER = 5;

function QuizApp({ quizData }: any) {
  const [questions, setQuestions] = useState(quizData); // クイズの質問データ
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 制限時間（60秒）
  const [status, setStatus] = useState(QUIZ_TITLE);

  const handleAnswer = (isCorrect: any) => {
    if (isCorrect) {
      setScore(score + 1);
      setStatus(QUIZ_ANSWER_CORRECT);
    } else {
      setStatus(QUIZ_ANSWER_WRONG);
    }
  };

  const nextQuiz = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setStatus(QUIZ_QUESTION);
    } else {
      setStatus(QUIZ_END);
    }
  };

  const quizRestart = () => {
    setScore(0);
    setCurrentQuestion(0);
    setStatus(QUIZ_TITLE);
  };

  useEffect(() => {}, [status]);

  useEffect(() => {
    // 制限時間のカウントダウン処理
    const countdown = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        // 時間切れの処理をここに追加
        clearInterval(countdown);
      }
    }, 1000);

    return () => {
      clearInterval(countdown);
    };
  }, [timeLeft]);
  switch (status) {
    case QUIZ_TITLE:
      return (
        <QuizHeader>
          <div>
            岸田國士戯曲賞受賞作を中心に戯曲に関するクイズを出題します。
          </div>
          <div>気になる作品があればぜひ読んでみてください！</div>
          <button
            onClick={() => {
              setStatus(QUIZ_QUESTION);
            }}
            className="hover:shadow:lg bg-blue-500 text-white px-4 py-2 rounded-md h-12 w-32"
          >
            スタート
          </button>
        </QuizHeader>
      );
    case QUIZ_QUESTION:
      return (
        <QuizHeader>
          <h2 className="text-2xl mb-4">
            質問 {currentQuestion + 1} / {questions.length}
          </h2>
          <p className="text-xl mb-4">{questions[currentQuestion].question}</p>
          <div className="flex flex-col gap-4">
            {questions[currentQuestion].options.map(
              (option: any, index: any) => (
                <button
                  key={index}
                  onClick={() =>
                    handleAnswer(
                      option == questions[currentQuestion].correctAnswer
                    )
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  {option}
                </button>
              )
            )}
          </div>
        </QuizHeader>
      );
    //ここにクイズの正解が合っていた場合の処理を追加
    case QUIZ_ANSWER_CORRECT:
      return (
        <QuizHeader>
          <h2 className="text-3xl">正解</h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BsCircle
              style={{
                color: "red",
                width: "72px", // 適切なサイズに変更
                height: "72px", // 適切なサイズに変更
              }}
            />
          </div>
          <div className="my-8">
            <div>正解は...</div>
            <div>{questions[currentQuestion].correctAnswer}</div>
          </div>
          <button
            className="hover:underline bg-red-300 border rounded-md shadow-lg px-4 py-2 my-4"
            onClick={nextQuiz}
          >
            次へ
          </button>
        </QuizHeader>
      );

    //ここにクイズの正解が間違っていた場合の処理を記述する
    case QUIZ_ANSWER_WRONG:
      return (
        <QuizHeader>
          <h2 className="text-3xl">不正解</h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RxCross1
              style={{
                color: "blue",
                width: "96px", // 適切なサイズに変更
                height: "96px", // 適切なサイズに変更
              }}
            />
          </div>

          <div className="my-8">
            <div>正解は...</div>
            <div>{questions[currentQuestion].correctAnswer}</div>
          </div>
          <button
            className="hover:underline bg-red-300 border rounded-md shadow-lg px-4 py-2 my-4"
            onClick={nextQuiz}
          >
            次へ
          </button>
        </QuizHeader>
      );

    case QUIZ_END:
      return (
        <QuizHeader>
          <h2 className="text-3xl mb-4">クイズ終了</h2>
          <p className="text-xl mb-4">
            正解数: {score} / {questions.length}
          </p>
          <div>
            <FacebookShareButton url="シェアしたいURLをここに設定">
              <FacebookIcon size={32} round />
            </FacebookShareButton>

            <TwitterShareButton url="シェアしたいURLをここに設定">
              <TwitterIcon size={32} round />
            </TwitterShareButton>

            <LineShareButton url="シェアしたいURLをここに設定">
              <LineIcon size={32} round />
            </LineShareButton>

            <HatenaShareButton url="シェアしたいURLをここに設定">
              <HatenaIcon size={32} round />
            </HatenaShareButton>
          </div>
          <button className="hover:underline" onClick={quizRestart}>
            TOPへ戻る
          </button>
        </QuizHeader>
      );
    case QUIZ_TIME_OVER:
      return (
        <QuizHeader>
          <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-screen flex flex-col justify-center items-center">
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <h2 className="text-2xl mb-4">クイズ終了</h2>
              <p className="text-xl mb-4">
                正解数: {score} / {questions.length}
              </p>
              <FacebookShareButton url="シェアしたいURLをここに設定">
                <FacebookIcon size={32} round />
              </FacebookShareButton>

              <TwitterShareButton url="シェアしたいURLをここに設定">
                <TwitterIcon size={32} round />
              </TwitterShareButton>

              <LineShareButton url="シェアしたいURLをここに設定">
                <LineIcon size={32} round />
              </LineShareButton>

              <HatenaShareButton url="シェアしたいURLをここに設定">
                <HatenaIcon size={32} round />
              </HatenaShareButton>
            </div>
          </div>
        </QuizHeader>
      );
    default:
      return null;
  }
}

export async function getServerSideProps() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quiz`
  );
  const quizData = await response.json();

  return {
    props: {
      quizData,
    },
  };
}
export default QuizApp;
