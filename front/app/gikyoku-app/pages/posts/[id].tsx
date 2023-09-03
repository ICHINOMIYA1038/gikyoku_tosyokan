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

const prisma = new PrismaClient();

function PostPage({ post }: any) {
  const URL = `/posts/${post.id}`;
  const QUOTE = "共有するときのメッセージ";

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
