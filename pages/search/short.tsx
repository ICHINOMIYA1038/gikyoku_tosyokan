import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostCardList from "@/components/PostCardList";
import { FaClock, FaGraduationCap, FaTheaterMasks, FaUsers } from "react-icons/fa";
import { GetStaticProps } from "next";

interface ShortPageProps {
  posts: any[];
  totalCount: number;
}

export default function ShortPage({ posts, totalCount }: ShortPageProps) {
  return (
    <Layout>
      <Seo
        pageTitle="短編戯曲・30分以内の脚本一覧 | 文化祭におすすめ"
        pageDescription="30分以内で上演できる短編戯曲を多数掲載。文化祭、学園祭、授業発表に最適な短い脚本を人数・ジャンルから検索。初心者でも挑戦しやすい作品が見つかります。"
        pagePath="/search/short"
      />
      <StructuredData
        type="Article"
        title="短編戯曲・30分以内の脚本一覧"
        description="30分以内で上演できる短編戯曲を多数掲載"
        url="https://gikyokutosyokan.com/search/short"
        datePublished="2024-01-01"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "短編戯曲", url: "https://gikyokutosyokan.com/search/short" }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FaClock className="text-3xl text-blue-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            短編戯曲・30分以内の脚本
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            限られた時間でも感動を届ける作品
          </p>
          <p className="text-sm text-gray-500">
            {totalCount}作品が見つかりました
          </p>
        </header>

        {/* 短編の魅力 */}
        <section className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaTheaterMasks className="mr-2 text-blue-500" />
            短編戯曲のメリット
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">1</div>
              <h3 className="font-semibold mb-1">準備期間が短い</h3>
              <p className="text-xs text-gray-600">
                1-2週間の練習でも上演可能
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">2</div>
              <h3 className="font-semibold mb-1">集中力が続く</h3>
              <p className="text-xs text-gray-600">
                観客も演者も最後まで集中
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">3</div>
              <h3 className="font-semibold mb-1">複数演目も可能</h3>
              <p className="text-xs text-gray-600">
                オムニバス形式で楽しめる
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">4</div>
              <h3 className="font-semibold mb-1">挑戦しやすい</h3>
              <p className="text-xs text-gray-600">
                初めての演劇にぴったり
              </p>
            </div>
          </div>
        </section>

        {/* 時間別クイックリンク */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">上演時間で絞り込む</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href="/?maxPlaytime=15"
              className="block p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
            >
              <FaClock className="mx-auto text-2xl text-blue-500 mb-2" />
              <span className="font-semibold">15分以内</span>
              <p className="text-xs text-gray-500 mt-1">超短編・コント向け</p>
            </Link>
            <Link
              href="/?minPlaytime=15&maxPlaytime=20"
              className="block p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-center"
            >
              <FaClock className="mx-auto text-2xl text-green-500 mb-2" />
              <span className="font-semibold">15-20分</span>
              <p className="text-xs text-gray-500 mt-1">授業発表向け</p>
            </Link>
            <Link
              href="/?minPlaytime=20&maxPlaytime=30"
              className="block p-4 border-2 border-yellow-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all text-center"
            >
              <FaClock className="mx-auto text-2xl text-yellow-500 mb-2" />
              <span className="font-semibold">20-30分</span>
              <p className="text-xs text-gray-500 mt-1">文化祭の定番</p>
            </Link>
            <Link
              href="/?minPlaytime=30&maxPlaytime=45"
              className="block p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center"
            >
              <FaClock className="mx-auto text-2xl text-purple-500 mb-2" />
              <span className="font-semibold">30-45分</span>
              <p className="text-xs text-gray-500 mt-1">本格短編</p>
            </Link>
          </div>
        </section>

        {/* おすすめの組み合わせ */}
        <section className="mb-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">人気の検索条件</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/?maxPlaytime=30&minTotalCount=3&maxTotalCount=5"
              className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <FaUsers className="text-3xl text-green-500 mr-4" />
              <div>
                <h3 className="font-semibold">3-5人で30分以内</h3>
                <p className="text-sm text-gray-600">少人数グループに最適</p>
              </div>
            </Link>
            <Link
              href="/?maxPlaytime=30&category=コメディ"
              className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <FaGraduationCap className="text-3xl text-blue-500 mr-4" />
              <div>
                <h3 className="font-semibold">30分以内のコメディ</h3>
                <p className="text-sm text-gray-600">文化祭で盛り上がる</p>
              </div>
            </Link>
          </div>
        </section>

        {/* 短編作品一覧 */}
        <section>
          <h2 className="text-xl font-bold mb-6">短編戯曲一覧（30分以内）</h2>
          {posts.length > 0 ? (
            <PostCardList posts={posts} />
          ) : (
            <p className="text-center text-gray-500 py-8">
              作品が見つかりませんでした
            </p>
          )}
        </section>

        {/* もっと見るボタン */}
        <section className="mt-12 text-center">
          <p className="mb-4 text-gray-600">
            さらに詳しい条件で探す
          </p>
          <Link
            href="/?maxPlaytime=30"
            className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-semibold"
          >
            短編戯曲をもっと見る
          </Link>
        </section>

        {/* ガイドへのリンク */}
        <section className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">短編戯曲の選び方ガイド</h2>
          <p className="text-gray-600 mb-4">
            短い時間でも観客の心を掴むには、作品選びが重要です。
            上演時間別の詳しいガイドをご覧ください。
          </p>
          <Link
            href="/guide/time"
            className="inline-block text-blue-500 font-semibold hover:underline"
          >
            上演時間別ガイドを読む →
          </Link>
        </section>

        {/* 関連ページ */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">関連ページ</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/search/comedy" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              コメディ戯曲
            </Link>
            <Link href="/search/school" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              学校演劇向け
            </Link>
            <Link href="/guide/school/culture-festival" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              文化祭演劇ガイド
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    // 30分以内の作品を取得
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
    };
  } catch (error) {
    console.error("Error fetching short posts:", error);
    return {
      props: {
        posts: [],
        totalCount: 0
      },
    };
  }
};
