import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostCardSmall from "@/components/PostCardSmall";
import { FaSchool, FaTheaterMasks, FaClock, FaUsers } from "react-icons/fa";
import { GetStaticProps } from "next";
import AdSlot from "@/components/Ad/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";

interface BunkasaiPageProps {
  posts: any[];
  totalCount: number;
}

export default function BunkasaiPage({ posts, totalCount }: BunkasaiPageProps) {
  return (
    <Layout>
      <Seo
        pageTitle="文化祭におすすめの戯曲・脚本一覧 | 戯曲図書館"
        pageDescription="文化祭・学園祭で上演するのにぴったりな戯曲・脚本を厳選。60分以内・15人以下で上演できる、クラスや部活動で取り組みやすい作品を多数掲載しています。"
        pagePath="/search/bunkasai"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "文化祭向け戯曲", url: "https://gikyokutosyokan.com/search/bunkasai" }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <FaSchool className="text-3xl text-orange-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            文化祭におすすめの戯曲・脚本
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            クラスや部活で取り組みやすい作品を厳選
          </p>
          <p className="text-sm text-gray-500">
            {totalCount}作品が見つかりました（60分以内・15人以下）
          </p>
        </header>

        {/* 文化祭の脚本選びのポイント */}
        <section className="mb-12 bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaTheaterMasks className="mr-2 text-orange-500" />
            文化祭の脚本選び 3つのポイント
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaClock className="text-orange-400 mr-2" />
                <h3 className="font-semibold">上演時間は60分以内</h3>
              </div>
              <p className="text-sm text-gray-600">
                文化祭では持ち時間に制限があることがほとんど。30〜45分がベストですが、長くても60分以内に収まる作品を選びましょう。
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaUsers className="text-orange-400 mr-2" />
                <h3 className="font-semibold">出演者は15人以下</h3>
              </div>
              <p className="text-sm text-gray-600">
                全員に出番があり、練習時間を確保できる人数が理想的。多すぎると統制が難しく、少なすぎると準備の負担が偏ります。
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaSchool className="text-orange-400 mr-2" />
                <h3 className="font-semibold">観客を楽しませる</h3>
              </div>
              <p className="text-sm text-gray-600">
                文化祭の観客は演劇に詳しくない人も多いです。コメディや分かりやすいストーリーの作品は特に盛り上がります。
              </p>
            </div>
          </div>
        </section>

        {/* おすすめ条件のリンク */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">条件で絞り込む</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href="/?maxPlaytime=30&maxTotalCount=10"
              className="block p-4 border-2 border-orange-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-center"
            >
              <span className="font-semibold block">30分以内</span>
              <p className="text-xs text-gray-500 mt-1">短時間で完結</p>
            </Link>
            <Link
              href="/?maxPlaytime=45&minTotalCount=5&maxTotalCount=10"
              className="block p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-center"
            >
              <span className="font-semibold block">5-10人・45分以内</span>
              <p className="text-xs text-gray-500 mt-1">部活動に最適</p>
            </Link>
            <Link
              href="/?maxPlaytime=60&category=コメディ&maxTotalCount=15"
              className="block p-4 border-2 border-yellow-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all text-center"
            >
              <span className="font-semibold block">コメディ</span>
              <p className="text-xs text-gray-500 mt-1">観客が盛り上がる</p>
            </Link>
            <Link
              href="/?maxPlaytime=60&minTotalCount=10&maxTotalCount=15"
              className="block p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
            >
              <span className="font-semibold block">10-15人</span>
              <p className="text-xs text-gray-500 mt-1">クラス劇向け</p>
            </Link>
          </div>
        </section>

        {/* 作品一覧 */}
        <section>
          <h2 className="text-xl font-bold mb-6">文化祭向け作品一覧</h2>
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
            もっと詳しい条件で探したい場合は
          </p>
          <Link
            href="/"
            className="inline-block bg-theater-primary-600 text-white px-8 py-3 rounded-lg hover:bg-theater-primary-700 font-semibold"
          >
            詳細検索で探す
          </Link>
        </section>

        {/* 関連ガイド */}
        <section className="mt-12 bg-orange-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">文化祭に役立つガイド</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/guide/school/culture-festival" className="block p-4 bg-white rounded-lg hover:shadow-md">
              <h3 className="font-semibold mb-2">文化祭演劇 完全ガイド</h3>
              <p className="text-sm text-gray-600">準備から本番まで、成功させるためのノウハウを網羅</p>
            </Link>
            <Link href="/guide/beginner/how-to-choose-script" className="block p-4 bg-white rounded-lg hover:shadow-md">
              <h3 className="font-semibold mb-2">脚本の選び方</h3>
              <p className="text-sm text-gray-600">初めての脚本選びで失敗しないためのポイント</p>
            </Link>
          </div>
        </section>

        {/* 関連ページ */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">関連ページ</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/search/school" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              学校演劇向け
            </Link>
            <Link href="/search/comedy" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              コメディ戯曲
            </Link>
            <Link href="/search/short" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              短編戯曲
            </Link>
            <Link href="/search/futarishibai" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              2人芝居
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
    // 文化祭向け: 60分以内 AND 15人以下
    const posts = await prisma.post.findMany({
      where: {
        AND: [
          { playtime: { lte: 60 } },
          { totalNumber: { lte: 15 } }
        ]
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
    console.error("Error fetching bunkasai posts:", error);
    return {
      props: {
        posts: [],
        totalCount: 0
      },
    };
  }
};
