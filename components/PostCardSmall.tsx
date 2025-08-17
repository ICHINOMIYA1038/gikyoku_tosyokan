import * as React from "react";
import Image from "next/image";
import { Post as PostType } from "@prisma/client";
import Link from "next/link";
import { FaClock, FaUsers, FaTag, FaPen, FaMale, FaFemale } from "react-icons/fa";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};

const PostCardSmall: React.FC<PostPageProps> = ({ post }: any) => {
  // カテゴリーの最初の1つを取得
  const primaryCategory = post.categories && post.categories.length > 0 ? post.categories[0] : null;
  
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
  const formatCast = () => {
    const parts = [];
    if (post.menNumber > 0) parts.push(`男${post.menNumber}`);
    if (post.womenNumber > 0) parts.push(`女${post.womenNumber}`);
    if (post.eitherNumber > 0) parts.push(`不問${post.eitherNumber}`);
    
    if (parts.length === 0 && post.totalNumber > 0) {
      return `${post.totalNumber}人`;
    }
    
    return parts.join(' ');
  };
  
  return (
    <Link href={`/posts/${post.id}`} className="block">
      <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden w-full max-w-[200px] cursor-pointer flex flex-col h-full border border-gray-100">
        {/* 画像部分 */}
        <div className="relative h-32 w-full bg-theater-neutral-100">
          {post.image_url ? (
            <img
              src={post.image_url}
              alt={`${post.title}のサムネイル`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-theater-primary-100 to-theater-secondary-100">
              <FaTag className="text-4xl text-theater-primary-300" />
            </div>
          )}
          
          {/* オーバーレイグラデーション */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* カテゴリーバッジ */}
          {primaryCategory && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 bg-theater-primary-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-md">
                {primaryCategory.name}
              </span>
            </div>
          )}
        </div>
        
        {/* テキスト部分 */}
        <div className="p-4 flex-grow flex flex-col">
          {/* タイトル */}
          <h3 className="font-bold text-sm text-theater-neutral-900 line-clamp-2 mb-2 group-hover:text-theater-primary-600 transition-colors min-h-[2.5rem]">
            {post.title}
          </h3>
          
          {/* 作者名 */}
          <div className="flex items-center gap-1 text-xs text-theater-neutral-600 mb-3">
            <FaPen className="text-theater-secondary-400 flex-shrink-0" />
            <span className="truncate">{post.author.name}</span>
          </div>
          
          {/* メタ情報カード */}
          <div className="mt-auto space-y-2">
            {/* 上演時間 */}
            {post.playtime && post.playtime > 0 && (
              <div className="flex items-center justify-between bg-theater-secondary-50 rounded-lg px-2 py-1.5">
                <div className="flex items-center gap-1">
                  <FaClock className="text-theater-secondary-500 text-xs" />
                  <span className="text-xs text-theater-neutral-700 font-medium">
                    {formatPlaytime(post.playtime)}
                  </span>
                </div>
                {post.playtime <= 30 && (
                  <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">短編</span>
                )}
              </div>
            )}
            
            {/* キャスト人数 */}
            {post.totalNumber && post.totalNumber > 0 && (
              <div className="flex items-center justify-between bg-theater-accent-blue/10 rounded-lg px-2 py-1.5">
                <div className="flex items-center gap-1">
                  <FaUsers className="text-theater-accent-blue text-xs" />
                  <span className="text-xs text-theater-neutral-700 font-medium">
                    {formatCast()}
                  </span>
                </div>
                {post.totalNumber <= 5 && (
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">少人数</span>
                )}
              </div>
            )}
            
            {/* 男女別人数（詳細） */}
            {(post.menNumber > 0 || post.womenNumber > 0) && (
              <div className="flex gap-2 text-[10px] text-theater-neutral-500 px-2">
                {post.menNumber > 0 && (
                  <div className="flex items-center gap-0.5">
                    <FaMale className="text-blue-500" />
                    <span>{post.menNumber}</span>
                  </div>
                )}
                {post.womenNumber > 0 && (
                  <div className="flex items-center gap-0.5">
                    <FaFemale className="text-pink-500" />
                    <span>{post.womenNumber}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* ホバー時のアクション表示 */}
        <div className="h-0 group-hover:h-8 transition-all duration-300 bg-theater-primary-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            詳細を見る →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PostCardSmall;