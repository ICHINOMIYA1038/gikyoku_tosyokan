import * as React from "react";
import { Post as PostType } from "@prisma/client";
import PostCardSmall from "../PostCardSmall";
import { BadgeGreen } from "../Badge";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};

const fetchAuthor = async (authorId: any) => {
    const response = await fetch(`${process.env.BASE_URL}/api/authors/${authorId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };
  


const OtherPosts = ({authorId,postId}:any) => {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery(['author', authorId], () => fetchAuthor(authorId));
  return (
    <>
      <div className="basic-card p-4 inline-block">
        <h2 className="m-4">この作者の他の作品</h2>
        <div className="flex gap-2 flex-wrap">
        <div className="flex gap-5 flex-wrap mx-auto w-full justify-center">
          {!isLoading &&
            data.posts
              .slice(0, 3)
              .map((post: any) => <PostCardSmall key={post.id} post={post} />)}
        </div>
        </div>
      </div>
    </>
  );
};

export default OtherPosts;
