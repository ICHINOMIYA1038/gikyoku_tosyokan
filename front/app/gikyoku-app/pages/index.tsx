import AuthorForm from "@/components/Form/AuthorForm";
import Layout from "@/components/Layout";
import SideModal from "@/components/Modal/SideModal";
import PostCard from "@/components/PostCard";
import PostCardList from "@/components/PostCardList";
import ReactPaginate from "react-paginate";
import SearchForm from "@/components/SearchForm";
import Pagination from "@/components/Pagination";
import { useRef, useState } from "react";
import { PrismaClient } from "@prisma/client";
import NewsList from "@/components/NewsList";
import TopImage from "@/components/TopImage";

const prisma = new PrismaClient();

export default function Home({ news }: any) {
  const [data, setData] = useState<any>(null); // 取得したデータを格納
  const [page, setPage] = useState(1);
  const searchFormRef = useRef<HTMLDivElement | null>(null);

  const handleScrollToRegistrationForm = () => {
    if (searchFormRef.current) {
      searchFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Layout>
      <TopImage buttonClick={handleScrollToRegistrationForm} />
      <NewsList news={news} />
      <div
        className="lg:flex relative  box-border"
        id="registration-form"
        ref={searchFormRef}
      >
        <SearchForm setData={setData} page={page} />
        <div className="lg:w-2/3 flex flex-col gap-3 m-5">
          {data && (
            <>
              <PostCardList posts={data.searchResults} />
              <Pagination
                setPage={setPage}
                pagination={data.pagination}
                className="max-w-full"
              />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const news = await prisma.news.findMany();

  // 日付データの変換（日本の形式）
  const formattedNews = news.map((item) => ({
    ...item,
    date: item.date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long", // 月のフルネーム
      day: "numeric",
    }),
  }));

  return {
    props: {
      news: formattedNews,
    },
    revalidate: 3600, // 必要に応じて再検証期間を調整できます
  };
}
