import * as React from "react";
import Badge from "@/components/Badge";
import AmazonAffiliateLink from "@/components/Ad/AmazonAffiliateLink";
import { QueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import LinkCard from "./LinkCard";
import Star from "./Widget/Star";
import CustomMarkdown from './CustomMarkdown';
import { 
  FaClock, FaUsers, FaMale, FaFemale, FaTheaterMasks, 
  FaTag, FaPen, FaBook, FaInfoCircle, FaQuoteLeft,
  FaExternalLinkAlt, FaAmazon, FaDownload, FaHeart,
  FaEye, FaCalendar, FaGlobe
} from "react-icons/fa";

const queryClient = new QueryClient();

type PostPageProps = {
  post: any;
};

const PostDetailIntegrated: React.FC<PostPageProps> = ({ post }: PostPageProps) => {
  const router = useRouter();
  
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 pt-8 pb-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* メインコンテンツ */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* ヒーローセクション */}
              <div className="bg-gradient-to-r from-theater-primary-50 to-theater-secondary-50 p-6 md:p-8 lg:p-10 border-b border-gray-100">
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
                        className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 hover:bg-white rounded-full text-sm font-medium text-theater-primary-600 hover:text-theater-primary-700 shadow-sm hover:shadow-md transition-all"
                      >
                        <FaTag className="text-xs" />
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 基本情報 */}
              <div className="p-6 md:p-8 lg:p-10 border-b border-gray-100">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                  <FaInfoCircle className="text-theater-primary-500" />
                  作品情報
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {/* 上演時間 */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 md:p-4 text-center border border-gray-200 hover:shadow-md transition-shadow">
                    <FaClock className="text-lg md:text-xl text-theater-secondary-500 mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-600">上演時間</p>
                    <p className="font-bold text-base md:text-lg text-gray-900 mt-1">
                      {post.playtime !== -1 ? `${post.playtime}分` : "不明"}
                    </p>
                  </div>
                  
                  {/* 総人数 */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 md:p-4 text-center border border-gray-200 hover:shadow-md transition-shadow">
                    <FaUsers className="text-lg md:text-xl text-theater-secondary-500 mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-600">総人数</p>
                    <p className="font-bold text-base md:text-lg text-gray-900 mt-1">
                      {post.totalNumber !== -1 ? `${post.totalNumber}人` : "不明"}
                    </p>
                  </div>
                  
                  {/* 男性 */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 md:p-4 text-center border border-gray-200 hover:shadow-md transition-shadow">
                    <FaMale className="text-lg md:text-xl text-blue-500 mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-600">男性</p>
                    <p className="font-bold text-base md:text-lg text-gray-900 mt-1">
                      {post.man !== -1 ? `${post.man}人` : "不明"}
                    </p>
                  </div>
                  
                  {/* 女性 */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 md:p-4 text-center border border-gray-200 hover:shadow-md transition-shadow">
                    <FaFemale className="text-lg md:text-xl text-pink-500 mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-600">女性</p>
                    <p className="font-bold text-base md:text-lg text-gray-900 mt-1">
                      {post.woman !== -1 ? `${post.woman}人` : "不明"}
                    </p>
                  </div>
                  
                  {/* どちらでも */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 md:p-4 text-center border border-gray-200 hover:shadow-md transition-shadow col-span-2 md:col-span-1">
                    <FaTheaterMasks className="text-lg md:text-xl text-purple-500 mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-600">どちらでも</p>
                    <p className="font-bold text-base md:text-lg text-gray-900 mt-1">
                      {(post.others !== undefined && post.others !== -1) ? `${post.others}人` : (post.either !== -1 ? `${post.either}人` : "不明")}
                    </p>
                  </div>
                </div>
              </div>

              {/* あらすじ */}
              {post.synopsis && (
                <div className="p-6 md:p-8 lg:p-10 border-b border-gray-100">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                    <FaQuoteLeft className="text-theater-primary-500" />
                    あらすじ
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-theater-primary-400">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {post.synopsis}
                    </p>
                  </div>
                </div>
              )}

              {/* 詳細説明 */}
              {post.details && (
                <div className="p-6 md:p-8 lg:p-10 border-b border-gray-100">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                    <FaBook className="text-theater-primary-500" />
                    詳細説明
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <CustomMarkdown content={post.details} />
                  </div>
                </div>
              )}

              {/* 購入・閲覧リンク */}
              {(post.amazon_text_url || post.link_to_plot) && (
                <div className="p-6 md:p-8 lg:p-10 border-b border-gray-100">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                    <FaExternalLinkAlt className="text-theater-primary-500" />
                    脚本を読む
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {post.amazon_text_url && (
                      <a
                        href={post.amazon_text_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all transform hover:-translate-y-1 hover:shadow-lg"
                      >
                        <FaAmazon />
                        Amazonで購入
                      </a>
                    )}
                    {post.link_to_plot && (
                      <a
                        href={post.link_to_plot}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold rounded-lg hover:from-green-500 hover:to-green-600 transition-all transform hover:-translate-y-1 hover:shadow-lg"
                      >
                        <FaDownload />
                        無料で読む
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* 作者情報（必要に応じて） */}
              {post.author.profile && (
                <div className="p-6 md:p-8 lg:p-10 bg-gray-50">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                    <FaPen className="text-theater-primary-500" />
                    作者について
                  </h2>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{post.author.name}</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {post.author.profile}
                      </p>
                      <Link
                        href={`/authors/${post.author_id}`}
                        className="inline-flex items-center gap-2 mt-4 text-theater-primary-600 hover:text-theater-primary-700 font-medium"
                      >
                        作者の他の作品を見る
                        <FaExternalLinkAlt className="text-sm" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* サイドバー（PCのみ） */}
          <aside className="hidden xl:block xl:w-80 2xl:w-96 flex-shrink-0">
            <div className="sticky top-4 space-y-6">
              {/* 統計情報 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-800">統計情報</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-600">
                      <FaEye />
                      閲覧数
                    </span>
                    <span className="font-bold text-gray-900">
                      {post._count?.accesses || 0}回
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-600">
                      <FaHeart />
                      評価数
                    </span>
                    <span className="font-bold text-gray-900">
                      {post._count?.ratings || 0}件
                    </span>
                  </div>
                  {post.createdAt && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-gray-600">
                        <FaCalendar />
                        登録日
                      </span>
                      <span className="font-bold text-gray-900">
                        {new Date(post.createdAt).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 関連作品 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-800">関連作品</h3>
                <div className="space-y-3">
                  {post.categories && post.categories.length > 0 && (
                    <Link
                      href={`/categories/${post.categories[0].id}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-700">
                        同じカテゴリの作品
                      </p>
                      <p className="text-xs text-theater-primary-600 mt-1">
                        {post.categories[0].name}の作品を見る →
                      </p>
                    </Link>
                  )}
                  <Link
                    href={`/authors/${post.author_id}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-700">
                      同じ作者の作品
                    </p>
                    <p className="text-xs text-theater-primary-600 mt-1">
                      {post.author.name}の作品を見る →
                    </p>
                  </Link>
                  {post.playtime && post.playtime !== -1 && (
                    <Link
                      href={`/?minPlaytime=${Math.max(0, post.playtime - 10)}&maxPlaytime=${post.playtime + 10}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-700">
                        同じ上演時間の作品
                      </p>
                      <p className="text-xs text-theater-primary-600 mt-1">
                        {post.playtime}分前後の作品を探す →
                      </p>
                    </Link>
                  )}
                </div>
              </div>

              {/* 作者のSNS（あれば） */}
              {(post.author.twitter || post.author.website) && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="font-bold text-lg mb-4 text-gray-800">作者のリンク</h3>
                  <div className="space-y-2">
                    {post.author.twitter && (
                      <a
                        href={`https://twitter.com/${post.author.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-theater-primary-600 hover:text-theater-primary-700"
                      >
                        <FaGlobe />
                        Twitter
                      </a>
                    )}
                    {post.author.website && (
                      <a
                        href={post.author.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-theater-primary-600 hover:text-theater-primary-700"
                      >
                        <FaGlobe />
                        ウェブサイト
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-gradient-to-br from-theater-primary-500 to-theater-primary-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="font-bold text-lg mb-2">他の作品を探す</h3>
                <p className="text-sm mb-4 opacity-90">
                  条件を指定して理想の脚本を見つけよう
                </p>
                <Link
                  href="/"
                  className="block w-full text-center bg-white text-theater-primary-600 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                >
                  検索ページへ
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PostDetailIntegrated;