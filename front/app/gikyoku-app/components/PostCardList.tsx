import * as React from "react";
import Image from "next/image";
import Badge from "@/components/Badge";
import { Post as PostType } from "@prisma/client";
import PostCard from "@/components/PostCard";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};

const PostCardList: React.FC<PostPageProps> = ({ posts }: any) => {
  return (
    <div className="border-solid border border-black">
      {posts &&
        posts.map((post: any) => <PostCard key={post.id} post={post} />)}
    </div>
  );
};

export default PostCardList;
