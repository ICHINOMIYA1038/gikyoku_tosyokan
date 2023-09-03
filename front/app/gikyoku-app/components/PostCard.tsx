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
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`mb-5 bg-white h-48 border-solid border border-black link-card ${
        hovered ? "bg-gray-100" : ""
      }`}
      onClick={() => {
        router.push(`/posts/${post.id}`);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex">
        {post.image_url && (
          <div className="h-48 w-1/3 relative">
            <Image
              src={post.image_url}
              alt="Landscape picture"
              layout="fill" // 画像を親要素に合わせる
              objectFit="contain" // 画像をトリミングなしで合わせる
              objectPosition="center center" // 画像の表示位置を中央に
              className="p-2"
            />
          </div>
        )}
        {!post.image_url && (
          <div className="h-48 w-1/3 relative">
            <Image
              src="/24202513.jpg"
              alt="Landscape picture"
              layout="fill" // 画像を親要素に合わせる
              objectFit="contain" // 画像をトリミングなしで合わせる
              objectPosition="center center" // 画像の表示位置を中央に
              className="p-2"
            />
          </div>
        )}
        <div className="w-2/3 p-2">
          {post.categories &&
            post.categories.length !== 0 &&
            post.categories
              .slice(0, 3)
              .map((category: any) => (
                <Badge key={post.id} text={category.name} />
              ))}

          <h2 className="text-xl font-bold">{post.title}</h2>
          <div className="flex font-bold gap-5">
            <p>
              <span>男:</span>
              {post.man !== -1 ? `${post.man}人` : "不明"}
            </p>
            <p>
              <span>女:</span>
              {post.woman !== -1 ? `${post.woman}人` : "不明"}
            </p>
            <p>
              <span>総人数:</span>
              {post.totalNumber !== -1 ? `${post.totalNumber}人` : "不明"}
            </p>
            <p>
              <span>上演時間:</span>
              {post.playtime !== -1 ? `${post.playtime}分` : "不明"}
            </p>
          </div>
          {post.synopsis && (
            <p className="">{post.synopsis.slice(0, 90) + "..."}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
