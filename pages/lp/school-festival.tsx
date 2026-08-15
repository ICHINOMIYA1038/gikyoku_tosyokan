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
import AdSlot from "@/components/Ad/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";

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
      question: "文化祭の劇ネタで最も定番なのはどれですか？",
      answer:
        "コメディ(喜劇)が最も定番です。観客が笑いやすく盛り上がりが分かりやすいため、演劇に慣れていない観客が多い文化祭では失敗が少ないジャンルです。次点で青春もの・ヒューマンドラマが人気で、感動系で締めたい場合におすすめです。",
    },
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
    {
      question: "オリジナル脚本と既存の戯曲、どちらが良いですか？",
      answer:
        "初めての文化祭演劇なら既存の戯曲がおすすめです。実績のある作品は完成度が高く、演出の参考資料も豊富です。オリジナル脚本は自由度が高い反面、脚本執筆と稽古の両立が難しくなります。時間に余裕がある場合や、部活動などで経験を積んでから挑戦するのが良いでしょう。",
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
        pageTitle="文化祭の劇ネタ｜おすすめ台本と選び方【ジャンル別まとめ】"
        pageDescription="文化祭の劇ネタに困ったらこれ。コメディ・感動・ミステリーなどジャンル別に、上演しやすい演劇台本を厳選。30分〜60分・少人数OKな脚本を高評価順に紹介。人数や時間からも探せます。"
        pagePath="/lp/school-festival"
        pageKeywords={[
          "文化祭 劇 ネタ",
          "文化祭 劇",
          "文化祭 劇 おすすめ",
          "文化祭 劇 定番",
          "文化祭 劇 コメディ",
          "文化祭 演劇 台本",
          "学園祭 脚本",
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
            文化祭の劇ネタに困ったら｜おすすめ台本と選び方
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            文化祭・学園祭の劇ネタ選びに悩んでいる人へ。コメディ・感動系・ミステリーなどジャンル別に、実際に上演しやすい演劇台本を厳選しました。上演時間や人数から絞り込むこともできます。
          </p>
          <p className="text-sm text-gray-500 mt-3">
            {totalCount}作品が見つかりました
          </p>
        </header>

        {/* ネタ選びのステップ */}
        <section className="bg-blue-50/40 border border-blue-100 rounded-lg p-6 mb-10">
          <h2 className="font-bold text-gray-800 mb-3">
            文化祭の劇ネタ 選び方の3ステップ
          </h2>
          <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
            <li>
              <span className="font-semibold">ジャンルを決める</span> — 観客層に合わせてコメディ/感動/ミステリー/オリジナル系から選ぶ
            </li>
            <li>
              <span className="font-semibold">上演時間と人数を確認</span> — 持ち時間とクラスの人数に合う作品に絞る
            </li>
            <li>
              <span className="font-semibold">著作権と入手方法をチェック</span> — 有料台本ならライセンス、無料なら<Link href="/lp/free-scripts" className="text-blue-600 underline">フリー台本</Link>を検討
            </li>
          </ol>
        </section>

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

        {/* ジャンル別のネタ */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            ジャンル別｜文化祭で定番の劇ネタ
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            観客のウケを狙うか、感動で締めるか。目的別に定番ジャンルの作品一覧へ。
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link
              href="/?category=%E3%82%B3%E3%83%A1%E3%83%87%E3%82%A3&maxPlaytime=60"
              className="block p-4 border border-gray-200 rounded-lg hover:border-orange-400 hover:bg-orange-50/50 transition-all"
            >
              <span className="font-semibold block">🎭 コメディ・喜劇</span>
              <p className="text-xs text-gray-500 mt-1">笑いで盛り上げる王道ネタ</p>
            </Link>
            <Link
              href="/?category=%E3%83%92%E3%83%A5%E3%83%BC%E3%83%9E%E3%83%B3%E3%83%89%E3%83%A9%E3%83%9E&maxPlaytime=60"
              className="block p-4 border border-gray-200 rounded-lg hover:border-pink-400 hover:bg-pink-50/50 transition-all"
            >
              <span className="font-semibold block">💫 ヒューマンドラマ</span>
              <p className="text-xs text-gray-500 mt-1">感動で締める定番</p>
            </Link>
            <Link
              href="/?category=%E3%83%9F%E3%82%B9%E3%83%86%E3%83%AA%E3%83%BC&maxPlaytime=60"
              className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50/50 transition-all"
            >
              <span className="font-semibold block">🔍 ミステリー・サスペンス</span>
              <p className="text-xs text-gray-500 mt-1">最後まで目が離せない</p>
            </Link>
            <Link
              href="/?category=%E3%83%95%E3%82%A1%E3%83%B3%E3%82%BF%E3%82%B8%E3%83%BC&maxPlaytime=60"
              className="block p-4 border border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50/50 transition-all"
            >
              <span className="font-semibold block">✨ ファンタジー</span>
              <p className="text-xs text-gray-500 mt-1">世界観で魅せる</p>
            </Link>
            <Link
              href="/?category=%E9%9D%92%E6%98%A5&maxPlaytime=60"
              className="block p-4 border border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50/50 transition-all"
            >
              <span className="font-semibold block">🌱 青春</span>
              <p className="text-xs text-gray-500 mt-1">学生が演じやすい</p>
            </Link>
            <Link
              href="/lp/two-person-plays"
              className="block p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              <span className="font-semibold block">👥 少人数(2〜3人)</span>
              <p className="text-xs text-gray-500 mt-1">濃密な会話劇で勝負</p>
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

        <AdSlot slot={AD_SLOTS.CATEGORY_AFTER_LIST} format="horizontal" />

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

        <AdSlot slot={AD_SLOTS.BLOG_AFTER_TOC} format="horizontal" />

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
      revalidate: 2592000,
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
