import React from "react";
import PostCardList from "./PostCardList";

type TrendingPost = {
  id: number;
  title: string;
  image_url: string | null;
  playtime: number | null;
  totalNumber: number | null;
  man: number | null;
  woman: number | null;
  averageRating: number | null;
  accessCount: number;
  author: {
    id: number;
    name: string;
  };
};

type Props = {
  posts: TrendingPost[];
};

// 直近7日間の閲覧数の上位。検索結果と同じ行の部品に順位を付けて並べる
const TrendingPosts: React.FC<Props> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 my-0">今週よく見られた作品</h2>
        <span className="text-sm text-gray-600">直近7日間の閲覧数</span>
      </div>
      <PostCardList posts={posts} ranked />
    </section>
  );
};

export default TrendingPosts;
