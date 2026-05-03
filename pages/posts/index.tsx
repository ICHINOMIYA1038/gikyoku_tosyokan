import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import Seo from "@/components/seo";
import { prisma } from "@/lib/prisma";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { FaTheaterMasks, FaFilter, FaSortAmountDown, FaSearch } from "react-icons/fa";

const POSTS_PER_PAGE = 24;

function PostListPage({ posts }: any) {
  const router = useRouter();

  // Initialize state from URL query params (fallback to defaults)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [initialized, setInitialized] = useState(false);

  // Read URL params on mount and when query changes
  useEffect(() => {
    if (!router.isReady) return;
    const { q, category, sort, page } = router.query;
    if (typeof q === "string") setSearchTerm(q);
    if (typeof category === "string") setSelectedCategory(category);
    if (typeof sort === "string") setSortBy(sort);
    if (typeof page === "string") {
      const parsed = parseInt(page, 10);
      if (!isNaN(parsed) && parsed >= 1) setCurrentPage(parsed);
    }
    setInitialized(true);
  }, [router.isReady, router.query]);

  // Sync state back to URL params (skip until initial read is done)
  const updateUrlParams = useCallback(
    (newSearch: string, newCategory: string, newSort: string, newPage: number = 1) => {
      const params: Record<string, string> = {};
      if (newSearch) params.q = newSearch;
      if (newCategory && newCategory !== "all") params.category = newCategory;
      if (newSort && newSort !== "latest") params.sort = newSort;
      if (newPage > 1) params.page = String(newPage);

      router.replace(
        { pathname: router.pathname, query: params },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  // Wrapped setters that also update URL (reset page to 1 on filter change)
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    if (initialized) updateUrlParams(value, selectedCategory, sortBy, 1);
  };
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
    if (initialized) updateUrlParams(searchTerm, value, sortBy, 1);
  };
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
    if (initialized) updateUrlParams(searchTerm, selectedCategory, value, 1);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (initialized) updateUrlParams(searchTerm, selectedCategory, sortBy, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  // ページネーション計算
  const totalCount = sortedPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * POSTS_PER_PAGE;
  const endIndex = Math.min(startIndex + POSTS_PER_PAGE, totalCount);
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

  // ページ番号リスト生成（最大7ページ表示）
  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [safePage, totalPages]);

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
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-theater-primary-400 rounded-full filter blur-3xl"></div>
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
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-theater-neutral-200 focus:border-theater-primary-500 focus:ring-2 focus:ring-theater-primary-200 transition-all duration-200 text-theater-neutral-800 placeholder-theater-neutral-400"
                  />
                </div>
              </div>

              {/* カテゴリーフィルター */}
              <div className="flex items-center gap-2">
                <FaFilter className="text-theater-neutral-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
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
                  onChange={(e) => handleSortChange(e.target.value)}
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
              {totalCount > 0 ? (
                <>
                  <span className="font-semibold text-brand-primary">{startIndex + 1}〜{endIndex}件</span>
                  {" / "}全<span className="font-semibold text-brand-primary">{totalCount}</span>件の作品が見つかりました
                </>
              ) : (
                <>
                  <span className="font-semibold text-brand-primary">0</span> 件の作品が見つかりました
                </>
              )}
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="px-4 md:px-0">
          {paginatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {paginatedPosts.map((post: any, index: number) => (
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

          {/* ページネーション */}
          {totalPages > 1 && (
            <nav className="flex justify-center items-center gap-1 mt-10 mb-8">
              <button
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage <= 1}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-theater-neutral-600 hover:bg-theater-neutral-100"
              >
                前へ
              </button>

              {pageNumbers.map((page, i) =>
                page === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-2 py-2 text-theater-neutral-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      page === safePage
                        ? "bg-brand-primary text-white shadow-sm"
                        : "text-theater-neutral-600 hover:bg-theater-neutral-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage >= totalPages}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-theater-neutral-600 hover:bg-theater-neutral-100"
              >
                次へ
              </button>
            </nav>
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
      revalidate: 604800,
    };
  } catch {
    return {
      notFound: true,
    };
  } finally {
    await prisma.$disconnect();
  }
}

export default PostListPage;
