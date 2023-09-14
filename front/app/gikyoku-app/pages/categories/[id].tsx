import * as React from "react";
import Link from "next/link";
import { PrismaClient, Author as AuthorType } from "@prisma/client";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import PostCardSmall from "@/components/PostCardSmall";
import ExLinkwithOG from "@/components/ExLinkwithOG";
import ExternalLinkButton from "@/components/ExternalLinkButton";
const prisma = new PrismaClient();

function CategoryPage({ category }: any) {
  return (
    <Layout>
      <div className="md:max-w-2xl px-4 my-4 mx-auto basic-card">
        <h2>カテゴリ詳細</h2>
      </div>
      <div className="md:max-w-2xl mx-auto">
        <div className="basic-card p-4 ">
          <h2>{category.name}</h2>
        </div>
        <div className="basic-card p-4 my-2">
          <h2>作品一覧</h2>
          <ul className="flex flex-wrap gap-3 my-2">
            {category.posts.map((post: any) => (
              <li key={post.id}>
                <PostCardSmall post={post} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
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
}
