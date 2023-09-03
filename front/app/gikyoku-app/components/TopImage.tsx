import * as React from "react";
import { Post as PostType } from "@prisma/client";
import PostCard from "@/components/PostCard";
import { useRouter } from "next/router";
import Image from "next/image";

const TopImage = ({ buttonClick }: any) => {
  const router = useRouter();
  return (
    <div className="bg-yellow-300 bg-contain bg-no-repeat bg-center text-center py-16">
      <div className="mx-auto max-w-4xl flex">
        <div className="w-1/2 h-auto relative">
          <Image
            src="/readbookman.svg"
            alt="top-image-read-book-man"
            layout="fill"
            className="p-10"
          />
        </div>
        <div className="py-16 px-10">
          <h2 className="text-4xl font-bold mb-6">
            戯曲を探すプラットフォーム
          </h2>
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
