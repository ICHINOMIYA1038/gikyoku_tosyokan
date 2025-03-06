import Layout from "@/components/Layout";
import { PrismaClient, Author } from "@prisma/client";
import Link from "next/link";
import Seo from "@/components/seo";

const prisma = new PrismaClient();

function CategoryListPage(categories: any) {
  return (
    <>
      <Seo pageTitle={`カテゴリから戯曲を探す -戯曲図書館`} />
      <Layout>
        <div>
          <h2>カテゴリ</h2>
          <ul>
            {categories.length == 0 &&
              categories.map((category: any) => (
                <li key={category.id}>
                  <Link href={`/categories/${category.id}`}>
                    {category.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  try{
  const categories = await prisma.category.findMany({
    include: {
      posts: {
        include: { author: true },
      },
    }, // Include the related author information
  });

  return {
    props: {
      categories,
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

export default CategoryListPage;
