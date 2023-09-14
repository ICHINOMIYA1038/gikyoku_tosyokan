import axios from "axios";
import React, { useEffect, useState } from "react";

const ExLinkwithOG = ({ title, url }: any) => {
  const [ogData, setOgData] = useState<any>({});

  useEffect(() => {
    // 関数を非同期で呼び出すための即時実行関数を使用
    (async () => {
      try {
        const response = await axios.get(
          `https://graph.facebook.com/v11.0/?id=${url}&fields=og_object{title,description,image}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        const data = response.data;
        setOgData(data.og_object);
      } catch (error) {
        console.error("Error fetching OpenGraph data:", error);
      }
    })();
  }, [url]);

  return (
    <div className="max-w-md cursor-pointer flex mx-auto my-4 p-4 border rounded-lg transition-transform duration-300 shadow-md hover:shadow-2xl hover:scale-105">
      <div className="w-full">
        <div>
          <h3 className="font-bold">{title}</h3>
        </div>
        <div className="p-4 m-2 text-center bg-indigo-500 cursor-pointer rounded-md w-ful font-bold text-black transition duration-300 ease-in-out hover:border-2 hover:border-indigo-500 hover:bg-white hover:text-indigo-500">
          外部サイトでチェックする
        </div>
        <div className="mt-4">
          {ogData.title && <p>Title: {ogData.title}</p>}
          {ogData.description && <p>Description: {ogData.description}</p>}
          {ogData.image && <img src={ogData.image.url} alt={ogData.title} />}
        </div>
      </div>
    </div>
  );
};

export default ExLinkwithOG;
