import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostCardSmall from "@/components/PostCardSmall";
import { FaUsers, FaTheaterMasks } from "react-icons/fa";
import { GetStaticProps } from "next";

interface FutarishibaiPageProps {
  posts: any[];
  totalCount: number;
}

export default function FutarishibaiPage({ posts, totalCount }: FutarishibaiPageProps) {
  return (
    <Layout>
      <Seo
        pageTitle="2人芝居・二人芝居のおすすめ戯曲一覧 | 戯曲図書館"
        pageDescription="2人で上演できる二人芝居の戯曲・脚本を多数掲載。少人数で取り組みやすく、演技力を磨くのに最適な2人芝居の作品を上演時間・ジャンルから検索できます。"
        pagePath="/search/futarishibai"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "2人芝居の戯曲", url: "https://gikyokutosyokan.com/search/futarishibai" }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <FaUsers className="text-3xl text-purple-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            2人芝居・二人芝居のおすすめ戯曲
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            2人だけで紡ぐ、濃密な物語の世界
          </p>
          <p className="text-sm text-gray-500">
            {totalCount}作品が見つかりました
          </p>
        </header>

        {/* 2人芝居の魅力 */}
        <section className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaTheaterMasks className="mr-2 text-purple-500" />
            2人芝居の魅力
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">濃密な演技体験</h3>
              <p className="text-sm text-gray-600">
                舞台上は2人だけ。逃げ場のない緊張感が、演技の密度を高めます。相手の呼吸を感じながら演じる醍醐味があります。
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">準備がしやすい</h3>
              <p className="text-sm text-gray-600">
                スケジュール調整が楽で、稽古を重ねやすいのが最大のメリット。少ない予算と場所で上演できます。
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">演技力が磨かれる</h3>
              <p className="text-sm text-gray-600">
                相手役との掛け合いに集中でき、リアクションや間の取り方など基礎力が自然と向上します。
              </p>
            </div>
          </div>
        </section>

        {/* 作品一覧 */}
        <section>
          <h2 className="text-xl font-bold mb-6">2人芝居の戯曲一覧</h2>
          {posts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {posts.map((post: any) => (
                <PostCardSmall key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              作品が見つかりませんでした
            </p>
          )}
        </section>

        {/* 詳細検索へのリンク */}
        <section className="mt-12 text-center">
          <p className="mb-4 text-gray-600">
            もっと詳しい条件で探したい場合は
          </p>
          <Link
            href="/?minTotalCount=2&maxTotalCount=2"
            className="inline-block bg-theater-primary-600 text-white px-8 py-3 rounded-lg hover:bg-theater-primary-700 font-semibold"
          >
            詳細検索で探す
          </Link>
        </section>

        {/* 関連ページ */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">関連ページ</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/search/short" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              短編戯曲
            </Link>
            <Link href="/search/comedy" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              コメディ戯曲
            </Link>
            <Link href="/search/bunkasai" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              文化祭向け
            </Link>
            <Link href="/guide/cast-size" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              人数別ガイド
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        totalNumber: 2
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        categories: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: {
        averageRating: 'desc'
      },
      take: 50
    });

    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
        totalCount: posts.length
      },
      revalidate: 2592000,
    };
  } catch (error) {
    console.error("Error fetching futarishibai posts:", error);
    return {
      props: {
        posts: [],
        totalCount: 0
      },
    };
  }
};
