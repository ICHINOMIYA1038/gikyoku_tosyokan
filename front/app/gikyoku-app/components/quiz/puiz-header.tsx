import React, { ReactNode } from "react";

type QuizHeaderProps = {
  children: ReactNode;
};

export default function QuizHeader({ children }: QuizHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-400 to-purple-500 min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white rounded-lg p-8 shadow-lg text-center w-full md:w-2/3 my-5 ">
        <h2 className="text-4xl">戯曲クイズ</h2>
      </div>
      <div className="bg-white rounded-lg p-8 shadow-lg text-center w-full md:w-2/3 ">
        {children}
      </div>
    </div>
  );
}
