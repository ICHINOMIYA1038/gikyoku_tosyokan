import * as React from "react";
import Image from "next/image";
import Badge from "@/components/Badge";
import { Post as PostType } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};

const PostCard: React.FC<PostPageProps> = ({ post }: PostPageProps) => {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`border-solid border border-black cursor-pointer ${
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
          <Image
            src={post.image_url}
            alt="Landscape picture"
            width={800}
            height={500}
            className="w-1/2"
          />
        )}
        <div className="p-2">
          {post.website1 && <Badge key={post.id} text={post.website1} />}
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="font-medium">{post.synopsis}</p>
          <p>{post.man}</p>
          <p>{post.woman}</p>
          <p>{post.playtime}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
