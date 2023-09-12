import * as React from "react";
import { Post as PostType } from "@prisma/client";
import PostCardSmall from "../PostCardSmall";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};

const Recommend = ({ posts }: any) => {
  return (
    <>
      <div className="basic-card p-4 inline-block">
        <h2 className="m-4">人気戯曲BEST3</h2>
        <div className="flex gap-5 flex-wrap">
          {posts &&
            posts
              .slice(0, 3)
              .map((post: any) => <PostCardSmall key={post.id} post={post} />)}
        </div>
      </div>
    </>
  );
};

export default Recommend;
