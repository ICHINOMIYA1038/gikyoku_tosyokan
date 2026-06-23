import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostCardSmall from "@/components/PostCardSmall";
import { FaClock, FaTheaterMasks } from "react-icons/fa";
import { GetStaticProps } from "next";
import AdSlot from "@/components/Ad/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";

interface ShortPlaysPageProps {
  posts: any[];
  totalCount: number;
}

export default function ShortPlaysPage({ posts, totalCount }: ShortPlaysPageProps) {
  return (
    <Layout>
      <Seo
        pageTitle="30分以内で上演できる短編戯曲一覧 | 戯曲図書館"
        pageDescription="30分以内で上演できる短編戯曲・脚本を多数掲載。文化祭、学園祭、授業発表、新人公演に最適。コントから本格短編まで、短い時間でも心に残る作品が見つかります。"
        pagePath="/search/short-plays"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "短編戯曲（30分以内）", url: "https://gikyokutosyokan.com/search/short-plays" }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FaClock className="text-3xl text-blue-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            30分以内で上演できる短編戯曲
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            短い時間でも、心に残る物語を届ける
          </p>
          <p className="text-sm text-gray-500">
            {totalCount}作品が見つかりました
          </p>
        </header>

        {/* 短編戯曲のメリット */}
        <section className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaTheaterMasks className="mr-2 text-blue-500" />
            短編戯曲が選ばれる理由
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">準備期間が短い</h3>
              <p className="text-sm text-gray-600">
                1〜2週間の練習でも上演可能。忙しい学生や社会人にも取り組みやすいのが魅力です。
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">集中力が持続する</h3>
              <p className="text-sm text-gray-600">
                観客も演者も最後まで集中できます。短い時間に凝縮されたドラマは印象に残ります。
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">複数演目で上演も</h3>
              <p className="text-sm text-gray-600">
                オムニバス形式にすれば、1回の公演で複数作品を上演でき、バリエーション豊かなステージに。
              </p>
            </div>
          </div>
        </section>

        {/* 作品一覧 */}
        <section>
          <h2 className="text-xl font-bold mb-6">短編戯曲一覧（30分以内）</h2>
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

        <AdSlot slot={AD_SLOTS.CATEGORY_AFTER_LIST} format="horizontal" />

        {/* 詳細検索へのリンク */}
        <section className="mt-12 text-center">
          <p className="mb-4 text-gray-600">
            さらに詳しい条件で探す
          </p>
          <Link
            href="/?maxPlaytime=30"
            className="inline-block bg-theater-primary-600 text-white px-8 py-3 rounded-lg hover:bg-theater-primary-700 font-semibold"
          >
            短編戯曲をもっと見る
          </Link>
        </section>

        {/* 関連ページ */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">関連ページ</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/search/bunkasai" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              文化祭向け
            </Link>
            <Link href="/search/comedy" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              コメディ戯曲
            </Link>
            <Link href="/search/futarishibai" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              2人芝居
            </Link>
            <Link href="/guide/time" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              上演時間別ガイド
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
        playtime: {
          lte: 30
        }
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
    console.error("Error fetching short plays:", error);
    return {
      props: {
        posts: [],
        totalCount: 0
      },
    };
  }
};
