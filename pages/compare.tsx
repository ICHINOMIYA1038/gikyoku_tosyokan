import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import { FaBalanceScale, FaLink, FaCheck, FaClock, FaUsers, FaStar, FaPen, FaTheaterMasks, FaMale, FaFemale, FaTimes } from "react-icons/fa";
import { toggleCompare } from "@/lib/favorites";
import {
  TwitterShareButton,
  LineShareButton,
  TwitterIcon,
  LineIcon,
} from "react-share";
import { prisma } from "@/lib/prisma";

function ComparePage({ posts: initialPosts }: { posts: any[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [copied, setCopied] = useState(false);

  const handleRemove = (postId: number) => {
    toggleCompare(postId);
    const remaining = posts.filter((p) => p.id !== postId);
    setPosts(remaining);
    if (remaining.length > 0) {
      router.replace(`/compare?ids=${remaining.map((p) => p.id).join(",")}`, undefined, { shallow: true });
    } else {
      router.replace("/compare", undefined, { shallow: true });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = posts.length > 0
    ? `${posts.map((p) => `「${p.title}」`).join("と")}を比較中`
    : "脚本を比較中";

  if (posts.length === 0) {
    return (
      <Layout>
        <Seo pageTitle="作品比較" pageDescription="脚本を比較します" pagePath="/compare" />
        <div className="container mx-auto px-4 py-16 text-center">
          <FaBalanceScale className="text-gray-200 text-6xl mx-auto mb-4" />
          <p className="text-gray-500 mb-4">比較する作品がありません</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition-colors"
          >
            脚本を探す
          </Link>
        </div>
      </Layout>
    );
  }

  // 数値比較でハイライトする関数
  const getHighlight = (values: (number | null | undefined)[], index: number, type: "max" | "min") => {
    const nums = values.map((v) => (v && v > 0 ? v : null));
    const validNums = nums.filter((n): n is number => n !== null);
    if (validNums.length < 2) return "";
    const target = type === "max" ? Math.max(...validNums) : Math.min(...validNums);
    return nums[index] === target ? "text-pink-600 font-bold" : "";
  };

  return (
    <Layout>
      <Seo
        pageTitle="作品比較"
        pageDescription={`${posts.map((p) => p.title).join("、")}の比較`}
        pagePath="/compare"
      />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <FaBalanceScale className="text-blue-500 text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif text-gray-800">作品比較</h1>
              <p className="text-xs text-gray-400">{posts.length}作品を比較中</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              {copied ? (
                <>
                  <FaCheck className="text-green-500" />
                  <span>コピーしました</span>
                </>
              ) : (
                <>
                  <FaLink />
                  <span>共有</span>
                </>
              )}
            </button>
            <TwitterShareButton url={shareUrl} title={shareText}>
              <TwitterIcon size={28} round />
            </TwitterShareButton>
            <LineShareButton url={shareUrl} title={shareText}>
              <LineIcon size={28} round />
            </LineShareButton>
          </div>
        </div>

        {/* カード型比較 */}
        <div className={`grid gap-4 ${posts.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
          {posts.map((post, idx) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              {/* 画像 + タイトル */}
              <Link href={`/posts/${post.id}`} className="block group">
                <div className="relative aspect-[16/10] w-full bg-gray-50 overflow-hidden">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                      <FaTheaterMasks className="text-4xl mb-1 opacity-50" />
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                  {/* 番号バッジ */}
                  <div className="absolute top-3 left-3">
                    <span className="w-8 h-8 rounded-full bg-gray-900/80 text-white text-sm font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                  </div>
                  {/* 削除ボタン */}
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemove(post.id); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
                    aria-label="比較から削除"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
                <div className="px-5 pt-4 pb-2">
                  <h2 className="text-lg font-bold font-serif text-gray-800 group-hover:text-pink-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                    <FaPen className="text-xs text-gray-400" />
                    <span>{post.author.name}</span>
                  </div>
                </div>
              </Link>

              {/* スペック */}
              <div className="px-5 py-4 flex-1">
                {/* 上演時間・人数 */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <FaClock className="text-green-500 mx-auto mb-1" />
                    <div className={`text-lg font-bold ${getHighlight(posts.map(p => p.playtime), idx, "min")}`}>
                      {post.playtime ? `${post.playtime}分` : "—"}
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium">上演時間</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <FaUsers className="text-blue-500 mx-auto mb-1" />
                    <div className={`text-lg font-bold ${getHighlight(posts.map(p => p.totalNumber), idx, "min")}`}>
                      {post.totalNumber ? `${post.totalNumber}人` : "—"}
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium">総人数</div>
                  </div>
                </div>

                {/* 男女内訳 */}
                <div className="flex items-center justify-center gap-4 mb-4 py-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                    <span className="text-gray-500">男</span>
                    <span className="font-bold text-gray-700">{post.man > 0 ? post.man : "—"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-400"></span>
                    <span className="text-gray-500">女</span>
                    <span className="font-bold text-gray-700">{post.woman > 0 ? post.woman : "—"}</span>
                  </div>
                  {post.others > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
                      <span className="text-gray-500">他</span>
                      <span className="font-bold text-gray-700">{post.others}</span>
                    </div>
                  )}
                </div>

                {/* カテゴリ */}
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.categories.map((c: any) => (
                      <span key={c.id} className="px-2.5 py-0.5 bg-pink-50 text-pink-600 text-xs font-medium rounded-full border border-pink-100">
                        {c.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* 評価 */}
                {post.averageRating && (
                  <div className="flex items-center gap-1.5 mb-4">
                    <FaStar className="text-yellow-400" />
                    <span className="font-bold text-gray-700">{Number(post.averageRating).toFixed(1)}</span>
                    <span className="text-xs text-gray-400">/ 5.0</span>
                  </div>
                )}

                {/* あらすじ */}
                {post.synopsis && (
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-4">
                      {post.synopsis}
                    </p>
                  </div>
                )}
              </div>

              {/* 詳細リンク */}
              <div className="px-5 pb-5">
                <Link
                  href={`/posts/${post.id}`}
                  className="block w-full py-2.5 text-center text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-100"
                >
                  詳細を見る →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default ComparePage;

export async function getServerSideProps(context: any) {
  const idsParam = context.query.ids as string | undefined;

  if (!idsParam) {
    return { props: { posts: [] } };
  }

  const ids = idsParam
    .split(",")
    .map((id: string) => parseInt(id, 10))
    .filter((id: number) => !isNaN(id))
    .slice(0, 3);

  if (ids.length === 0) {
    return { props: { posts: [] } };
  }

  try {
    const posts = await prisma.post.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        title: true,
        image_url: true,
        playtime: true,
        totalNumber: true,
        man: true,
        woman: true,
        others: true,
        synopsis: true,
        averageRating: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const postMap = new Map(posts.map((p) => [p.id, p]));
    const orderedPosts = ids.map((id) => postMap.get(id)).filter(Boolean);

    return {
      props: {
        posts: JSON.parse(JSON.stringify(orderedPosts)),
      },
    };
  } catch (error) {
    console.error("Error fetching compare posts:", error);
    return { props: { posts: [] } };
  }
}
