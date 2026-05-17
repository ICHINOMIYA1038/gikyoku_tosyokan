import { GetStaticProps } from "next";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import PostCard from "@/components/PostCard";
import FAQ from "@/components/FAQ";
import Link from "next/link";
import Head from "next/head";
import { prisma } from "@/lib/prisma";
import { FaSearch, FaStar } from "react-icons/fa";

interface CryingPlaysPageProps {
  posts: any[];
  totalCount: number;
}

export default function CryingPlaysPage({ posts, totalCount }: CryingPlaysPageProps) {
  const faqItems = [
    {
      question: "泣ける演劇台本はどんな人におすすめですか？",
      answer:
        "感動的な演劇は観客の心に強く残ります。文化祭や定期公演で観客を感動させたい演劇部、卒業公演で特別な作品を上演したい学校、ヒューマンドラマに挑戦したいアマチュア劇団の方におすすめです。",
    },
    {
      question: "泣ける台本を上演するときのポイントは？",
      answer:
        "感情を押し付けるのではなく、登場人物の心情に寄り添った演技が大切です。台本を何度も読み込み、なぜその台詞があるのかを理解しましょう。演出面では、照明や音楽の使い方で感動を引き立てることができます。",
    },
    {
      question: "初心者でも泣ける演劇は上演できますか？",
      answer:
        "はい、上演できます。ただし感動作は演技力が問われるため、十分な稽古期間を確保することをおすすめします。まずは短編のヒューマンドラマから始めてみるのがよいでしょう。",
    },
  ];

  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "泣ける演劇台本・感動の戯曲おすすめ",
    description:
      "心に響く感動のヒューマンドラマ・泣ける演劇台本を厳選。評価の高い作品順に紹介。",
    numberOfItems: totalCount,
    itemListElement: posts.slice(0, 20).map((post: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: `https://gikyokutosyokan.com/posts/${post.id}`,
    })),
  };

  return (
    <Layout>
      <Seo
        pageTitle="泣ける演劇台本・感動の戯曲おすすめ"
        pageDescription="泣ける演劇台本・感動のヒューマンドラマを厳選紹介。高評価の泣ける脚本を一覧で。演劇部の公演や文化祭で観客を感動させる名作を探せます。"
        pagePath="/lp/crying-plays"
        pageKeywords={[
          "演劇 台本 泣ける",
          "泣ける脚本",
          "感動 演劇",
          "ヒューマンドラマ 戯曲",
          "泣ける芝居",
        ]}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          {
            name: "泣ける演劇台本",
            url: "https://gikyokutosyokan.com/lp/crying-plays",
          },
        ]}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListStructuredData),
          }}
        />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            泣ける演劇台本・感動の戯曲おすすめ
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            心に響くヒューマンドラマや感動の物語を集めました。観客の涙を誘う名作戯曲を評価の高い順にご紹介します。
          </p>
          <p className="text-sm text-gray-500 mt-3">
            {totalCount}作品が見つかりました
          </p>
        </header>

        {/* 選び方のポイント */}
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10">
          <h2 className="font-bold text-gray-800 mb-4">
            泣ける台本を選ぶポイント
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                テーマで選ぶ
              </h3>
              <p className="text-sm text-gray-600">
                家族の絆、友情、別れ、再生など、自分たちが共感できるテーマの作品を選びましょう。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                評価を参考に
              </h3>
              <p className="text-sm text-gray-600">
                他の利用者の評価やコメントを参考にすると、実際に上演して感動できた作品が分かります。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                人数と時間を確認
              </h3>
              <p className="text-sm text-gray-600">
                感動作は演技力が重要。稽古に十分時間がかけられる長さの作品を選びましょう。
              </p>
            </div>
          </div>
        </section>

        {/* 作品一覧 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            おすすめの泣ける戯曲
          </h2>
          {posts.length > 0 ? (
            <div className="space-y-0">
              {posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              作品が見つかりませんでした
            </p>
          )}
        </section>

        {/* 詳細検索リンク */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">
            もっと詳しい条件で探したい場合は
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 font-medium"
          >
            <FaSearch className="text-sm" />
            詳細検索で探す
          </Link>
        </div>

        {/* 関連ページ */}
        <section className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">関連ページ</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/lp/two-person-plays"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
            >
              二人芝居の名作
            </Link>
            <Link
              href="/lp/free-scripts"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
            >
              フリー台本まとめ
            </Link>
            <Link
              href="/lp/school-festival"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
            >
              文化祭におすすめ
            </Link>
            <Link
              href="/search/bunkasai"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
            >
              文化祭向け戯曲
            </Link>
            <Link
              href="/lp/shindan"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
            >
              脚本診断
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <FAQ items={faqItems} />
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    // 感動系カテゴリの作品を取得
    const posts = await prisma.post.findMany({
      where: {
        categories: {
          some: {
            name: {
              in: ["ヒューマンドラマ", "感動", "ドラマ", "家族"],
            },
          },
        },
      },
      include: {
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
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: [{ averageRating: "desc" }, { id: "desc" }],
      take: 60,
    });

    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
        totalCount: posts.length,
      },
      revalidate: 2592000,
    };
  } catch (error) {
    console.error("Error fetching crying plays:", error);
    return {
      props: {
        posts: [],
        totalCount: 0,
      },
    };
  }
};
