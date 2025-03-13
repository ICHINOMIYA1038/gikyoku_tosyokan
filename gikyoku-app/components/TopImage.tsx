import * as React from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const TopImage = ({ buttonClick }: any) => {
  const router = useRouter();
  return (
    <div className="text-center py-16" style={{ backgroundColor: 'rgb(var(--top-image-bg))' }}>
      <div className="mx-auto max-w-4xl md:flex">
        <div className="w-1/2 relative">
          <Image
            src="/readbookman.svg"
            alt="top-image-read-book-man"
            layout="fill"
            className="p-10"
          />
        </div>
        <div className="py-16 px-10">
          <p className="text-sm font-bold mb-2">戯曲を探すプラットフォーム</p>
          <h2 className="text-4xl font-bold mb-6">戯曲図書館</h2>
          <p className="text-lg mb-6">
            ※ 著作権のため、作品の内容自体は公開されていません。
          </p>
          <button
            className="bg-green-600 text-white py-4 px-8 rounded-full text-lg hover:bg-green-700 cursor-pointer"
            onClick={buttonClick}
          >
            検索する
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopImage;
