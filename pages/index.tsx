import Layout from "@/components/Layout";
import ResponsiveSearchForm from "@/components/ResponsiveSearchForm";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { prisma } from "@/lib/prisma";
import NewsList from "@/components/NewsList";
import HeroSearchBand from "@/components/HeroSearchBand";
import SisterApps from "@/components/SisterApps";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import ContentSection from "@/components/ContentSection";
import SearchResults from "@/components/SearchResults";
import FAQ from "@/components/FAQ";
import Link from "next/link";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import HomeCommunity from "@/components/HomeCommunity";
import TrendingPosts from "@/components/TrendingPosts";
import AdSlot from "@/components/Ad/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";
import OptimizedImage from "@/components/OptimizedImage";

export default function Home({ news, authors, posts, categories, blogPosts, trendingPosts, announcements, totalPosts }: any) {
  const [data, setData] = useState<any>(null); // 取得したデータを格納
  const [page, setPage] = useState(1);
  const [sort_by, setSortIndex] = useState<number>(2);
  const [sortDirection, setSortDirection] = useState<number>(1);
  const searchFormRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const handleScrollToRegistrationForm = () => {
    if (searchFormRef.current) {
      searchFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // FAQデータ
  const faqItems = [
    {
      question: "戯曲図書館は無料で使えますか？",
      answer: "はい、戯曲図書館の検索機能は完全無料でご利用いただけます。作品の詳細情報、上演時間、必要な人数などすべての情報を無料で閲覧できます。ただし、実際の脚本については著作権の関係で、各出版社や作者のサイトでご購入いただく必要があります。"
    },
    {
      question: "文化祭に適した30分程度の脚本はありますか？",
      answer: "はい、多数ご用意しています。上演時間を「30分以内」で検索していただくと、文化祭に最適な短編作品が見つかります。人数や難易度でも絞り込めるので、クラスの状況に合わせて選べます。"
    },
    {
      question: "少人数（2-3人）でできる脚本を探しています",
      answer: "少人数向けの作品も豊富に掲載しています。検索フォームで「総人数」を2-3人に設定して検索してください。二人芝居や三人芝居など、少人数でも見応えのある作品が見つかります。"
    },
    {
      question: "脚本の著作権使用料はどのくらいかかりますか？",
      answer: "著作権使用料は作品や上演規模によって異なります。一般的には入場無料の学校公演で5,000円〜20,000円程度、有料公演の場合は売上の10%程度が目安です。詳細は各作品の出版社にお問い合わせください。"
    },
    {
      question: "初心者でも演じやすい脚本はどれですか？",
      answer: "日常会話が中心で、感情表現がわかりやすい現代劇がおすすめです。カテゴリーから「コメディ」や「青春」を選んでいただくと、初心者でも取り組みやすい作品が見つかります。"
    }
  ];

  return (
    <>
      <Layout>
        <Seo
          pageDescription={
            "戯曲図書館は、演劇の脚本を上演時間・人数・ジャンルで検索できる日本最大級の戯曲検索サービスです。文化祭・学園祭の台本探し、劇団の次回公演の脚本選びに。レビューや上演報告も共有できます。"
          }
          pageImg={"https://gikyokutosyokan.com/logo.png"}
          pagePath="/"
        />
        <StructuredData
          type="WebSite"
          title="戯曲図書館"
          description="戯曲図書館は、演劇の脚本を上演時間・人数・ジャンルで検索できる日本最大級の戯曲検索サービスです。レビューや上演報告も共有できます。"
          url="https://gikyokutosyokan.com"
        />
        <StructuredData type="Organization" />
        <StructuredData type="FAQPage" faqItems={faqItems} />
        {trendingPosts && trendingPosts.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "注目の戯曲",
                "itemListElement": trendingPosts.slice(0, 20).map((p: any, i: number) => ({
                  "@type": "ListItem",
                  "position": i + 1,
                  "url": `https://gikyokutosyokan.com/posts/${p.id}`,
                  "name": p.title,
                })),
              }),
            }}
          />
        )}
        <HeroSearchBand totalPosts={totalPosts} onSearch={handleScrollToRegistrationForm} />

        {/* みんなの書き込み（作品への声・上演告知・劇団員募集） */}
        <HomeCommunity />

        <div className="max-w-6xl mx-auto px-4 py-6">
          <NewsList news={news} />
        </div>

        {/* 今週の人気作品 */}
        <TrendingPosts posts={trendingPosts} />

        {/* 広告: トレンド後 */}
        <div className="max-w-6xl mx-auto px-4">
          <AdSlot slot={AD_SLOTS.HOME_AFTER_TRENDING} format="horizontal" />
        </div>

        <div
          className="lg:flex relative box-border"
          id="registration-form"
          ref={searchFormRef}
        >
          <div className="mx-3 my-3 md:m-5 lg:w-[420px] lg:flex-shrink-0 lg:sticky lg:top-24 lg:self-start">
            <ResponsiveSearchForm
              setData={setData}
              page={page}
              setPage={setPage}
              sort_by={sort_by}
              sortDirection={sortDirection}
              onSearch={handleScrollToRegistrationForm}
            />
          </div>
          <div className="lg:flex-1 min-w-0 flex flex-col gap-3 mx-3 my-3 md:m-5">
            <SearchResults
              data={data}
              sort_by={sort_by}
              setSortIndex={setSortIndex}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              setPage={setPage}
            />
          </div>
        </div>
        
        {/* 広告: コンテンツ中間 */}
        <div className="max-w-6xl mx-auto px-4">
          <AdSlot slot={AD_SLOTS.HOME_MID_CONTENT} format="horizontal" />
        </div>

        {/* 最新の記事 */}
        <LatestBlogPosts posts={blogPosts} />

        {/* もっと知る。ガイドとデータベースへの入口を、行の一覧で並べる */}
        <section aria-labelledby="home-more" className="max-w-6xl mx-auto px-4 py-10">
          <h2 id="home-more" className="!my-0 !pb-0 !text-[22px] !font-bold !text-gray-900">もっと知る</h2>
          <div className="mt-4 grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {[
              [
                { href: "/guide/beginner/how-to-choose-script", title: "脚本の選び方", note: "上演時間・人数・難易度から選ぶポイント" },
                { href: "/guide/school/culture-festival", title: "文化祭演劇ガイド", note: "限られた時間と予算で上演するコツ" },
                { href: "/guide/beginner/acting-basics", title: "演技の基礎", note: "初心者向けのトレーニング" },
                { href: "/guide", title: "すべてのガイド", note: "" },
              ],
              [
                { href: "/university-theater", title: "大学演劇データベース", note: "全国の学生劇団・演劇サークル" },
                { href: "/shogekijo", title: "小劇場データベース", note: "プロ・社会人・ユースの劇団" },
                { href: "/awards", title: "戯曲賞データベース", note: "岸田國士戯曲賞などの受賞作・候補作" },
                { href: "/venues", title: "劇場データベース", note: "座席数・アクセス・設備" },
              ],
            ].map((col, i) => (
              <ul key={i} className="border-t border-[#D9D5CF]">
                {col.map((item) => (
                  <li key={item.href} className="border-b border-[#D9D5CF]">
                    <Link href={item.href} className="group flex items-baseline justify-between gap-4 py-3 px-1 hover:bg-[#F4F2EE]">
                      <span className="font-bold text-gray-900 group-hover:text-theater-primary-700">{item.title}</span>
                      {item.note && <span className="text-sm text-gray-600 text-right">{item.note}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </section>

        <ContentSection posts={posts} authors={authors} categories={categories} />
        
        {/* FAQセクション */}
        <FAQ items={faqItems} />

        <SisterApps />
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  let formattedNews = [];
  let authors = [];
  let posts = [];
  let categories = [];
  let blogPosts: any[] = [];
  let trendingPosts: any[] = [];
  let announcements: any[] = [];

  try {
    // 並列でデータを取得（最適化）
    const [newsData, authorsData, postsData, categoriesData, blogData, trendingData, announcementsData] = await Promise.all([
      // ニュースは最新10件のみ
      prisma.news.findMany({
        take: 10,
        orderBy: { date: 'desc' },
        select: {
          id: true,
          date: true,
          url: true,
          category: true,
          title: true,
        },
      }),
      // 作者は必要最小限のフィールドのみ、最大50件
      prisma.author.findMany({
        take: 50,
        select: {
          id: true,
          name: true,
          group: true,
        },
        orderBy: { name: 'asc' },
      }),
      // 人気の投稿を20件のみ取得
      prisma.post.findMany({
        take: 20,
        select: {
          id: true,
          title: true,
          image_url: true,
          averageRating: true,
          playtime: true,
          totalNumber: true,
          man: true,
          woman: true,
          author: {
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
          { averageRating: 'desc' },
          { id: 'desc' },
        ],
      }),
      // カテゴリは基本情報のみ
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          image_url: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
      // ブログ記事（最新3件）
      prisma.blogPost.findMany({
        where: { published: true, language: "ja" },
        take: 3,
        orderBy: { publishedAt: 'desc' },
        select: {
          slug: true,
          title: true,
          description: true,
          publishedAt: true,
          tags: true,
        },
      }),
      // 注目作品（直近7日間のアクセス数ベース上位5作品）
      prisma.$queryRaw`
        SELECT a."postId", COUNT(*) as access_count
        FROM "Access" a
        WHERE a."date" >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY a."postId"
        ORDER BY access_count DESC
        LIMIT 5
      ` as Promise<Array<{ postId: number; access_count: bigint }>>,
      // 最新の上演告知3件
      prisma.announcement.findMany({
        where: { status: 'approved', deletedAt: null },
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          performanceDate: true,
          venue: true,
          theaterGroupName: true,
        },
      }),
    ]);

    // 日付データの変換
    formattedNews = newsData.map((item) => ({
      ...item,
      date: item.date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

    authors = authorsData;
    posts = postsData;
    categories = categoriesData;

    // ブログ記事の日付フォーマット
    blogPosts = blogData.map((bp) => ({
      ...bp,
      publishedAt: bp.publishedAt.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

    // 上演告知の日付フォーマット
    announcements = announcementsData.map((a) => ({
      ...a,
      performanceDate: a.performanceDate
        ? a.performanceDate.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : null,
    }));

    // 注目作品の詳細取得
    const trendingRaw = trendingData as Array<{ postId: number; access_count: bigint }>;
    const trendingIds = trendingRaw.map((t) => t.postId);
    if (trendingIds.length > 0) {
      const accessCountMap = Object.fromEntries(
        trendingRaw.map((t) => [t.postId, Number(t.access_count)])
      );
      const trendingPostsData = await prisma.post.findMany({
        where: { id: { in: trendingIds } },
        select: {
          id: true,
          title: true,
          image_url: true,
          playtime: true,
          totalNumber: true,
          man: true,
          woman: true,
          averageRating: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          categories: {
            select: { id: true, name: true },
            orderBy: { id: "asc" },
          },
        },
      });
      // 元の順序（アクセス数順）を維持し、アクセス数を付与
      trendingPosts = trendingIds
        .map((id) => {
          const post = trendingPostsData.find((p) => p.id === id);
          if (!post) return null;
          return { ...post, accessCount: accessCountMap[id] || 0 };
        })
        .filter(Boolean);
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    return {
      props: {
        news: [],
        authors: [],
        posts: [],
        categories: [],
        blogPosts: [],
        trendingPosts: [],
        announcements: [],
      },
      revalidate: 604800,
    };
  }

  const totalPosts = await prisma.post.count().catch(() => 0);

  return {
    props: {
      totalPosts,
      news: formattedNews,
      authors,
      posts,
      categories,
      blogPosts,
      trendingPosts,
      announcements,
    },
    revalidate: 604800,
  };
}
