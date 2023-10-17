import AuthorForm from "@/components/Form/AuthorForm";
import CategoryForm from "@/components/Form/CategoryForm";
import PostForm from "@/components/Form/PostForm";
import Layout from "@/components/Layout";
import getOgpData from "@/components/util/getOgpData";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default function Home({ authors, categories }: any) {
  return (
    <Layout>
      <div className="">
        <CategoryForm />
        <AuthorForm />
        <PostForm categories={categories} authors={authors} />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const authors = await prisma.author.findMany({});
  const categories = await prisma.category.findMany({});

  return {
    props: {
      authors,
      categories,
    },
    revalidate: 3600, // You can adjust the revalidation period as needed
  };
}
