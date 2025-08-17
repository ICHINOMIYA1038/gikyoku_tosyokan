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
  const router = useRouter();
  const primaryCategory = post.categories && post.categories.length > 0 ? post.categories[0] : null;
  const additionalCategories = post.categories && post.categories.length > 1 ? post.categories.length - 1 : 0;

  return (
    <Link href={`/posts/${post.id}`} target="_blank" className="block">
      <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer border border-theater-neutral-200 h-40 md:h-48">
        <div className="flex flex-col md:flex-row h-full">
          {/* 画像部分 - 高さを親要素の100%に */}
          <div className="relative h-full w-full md:w-1/3 bg-theater-neutral-100 flex-shrink-0">
            {post.image_url ? (
              <img
                src={post.image_url}
                alt={`${post.title}のサムネイル`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-theater-primary-100 to-theater-secondary-100">
                <FaTheaterMasks className="text-5xl text-theater-primary-300" />
              </div>
            )}
            
            {/* カテゴリーバッジ */}
            {primaryCategory && (
              <div className="absolute top-2 left-2 flex gap-1">
                <span className="px-2 py-1 bg-theater-primary-500 text-white text-xs rounded-full">
                  {primaryCategory.name}
                </span>
                {additionalCategories > 0 && (
                  <span className="px-2 py-1 bg-theater-neutral-600 text-white text-xs rounded-full">
                    +{additionalCategories}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* テキスト部分 - overflow-hiddenとoverflow-y-autoで高さを制限 */}
          <div className="flex-1 p-3 md:p-4 overflow-hidden flex flex-col">
            {/* タイトルと作者 */}
            <div className="mb-2">
              <h3 className="text-base md:text-lg font-bold text-theater-neutral-900 group-hover:text-theater-primary-600 transition-colors line-clamp-1">
                {post.title}
              </h3>
              <div className="flex items-center gap-1 text-xs text-theater-neutral-600 mt-1">
                <FaPen className="text-theater-secondary-400 text-xs" />
                <span>{post.author.name}</span>
              </div>
            </div>
            
            {/* メタ情報 */}
            <div className="flex flex-wrap gap-2 mb-2 text-xs">
              {post.playtime && post.playtime > 0 && (
                <div className="flex items-center gap-1 text-theater-neutral-600">
                  <FaClock className="text-theater-secondary-400" />
                  <span className="font-medium">{post.playtime}分</span>
                </div>
              )}
              
              {post.totalNumber && post.totalNumber > 0 && (
                <div className="flex items-center gap-1 text-theater-neutral-600">
                  <FaUsers className="text-theater-accent-blue" />
                  <span className="font-medium">{post.totalNumber}人</span>
                </div>
              )}
              
              {post.man && post.man > 0 && (
                <div className="flex items-center gap-1 text-theater-neutral-600">
                  <FaMale className="text-blue-500" />
                  <span>{post.man}</span>
                </div>
              )}
              
              {post.woman && post.woman > 0 && (
                <div className="flex items-center gap-1 text-theater-neutral-600">
                  <FaFemale className="text-pink-500" />
                  <span>{post.woman}</span>
                </div>
              )}
            </div>
            
            {/* あらすじ - flex-1で残りのスペースを使用 */}
            {post.synopsis && (
              <p className="text-xs text-theater-neutral-700 line-clamp-2 md:line-clamp-3 flex-1">
                {post.synopsis}
              </p>
            )}
            
            {/* もっと見るリンク */}
            <div className="mt-2 text-theater-primary-600 text-xs font-medium group-hover:text-theater-primary-700">
              詳細を見る →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;