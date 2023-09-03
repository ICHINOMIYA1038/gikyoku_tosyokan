import React from "react";

const ExternalLinkButton = ({ title, url }: any) => {
  return (
    <div
      className="max-w-md cursor-pointer flex mx-auto my-4 p-4 border rounded-lg  transition-transform duration-300 shadow-md hover:shadow-2xl hover:scale-105"
      onClick={() => {
        window.location.replace(url);
      }}
    >
      <div className="w-full">
        <div>
          <h2 className="font-bold">{title}</h2>
        </div>
        <div className="p-4 m-4 text-center bg-indigo-500 cursor-pointer  rounded-md w-ful font-bold text-xl text-black transition duration-300 ease-in-out hover:border-2 hover:border-indigo-500  hover:bg-white hover:text-indigo-500">
          外部サイトでチェックする
        </div>
      </div>
    </div>
  );
};

export default ExternalLinkButton;
