import * as React from "react";
import { PrismaClient, Post as PostType } from "@prisma/client";
import Layout from "@/components/Layout";
import PostDetail from "@/components/PostDetail";
import {
  FacebookShareButton,
  HatenaShareButton,
  LineShareButton,
  TwitterShareButton,
  FacebookIcon,
  HatenaIcon,
  LineIcon,
  TwitterIcon,
} from "react-share";
import Comments from "@/components/Comments";

const prisma = new PrismaClient();

function PostPage({ post }: any) {
  console.log(post);
  const URL = `https://gikyokutosyokan.com/posts/${post.id}`;
  const QUOTE = `${post.author.name}作「${post.title}」をみんなにおすすめしよう`;

  return (
    <Layout>
      <div className="relative mx-auto max-w-xl">
        <div className="flex flex-col fixed mr-20">
          <FacebookShareButton url={URL} quote={QUOTE}>
            <FacebookIcon size={48} round />
          </FacebookShareButton>
          <TwitterShareButton url={URL} title={QUOTE}>
            <TwitterIcon size={48} round />
          </TwitterShareButton>
          <LineShareButton url={URL} title={QUOTE}>
            <LineIcon size={48} round />
          </LineShareButton>
          <HatenaShareButton
            url={URL}
            title={QUOTE}
            windowWidth={660}
            windowHeight={460}
          >
            <HatenaIcon size={48} round />
          </HatenaShareButton>
        </div>
        <PostDetail post={post} />
        {post.comments && (
          <Comments comments={post.comments} postid={post.id} />
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
    include: {
      comments: {
        include: {
          children: true,
        },
      },
      author: true,
    },
  });

  // Datetimeを指定したフォーマットに変換する関数
  function formatDatetime(datetime: any) {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }

  if (!post) {
    return {
      notFound: true, // Return a 404 page
    };
  }

  // postオブジェクト内のcommentsとchildrenのDatetimeカラムをフォーマット変換
  const formattedPost = {
    ...post,
    comments: post.comments.map((comment: any) => ({
      ...comment,
      children: comment.children.map((child: any) => ({
        ...child,
        date: formatDatetime(child.date),
      })),
      date: formatDatetime(comment.date),
    })),
  };

  return {
    props: {
      post: formattedPost,
    },
  };
}
