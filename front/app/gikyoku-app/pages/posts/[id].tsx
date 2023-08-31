import * as React from "react";
import { PrismaClient, Post as PostType } from "@prisma/client";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import { PostData, PostsPageProps } from "@/components/Type/type";

const prisma = new PrismaClient();

function PostPage({ post }: PostData) {
  return (
    <Layout>
      <PostCard post={post} />
      <div>
        <h1>{post.title}</h1>
        <p>Author: {post.author.name}</p>
        <p>Content: {post.content}</p>
        <p>Man: {post.man}</p>
        <p>Woman: {post.woman}</p>
        <p>Others: {post.others}</p>
        <p>Total Number: {post.totalNumber}</p>
        <p>Playtime: {post.playtime} minutes</p>
        {post.synopsis && <p>Synopsis: {post.synopsis}</p>}
        {post.image_url && <img src={post.image_url} alt={post.title} />}
        {post.website1 && (
          <p>
            Website 1: <a href={post.website1}>{post.website1}</a>
          </p>
        )}
        {post.website2 && (
          <p>
            Website 2: <a href={post.website2}>{post.website2}</a>
          </p>
        )}
        {post.website3 && (
          <p>
            Website 3: <a href={post.website3}>{post.website3}</a>
          </p>
        )}
      </div>
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
