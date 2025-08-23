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
    <div className="min-h-screen bg-brand-light">
      {/* ヒーローセクション */}
      <div className="bg-white py-8 px-4 shadow-lg border-b border-brand-light">
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
              className="flex items-center gap-2 hover:text-brand-primary transition-colors"
            >
              <FaPen className="text-brand-primary" />
              <span className="font-medium text-lg">{post.author.name}</span>
              {post.author.group && (
                <span className="text-brand-dark opacity-60">({post.author.group})</span>
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
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-brand-light rounded-full text-sm font-medium text-brand-primary hover:text-brand-primary shadow-md hover:shadow-lg transition-all border border-brand-light"
                >
                  <FaTag className="text-xs" />
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* 基本情報カード */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-brand-dark">
            <FaInfoCircle className="text-brand-primary" />
            作品情報
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {/* 上演時間 */}
            <div className="bg-white rounded-lg p-4 text-center shadow-lg hover:shadow-xl transition-all duration-200 border border-brand-light hover:scale-105">
              <FaClock className="text-2xl text-brand-secondary mx-auto mb-1" />
              <p className="text-sm font-medium text-brand-dark opacity-70 mb-1">上演時間</p>
              <p className="font-bold text-xl text-brand-dark">
                {post.playtime !== -1 ? `${post.playtime}分` : "不明"}
              </p>
            </div>
            
            {/* 総人数 */}
            <div className="bg-white rounded-lg p-4 text-center shadow-lg hover:shadow-xl transition-all duration-200 border border-brand-light hover:scale-105">
              <FaUsers className="text-2xl text-brand-secondary mx-auto mb-1" />
              <p className="text-sm font-medium text-brand-dark opacity-70 mb-1">総人数</p>
              <p className="font-bold text-xl text-brand-dark">
                {post.totalNumber !== -1 ? `${post.totalNumber}人` : "不明"}
              </p>
            </div>
            
            {/* 男性 */}
            <div className="bg-white rounded-lg p-4 text-center shadow-lg hover:shadow-xl transition-all duration-200 border border-brand-light hover:scale-105">
              <FaMale className="text-2xl text-brand-primary mx-auto mb-1" />
              <p className="text-sm font-medium text-brand-dark opacity-70 mb-1">男性</p>
              <p className="font-bold text-xl text-brand-dark">
                {post.man !== -1 ? `${post.man}人` : "不明"}
              </p>
            </div>
            
            {/* 女性 */}
            <div className="bg-white rounded-lg p-4 text-center shadow-lg hover:shadow-xl transition-all duration-200 border border-brand-light hover:scale-105">
              <FaFemale className="text-2xl text-brand-primary mx-auto mb-1" />
              <p className="text-sm font-medium text-brand-dark opacity-70 mb-1">女性</p>
              <p className="font-bold text-xl text-brand-dark">
                {post.woman !== -1 ? `${post.woman}人` : "不明"}
              </p>
            </div>
            
            {/* その他 */}
            {post.others !== 0 && post.others !== -1 && (
              <div className="bg-white rounded-lg p-4 text-center shadow-lg hover:shadow-xl transition-all duration-200 border border-brand-light hover:scale-105">
                <FaUsers className="text-2xl text-brand-secondary mx-auto mb-1" />
                <p className="text-sm font-medium text-brand-dark opacity-70 mb-1">その他</p>
                <p className="font-bold text-xl text-brand-dark">{post.others}人</p>
              </div>
            )}
          </div>
        </div>

        {/* あらすじ */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-brand-dark">
            <FaQuoteLeft className="text-brand-primary" />
            あらすじ
          </h2>
          <div className="prose prose-lg max-w-none text-brand-dark leading-relaxed">
            <p className="leading-relaxed text-lg">{post.synopsis}</p>
          </div>
        </div>

        {/* 感想・レビュー */}
        {post.content && (
          <div className="bg-white rounded-xl shadow-2xl p-8 mb-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-brand-dark">
              <FaTheaterMasks className="text-brand-primary" />
              感想・レビュー
            </h2>
            <div className="prose prose-lg max-w-none">
              <CustomMarkdown content={post.content} />
            </div>
          </div>
        )}

        {/* 台本の入手方法 */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-brand-dark">
            <FaBook className="text-brand-secondary" />
            台本の入手方法
          </h2>
          
          <div className="space-y-6">
            {/* 無料リンク */}
            {post.link_to_plot && (
              <div className="bg-brand-light rounded-lg p-5 shadow-lg hover:shadow-xl transition-all duration-200">
                <h3 className="font-bold mb-3 text-lg text-brand-dark">📖 無料で読む</h3>
                <LinkCard href={post.link_to_plot} />
              </div>
            )}
            
            {/* Amazon */}
            {post.amazon_text_url && (
              <div className="bg-brand-light rounded-lg p-5 shadow-lg hover:shadow-xl transition-all duration-200">
                <h3 className="font-bold mb-3 text-lg text-brand-dark">🛒 購入する</h3>
                <AmazonAffiliateLink href={post.amazon_text_url} />
              </div>
            )}
            
            {/* その他のリンク */}
            {post.other_text_url && (
              <div className="bg-brand-light rounded-lg p-5 shadow-lg hover:shadow-xl transition-all duration-200">
                <h3 className="font-bold mb-3 text-lg text-brand-dark">🔗 その他の入手方法</h3>
                <LinkCard href={post.other_text_url} />
              </div>
            )}
            
            {!post.link_to_plot && !post.amazon_text_url && !post.other_text_url && (
              <p className="text-brand-dark opacity-70">
                台本の入手方法については、作者または出版社にお問い合わせください。
              </p>
            )}
          </div>
        </div>

        {/* 上演について */}
        <div className="bg-white rounded-xl shadow-xl p-8 border-l-4 border-brand-secondary">
          <h3 className="font-bold mb-4 text-lg text-brand-dark">📌 上演をご検討の方へ</h3>
          <ul className="space-y-3 text-base text-brand-dark opacity-80">
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