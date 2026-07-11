import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import { prisma } from "@/lib/prisma";
import { TheaterMenuSidebar, SidebarCategory } from "@/components/TheaterMenuSidebar";
import { FilterBar, useMenuFilter } from "@/components/TheaterMenuFilter";
import { MenuGrid } from "../index";

type Props = {
  categories: SidebarCategory[];
  category: { slug: string; name: string; description: string | null };
  menus: any[];
};

export default function CategoryPage({ categories, category, menus }: Props) {
  const { filter, setFilter, filtered } = useMenuFilter(menus);
  const availableTags = Array.from(new Set(menus.flatMap((m: any) => m.tags))).sort() as string[];
  return (
    <Layout>
      <Seo
        pageTitle={`${category.name} — 演劇メニュー辞典`}
        pageDescription={
          category.description ||
          `${category.name}のメニュー一覧。レッスンや稽古に使えるアイデア集。`
        }
        pagePath={`/theater-menu/${category.slug}`}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "演劇メニュー", url: "https://gikyokutosyokan.com/theater-menu" },
          { name: category.name, url: `https://gikyokutosyokan.com/theater-menu/${category.slug}` },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <nav className="text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-rose-600">ホーム</Link>
          <span className="mx-2">/</span>
          <Link href="/theater-menu" className="hover:text-rose-600">演劇メニュー</Link>
          <span className="mx-2">/</span>
          <span>{category.name}</span>
        </nav>
        <div className="mb-6 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 p-6 md:p-8 border border-rose-100">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {category.name}
            <span className="ml-3 text-sm font-normal text-rose-600">{menus.length}件</span>
          </h1>
          {category.description && (
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {category.description}
            </p>
          )}
        </div>

        <div className="md:flex md:gap-6">
          <TheaterMenuSidebar categories={categories} />
          <main className="flex-1 min-w-0 mt-6 md:mt-0">
            <FilterBar
              filter={filter}
              setFilter={setFilter}
              totalCount={menus.length}
              filteredCount={filtered.length}
              availableTags={availableTags}
            />
            <MenuGrid menus={filtered} />
          </main>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const cats = await prisma.theaterMenuCategory.findMany({ select: { slug: true } });
  return {
    paths: cats.map((c) => ({ params: { category: c.slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = String(params?.category);
  const category = await prisma.theaterMenuCategory.findUnique({ where: { slug } });
  if (!category) return { notFound: true };

  const [categoriesRaw, menus] = await Promise.all([
    prisma.theaterMenuCategory.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: { _count: { select: { menus: { where: { published: true } } } } },
    }),
    prisma.theaterMenu.findMany({
      where: { published: true, categoryId: category.id },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        imageUrl: true,
        tags: true,
        duration: true,
        minPeople: true,
        maxPeople: true,
        difficulty: true,
        hasPhysicalContact: true,
        category: { select: { slug: true, name: true } },
      },
    }),
  ]);

  return {
    props: {
      categories: categoriesRaw.map((c) => ({
        slug: c.slug,
        name: c.name,
        count: c._count.menus,
        icon: c.icon,
      })),
      category: {
        slug: category.slug,
        name: category.name,
        description: category.description,
      },
      menus,
    },
    revalidate: 300,
  };
};
