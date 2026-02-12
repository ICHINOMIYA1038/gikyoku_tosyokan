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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                カテゴリ一覧
              </h1>
              <p className="text-lg text-gray-600">
                興味のあるカテゴリから戯曲を探してみましょう
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    imageUrl={category.image_url}
                    postCount={category.posts?.length || 0}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">
                    カテゴリがまだ登録されていません
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
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
