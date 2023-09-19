import AuthorForm from "@/components/Form/AuthorForm";
import CategoryForm from "@/components/Form/CategoryForm";
import PostForm from "@/components/Form/PostForm";
import Layout from "@/components/Layout";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default function Home({ posts }: any) {
  return (
    <Layout>
      <div className=""></div>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = await prisma.post.findMany({
    include: { author: true },
  });

  return {
    props: {
      posts,
    },
    revalidate: 3600, // You can adjust the revalidation period as needed
  };
}
