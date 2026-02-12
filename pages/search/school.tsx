import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostCardList from "@/components/PostCardList";
import { FaGraduationCap, FaClock, FaUsers, FaTheaterMasks, FaSchool, FaTrophy } from "react-icons/fa";
import { GetStaticProps } from "next";

interface SchoolPageProps {
  posts: any[];
  totalCount: number;
}

export default function SchoolPage({ posts, totalCount }: SchoolPageProps) {
  return (
    <Layout>
      <Seo
        pageTitle="高校演劇・学校演劇向け脚本 | 文化祭・部活動におすすめ"
        pageDescription="高校演劇部、中学演劇部、文化祭におすすめの脚本を厳選。上演許可が取りやすく、学生でも演じやすい作品を人数・上演時間から検索。大会向け作品も充実。"
        pagePath="/search/school"
      />
      <StructuredData
        type="Article"
        title="高校演劇・学校演劇向け脚本"
        description="学校演劇、文化祭に最適な脚本を厳選"
        url="https://gikyokutosyokan.com/search/school"
        datePublished="2024-01-01"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "学校演劇向け", url: "https://gikyokutosyokan.com/search/school" }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <FaGraduationCap className="text-3xl text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            高校演劇・学校演劇向け脚本
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            文化祭、部活動、大会に最適な作品を厳選
          </p>
          <p className="text-sm text-gray-500">
            {totalCount}作品が見つかりました
          </p>
        </header>

        {/* 用途別クイックリンク */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">目的から探す</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/?maxPlaytime=60&minTotalCount=5&maxTotalCount=15"
              className="block p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition-all"
            >
              <FaSchool className="text-3xl text-blue-500 mb-3" />
              <h3 className="font-bold text-lg mb-2">文化祭・学園祭</h3>
              <p className="text-sm text-gray-600">
                60分以内、5-15人向け。クラス・部活で上演しやすい作品
              </p>
            </Link>
            <Link
              href="/?minPlaytime=50&maxPlaytime=70&minTotalCount=5&maxTotalCount=12"
              className="block p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg hover:shadow-md transition-all"
            >
              <FaTrophy className="text-3xl text-yellow-500 mb-3" />
              <h3 className="font-bold text-lg mb-2">高校演劇大会</h3>
              <p className="text-sm text-gray-600">
                60分前後、競技向け。審査員に評価される本格作品
              </p>
            </Link>
            <Link
              href="/?maxPlaytime=30&minTotalCount=2&maxTotalCount=5"
              className="block p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-md transition-all"
            >
              <FaTheaterMasks className="text-3xl text-green-500 mb-3" />
              <h3 className="font-bold text-lg mb-2">部活動の練習・発表</h3>
              <p className="text-sm text-gray-600">
                30分以内、少人数。新人公演や練習発表に
              </p>
            </Link>
          </div>
        </section>

        {/* 学校演劇の選び方 */}
        <section className="mb-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">学校演劇の脚本選びのポイント</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">1</span>
                人数と役割のバランス
              </h3>
              <p className="text-sm text-gray-600 ml-8">
                全員に見せ場があるか、男女比は適切か確認しましょう。
                脇役が多すぎると不満が出ることも。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">2</span>
                上演時間と準備期間
              </h3>
              <p className="text-sm text-gray-600 ml-8">
                本番までの日数を考慮。文化祭なら30-45分、
                大会なら60分を目安に選びましょう。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">3</span>
                セットと衣装の難易度
              </h3>
              <p className="text-sm text-gray-600 ml-8">
                予算と技術力を考慮。現代劇なら衣装代を抑えられます。
                複雑なセットが必要な作品は要注意。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">4</span>
                著作権と上演許可
              </h3>
              <p className="text-sm text-gray-600 ml-8">
                学校行事でも著作権使用料が必要な場合があります。
                早めに出版社に確認しましょう。
              </p>
            </div>
          </div>
        </section>

        {/* 人気の検索条件 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">人気の検索条件</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href="/?maxPlaytime=45&minTotalCount=8&maxTotalCount=12"
              className="block p-3 border rounded-lg hover:bg-gray-50 text-center"
            >
              <FaUsers className="mx-auto text-xl text-blue-500 mb-1" />
              <span className="text-sm font-medium block">8-12人 / 45分以内</span>
              <span className="text-xs text-gray-500">クラス劇向け</span>
            </Link>
            <Link
              href="/?maxPlaytime=60&category=青春"
              className="block p-3 border rounded-lg hover:bg-gray-50 text-center"
            >
              <FaTheaterMasks className="mx-auto text-xl text-pink-500 mb-1" />
              <span className="text-sm font-medium block">青春もの / 60分以内</span>
              <span className="text-xs text-gray-500">学生に人気</span>
            </Link>
            <Link
              href="/?maxPlaytime=30&minTotalCount=3&maxTotalCount=5"
              className="block p-3 border rounded-lg hover:bg-gray-50 text-center"
            >
              <FaClock className="mx-auto text-xl text-green-500 mb-1" />
              <span className="text-sm font-medium block">3-5人 / 30分以内</span>
              <span className="text-xs text-gray-500">新人公演向け</span>
            </Link>
            <Link
              href="/?maxPlaytime=60&category=コメディ"
              className="block p-3 border rounded-lg hover:bg-gray-50 text-center"
            >
              <FaGraduationCap className="mx-auto text-xl text-yellow-500 mb-1" />
              <span className="text-sm font-medium block">コメディ / 60分以内</span>
              <span className="text-xs text-gray-500">盛り上がる</span>
            </Link>
          </div>
        </section>

        {/* 学校演劇向け作品一覧 */}
        <section>
          <h2 className="text-xl font-bold mb-6">学校演劇におすすめの作品</h2>
          {posts.length > 0 ? (
            <PostCardList posts={posts} />
          ) : (
            <p className="text-center text-gray-500 py-8">
              作品が見つかりませんでした
            </p>
          )}
        </section>

        {/* もっと見る */}
        <section className="mt-12 text-center">
          <Link
            href="/?maxPlaytime=60&minTotalCount=5&maxTotalCount=15"
            className="inline-block bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 font-semibold"
          >
            学校向け作品をもっと見る
          </Link>
        </section>

        {/* 関連ガイド */}
        <section className="mt-12 bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">学校演劇に役立つガイド</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/guide/school/culture-festival" className="block p-4 bg-white rounded-lg hover:shadow-md">
              <h3 className="font-semibold mb-2">文化祭演劇ガイド</h3>
              <p className="text-sm text-gray-600">成功させるための完全マニュアル</p>
            </Link>
            <Link href="/guide/school/drama-club" className="block p-4 bg-white rounded-lg hover:shadow-md">
              <h3 className="font-semibold mb-2">演劇部運営ガイド</h3>
              <p className="text-sm text-gray-600">部活動を充実させるコツ</p>
            </Link>
            <Link href="/guide/beginner/how-to-choose-script" className="block p-4 bg-white rounded-lg hover:shadow-md">
              <h3 className="font-semibold mb-2">脚本の選び方</h3>
              <p className="text-sm text-gray-600">失敗しない作品選びのポイント</p>
            </Link>
          </div>
        </section>

        {/* 関連ページ */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">関連ページ</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/search/comedy" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              コメディ戯曲
            </Link>
            <Link href="/search/short" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              短編戯曲
            </Link>
            <Link href="/guide/cast-size" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              人数別ガイド
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
    // 学校演劇向けの条件: 60分以内、5-15人
    const posts = await prisma.post.findMany({
      where: {
        AND: [
          { playtime: { lte: 60 } },
          { totalNumber: { gte: 5 } },
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
    console.error("Error fetching school posts:", error);
    return {
      props: {
        posts: [],
        totalCount: 0
      },
    };
  }
};
