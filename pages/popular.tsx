import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import PostCardList from "@/components/PostCardList";
import Seo from "@/components/seo";
import { Post } from "@prisma/client";
import LoadingSpinner from "@/components/LoadingSpinner";

interface PopularPost extends Post {
  author: any;
  categories: any[];
  _count?: {
    access: number;
  };
}

export default function Popular() {
  const [posts, setPosts] = useState<PopularPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await fetch("/api/popular");
        if (!response.ok) {
          throw new Error("人気作品の取得に失敗しました");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  return (
    <Layout>
      <Seo
        pageTitle="人気の脚本"
        pageDescription="戯曲図書館で人気の脚本一覧。多くの方に読まれている作品をご紹介します。"
        pagePath="/popular"
      />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">人気の脚本</h1>
        
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {!loading && !error && posts.length > 0 && (
          <div className="grid gap-6">
            <PostCardList posts={posts} />
          </div>
        )}
        
        {!loading && !error && posts.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            現在、表示できる作品がありません。
          </div>
        )}
      </div>
    </Layout>
  );
}