import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import Seo from "@/components/seo";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function PostListPage({ posts }: any) {
  return (
    <Layout>
      <Seo />
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
  try{
  const posts = await prisma.post.findMany({
    include: { author: true }, // Include the related author information
  });

  return {
    props: {
      posts,
    },
    revalidate: 3600, // You can adjust the revalidation period as needed
  };
}catch{
  return {
    notFound: true, // Return a 404 page
  };
}finally {
  await prisma.$disconnect(); // リクエスト処理の最後で接続を切断
}
}

export default PostListPage;
