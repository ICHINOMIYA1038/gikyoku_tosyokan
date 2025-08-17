import React from "react";
import Image from "next/image";
import Link from "next/link";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useRouter } from "next/router";
import { FaTrophy, FaPen, FaTag, FaChevronRight, FaFire, FaCrown, FaMedal, FaStar, FaHeart, FaTheaterMasks, FaClock, FaUsers } from "react-icons/fa";
import PostCardSmall from "./PostCardSmall";
import { useQuery } from "@tanstack/react-query";

interface ContentSectionProps {
    posts: any;
    authors: any;
    categories: any;
}

const getPopularPosts = async (): Promise<any> => {
  const res = await fetch("/api/popular");
  return res.json();
};

const ContentSection: React.FC<ContentSectionProps> = ({ posts, authors, categories }) => {
    const router = useRouter();
    
    const {
        data: popularPosts,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["popular"],
        queryFn: getPopularPosts,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
        cacheTime: Infinity,
    });

    // カテゴリごとの作品数を計算
    const categoriesWithCount = categories?.map((cat: any) => ({
        ...cat,
        postCount: cat.posts?.length || 0
    })).sort((a: any, b: any) => b.postCount - a.postCount);

    return (
        <section className="py-12 px-4 bg-gradient-to-b from-theater-neutral-50 to-white">
            <div className="max-w-7xl mx-auto">
                {/* セクションタイトル */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-theater-neutral-900 mb-4">
                        戯曲図書館の人気コンテンツ
                    </h2>
                    <p className="text-theater-neutral-600">
                        人気作品、作者、カテゴリーをチェック
                    </p>
                </div>

                {/* メインコンテンツグリッド */}
                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {/* 人気記事TOP3 */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-theater-neutral-900 flex items-center gap-2">
                                    <FaTrophy className="text-theater-accent-yellow" />
                                    人気戯曲 TOP3
                                </h3>
                                <Link href="/popular" className="text-theater-primary-600 hover:text-theater-primary-700 text-sm font-medium flex items-center gap-1">
                                    もっと見る <FaChevronRight className="text-xs" />
                                </Link>
                            </div>
                            
                            {isLoading ? (
                                <LoadingIndicator />
                            ) : (
                                <div className="space-y-4">
                                    {popularPosts?.slice(0, 3).map((post: any, index: number) => (
                                        <Link 
                                            key={post.id} 
                                            href={`/posts/${post.id}`}
                                            className="flex items-center gap-4 p-4 rounded-lg hover:bg-theater-primary-50 transition-all group"
                                        >
                                            {/* ランキング番号 */}
                                            <div className="flex-shrink-0">
                                                {index === 0 && (
                                                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                                                        <FaCrown className="text-white text-xl" />
                                                    </div>
                                                )}
                                                {index === 1 && (
                                                    <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                                                        <span className="text-white font-bold text-lg">2</span>
                                                    </div>
                                                )}
                                                {index === 2 && (
                                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                                                        <span className="text-white font-bold text-lg">3</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* サムネイル */}
                                            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-theater-neutral-100">
                                                {post.image_url ? (
                                                    <img 
                                                        src={post.image_url} 
                                                        alt={post.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-theater-primary-100 to-theater-secondary-100">
                                                        <FaTheaterMasks className="text-2xl text-theater-primary-300" />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* 作品情報 */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-theater-neutral-900 group-hover:text-theater-primary-600 transition-colors truncate">
                                                    {post.title}
                                                </h4>
                                                <p className="text-sm text-theater-neutral-600 mt-1">
                                                    {post.author?.name}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2 text-xs text-theater-neutral-500">
                                                    {post.playtime > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <FaClock className="text-theater-secondary-400" />
                                                            {post.playtime}分
                                                        </span>
                                                    )}
                                                    {post.totalNumber > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <FaUsers className="text-theater-accent-blue" />
                                                            {post.totalNumber}人
                                                        </span>
                                                    )}
                                                    {post.categories?.[0] && (
                                                        <span className="px-2 py-0.5 bg-theater-primary-100 text-theater-primary-600 rounded-full">
                                                            {post.categories[0].name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* カテゴリー一覧 */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-theater-neutral-900 flex items-center gap-2">
                                    <FaTag className="text-theater-primary-500" />
                                    カテゴリー
                                </h3>
                                <Link href="/categories" className="text-theater-primary-600 hover:text-theater-primary-700 text-sm font-medium flex items-center gap-1">
                                    全て <FaChevronRight className="text-xs" />
                                </Link>
                            </div>
                            
                            <div className="space-y-3">
                                {categoriesWithCount?.slice(0, 6).map((category: any) => (
                                    <Link
                                        key={category.id}
                                        href={`/categories/${category.id}`}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-theater-primary-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-theater-primary-100 rounded-full flex items-center justify-center group-hover:bg-theater-primary-200 transition-colors">
                                                <FaTheaterMasks className="text-theater-primary-600 text-sm" />
                                            </div>
                                            <span className="font-medium text-theater-neutral-800 group-hover:text-theater-primary-700">
                                                {category.name}
                                            </span>
                                        </div>
                                        <span className="text-sm text-theater-neutral-500 bg-theater-neutral-100 px-2 py-1 rounded-full">
                                            {category.postCount}作品
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 作者一覧 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-theater-neutral-900 flex items-center gap-2">
                            <FaPen className="text-theater-secondary-500" />
                            作者一覧
                        </h3>
                        <Link href="/authors" className="text-theater-primary-600 hover:text-theater-primary-700 text-sm font-medium flex items-center gap-1">
                            全ての作者を見る <FaChevronRight className="text-xs" />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {authors?.slice(0, 18).map((author: any) => (
                            <Link
                                key={author.id}
                                href={`/authors/${author.id}`}
                                className="p-3 bg-gradient-to-br from-theater-secondary-50 to-theater-secondary-100 rounded-lg hover:from-theater-secondary-100 hover:to-theater-secondary-200 transition-all group text-center"
                            >
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                                    <FaPen className="text-theater-secondary-500" />
                                </div>
                                <p className="text-sm font-medium text-theater-neutral-800 truncate">
                                    {author.name}
                                </p>
                                {author.posts && (
                                    <p className="text-xs text-theater-neutral-500 mt-1">
                                        {author.posts.length}作品
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* CTA セクション */}
                <div className="mt-12 text-center">
                    <div className="inline-flex flex-col sm:flex-row gap-4">
                        <Link 
                            href="/posts"
                            className="px-8 py-3 bg-theater-primary-500 text-white font-bold rounded-lg hover:bg-theater-primary-600 transition-colors flex items-center gap-2 justify-center"
                        >
                            <FaTheaterMasks />
                            すべての作品を見る
                        </Link>
                        <Link 
                            href="/guide"
                            className="px-8 py-3 bg-theater-secondary-500 text-white font-bold rounded-lg hover:bg-theater-secondary-600 transition-colors flex items-center gap-2 justify-center"
                        >
                            <FaStar />
                            演劇ガイドを読む
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContentSection;