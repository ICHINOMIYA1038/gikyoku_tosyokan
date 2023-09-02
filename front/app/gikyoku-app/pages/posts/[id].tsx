import * as React from "react";
import { PrismaClient, Post as PostType } from "@prisma/client";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import { PostData, PostsPageProps } from "@/components/Type/type";
import PostDetail from "@/components/PostDetail";

const prisma = new PrismaClient();

function PostPage({ post }: PostData) {
  return (
    <Layout>
      <PostDetail post={post} />
    </Layout>
  );
}
export default PostPage;

export async function getServerSideProps(context: any) {
  const postId = parseInt(context.params.id);
  if (isNaN(postId)) {
    return {
      notFound: true, // Return a 404 page for non-numeric IDs
    };
  }
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { author: true }, // Include the related author information
  });

  if (!post) {
    return {
      notFound: true, // Return a 404 page
    };
  }

  return {
    props: {
      post,
    },
  };
}
