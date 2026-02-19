import * as React from "react";
import Image from "next/image";
import { Post as PostType } from "@prisma/client";
import Link from "next/link";
import { FaClock, FaUsers, FaTag, FaPen, FaMale, FaFemale, FaTheaterMasks } from "react-icons/fa";
import FavoriteButton from "@/components/FavoriteButton";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};

const PostCardSmall: React.FC<PostPageProps> = ({ post }: any) => {
  const primaryCategory = post.categories && post.categories.length > 0 ? post.categories[0] : null;
  
  // 上演時間のフォーマット（簡略化）
  const formatPlaytime = (minutes: number) => {
     if (minutes >= 60) return `${Math.floor(minutes / 60)}時間${minutes % 60 > 0 ? minutes % 60 + '分' : ''}`;
     return `${minutes}分`;
  };
  
  return (
    <Link href={`/posts/${post.id}`} className="block h-full">
      <div className="group h-full bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
        {/* 画像部分 */}
        <div className="relative aspect-[16/9] w-full bg-gray-50 overflow-hidden">
          {post.image_url ? (
            <img
              src={post.image_url}
              alt={`${post.title}のサムネイル`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
             <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                <FaTheaterMasks className="text-3xl opacity-50" />
            </div>
          )}
          
          {/* お気に入りボタン（左上） */}
          <div className="absolute top-2 left-2 z-10">
            <FavoriteButton postId={post.id} size="sm" />
          </div>

          {/* カテゴリーバッジ */}
          {primaryCategory && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-pink-700 text-[10px] font-medium rounded shadow-sm border border-gray-100">
                {primaryCategory.name}
              </span>
            </div>
          )}
        </div>
        
        {/* コンテンツ */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-serif font-bold text-base text-gray-800 line-clamp-2 mb-2 group-hover:text-pink-700 transition-colors">
            {post.title}
          </h3>
          
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <FaPen className="text-gray-400" />
            <span className="truncate">{post.author.name}</span>
          </div>
          
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50 text-xs text-gray-500">
            {post.playtime && post.playtime > 0 && (
              <div className="flex items-center gap-1">
                <FaClock className="text-green-500/60" />
                <span>{formatPlaytime(post.playtime)}</span>
              </div>
            )}
            
            {post.totalNumber && post.totalNumber > 0 && (
               <div className="flex items-center gap-1">
                <FaUsers className="text-blue-500/60" />
                <span>{post.totalNumber}人</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCardSmall;
