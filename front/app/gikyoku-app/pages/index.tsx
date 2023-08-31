import AuthorForm from "@/components/Form/AuthorForm";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import PostCardList from "@/components/PostCardList";
import PostDetail from "@/components/PostDetail";
import SearchForm from "@/components/SearchForm";
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState(null); // 取得したデータを格納
  const samplePost = {
    badgeTexts: ["Tech", "Programming"],
    title: "Example Blog Post",
    image_url: "https://example.com/image.jpg",
    content:
      "## Markdown Content\n\nThis is a **sample** blog post using *Markdown*.",
    catchphrase: "Exploring the world of coding and technology.",
  };
  return (
    <Layout>
      <PostDetail post={samplePost} />
      <div className="lg:flex">
        <SearchForm setData={setData} />
        <div className="lg:w-1/2 flex flex-col gap-3">
          <PostCardList posts={data} />
        </div>
      </div>
    </Layout>
  );
}
