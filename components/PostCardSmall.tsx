import * as React from "react";
import Image from "next/image";
import { Post as PostType } from "@prisma/client";
import Link from "next/link";
import { FaClock, FaUsers, FaTag, FaPen } from "react-icons/fa";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};

const PostCardSmall: React.FC<PostPageProps> = ({ post }: any) => {
  // カテゴリーの最初の1つを取得
  const primaryCategory = post.categories && post.categories.length > 0 ? post.categories[0] : null;
  
  return (
    <Link href={`/posts/${post.id}`} className="block">
      <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden w-full max-w-[160px] cursor-pointer flex flex-col h-full">
        {/* 画像部分 - line-height: 0で余白を除去 */}
        <div className="relative h-24 w-full bg-theater-neutral-100" style={{ lineHeight: 0 }}>
          {post.image_url ? (
            <img
              src={post.image_url}
              alt={`${post.title}のサムネイル`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-theater-primary-100 to-theater-secondary-100">
              <FaTag className="text-3xl text-theater-primary-300" />
            </div>
          )}
          
          {/* カテゴリーバッジ - 画像の上に配置 */}
          {primaryCategory && (
            <div className="absolute top-1 right-1">
              <span className="px-2 py-0.5 bg-theater-primary-500 text-white text-xs rounded-full">
                {primaryCategory.name}
              </span>
            </div>
          )}
        </div>
        
        {/* テキスト部分 - コンパクトに調整 */}
        <div className="p-3">
          {/* タイトル - 2行まで表示 */}
          <h3 className="font-bold text-sm text-theater-neutral-900 line-clamp-2 mb-1 group-hover:text-theater-primary-600 transition-colors">
            {post.title}
          </h3>
          
          {/* 作者名 */}
          <div className="flex items-center gap-1 text-xs text-theater-neutral-600 mb-2">
            <FaPen className="text-theater-secondary-400" />
            <span className="truncate">{post.author.name}</span>
          </div>
          
          {/* メタ情報 - アイコンとテキストを小さく */}
          <div className="space-y-1">
            {post.playtime && post.playtime > 0 && (
              <div className="flex items-center gap-1 text-xs text-theater-neutral-500">
                <FaClock className="text-theater-secondary-400" />
                <span>{post.playtime}分</span>
              </div>
            )}
            
            {post.totalNumber && post.totalNumber > 0 && (
              <div className="flex items-center gap-1 text-xs text-theater-neutral-500">
                <FaUsers className="text-theater-accent-blue" />
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