import Layout from "@/components/Layout";
import ResponsiveSearchForm from "@/components/ResponsiveSearchForm";
import { useRef, useState } from "react";
import { prisma } from "@/lib/prisma";
import NewsList from "@/components/NewsList";
import TopImage from "@/components/TopImage"
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import ContentSection from "@/components/ContentSection";
import SearchResults from "@/components/SearchResults";
import FAQ from "@/components/FAQ";
import Link from "next/link";

export default function Home({ news, authors, posts, categories }: any) {
  const [data, setData] = useState<any>(null); // 取得したデータを格納
  const [page, setPage] = useState(1);
  const [sort_by, setSortIndex] = useState<number>(1);
  const [sortDirection, setSortDirection] = useState<number>(1);
  const searchFormRef = useRef<HTMLDivElement | null>(null);

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
            "上演する脚本を探しの方に。上演時間や人数などから検索ができます。戯曲を探す、戯曲図書館。"
          }
          pageImg={"https://gikyokutosyokan.com/logo.png"}
          pagePath="/"
        />
        <StructuredData
          type="WebSite"
          title="戯曲図書館"
          description="上演する脚本を探しの方に。上演時間や人数などから検索ができます。戯曲を探す、戯曲図書館。"
          url="https://gikyokutosyokan.com"
        />
        <StructuredData type="Organization" />
        <StructuredData type="FAQPage" faqItems={faqItems} />
        <TopImage buttonClick={handleScrollToRegistrationForm} />
        <NewsList news={news} />
        <div
          className="lg:flex relative box-border"
          id="registration-form"
          ref={searchFormRef}
        >
          <div className="m-1 md:m-5 lg:w-1/2 lg:sticky lg:top-24">
            <ResponsiveSearchForm
              setData={setData}
              page={page}
              setPage={setPage}
              sort_by={sort_by}
              sortDirection={sortDirection}
              onSearch={handleScrollToRegistrationForm}
            />
          </div>
          <div className="lg:w-2/3 flex flex-col gap-3 m-1 md:m-5">
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
        
        {/* ガイドセクション */}
        <section className="bg-gray-50 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              演劇を始める方へのガイド
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/guide/beginner/how-to-choose-script" className="block">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold mb-3">脚本の選び方</h3>
                  <p className="text-gray-600 mb-3">
                    上演時間、人数、難易度から最適な脚本を選ぶポイントを解説
                  </p>
                  <span className="text-blue-600 hover:underline">詳しく見る →</span>
                </div>
              </Link>
              
              <Link href="/guide/school/culture-festival" className="block">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold mb-3">文化祭演劇ガイド</h3>
                  <p className="text-gray-600 mb-3">
                    限られた時間と予算で成功させるための実践的アドバイス
                  </p>
                  <span className="text-blue-600 hover:underline">詳しく見る →</span>
                </div>
              </Link>
              
              <Link href="/guide/beginner/acting-basics" className="block">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold mb-3">演技の基礎</h3>
                  <p className="text-gray-600 mb-3">
                    初心者でもできる演技力向上のトレーニング方法
                  </p>
                  <span className="text-blue-600 hover:underline">詳しく見る →</span>
                </div>
              </Link>
            </div>
            
            <div className="text-center mt-8">
              <Link href="/guide" className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700">
                すべてのガイドを見る →
              </Link>
            </div>
          </div>
        </section>

        <ContentSection posts={posts} authors={authors} categories={categories} />
        
        {/* FAQセクション */}
        <FAQ items={faqItems} />
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  let formattedNews = [];
  let authors = [];
  let posts = [];
  let categories = [];

  try {
    // 並列でデータを取得（最適化）
    const [newsData, authorsData, postsData, categoriesData] = await Promise.all([
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
  } catch (error) {
    console.error("Error fetching data: ", error);
    return { 
      props: { 
        news: [],
        authors: [],
        posts: [],
        categories: [],
      },
      revalidate: 60, // エラー時は1分後に再試行
    };
  }

  return {
    props: {
      news: formattedNews,
      authors,
      posts,
      categories,
    },
    revalidate: 3600, // 1時間キャッシュ
  };
}
