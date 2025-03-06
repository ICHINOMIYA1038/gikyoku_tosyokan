import * as React from "react";
import Image from "next/image";
import Badge from "@/components/Badge";
import { Post as PostType } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import Star from "./Widget/Star";
import Link from "next/link";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};

const PostCard: React.FC<PostPageProps> = ({ post }: any) => {
  const router = useRouter();

  return (
    <Link href={`/posts/${post.id}`} target="_blank">
      <div className="mb-2 bg-white border-solid border border-black shadow-md hover:shadow-md hover:scale-105 transition-transform duration-300 rounded-xl cursor-pointer">
        <div className="">
          <div className="h-10 mb-2 py-2 pl-1">
            {post.ratings ? (
              <Star
                star={post.averageRating}
                rateCount={post.ratings.length || 0}
              />
            ) : (
              <Star star={post.averageRating} />
            )}
          </div>
        </div>
        <div className="h-60 max-w-32 relative flex flex-col">
          {post.image_url ? (
            <Image
              src={post.image_url}
              alt="投稿の写真"
              layout="fill"
              objectFit="contain"
              objectPosition="left center"
              className=""
            />
          ) : (
            <Image
              src="/24202513.jpg"
              alt="NoImage"
              layout="fill"
              objectFit="contain"
              objectPosition="left center"
              className=""
            />
          )}
        </div>
        <div className="p-2">
          <div className="text-xs h-8 flex gap-2">
            {post.categories &&
              post.categories.length !== 0 &&
              post.categories
                .slice(0, 3)
                .map((category: any) => (
                  <Badge key={category.id} text={category.name} />
                ))}
          </div>
          <div className="md:flex md:gap-5 items-center">
            <h2 className="text-base md:text-xl font-bold">{post.title}</h2>
            <p className="text-xs md:text-base font-bold">{post.author.name}</p>
          </div>
          <div className="flex font-bold gap-1 text-xs md:text-sm mt-1">
            <p>
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
    </Link>
  );
};

export default PostCard;
