import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import Seo from "@/components/seo";
import { prisma } from "@/lib/prisma";
import { useState } from "react";
import { FaTheaterMasks, FaFilter, FaSortAmountDown, FaSearch } from "react-icons/fa";

function PostListPage({ posts }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  // カテゴリーリストを抽出
  const categories: string[] = Array.from(
    new Set(
      posts.flatMap((post: any) => 
        post.categories?.map((cat: any) => cat.name) || []
      )
    )
  );

  // フィルタリングと検索
  const filteredPosts = posts.filter((post: any) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.synopsis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
                           post.categories?.some((cat: any) => cat.name === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  // ソート
  const sortedPosts = [...filteredPosts].sort((a: any, b: any) => {
    switch(sortBy) {
      case "playtime":
        return (b.playtime || 0) - (a.playtime || 0);
      case "cast":
        return (b.totalNumber || 0) - (a.totalNumber || 0);
      case "title":
        return a.title.localeCompare(b.title);
      default: // latest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <Layout>
      <Seo />
      <div className="min-h-screen">
        {/* ヒーローセクション */}
        <div className="relative overflow-hidden bg-gradient-to-r from-brand-primary to-theater-primary-700 text-white mb-8">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black opacity-10"></div>
          
          {/* 装飾的な背景パターン */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-theater-secondary-400 rounded-full filter blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <FaTheaterMasks className="text-6xl animate-pulse" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">
                戯曲ライブラリー
              </h1>
              <p className="text-lg md:text-xl text-theater-primary-100 max-w-2xl mx-auto">
                演劇の世界へようこそ。素晴らしい脚本との出会いがここに。
              </p>
            </div>
          </div>
        </div>

        {/* 検索・フィルターセクション */}
        <div className="bg-white shadow-md rounded-lg mb-8 mx-4 md:mx-0">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* 検索バー */}
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-theater-neutral-400" />
                  <input
                    type="text"
                    placeholder="タイトル、あらすじ、作者名で検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-theater-neutral-200 focus:border-theater-primary-500 focus:ring-2 focus:ring-theater-primary-200 transition-all duration-200 text-theater-neutral-800 placeholder-theater-neutral-400"
                  />
                </div>
              </div>

              {/* カテゴリーフィルター */}
              <div className="flex items-center gap-2">
                <FaFilter className="text-theater-neutral-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-theater-neutral-200 focus:border-theater-primary-500 focus:ring-2 focus:ring-theater-primary-200 transition-all duration-200 text-theater-neutral-700 bg-white cursor-pointer hover:bg-theater-neutral-50"
                >
                  <option value="all">全カテゴリー</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* ソート */}
              <div className="flex items-center gap-2">
                <FaSortAmountDown className="text-theater-neutral-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-theater-neutral-200 focus:border-theater-primary-500 focus:ring-2 focus:ring-theater-primary-200 transition-all duration-200 text-theater-neutral-700 bg-white cursor-pointer hover:bg-theater-neutral-50"
                >
                  <option value="latest">最新順</option>
                  <option value="title">タイトル順</option>
                  <option value="playtime">上演時間順</option>
                  <option value="cast">キャスト数順</option>
                </select>
              </div>
            </div>

            {/* 結果数表示 */}
            <div className="mt-4 text-sm text-theater-neutral-600">
              <span className="font-semibold text-brand-primary">{sortedPosts.length}</span> 件の作品が見つかりました
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="px-4 md:px-0">
          {sortedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {sortedPosts.map((post: any, index: number) => (
                <div
                  key={post.id}
                  className="animate-fadeInUp"
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FaTheaterMasks className="text-6xl text-theater-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-theater-neutral-600 mb-2">
                作品が見つかりませんでした
              </h3>
              <p className="text-theater-neutral-500">
                検索条件を変更してお試しください
              </p>
            </div>
          )}
        </div>
      </div>

      {/* アニメーション定義 */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const posts = await prisma.post.findMany({
      include: { 
        author: true,
        categories: true,
      },
    });

    return {
      props: {
        posts,
      },
    };
  } catch {
    return {
      notFound: true, // Return a 404 page
    };
  } finally {
    await prisma.$disconnect(); // リクエスト処理の最後で接続を切断
  }
}

export default PostListPage;
