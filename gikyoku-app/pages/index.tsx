import Layout from "@/components/Layout";
import PostCardList from "@/components/PostCardList";
import SearchForm from "@/components/SearchForm";
import Pagination from "@/components/Pagination";
import { useRef, useState } from "react";
import { PrismaClient } from "@prisma/client";
import NewsList from "@/components/NewsList";
import TopImage from "@/components/TopImage"
import DropBox from "@/components/DropBox";
import Seo from "@/components/seo";
import ContentSection from "@/components/ContentSection";
import SearchResults from "@/components/SearchResults";

const prisma = new PrismaClient();

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

  return (
    <>
      <Layout>
        <Seo
          pageDescription={
            "上演する脚本を探しの方に。上演時間や人数などから検索ができます。戯曲を探す、戯曲図書館。"
          }
          pageImg={"https://gikyokutosyokan.com/logo.png"}
        />
        <TopImage buttonClick={handleScrollToRegistrationForm} />
        <NewsList news={news} />
        <div
          className="lg:flex relative box-border"
          id="registration-form"
          ref={searchFormRef}
        >
          <div className="m-1 md:m-5 lg:w-1/2 lg:sticky lg:top-24">
            <SearchForm
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
        <ContentSection posts={posts} authors={authors} categories={categories} />
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  let authors, posts, categories;
  let formattedNews = []; // formattedNews を初期化

  try {
    // データベースからニュースを取得
    const news = await prisma.news.findMany();

    // 日付データの変換（日本の形式）
    formattedNews = news.map((item) => ({
      ...item,
      date: item.date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

    // その他のデータを取得
    authors = await prisma.author.findMany();
    posts = await prisma.post.findMany({
      include: { author: true },
    });
    categories = await prisma.category.findMany({
      include: {
        posts: {
          include: { author: true },
        },
      },
    });
  } catch (error) {
    // エラーハンドリング
    console.error("Error fetching data: ", error);
    // エラーが発生した場合の処理
    return { props: { error: "Data fetching error" } };
  } finally {
    // データベース接続を閉じる
    await prisma.$disconnect();
  }

  return {
    props: {
      news: formattedNews,
      authors,
      posts,
      categories,
    },
    revalidate: 3600, // 必要に応じて再検証期間を調整
  };
}
