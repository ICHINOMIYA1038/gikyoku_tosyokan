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
    const response = await fetch(`/api/authors/${authorId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };
  


const OtherPosts = ({authorId,postId,authorName}:any) => {
  const router = useRouter();
  console.log(authorId)
  const { data, isLoading, isError } = useQuery([authorId], () => fetchAuthor(authorId));
  return (
    <>
      <div className="basic-card p-4 inline-block min-w-md">
        <h2 className="m-4">{`${authorName}さんの他の作品`}</h2>
        <div className="flex gap-2 flex-wrap">
        <div className="flex gap-5 flex-wrap mx-auto w-full justify-center">
          {(!isLoading)?
          <>
          {data.posts.length<=1 && <div>他の作品はまだありません</div>}
          
            {data.posts
              .map((post: any) =>
              <>
                {postId!==post.id && <PostCardSmall key={post.id} post={post} />
                }
              </>)}
              </>: (
                
                <div
                  className="flex justify-center h-3/4 items-center"
                  aria-label="読み込み中"
                >
                  <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              )}
        </div>
        </div>
      </div>
    </>
  );
};

export default OtherPosts;
