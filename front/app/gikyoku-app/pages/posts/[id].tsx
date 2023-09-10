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
  const URL = `https://gikyokutosyokan.com/posts/${post.id}`;
  const QUOTE = `${post.author.name}作「${post.title}」をみんなにおすすめしよう`;

  return (
    <Layout>
      <div className="relative mx-auto max-w-xl">
        <div className="md:flex flex-col md:fixed md:mr-20 max-w-md mx-auto">
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
        <div className="max-w-md mx-auto">
          {post.comments && (
            <Comments comments={post.comments} postid={post.id} />
          )}
        </div>
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
      categories: true,
    },
  });

  const ipAddress = context.req.socket.remoteAddress;
  const currentDate = new Date();

  // 年月日の部分を取得
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 月は0から始まるため+1
  const day = currentDate.getDate();

  // PostgreSQLのDate型に変換
  const date = new Date(year, month - 1, day); // 月は0から始まるため-1

  const existingAccess = await prisma.access.findFirst({
    where: {
      ipAddress: ipAddress,
      postId: postId,
      date: date,
    },
  });

  if (!existingAccess) {
    // 既存のレコードが見つからない場合、新しいレコードを作成
    await prisma.access.create({
      data: {
        ipAddress,
        postId,
        date,
      },
    });
  } else {
    // 既存のレコードが存在する場合、適切なエラー処理を行います。
    // 例えば、一意制約違反エラーをハンドルして通知するか、別のアクションを実行するなどの処理が考えられます。
  }

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
