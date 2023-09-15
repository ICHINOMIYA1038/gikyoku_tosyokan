import * as React from "react";
import PostCardSmall from "../PostCardSmall";
import { useQuery } from "@tanstack/react-query";

const getposts = async (): Promise<any> => {
  const res = await fetch("/api/popular");
  return res.json();
};

const Recommend = () => {
  const {
    data,
    isLoading,
    // isFetching,
    error,
  } = useQuery({
    queryKey: ["popular"],
    queryFn: getposts,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    cacheTime: Infinity,
  });
  return (
    <>
      <div className="basic-card p-4 inline-block">
        <h2 className="m-4">人気戯曲BEST3</h2>
        <div className="flex gap-5 flex-wrap">
          {data &&
            data
              .slice(0, 3)
              .map((post: any) => <PostCardSmall key={post.id} post={post} />)}
        </div>
      </div>
    </>
  );
};

export default Recommend;
