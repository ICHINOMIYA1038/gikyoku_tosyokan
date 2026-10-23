import * as React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import PostCardList from "@/components/PostCardList";
import { FaClock, FaUsers, FaTag, FaPen, FaStar, FaTheaterMasks, FaArrowRight } from "react-icons/fa";

const fetchAuthor = async (authorId: any) => {
  const response = await fetch(`/api/authors/${authorId}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const OtherPosts = ({ authorId, postId, authorName }: any) => {
  const router = useRouter();
  
  const { data, isLoading, isError } = useQuery([authorId], () =>
    fetchAuthor(authorId)
  );

  // 上演時間のフォーマット
  const formatPlaytime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`;
    }
    return `${minutes}分`;
  };

  // キャスト情報のフォーマット
  const formatCast = (post: any) => {
    const parts = [];
    if (post.man > 0) parts.push(`男${post.man}`);
    if (post.woman > 0) parts.push(`女${post.woman}`);
    if (post.others > 0) parts.push(`不問${post.others}`);
    
    if (parts.length === 0 && post.totalNumber > 0) {
      return `${post.totalNumber}名`;
    }
    
    return parts.join(' ') || "";
  };

  // 現在の作品を除いた他の作品を取得
  const otherPosts = data?.posts?.filter((post: any) => post.id !== postId) || [];
  
  // 最大表示数を制限
  const displayPosts = otherPosts.slice(0, 4);

  if (isLoading) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin h-6 w-6 border-2 border-purple-500 rounded-full border-t-transparent"></div>
          <span className="text-gray-600">読み込み中...</span>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return null;
  }

  if (otherPosts.length === 0) {
    return (
      <div className="w-full p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600">
          {authorName}さんの他の作品はまだ登録されていません
        </p>
      </div>
    );
  }

  // 一覧と同じ行の部品で並べる（作者名は API の結果に含まれないので補う）
  return (
    <div className="w-full">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-gray-900 my-0">{authorName}さんの他の作品</h2>
        {otherPosts.length > 4 && (
          <Link href={`/authors/${authorId}`} className="text-sm text-theater-primary-700 hover:underline">
            全{otherPosts.length}作品を見る
          </Link>
        )}
      </div>
      <PostCardList posts={displayPosts.map((post: any) => ({ ...post, author: post.author ?? { id: authorId, name: authorName } }))} />
    </div>
  );
};

export default OtherPosts;