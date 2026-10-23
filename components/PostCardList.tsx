import * as React from "react";
import { Post as PostType } from "@prisma/client";
import PostCard from "@/components/PostCard";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};

const PostCardList = ({ posts, ranked = false }: any) => {
  return (
    <div className="border-t border-[#D9D5CF]">
      {/* PC では列の見出しを付けて、表として読めるようにする */}
      <div className="hidden md:grid grid-cols-[48px_minmax(0,1fr)_9rem_4.5rem_8rem_4.5rem_2.5rem] gap-x-4 py-2 pr-2 text-xs font-medium text-gray-600 bg-[#F4F2EE] border-b border-[#D9D5CF]">
        <span />
        <span>作品</span>
        <span>人数</span>
        <span>上演時間</span>
        <span>ジャンル</span>
        <span>台本</span>
        <span />
      </div>
      {posts &&
        posts.map((post: any, i: number) => <PostCard key={post.id} post={post} rank={ranked ? i + 1 : undefined} />)}
    </div>
  );
};

export default PostCardList;
