import React from "react";

const AmazonAffiliateLink = ({ title, amazonImgUrl, amazonTextUrl }: any) => {
  return (
    <div
      className="max-w-md cursor-pointer flex mx-auto my-4 p-4 border rounded-lg  transition-transform duration-300 shadow-md hover:shadow-2xl hover:scale-105"
      onClick={() => {
        window.location.replace(amazonTextUrl);
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: amazonImgUrl }} />
      <div className="w-full">
        <div>
          <h3 className="mr-2 font-bold">{title}</h3>
        </div>
        <div className="p-4 m-4 text-center bg-indigo-500 cursor-pointer  rounded-md w-ful font-bold text-xl text-black transition duration-300 ease-in-out hover:border-2 hover:border-indigo-500  hover:bg-white hover:text-indigo-500">
          Amazonでチェックする
        </div>
      </div>
    </div>
  );
};

export default AmazonAffiliateLink;
