import Layout from "@/components/Layout";
import { PrismaClient, Author } from "@prisma/client";
import Link from "next/link";
import { AuthorPageProps, AuthorData } from "@/components/Type/type";

const prisma = new PrismaClient();

function CategoryListPage(categories: any) {
  return (
    <Layout>
      <div>
        <h2>カテゴリ</h2>
        <ul>
          {categories.length == 0 &&
            categories.map((category: any) => (
              <li key={category.id}>
                <Link href={`/categories/${category.id}`}>{category.name}</Link>
              </li>
            ))}
        </ul>
      </div>
    </Layout>
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
