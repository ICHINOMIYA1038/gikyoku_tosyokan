import React from "react";
import Link from "next/link";
import { FaFire, FaStar, FaClock, FaUsers, FaEye } from "react-icons/fa";

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

const RANK_STYLES = [
  "bg-yellow-400 text-white",  // 1st
  "bg-gray-400 text-white",    // 2nd
  "bg-amber-600 text-white",   // 3rd
  "bg-gray-300 text-gray-700", // 4th
  "bg-gray-300 text-gray-700", // 5th
];

const TrendingPosts: React.FC<Props> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-8 px-4 bg-gradient-to-b from-orange-50/50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
            <FaFire className="text-orange-500" />
            今週の人気作品
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            直近7日間で最も閲覧された作品
          </p>
        </div>

        {/* 横スクロール対応のカードリスト */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-5 md:overflow-x-visible">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="block group snap-start flex-shrink-0 w-[220px] md:w-auto"
            >
              <div className="bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all h-full flex flex-col overflow-hidden">
                {/* ランキング番号 */}
                <div className="relative">
                  <div
                    className={`absolute top-2 left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow ${RANK_STYLES[index] || RANK_STYLES[4]}`}
                  >
                    {index + 1}
                  </div>
                  {post.image_url ? (
                    <div className="w-full h-32 bg-gray-100 overflow-hidden">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                      <span className="text-3xl opacity-40">🎭</span>
                    </div>
                  )}
                </div>

                <div className="p-3 flex flex-col flex-1">
                  {/* タイトル */}
                  <h3 className="font-bold text-sm text-gray-800 group-hover:text-orange-700 transition-colors line-clamp-2 mb-1">
                    {post.title}
                  </h3>

                  {/* 作者 */}
                  <p className="text-xs text-gray-500 mb-2 truncate">
                    {post.author.name}
                  </p>

                  {/* メタ情報 */}
                  <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                    {post.averageRating != null && post.averageRating > 0 && (
                      <span className="flex items-center gap-1">
                        <FaStar className="text-yellow-400 text-[10px]" />
                        {post.averageRating.toFixed(1)}
                      </span>
                    )}
                    {post.playtime != null && (
                      <span className="flex items-center gap-1">
                        <FaClock className="text-[10px]" />
                        {post.playtime}分
                      </span>
                    )}
                    {post.totalNumber != null && (
                      <span className="flex items-center gap-1">
                        <FaUsers className="text-[10px]" />
                        {post.totalNumber}人
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-orange-500">
                      <FaEye className="text-[10px]" />
                      {post.accessCount}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingPosts;
