import * as React from "react";
import { PrismaClient, Author as AuthorType } from "@prisma/client";
import Layout from "@/components/Layout";
import PostCardSmall from "@/components/PostCardSmall";
import Seo from "@/components/seo";
const prisma = new PrismaClient();

function CategoryPage({ category }: any) {
  return (
    <>
      <Seo pageTitle={`${category.name}の戯曲一覧 -戯曲図書館`} />
      <Layout ishead="true">
        <div className="md:max-w-2xl px-4 my-4 mx-auto basic-card">
          <h2>カテゴリ詳細</h2>
        </div>
        <div className="md:max-w-2xl mx-auto">
          <div className="basic-card p-4 ">
            <h2>{category.name}の脚本一覧</h2>
            <p>{category.name}の</p>
          </div>
          <div className="basic-card p-4 my-2">
            <h2>作品一覧</h2>
            <div className="flex flex-wrap gap-3">
              {category.posts.map((post: any) => (
                <PostCardSmall post={post} key={post.id} />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default CategoryPage;

export async function getServerSideProps(context: any) {
  const categoryid = parseInt(context.params.id);
  if (isNaN(categoryid)) {
    return {
      notFound: true, // Return a 404 page for non-numeric IDs
    };
  }
  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryid },
      include: {
        posts: {
          include: { author: true },
        },
      }, // Include the related author information
    });

    if (!category) {
      return {
        notFound: true, // Return a 404 page
      };
    }

    return {
      props: {
        category,
      },
    };
  } catch {
    return {
      notFound: true, // Return a 404 page
    };
  } finally {
    await prisma.$disconnect(); // リクエスト処理の最後で接続を切断
  }
}
