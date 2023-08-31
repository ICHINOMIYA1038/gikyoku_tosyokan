import * as React from "react";
import Link from "next/link";
import { PrismaClient, Author as AuthorType } from "@prisma/client";
import Layout from "@/components/Layout";
const prisma = new PrismaClient();

function AuthorPage({ author }: any) {
  return (
    <Layout>
      <div>
        <h1>name:{author.name}</h1>
        {author.website && (
          <p>
            Website: <a href={author.website}>{author.website}</a>
          </p>
        )}
        {author.group && <p>Group: {author.group}</p>}
        {author.profile && <p>Profile: {author.profile}</p>}
        {author.masterpiece && <p>Masterpiece: {author.masterpiece}</p>}

        <h1>作品一覧</h1>
        <ul>
          {author.posts.map((post: any) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
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
    include: { posts: true }, // Include the related author information
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
