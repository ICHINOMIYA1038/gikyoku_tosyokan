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

interface TwoPersonPlaysPageProps {
  posts: any[];
  totalCount: number;
}

export default function TwoPersonPlaysPage({
  posts,
  totalCount,
}: TwoPersonPlaysPageProps) {
  const faqItems = [
    {
      question: "二人芝居のメリットは何ですか？",
      answer:
        "二人芝居は少ない人数で上演できるため、稽古のスケジュール調整がしやすく、準備費用も抑えられます。また、役者一人ひとりの出番が多いため演技力の向上にもつながります。密度の濃い掛け合いが魅力です。",
    },
    {
      question: "二人芝居で有名な作品はありますか？",
      answer:
        "日本の現代演劇では、二人芝居の名作が数多くあります。コメディからシリアスまでジャンルも幅広く、このページでは評価の高い順に掲載しています。まずは気になる作品のあらすじや評価をチェックしてみてください。",
    },
    {
      question: "初心者でも二人芝居はできますか？",
      answer:
        "はい、二人芝居は初心者にも取り組みやすい形式です。相手役との掛け合いに集中できるので、演技の基礎を学ぶのに適しています。まずは短編（30分以内）の作品から始めてみるのがおすすめです。",
    },
  ];

  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "二人芝居の名作・おすすめ戯曲",
    description:
      "二人で上演できる戯曲・台本を厳選。評価の高い二人芝居の名作を一覧で紹介。",
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
        pageTitle="二人芝居の名作・おすすめ戯曲"
        pageDescription="二人芝居の名作・おすすめ戯曲を高評価順に紹介。2人で上演できる台本を探している方に。コメディからシリアスまで、二人芝居の傑作を集めました。"
        pagePath="/lp/two-person-plays"
        pageKeywords={[
          "二人芝居 名作",
          "二人芝居 おすすめ",
          "2人芝居 台本",
          "二人芝居 戯曲",
          "二人劇 脚本",
        ]}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          {
            name: "二人芝居の名作",
            url: "https://gikyokutosyokan.com/lp/two-person-plays",
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
            二人芝居の名作・おすすめ戯曲
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            2人で上演できる戯曲を高評価順に集めました。密度の濃い掛け合いが魅力の二人芝居は、演劇部の自主公演やワークショップにも最適です。
          </p>
          <p className="text-sm text-gray-500 mt-3">
            {totalCount}作品が見つかりました
          </p>
        </header>

        {/* 二人芝居の魅力 */}
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10">
          <h2 className="font-bold text-gray-800 mb-4">二人芝居の魅力</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                少人数で上演可能
              </h3>
              <p className="text-sm text-gray-600">
                2人だけで上演できるため、スケジュール調整が容易。小さな会場でも上演できます。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                濃密な掛け合い
              </h3>
              <p className="text-sm text-gray-600">
                二人の関係性に焦点を当てた脚本が多く、役者の演技力が存分に発揮されます。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                演技力の向上
              </h3>
              <p className="text-sm text-gray-600">
                出番が多く相手の演技を受ける練習になるため、役者としての成長に繋がります。
              </p>
            </div>
          </div>
        </section>

        {/* ブログ記事リンク */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-10">
          <h2 className="font-bold text-gray-800 mb-1">
            二人芝居ガイド
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            二人芝居の選び方や演出のコツを詳しく解説しています。
          </p>
          <Link
            href="/blog/ja/2026-02-15-two-person-play-guide"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            二人芝居ガイドを読む →
          </Link>
        </div>

        {/* 作品一覧 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            おすすめの二人芝居
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

        {/* 人数別リンク */}
        <section className="mt-10 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="font-bold text-gray-800 mb-3">
            人数別で台本を探す
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/?maxTotalCount=1"
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:bg-gray-50"
            >
              一人芝居
            </Link>
            <Link
              href="/?minTotalCount=2&maxTotalCount=2"
              className="px-4 py-2 bg-white border border-gray-800 text-gray-900 rounded-full text-sm font-medium"
            >
              二人芝居
            </Link>
            <Link
              href="/?minTotalCount=3&maxTotalCount=5"
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:bg-gray-50"
            >
              3〜5人
            </Link>
            <Link
              href="/?minTotalCount=6&maxTotalCount=10"
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:bg-gray-50"
            >
              6〜10人
            </Link>
            <Link
              href="/?minTotalCount=11"
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:bg-gray-50"
            >
              11人以上
            </Link>
          </div>
        </section>

        {/* 関連ページ */}
        <section className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">関連ページ</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/lp/crying-plays"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
            >
              泣ける演劇台本
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
              href="/search/futarishibai"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
            >
              2人芝居検索
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
    // totalNumber=2 OR (man+woman+others)=2 の作品を取得
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { totalNumber: 2 },
          {
            AND: [
              { man: { gte: 0 } },
              { woman: { gte: 0 } },
            ],
          },
        ],
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
      take: 200,
    });

    // Filter to exactly 2 person plays
    const filtered = posts.filter((p) => {
      if (p.totalNumber === 2) return true;
      const total = (p.man || 0) + (p.woman || 0) + (p.others || 0);
      return total === 2 && p.totalNumber !== 2;
    });

    return {
      props: {
        posts: JSON.parse(JSON.stringify(filtered)),
        totalCount: filtered.length,
      },
      revalidate: 2592000,
    };
  } catch (error) {
    console.error("Error fetching two-person plays:", error);
    return {
      props: {
        posts: [],
        totalCount: 0,
      },
    };
  }
};
