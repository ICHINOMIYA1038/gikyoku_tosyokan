import * as React from "react";
import Link from "next/link";
import { PrismaClient, Author as AuthorType } from "@prisma/client";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import PostCardSmall from "@/components/PostCardSmall";
import ExLinkwithOG from "@/components/ExLinkwithOG";
import ExternalLinkButton from "@/components/ExternalLinkButton";
import Seo from "@/components/seo";
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
          {author.website && <ExternalLinkButton url={author.website} />}
          {author.profile && <p>{author.profile}</p>}
          {author.masterpiece && <p>代表作: {author.masterpiece}</p>}
        </div>
        <div className="basic-card p-4 my-2">
          <h2>作品一覧</h2>
          <ul className="flex flex-wrap gap-3 my-2">
            {author.posts.map((post: any) => (
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

export default AuthorPage;

export async function getServerSideProps(context: any) {
  const authorId = parseInt(context.params.id);
  if (isNaN(authorId)) {
    return {
      notFound: true, // Return a 404 page for non-numeric IDs
    };
  }
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
}
