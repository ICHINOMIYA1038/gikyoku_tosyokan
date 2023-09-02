import AuthorForm from "@/components/Form/AuthorForm";
import Layout from "@/components/Layout";
import SideModal from "@/components/Modal/SideModal";
import PostCard from "@/components/PostCard";
import PostCardList from "@/components/PostCardList";
import PostDetail from "@/components/PostDetail";
import SearchForm from "@/components/SearchForm";
import Pagination from "@/components/Pagination";
import { useState } from "react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default function Home() {
  const [data, setData] = useState(null); // 取得したデータを格納
  const [page, setPage] = useState(1);

  return (
    <Layout>
      <div className="lg:flex relative  box-border">
        <SearchForm setData={setData} page={page} />
        <div className="lg:w-2/3 flex flex-col gap-3 m-5">
          {data && (
            <>
              <PostCardList posts={data.searchResults} />
              <Pagination setPage={setPage} pagination={data.pagination} />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
