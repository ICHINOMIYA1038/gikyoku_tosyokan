import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import PostCardSmall from "@/components/PostCardSmall";
import FavoriteButton from "@/components/FavoriteButton";
import CompareButton from "@/components/CompareButton";
import { getFavorites } from "@/lib/favorites";
import { FaHeart, FaSearch, FaLink, FaCheck } from "react-icons/fa";
import {
  TwitterShareButton,
  LineShareButton,
  TwitterIcon,
  LineIcon,
} from "react-share";
import { prisma } from "@/lib/prisma";

function FavoritesPage({ posts, isShared }: { posts: any[]; isShared: boolean }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  // 自分のお気に入りページ（idsなし）→ localStorageから読んでリダイレクト
  useEffect(() => {
    if (isShared) return;
    const ids = getFavorites();
    if (ids.length > 0) {
      router.replace(`/favorites?ids=${ids.join(",")}`, undefined, { shallow: false });
    }
  }, [isShared, router]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `おすすめの脚本${posts.length}作品を共有します`;

  return (
    <Layout>
      <Seo
        pageTitle="お気に入り"
        pageDescription="お気に入りに追加した脚本の一覧です。"
        pagePath="/favorites"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <FaHeart className="text-pink-500 text-2xl" />
          <h1 className="text-2xl font-bold font-serif text-gray-800">お気に入り</h1>
        </div>

        {posts.length > 0 ? (
          <>
            {/* 共有ボタン */}
            {isShared && (
              <div className="mb-6 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500">この一覧を共有:</span>
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
                      <span>URLをコピー</span>
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
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {posts.map((post: any) => (
                <div key={post.id} className="relative">
                  <PostCardSmall post={post} />
                  <div className="absolute top-2 left-2 z-10 flex gap-1">
                    <FavoriteButton postId={post.id} size="sm" />
                  </div>
                  <div className="absolute top-2 right-12 z-10">
                    <CompareButton postId={post.id} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <FaHeart className="text-gray-200 text-6xl mx-auto mb-4" />
            <p className="text-gray-500 mb-4">まだお気に入りがありません</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 transition-colors"
            >
              <FaSearch />
              脚本を探す
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default FavoritesPage;

export async function getServerSideProps(context: any) {
  const idsParam = context.query.ids as string | undefined;

  if (!idsParam) {
    return {
      props: {
        posts: [],
        isShared: false,
      },
    };
  }

  const ids = idsParam
    .split(",")
    .map((id: string) => parseInt(id, 10))
    .filter((id: number) => !isNaN(id));

  if (ids.length === 0) {
    return {
      props: {
        posts: [],
        isShared: true,
      },
    };
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
        synopsis: true,
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

    // 入力順を保持
    const postMap = new Map(posts.map((p) => [p.id, p]));
    const orderedPosts = ids.map((id) => postMap.get(id)).filter(Boolean);

    return {
      props: {
        posts: orderedPosts,
        isShared: true,
      },
    };
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return {
      props: {
        posts: [],
        isShared: true,
      },
    };
  }
}
