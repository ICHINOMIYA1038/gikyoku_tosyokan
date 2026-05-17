import Layout from "@/components/Layout";
import { PrismaClient } from "@prisma/client";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import CategoryCard from "@/components/CategoryCard";

const prisma = new PrismaClient();

type CategoryItem = {
  id: number;
  name: string;
  image_url: string | null;
  postCount: number;
};

function CategoryListPage({ categories }: { categories: CategoryItem[] }) {
  return (
    <>
      <Seo
        pageTitle="カテゴリから戯曲を探す"
        pageDescription={`戯曲図書館の全${categories.length}カテゴリから演劇脚本・台本を探せます。コメディ、悲劇、不条理劇、ヒューマンドラマ、社会問題、時代劇など、ジャンル別に1,000作品以上を網羅。文化祭・学園祭・高校演劇の脚本選びにも。`}
        pagePath="/categories"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "カテゴリー", url: "https://gikyokutosyokan.com/categories" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        title="カテゴリ一覧"
        description="ジャンル別に戯曲を探せる"
        url="https://gikyokutosyokan.com/categories"
        numberOfItems={categories.length}
        collectionItems={categories.slice(0, 10).map((c) => ({
          name: `${c.name}（${c.postCount}作品）`,
          url: `https://gikyokutosyokan.com/categories/${c.id}`,
        }))}
      />
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                カテゴリ一覧
              </h1>
              <p className="text-lg text-gray-600">
                {categories.length}ジャンルから戯曲・脚本を探せます。作品数が多い順に表示しています。
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    imageUrl={category.image_url || ""}
                    postCount={category.postCount}
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
      select: {
        id: true,
        name: true,
        image_url: true,
        _count: { select: { posts: true } },
      },
    });

    // 作品数のあるものだけ＆作品数降順
    const formatted: CategoryItem[] = categories
      .filter((c) => c._count.posts > 0)
      .map((c) => ({
        id: c.id,
        name: c.name,
        image_url: c.image_url,
        postCount: c._count.posts,
      }))
      .sort((a, b) => b.postCount - a.postCount);

    return {
      props: {
        categories: formatted,
      },
      revalidate: 604800,
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
