import * as React from "react";
import Link from "next/link";
import { PrismaClient, Author as AuthorType } from "@prisma/client";
import Layout from "@/components/Layout";
import PostCardSmall from "@/components/PostCardSmall";
import Seo from "@/components/seo";
import LinkCard from "@/components/LinkCard";
import OtherPosts from "@/components/Widget/OtherPosts";
const prisma = new PrismaClient();

function AuthorPage({ author }: any) {
  return (
    <Layout>
      <Seo />
      <div className="md:max-w-2xl px-4 my-4 mx-auto basic-card">
        <h2>作者詳細</h2>
      </div>
      <div className="md:max-w-2xl mx-auto">
        <div className="basic-card p-4 ">
          <h2>{author.name}</h2>
          {author.group && <p>{author.group}</p>}
          {author.website && <LinkCard href={author.website} />}
          {author.profile && <p>{author.profile}</p>}
          {author.masterpiece && <p>代表作: {author.masterpiece}</p>}
        </div>
        <div className="basic-card p-4 my-2">
          <h2>作品一覧</h2>
          <div className="flex flex-wrap gap-3">
            {author.posts.map((post: any) => (
              <PostCardSmall post={post} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AuthorPage;

export async function getServerSideProps(context: any) {
  const authorId = parseInt(context.params.id);
  if (isNaN(authorId)) {
    return {
      notFound: true, // Return a 404 page for non-numeric IDs
    };
  }
  try {
    const author = await prisma.author.findUnique({
      where: { id: authorId },
      include: {
        posts: {
          include: { author: true },
        },
      }, // Include the related author information
    });

    if (!author) {
      return {
        notFound: true, // Return a 404 page
      };
    }

    return {
      props: {
        author,
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
