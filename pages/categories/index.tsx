import Layout from "@/components/Layout";
import { PrismaClient } from "@prisma/client";
import Seo from "@/components/seo";
import CategoryCard from "@/components/CategoryCard";

const prisma = new PrismaClient();

function CategoryListPage({ categories }: { categories: any[] }) {
  return (
    <>
      <Seo pageTitle={`カテゴリから戯曲を探す -戯曲図書館`} />
      <Layout>
        <div>
          <h2>カテゴリ</h2>
          <div className="category-list">
            {categories.length != 0 &&
              categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  imageUrl={category.image_url}
                />
              ))}
          </div>
        </div>
        <style jsx>{`
          .category-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
          }
        `}</style>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        posts: {
          include: { author: true },
        },
      },
    });

    return {
      props: {
        categories,
      },
      revalidate: 3600,
    };
  } catch {
    return {
      notFound: true,
    };
  } finally {
    await prisma.$disconnect();
  }
}

export default CategoryListPage;
