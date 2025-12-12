import * as React from "react";
import Image from "next/image";
import { Post as PostType } from "@prisma/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaClock, FaUsers, FaMale, FaFemale, FaTag, FaPen, FaTheaterMasks } from "react-icons/fa";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};

const PostCard: React.FC<PostPageProps> = ({ post }: any) => {
  const primaryCategory = post.categories && post.categories.length > 0 ? post.categories[0] : null;
  const additionalCategories = post.categories && post.categories.length > 1 ? post.categories.length - 1 : 0;

  return (
    <Link href={`/posts/${post.id}`} className="block mb-4">
      <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-0.5">
        <div className="flex flex-col md:flex-row h-full">
          {/* 画像部分 */}
          <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0 bg-gray-50">
             {post.image_url ? (
              <img
                src={post.image_url}
                alt={`${post.title}のサムネイル`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300">
                <FaTheaterMasks className="text-4xl mb-2 opacity-50" />
                <span className="text-xs font-serif opacity-70">No Image</span>
              </div>
            )}
             {/* カテゴリーバッジ（左上） */}
             {primaryCategory && (
              <div className="absolute top-3 left-3 flex gap-1 z-10">
                <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-gray-100 text-pink-700 text-xs font-medium rounded-full shadow-sm">
                  {primaryCategory.name}
                </span>
                {additionalCategories > 0 && (
                  <span className="px-2 py-1 bg-gray-800/80 text-white text-xs rounded-full">
                    +{additionalCategories}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* テキスト部分 */}
          <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                 <h3 className="text-lg md:text-xl font-serif font-bold text-gray-800 group-hover:text-pink-700 transition-colors line-clamp-1 leading-snug">
                  {post.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 rounded text-gray-600 border border-gray-100">
                  <FaPen className="text-gray-400 text-xs" />
                  {post.author.name}
                </span>
              </div>

              {/* あらすじ */}
              {post.synopsis && (
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4 font-sans">
                  {post.synopsis}
                </p>
              )}
            </div>
            
            {/* メタ情報（下部） */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-50 mt-auto">
              {post.playtime && post.playtime > 0 && (
                <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                  <FaClock className="text-green-500/70" />
                  <span className="font-medium">{post.playtime}分</span>
                </div>
              )}
              
              {post.totalNumber && post.totalNumber > 0 && (
                <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                  <FaUsers className="text-blue-500/70" />
                  <span className="font-medium">{post.totalNumber}人</span>
                </div>
              )}
              
              {/* 男女内訳 */}
              {(post.man > 0 || post.woman > 0) && (
                <div className="flex items-center gap-3 ml-auto text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                   {post.man > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <span>男 {post.man}</span>
                    </div>
                  )}
                  {post.woman > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                      <span>女 {post.woman}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
