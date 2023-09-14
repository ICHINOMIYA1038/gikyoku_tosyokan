import * as React from "react";
import Image from "next/image";
import Badge from "@/components/Badge";
import { Post as PostType } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};

const PostCardSmall: React.FC<PostPageProps> = ({ post }: any) => {
  const router = useRouter();

  return (
    <div
      className="mb-5 bg-white h-80 w-48 border-solid border border-black link-card"
      onClick={() => {
        router.push(`/posts/${post.id}`);
      }}
    >
      <div className="">
        {post.image_url && (
          <div className="h-48 w-full relative">
            <Image
              src={post.image_url}
              alt="投稿の写真"
              fill
              style={{ objectFit: "contain", objectPosition: "50% 50%" }} // or className={xxx}を用いる
              objectPosition="center center" // 画像の表示位置を中央に
              className="p-2"
            />
          </div>
        )}
        {!post.image_url && (
          <div className="h-48 w-full relative">
            <Image
              src="/24202513.jpg"
              alt="NoImage"
              fill
              style={{ objectFit: "fill", objectPosition: "50% 50%" }} // or className={xxx}を用いる
              objectPosition="center center" // 画像の表示位置を中央に
              className="p-2"
            />
          </div>
        )}
        <div className="h-32 text-center">
          <div className="text-xs h-8">
            {post.categories &&
              post.categories.length !== 0 &&
              post.categories
                .slice(0, 1)
                .map((category: any) => (
                  <Badge key={post.id} text={category.name} />
                ))}
          </div>
          <div className="text-center">
            <h2 className="text-base text-base font-bold">{post.title}</h2>
            <div className=" text-xs font-bold">{post.author.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCardSmall;
