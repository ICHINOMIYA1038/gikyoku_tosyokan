import Layout from "@/components/Layout";
import { PrismaClient, Author } from "@prisma/client";
import Link from "next/link";
import { AuthorPageProps, AuthorData } from "@/components/Type/type";
import Head from "next/head";

const prisma = new PrismaClient();

function CategoryListPage(categories: any) {
  return (
    <>
      <Head>
        <title>カテゴリから戯曲を探す -戯曲図書館</title>
        <meta
          name="description"
          content="
  上演する脚本を探しの方に。上演時間や人数などから検索ができます。戯曲を探す、戯曲図書館。"
          key="desc"
        />
        <meta property="og:title" content="戯曲を探す、戯曲図書館" />
        <meta
          property="og:description"
          content="上演する脚本を探しの方に。上演時間や人数などから検索ができます。戯曲を探す、戯曲図書館。"
        />
        <meta property="og:image" content="https://gikyokutosyokan.logo.png" />
      </Head>
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
}

export default CategoryListPage;
