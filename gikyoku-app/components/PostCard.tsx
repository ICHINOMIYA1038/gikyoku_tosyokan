import * as React from "react";
import Image from "next/image";
import Badge from "@/components/Badge";
import { Post as PostType } from "@prisma/client";
import { useRouter } from "next/router";
import Star from "./Widget/Star";
import Link from "next/link";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};

const PostCard: React.FC<PostPageProps> = ({ post }: any) => {
  const router = useRouter();

  return (
    <Link href={`/posts/${post.id}`} target="_blank">
      <div className="mb-2 border-solid border border-black shadow-md hover:shadow-md hover:scale-105 transition-transform duration-300 rounded-xl cursor-pointer min-h-[350px] md:min-h-0" style={{ backgroundColor: 'rgb(var(--card-bg))' }}>
        <div className="flex flex-wrap md:flex-nowrap h-full">
          <div className="w-full md:w-1/2 relative flex items-center justify-center" style={{ maxHeight: '100%', minHeight: '200px' }}>
            <div className="absolute inset-0">
              <Image
                src={post.image_url || "/24202513.jpg"}
                alt="背景画像"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                className="opacity-30"
              />
            </div>
            <div className="relative h-full w-full flex items-center justify-center">
              <Image
                src={post.image_url || "/24202513.jpg"}
                alt="投稿の写真"
                layout="fill"
                objectFit="contain"
                objectPosition="center"
                className=""
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 p-2 flex flex-col">
            <div className="text-xs flex gap-2 whitespace-nowrap overflow-x-hidden mb-2">
              {post.categories &&
                post.categories.map((category: any) => (
                  <Badge key={category.id} text={category.name} />
                ))}
            </div>
            <div className="md:flex md:gap-5 items-center mb-2">
              <h2 className="text-base md:text-xl font-bold">{post.title}</h2>
              <p className="text-xs md:text-base font-bold">{post.author.name}</p>
            </div>
            <div className="flex font-bold gap-1 text-xs md:text-sm mt-1 mb-2">
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
            <div className="mt-2">
              {post.synopsis && (
                <p className="line-clamp-3 mr-3 mb-3 max-h-20 lg:max-h-24">
                  {post.synopsis}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
