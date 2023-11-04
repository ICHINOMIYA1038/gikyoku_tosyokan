// components/Answer.js

import React from "react";

const Answer = ({ options, handleAnswer }: any) => {
  return (
    <div className="flex flex-col space-y-4">
      {options.map((option: any, index: any) => (
        <button
          key={index}
          onClick={() => handleAnswer(option === options[0])}
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full"
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default Answer;
