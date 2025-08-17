import * as React from "react";
import { Post as PostType } from "@prisma/client";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaClock, FaUsers, FaTag, FaPen, FaChevronRight, FaBookOpen, FaStar, FaTheaterMasks, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};

const fetchAuthor = async (authorId: any) => {
  const response = await fetch(`/api/authors/${authorId}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const OtherPostsModern = ({ authorId, postId, authorName }: any) => {
  const router = useRouter();
  const [hoveredId, setHoveredId] = React.useState<number | null>(null);
  
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
    if (post.totalNumber > 0) {
      return `${post.totalNumber}名`;
    }
    const parts = [];
    if (post.man > 0) parts.push(`男${post.man}`);
    if (post.woman > 0) parts.push(`女${post.woman}`);
    if (post.others > 0) parts.push(`不問${post.others}`);
    return parts.join(' ') || "情報なし";
  };

  // 現在の作品を除いた他の作品を取得
  const otherPosts = data?.posts?.filter((post: any) => post.id !== postId) || [];
  
  // 最大表示数を制限
  const displayPosts = otherPosts.slice(0, 6);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto my-8">
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin h-8 w-8 border-3 border-purple-500 rounded-full border-t-transparent"></div>
            <span className="text-gray-600">作品を読み込み中...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return null;
  }

  if (otherPosts.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto my-8">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 text-center">
          <FaBookOpen className="text-4xl text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">
            {authorName}さんの他の作品はまだ登録されていません
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      {/* ヘッダー部分 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-0.5 rounded-lg">
              <div className="bg-white p-2 rounded-lg">
                <FaTheaterMasks className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {authorName}さんの他の作品
              </h2>
              <p className="text-sm text-gray-500">全{otherPosts.length}作品</p>
            </div>
          </div>
          
          {otherPosts.length > 6 && (
            <Link 
              href={`/authors/${authorId}`}
              className="group flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              <span>すべて見る</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* 作品カードグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {displayPosts.map((post: any, index: number) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={`/posts/${post.id}`}>
                <div 
                  className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer h-full"
                  onMouseEnter={() => setHoveredId(post.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* 背景グラデーション */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* メインコンテンツ */}
                  <div className="relative p-5">
                    {/* タイトル部分 */}
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2 min-h-[3rem]">
                        {post.title}
                      </h3>
                    </div>

                    {/* カテゴリータグ */}
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.categories.slice(0, 2).map((cat: any) => (
                          <span 
                            key={cat.id}
                            className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full"
                          >
                            <FaTag className="mr-1" />
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* メタ情報 */}
                    <div className="space-y-2">
                      {/* 上演時間 */}
                      {post.playtime > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaClock className="mr-2 text-purple-400" />
                          <span>{formatPlaytime(post.playtime)}</span>
                          {post.playtime <= 30 && (
                            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                              短編
                            </span>
                          )}
                        </div>
                      )}

                      {/* キャスト数 */}
                      {(post.totalNumber > 0 || post.man > 0 || post.woman > 0) && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaUsers className="mr-2 text-pink-400" />
                          <span>{formatCast(post)}</span>
                          {post.totalNumber > 0 && post.totalNumber <= 5 && (
                            <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                              少人数
                            </span>
                          )}
                        </div>
                      )}

                      {/* 評価 */}
                      {post.averageRating > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaStar className="mr-2 text-yellow-400" />
                          <span>{post.averageRating.toFixed(1)}</span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({post._count?.ratings || 0}件)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* あらすじ */}
                    {post.synopsis && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {post.synopsis}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ホバー時のオーバーレイ */}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-r from-purple-500 to-pink-500 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="h-full flex items-center justify-center text-white font-semibold text-sm">
                      <span>詳細を見る</span>
                      <FaChevronRight className="ml-1" />
                    </div>
                  </div>

                  {/* 装飾的な要素 */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500" />
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 作者ページへのリンク（下部） */}
      {otherPosts.length > 3 && (
        <div className="mt-8 text-center">
          <Link 
            href={`/authors/${authorId}`}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <FaPen />
            <span>{authorName}さんの全作品を見る</span>
            <FaArrowRight />
          </Link>
        </div>
      )}
    </div>
  );
};

export default OtherPostsModern;