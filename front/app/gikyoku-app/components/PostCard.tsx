import * as React from "react";
import Image from "next/image";
import Badge from "@/components/Badge";
import { Post as PostType } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};

const PostCard: React.FC<PostPageProps> = ({ post }: any) => {
  const router = useRouter();

  return (
    <div
      className="mb-5 bg-white h-60 border-solid border border-black link-card"
      onClick={() => {
        router.push(`/posts/${post.id}`);
      }}
    >
      <div className="flex">
        {post.image_url && (
          <div className="h-60 w-1/4 relative">
            <Image
              src={post.image_url}
              alt="投稿の写真"
              layout="fill" // 画像を親要素に合わせる
              objectFit="contain" // 画像をトリミングなしで合わせる
              objectPosition="center center" // 画像の表示位置を中央に
              className="p-2"
            />
          </div>
        )}
        {!post.image_url && (
          <div className="h-60 w-1/4 relative">
            <Image
              src="/24202513.jpg"
              alt="NoImage"
              layout="fill" // 画像を親要素に合わせる
              objectFit="contain" // 画像をトリミングなしで合わせる
              objectPosition="center center" // 画像の表示位置を中央に
              className="p-2"
            />
          </div>
        )}
        <div className="w-3/4 p-2 h-48">
          <div className="text-xs h-8 flex gap-2">
            {post.categories &&
              post.categories.length !== 0 &&
              post.categories
                .slice(0, 3)
                .map((category: any) => (
                  <Badge key={post.id} text={category.name} />
                ))}
          </div>
          <div className="md:flex md:gap-5 items-center">
            <h2 className="text-base md:text-xl font-bold">{post.title}</h2>
            <p className=" text-xs md:text-base font-bold">
              {post.author.name}
            </p>
          </div>
          <div className="flex font-bold gap-1 text-xs md:text-sm mt-1">
            <p className="">
              <span>男:</span>
              {post.man !== -1 ? `${post.man}` : "不明"}
            </p>
            <p>
              <span>女:</span>
              {post.woman !== -1 ? `${post.woman}` : "不明"}
            </p>
            <p>
              <span>総人数:</span>
              {post.totalNumber !== -1 ? `${post.totalNumber}` : "不明"}
            </p>
            <p>
              <span>上演時間:</span>
              {post.playtime !== -1 ? `${post.playtime}分` : "不明"}
            </p>
          </div>
          <div>
            {post.synopsis && (
              <p className="line-clamp-3 mr-3 mt-3 mb-3 max-h-20 lg:max-h-24">
                {post.synopsis}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
