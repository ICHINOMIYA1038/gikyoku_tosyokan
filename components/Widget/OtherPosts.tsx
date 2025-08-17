import * as React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
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

  return (
    <div className="w-full">
      {/* ヘッダー */}
      <div className="mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <FaTheaterMasks className="mr-2 text-purple-500" />
            {authorName}さんの他の作品
          </h2>
          {otherPosts.length > 4 && (
            <Link 
              href={`/authors/${authorId}`}
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
            >
              全{otherPosts.length}作品を見る
              <FaArrowRight className="ml-1 text-xs" />
            </Link>
          )}
        </div>
      </div>

      {/* 作品リスト */}
      <div className="space-y-3">
        {displayPosts.map((post: any) => (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-purple-300 transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                {/* 左側：タイトルと情報 */}
                <div className="flex-1 mr-4">
                  <h3 className="font-semibold text-gray-800 hover:text-purple-600 mb-2 line-clamp-1">
                    {post.title}
                  </h3>
                  
                  {/* メタ情報 */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    {post.playtime > 0 && (
                      <div className="flex items-center">
                        <FaClock className="mr-1 text-gray-400" />
                        <span>{formatPlaytime(post.playtime)}</span>
                      </div>
                    )}
                    
                    {(post.totalNumber > 0 || post.man > 0 || post.woman > 0) && (
                      <div className="flex items-center">
                        <FaUsers className="mr-1 text-gray-400" />
                        <span>{formatCast(post)}</span>
                      </div>
                    )}
                    
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex items-center">
                        <FaTag className="mr-1 text-gray-400" />
                        <span>{post.categories[0].name}</span>
                      </div>
                    )}
                  </div>

                  {/* あらすじ（あれば） */}
                  {post.synopsis && (
                    <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                      {post.synopsis}
                    </p>
                  )}
                </div>

                {/* 右側：評価 */}
                {post.averageRating > 0 && (
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center text-yellow-500">
                      <FaStar className="mr-1" />
                      <span className="font-semibold">{post.averageRating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {post._count?.ratings || 0}件
                    </span>
                  </div>
                )}
              </div>

              {/* バッジ */}
              <div className="mt-2 flex gap-2">
                {post.playtime > 0 && post.playtime <= 30 && (
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    短編
                  </span>
                )}
                {post.totalNumber > 0 && post.totalNumber <= 5 && (
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    少人数
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* もっと見るボタン */}
      {otherPosts.length > 4 && (
        <div className="mt-6 text-center">
          <Link 
            href={`/authors/${authorId}`}
            className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
          >
            <FaPen className="mr-2" />
            {authorName}さんの全作品を見る
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default OtherPosts;