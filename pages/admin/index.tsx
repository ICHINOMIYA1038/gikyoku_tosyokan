import AuthorForm from "@/components/Form/AuthorForm";
import CategoryForm from "@/components/Form/CategoryForm";
import PostForm from "@/components/Form/PostForm";
import Layout from "@/components/Layout";
import { prisma } from "@/lib/prisma";

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
  let authors: any;
  let categories: any;

  try {
    // データベースから著者とカテゴリを取得
    authors = await prisma.author.findMany({});
    categories = await prisma.category.findMany({});
  } catch (error) {
    // エラーが発生した場合、空のリストを返すか、適切に対応
    authors = [];
    categories = [];
  } finally {
    // データベース接続を閉じる
    await prisma.$disconnect();
  }

  return {
    props: {
      authors,
      categories,
    },
    revalidate: 3600, // 再検証の期間を必要に応じて調整
  };
}
