import { GetStaticProps } from "next";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import PostCard from "@/components/PostCard";
import FAQ from "@/components/FAQ";
import Link from "next/link";
import Head from "next/head";
import { prisma } from "@/lib/prisma";
import { FaSearch, FaClock, FaUsers, FaStar } from "react-icons/fa";

interface SchoolFestivalPageProps {
  shortPosts: any[];
  mediumPosts: any[];
  totalCount: number;
}

export default function SchoolFestivalPage({
  shortPosts,
  mediumPosts,
  totalCount,
}: SchoolFestivalPageProps) {
  const faqItems = [
    {
      question: "文化祭の演劇でおすすめの上演時間はどのくらいですか？",
      answer:
        "文化祭では30分〜45分の作品が最もおすすめです。観客の集中力が持続しやすく、準備や転換の時間も確保できます。初めての演劇なら30分以内の作品から始めるのがよいでしょう。",
    },
    {
      question: "クラス全員で参加できる台本はありますか？",
      answer:
        "10〜15人程度で上演できる作品は数多くあります。全員に出番がある群像劇やオムニバス形式の作品がクラス劇に向いています。詳細検索で人数を指定して探してみてください。",
    },
    {
      question: "文化祭の演劇で著作権使用料はかかりますか？",
      answer:
        "入場無料の学校行事であっても、台本の著作権使用料が必要になる場合があります。一般的に5,000円〜20,000円程度が目安です。上演前に必ず作者や出版社に確認してください。フリー台本を利用する方法もあります。",
    },
  ];

  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "文化祭におすすめの演劇台本・脚本",
    description:
      "文化祭・学園祭で上演しやすい演劇台本を厳選。短時間・少人数で取り組める脚本を紹介。",
    numberOfItems: totalCount,
    itemListElement: [...shortPosts, ...mediumPosts]
      .slice(0, 20)
      .map((post: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: `https://gikyokutosyokan.com/posts/${post.id}`,
      })),
  };

  return (
    <Layout>
      <Seo
        pageTitle="文化祭におすすめの演劇台本・脚本"
        pageDescription="文化祭・学園祭で上演しやすい演劇台本を厳選紹介。30分〜60分で上演でき、少人数でも取り組める脚本を高評価順に掲載。初めての演劇でも成功させるためのヒントも。"
        pagePath="/lp/school-festival"
        pageKeywords={[
          "文化祭 演劇 台本",
          "学園祭 脚本",
          "文化祭 劇 おすすめ",
          "高校 演劇 台本",
          "クラス劇 台本",
        ]}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          {
            name: "文化祭におすすめの台本",
            url: "https://gikyokutosyokan.com/lp/school-festival",
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
            文化祭におすすめの演劇台本・脚本
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            文化祭や学園祭で上演しやすい脚本を集めました。短時間で準備でき、少人数でも見応えのある作品を高評価順にご紹介します。
          </p>
          <p className="text-sm text-gray-500 mt-3">
            {totalCount}作品が見つかりました
          </p>
        </header>

        {/* 脚本選びのポイント */}
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10">
          <h2 className="font-bold text-gray-800 mb-4">
            文化祭の脚本選び 3つのポイント
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <FaClock className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                  上演時間は60分以内
                </h3>
                <p className="text-sm text-gray-600">
                  文化祭では持ち時間に制限があります。30〜45分がベストです。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaUsers className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                  出演者は15人以下
                </h3>
                <p className="text-sm text-gray-600">
                  全員に出番がある人数が理想的。練習も効率よく進みます。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaStar className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                  分かりやすい作品を
                </h3>
                <p className="text-sm text-gray-600">
                  演劇に詳しくない観客も多い文化祭。コメディや明快なストーリーが人気です。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 文化祭ガイドリンク */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-10">
          <h2 className="font-bold text-gray-800 mb-1">
            文化祭演劇 完全ガイド
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            準備スケジュール、予算配分、練習方法まで。文化祭演劇を成功させるためのノウハウを網羅しています。
          </p>
          <Link
            href="/guide/school/culture-festival"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            文化祭演劇ガイドを読む →
          </Link>
        </div>

        {/* 条件別リンク */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            条件で絞り込む
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href="/?maxPlaytime=30&maxTotalCount=10"
              className="block p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all text-center"
            >
              <span className="font-semibold block text-sm">30分以内</span>
              <p className="text-xs text-gray-500 mt-1">短時間で完結</p>
            </Link>
            <Link
              href="/?maxPlaytime=45&minTotalCount=5&maxTotalCount=10"
              className="block p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all text-center"
            >
              <span className="font-semibold block text-sm">
                5〜10人・45分以内
              </span>
              <p className="text-xs text-gray-500 mt-1">部活動に最適</p>
            </Link>
            <Link
              href="/?maxPlaytime=60&category=コメディ&maxTotalCount=15"
              className="block p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all text-center"
            >
              <span className="font-semibold block text-sm">コメディ</span>
              <p className="text-xs text-gray-500 mt-1">観客が盛り上がる</p>
            </Link>
            <Link
              href="/?maxPlaytime=60&minTotalCount=10&maxTotalCount=15"
              className="block p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all text-center"
            >
              <span className="font-semibold block text-sm">10〜15人</span>
              <p className="text-xs text-gray-500 mt-1">クラス劇向け</p>
            </Link>
          </div>
        </section>

        {/* 短編作品（30分以内） */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            30分以内の短編作品
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            準備期間が短くても取り組みやすい短編。初めての演劇にもおすすめです。
          </p>
          {shortPosts.length > 0 ? (
            <div className="space-y-0">
              {shortPosts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              作品が見つかりませんでした
            </p>
          )}
        </section>

        {/* 中編作品（30〜60分） */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            30〜60分の中編作品
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            文化祭の持ち時間にちょうどよい長さ。見応えのある作品が揃っています。
          </p>
          {mediumPosts.length > 0 ? (
            <div className="space-y-0">
              {mediumPosts.map((post: any) => (
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
        <div className="text-center">
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

        {/* フリー台本リンク */}
        <div className="mt-10 bg-gray-50 border border-gray-200 rounded-lg p-5">
          <h2 className="font-bold text-gray-800 mb-1">
            フリー台本もチェック
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            予算を抑えたい場合は、無料で公開されている台本も検討してみてください。
          </p>
          <Link
            href="/lp/free-scripts"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            フリー台本まとめを見る →
          </Link>
        </div>

        {/* 関連ページ */}
        <section className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">関連ページ</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/search/bunkasai"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
            >
              文化祭向け戯曲一覧
            </Link>
            <Link
              href="/guide/school/culture-festival"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
            >
              文化祭演劇ガイド
            </Link>
            <Link
              href="/lp/free-scripts"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
            >
              フリー台本まとめ
            </Link>
            <Link
              href="/lp/crying-plays"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
            >
              泣ける演劇台本
            </Link>
            <Link
              href="/lp/two-person-plays"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
            >
              二人芝居の名作
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
    const selectFields = {
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
      orderBy: [
        { averageRating: "desc" as const },
        { id: "desc" as const },
      ],
    };

    // 短編: 30分以内 & 15人以下
    const shortPosts = await prisma.post.findMany({
      where: {
        AND: [
          { playtime: { gt: 0, lte: 30 } },
          { totalNumber: { gt: 0, lte: 15 } },
        ],
      },
      ...selectFields,
      take: 20,
    });

    // 中編: 31〜60分 & 15人以下
    const mediumPosts = await prisma.post.findMany({
      where: {
        AND: [
          { playtime: { gt: 30, lte: 60 } },
          { totalNumber: { gt: 0, lte: 15 } },
        ],
      },
      ...selectFields,
      take: 30,
    });

    const totalCount = shortPosts.length + mediumPosts.length;

    return {
      props: {
        shortPosts: JSON.parse(JSON.stringify(shortPosts)),
        mediumPosts: JSON.parse(JSON.stringify(mediumPosts)),
        totalCount,
      },
      revalidate: 604800,
    };
  } catch (error) {
    console.error("Error fetching school festival posts:", error);
    return {
      props: {
        shortPosts: [],
        mediumPosts: [],
        totalCount: 0,
      },
    };
  }
};
