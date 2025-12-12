import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostCardList from "@/components/PostCardList";
import { FaLaugh, FaTheaterMasks, FaGraduationCap, FaUsers } from "react-icons/fa";
import { GetStaticProps } from "next";

interface ComedyPageProps {
  posts: any[];
  totalCount: number;
}

export default function ComedyPage({ posts, totalCount }: ComedyPageProps) {
  return (
    <Layout>
      <Seo
        pageTitle="コメディ・喜劇の戯曲一覧 | 笑える脚本を探すなら戯曲図書館"
        pageDescription="文化祭や学園祭におすすめのコメディ脚本を多数掲載。観客を笑わせる喜劇、ドタバタコメディ、シチュエーションコメディなど、笑える戯曲を人数・上演時間から検索できます。"
        pagePath="/search/comedy"
      />
      <StructuredData
        type="Article"
        title="コメディ・喜劇の戯曲一覧"
        description="観客を笑わせるコメディ脚本を多数掲載"
        url="https://gikyokutosyokan.com/search/comedy"
        datePublished="2024-01-01"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "コメディ戯曲", url: "https://gikyokutosyokan.com/search/comedy" }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <FaLaugh className="text-3xl text-yellow-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            コメディ・喜劇の戯曲
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            観客を笑顔にする脚本を見つけよう
          </p>
          <p className="text-sm text-gray-500">
            {totalCount}作品が見つかりました
          </p>
        </header>

        {/* コメディの魅力 */}
        <section className="mb-12 bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaTheaterMasks className="mr-2 text-yellow-500" />
            コメディ戯曲の魅力
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">観客との一体感</h3>
              <p className="text-sm text-gray-600">
                笑いは観客と演者の距離を縮めます。会場全体が一つになる瞬間を体験できます。
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">初心者でも挑戦しやすい</h3>
              <p className="text-sm text-gray-600">
                シリアスな演技より緊張が和らぎ、自然体で演じられます。失敗も笑いに変えられます。
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">記憶に残る</h3>
              <p className="text-sm text-gray-600">
                楽しかった記憶は長く残ります。文化祭の思い出作りに最適です。
              </p>
            </div>
          </div>
        </section>

        {/* おすすめシーン */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">こんな場面におすすめ</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/?category=コメディ&maxPlaytime=30" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <FaGraduationCap className="text-2xl text-blue-500 mr-3" />
                <div>
                  <h3 className="font-semibold">文化祭・学園祭</h3>
                  <p className="text-sm text-gray-600">30分以内の短編コメディ</p>
                </div>
              </div>
            </Link>
            <Link href="/?category=コメディ&minTotalCount=5&maxTotalCount=10" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <FaUsers className="text-2xl text-green-500 mr-3" />
                <div>
                  <h3 className="font-semibold">演劇部の新人公演</h3>
                  <p className="text-sm text-gray-600">5-10人で演じるコメディ</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* コメディ作品一覧 */}
        <section>
          <h2 className="text-xl font-bold mb-6">コメディ作品一覧</h2>
          {posts.length > 0 ? (
            <PostCardList posts={posts} />
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
            href="/"
            className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-semibold"
          >
            詳細検索で探す
          </Link>
        </section>

        {/* 関連カテゴリ */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">関連カテゴリ</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/search/school" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              学校演劇向け
            </Link>
            <Link href="/search/short" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              短編戯曲
            </Link>
            <Link href="/categories" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              すべてのカテゴリ
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    // コメディカテゴリの作品を取得
    const comedyCategory = await prisma.category.findFirst({
      where: {
        name: {
          contains: "コメディ"
        }
      }
    });

    let posts: any[] = [];
    let totalCount = 0;

    if (comedyCategory) {
      const result = await prisma.post.findMany({
        where: {
          categories: {
            some: {
              id: comedyCategory.id
            }
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

      posts = result;
      totalCount = result.length;
    }

    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
        totalCount
      },
      revalidate: 3600 // 1時間ごとに再生成
    };
  } catch (error) {
    console.error("Error fetching comedy posts:", error);
    return {
      props: {
        posts: [],
        totalCount: 0
      },
      revalidate: 3600
    };
  }
};
