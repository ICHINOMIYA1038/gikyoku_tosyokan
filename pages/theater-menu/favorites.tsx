import { GetServerSideProps } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { TheaterMenuSidebar, SidebarCategory } from "@/components/TheaterMenuSidebar";
import { MenuGrid, MenuItem } from "./index";
import { Heart } from "lucide-react";

type Props = {
  categories: SidebarCategory[];
  menus: MenuItem[];
};

export default function FavoritesPage({ categories, menus }: Props) {
  return (
    <Layout>
      <Seo
        pageTitle="お気に入りメニュー — 演劇メニュー辞典"
        pageDescription="保存した演劇メニュー一覧"
        pagePath="/theater-menu/favorites"
      />
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <nav className="text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-rose-600">ホーム</Link>
          <span className="mx-2">/</span>
          <Link href="/theater-menu" className="hover:text-rose-600">演劇メニュー</Link>
          <span className="mx-2">/</span>
          <span>お気に入り</span>
        </nav>
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            お気に入りメニュー
          </h1>
          <p className="text-sm text-gray-600">
            保存したメニューの一覧。稽古前に開いてすぐ確認できます。
          </p>
        </div>
        <div className="md:flex md:gap-6">
          <TheaterMenuSidebar categories={categories} />
          <main className="flex-1 min-w-0 mt-6 md:mt-0">
            {menus.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
                <p className="text-sm text-gray-500 mb-3">まだお気に入りはありません</p>
                <Link
                  href="/theater-menu"
                  className="inline-block text-sm text-rose-600 hover:underline"
                >
                  メニュー一覧を見る →
                </Link>
              </div>
            ) : (
              <MenuGrid menus={menus} />
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: `/auth/signin?callbackUrl=${encodeURIComponent("/theater-menu/favorites")}`,
        permanent: false,
      },
    };
  }
  const userId = session.user.id;
  const [categoriesRaw, favs] = await Promise.all([
    prisma.theaterMenuCategory.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: { _count: { select: { menus: { where: { published: true } } } } },
    }),
    prisma.theaterMenuFavorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        menu: {
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
            published: true,
            category: { select: { slug: true, name: true } },
          },
        },
      },
    }),
  ]);
  const menus = favs.filter((f) => f.menu.published).map((f) => {
    const { published: _p, ...rest } = f.menu;
    return rest;
  });
  return {
    props: {
      categories: categoriesRaw.map((c) => ({
        slug: c.slug,
        name: c.name,
        count: c._count.menus,
        icon: c.icon,
      })),
      menus,
    },
  };
};
