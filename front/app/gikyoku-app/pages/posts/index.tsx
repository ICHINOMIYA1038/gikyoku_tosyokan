import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import { PrismaClient } from "@prisma/client";
import { PostData, PostsPageProps } from "@/components/Type/type";
import Link from "next/link";

const prisma = new PrismaClient();

function PostListPage({ posts }: any) {
  return (
    <Layout>
      <div>
        <h1>Post List</h1>
        <ul>
          {posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </ul>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = await prisma.post.findMany({
    include: { author: true }, // Include the related author information
  });

  return {
    props: {
      posts,
    },
    revalidate: 3600, // You can adjust the revalidation period as needed
  };
}

export default PostListPage;
