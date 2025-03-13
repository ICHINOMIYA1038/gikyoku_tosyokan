import React from "react";

const AmazonAffiliateLink = ({ title, amazonImgUrl, amazonTextUrl }: any) => {
  return (
    <div
      className="max-w-md cursor-pointer flex flex-col md:flex-row mx-auto my-6 p-5 border border-gray-200 rounded-lg bg-white transition-all duration-300 shadow-md hover:shadow-xl hover:scale-102"
      onClick={() => {
        window.location.replace(amazonTextUrl);
      }}
    >
      <div className="flex justify-center md:justify-start mb-4 md:mb-0">
        <div dangerouslySetInnerHTML={{ __html: amazonImgUrl }} />
      </div>
      <div className="w-full flex flex-col justify-between">
        <div>
          <p className="text-lg font-bold mb-3 text-gray-800">{title}</p>
        </div>
        <div className="mt-3">
          <button className="w-full py-3 px-4 bg-[#FF9900] text-white font-bold rounded-md transition duration-300 ease-in-out hover:bg-[#e88a00] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Amazonでチェックする
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmazonAffiliateLink;
