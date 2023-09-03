import * as React from "react";
import { Post as PostType } from "@prisma/client";
import PostCard from "@/components/PostCard";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};

const PostCardList: React.FC = ({ posts }: any) => {
  return (
    <div className="">
      {posts &&
        posts.map((post: any) => <PostCard key={post.id} post={post} />)}
    </div>
  );
};

export default PostCardList;
