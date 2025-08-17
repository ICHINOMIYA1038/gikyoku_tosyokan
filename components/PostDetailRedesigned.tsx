import * as React from "react";
import Badge from "@/components/Badge";
import AmazonAffiliateLink from "@/components/Ad/AmazonAffiliateLink";
import { QueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import LinkCard from "./LinkCard";
import Star from "./Widget/Star";
import CustomMarkdown from './CustomMarkdown';
import { FaClock, FaUsers, FaMale, FaFemale, FaTheaterMasks, FaTag, FaPen, FaBook, FaInfoCircle, FaQuoteLeft } from "react-icons/fa";

const queryClient = new QueryClient();

type PostPageProps = {
  post: any;
};

const PostDetailRedesigned: React.FC<PostPageProps> = ({ post }: PostPageProps) => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-theater-neutral-50 to-white">
      {/* ヒーローセクション */}
      <div className="bg-gradient-to-r from-theater-primary-100 via-theater-secondary-50 to-theater-primary-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 評価 */}
          {post.averageRating > 0 && (
            <div className="mb-4">
              <Star star={post.averageRating} rateCount={post._count?.ratings || 0} />
            </div>
          )}
          
          {/* タイトルと作者 */}
          <h1 className="text-3xl md:text-4xl font-bold text-theater-neutral-900 mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-theater-neutral-700">
            <Link
              href={`/authors/${post.author_id}`}
              className="flex items-center gap-2 hover:text-theater-primary-600 transition-colors"
            >
              <FaPen className="text-theater-primary-500" />
              <span className="font-medium text-lg">{post.author.name}</span>
              {post.author.group && (
                <span className="text-theater-neutral-500">({post.author.group})</span>
              )}
            </Link>
          </div>
          
          {/* カテゴリータグ */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.categories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 hover:bg-white rounded-full text-sm font-medium text-theater-primary-600 hover:text-theater-primary-700 transition-colors"
                >
                  <FaTag className="text-xs" />
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 基本情報カード */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaInfoCircle className="text-theater-primary-500" />
            作品情報
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* 上演時間 */}
            <div className="bg-theater-neutral-50 rounded-lg p-3 text-center">
              <FaClock className="text-2xl text-theater-secondary-500 mx-auto mb-1" />
              <p className="text-xs text-theater-neutral-600">上演時間</p>
              <p className="font-bold text-lg">
                {post.playtime !== -1 ? `${post.playtime}分` : "不明"}
              </p>
            </div>
            
            {/* 総人数 */}
            <div className="bg-theater-neutral-50 rounded-lg p-3 text-center">
              <FaUsers className="text-2xl text-theater-secondary-500 mx-auto mb-1" />
              <p className="text-xs text-theater-neutral-600">総人数</p>
              <p className="font-bold text-lg">
                {post.totalNumber !== -1 ? `${post.totalNumber}人` : "不明"}
              </p>
            </div>
            
            {/* 男性 */}
            <div className="bg-theater-neutral-50 rounded-lg p-3 text-center">
              <FaMale className="text-2xl text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-theater-neutral-600">男性</p>
              <p className="font-bold text-lg">
                {post.man !== -1 ? `${post.man}人` : "不明"}
              </p>
            </div>
            
            {/* 女性 */}
            <div className="bg-theater-neutral-50 rounded-lg p-3 text-center">
              <FaFemale className="text-2xl text-pink-500 mx-auto mb-1" />
              <p className="text-xs text-theater-neutral-600">女性</p>
              <p className="font-bold text-lg">
                {post.woman !== -1 ? `${post.woman}人` : "不明"}
              </p>
            </div>
            
            {/* その他 */}
            {post.others !== 0 && post.others !== -1 && (
              <div className="bg-theater-neutral-50 rounded-lg p-3 text-center">
                <FaUsers className="text-2xl text-purple-500 mx-auto mb-1" />
                <p className="text-xs text-theater-neutral-600">その他</p>
                <p className="font-bold text-lg">{post.others}人</p>
              </div>
            )}
          </div>
        </div>

        {/* あらすじ */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaQuoteLeft className="text-theater-primary-500" />
            あらすじ
          </h2>
          <div className="prose prose-lg max-w-none text-theater-neutral-700">
            <p className="leading-relaxed">{post.synopsis}</p>
          </div>
        </div>

        {/* 感想・レビュー */}
        {post.content && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaTheaterMasks className="text-theater-primary-500" />
              感想・レビュー
            </h2>
            <div className="prose prose-lg max-w-none">
              <CustomMarkdown content={post.content} />
            </div>
          </div>
        )}

        {/* 台本の入手方法 */}
        <div className="bg-gradient-to-r from-theater-secondary-50 to-theater-primary-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaBook className="text-theater-secondary-600" />
            台本の入手方法
          </h2>
          
          <div className="space-y-4">
            {/* 無料リンク */}
            {post.link_to_plot && (
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-bold mb-2 text-theater-secondary-700">📖 無料で読む</h3>
                <LinkCard href={post.link_to_plot} />
              </div>
            )}
            
            {/* Amazon */}
            {post.amazon_text_url && (
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-bold mb-2 text-theater-primary-700">🛒 購入する</h3>
                <AmazonAffiliateLink href={post.amazon_text_url} />
              </div>
            )}
            
            {/* その他のリンク */}
            {post.other_text_url && (
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-bold mb-2 text-theater-neutral-700">🔗 その他の入手方法</h3>
                <LinkCard href={post.other_text_url} />
              </div>
            )}
            
            {!post.link_to_plot && !post.amazon_text_url && !post.other_text_url && (
              <p className="text-theater-neutral-600">
                台本の入手方法については、作者または出版社にお問い合わせください。
              </p>
            )}
          </div>
        </div>

        {/* 上演について */}
        <div className="bg-theater-accent-yellow/10 rounded-lg p-6 border-l-4 border-theater-accent-yellow">
          <h3 className="font-bold mb-3 text-theater-neutral-900">📌 上演をご検討の方へ</h3>
          <ul className="space-y-2 text-sm text-theater-neutral-700">
            <li>• 著作権や上演料については、作者または出版社に直接お問い合わせください</li>
            <li>• 上演時間は目安です。演出により前後する可能性があります</li>
            <li>• 人数は役の兼ね合いなどで調整可能な場合があります</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PostDetailRedesigned;