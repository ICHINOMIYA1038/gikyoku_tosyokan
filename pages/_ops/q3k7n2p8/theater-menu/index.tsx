import { GetServerSideProps } from "next";
import Link from "next/link";
import { AdminLayout, ADMIN_BASE } from "@/components/AdminLayout";
import { requireAdminPage } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

type Category = {
  id: number;
  slug: string;
  name: string;
  count: number;
};
type Menu = {
  id: number;
  slug: string;
  title: string;
  category: { name: string; slug: string };
  published: boolean;
  updatedAt: string;
};
type Props = { categories: Category[]; menus: Menu[] };

export default function AdminTheaterMenuIndex({ categories, menus }: Props) {
  return (
    <AdminLayout title="演劇メニュー">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Link
          href={`${ADMIN_BASE}/theater-menu/edit`}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
        >
          + 新しいメニュー
        </Link>
        <Link
          href={`${ADMIN_BASE}/theater-menu/category`}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          カテゴリを管理
        </Link>
      </div>

      <h2 className="text-sm font-semibold text-gray-700 mb-2">カテゴリ</h2>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {categories.map((c) => (
          <div
            key={c.id}
            className="rounded-lg border border-gray-200 bg-white p-3"
          >
            <p className="text-sm font-medium text-gray-900">{c.name}</p>
            <p className="text-xs text-gray-500">{c.slug} · {c.count}件</p>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-gray-700 mb-2">メニュー一覧</h2>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">タイトル</th>
              <th className="px-3 py-2 text-left">カテゴリ</th>
              <th className="px-3 py-2 text-left">状態</th>
              <th className="px-3 py-2 text-left">更新</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {menus.map((m) => (
              <tr key={m.id}>
                <td className="px-3 py-2 text-gray-900">{m.title}</td>
                <td className="px-3 py-2 text-gray-600">{m.category.name}</td>
                <td className="px-3 py-2">
                  {m.published ? (
                    <span className="text-emerald-700 text-xs">公開中</span>
                  ) : (
                    <span className="text-gray-400 text-xs">下書き</span>
                  )}
                </td>
                <td className="px-3 py-2 text-xs text-gray-500">
                  {new Date(m.updatedAt).toLocaleDateString("ja-JP")}
                </td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`${ADMIN_BASE}/theater-menu/edit?id=${m.id}`}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    編集
                  </Link>
                </td>
              </tr>
            ))}
            {menus.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-xs text-gray-400">
                  まだメニューはありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const guard = await requireAdminPage(ctx);
  if ("redirect" in guard) return { redirect: guard.redirect };
  if ("notFound" in guard) return { notFound: true };

  const [cats, menus] = await Promise.all([
    prisma.theaterMenuCategory.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: { _count: { select: { menus: true } } },
    }),
    prisma.theaterMenu.findMany({
      orderBy: [{ updatedAt: "desc" }],
      include: { category: { select: { name: true, slug: true } } },
    }),
  ]);

  return {
    props: {
      categories: cats.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        count: c._count.menus,
      })),
      menus: menus.map((m) => ({
        id: m.id,
        slug: m.slug,
        title: m.title,
        category: { name: m.category.name, slug: m.category.slug },
        published: m.published,
        updatedAt: m.updatedAt.toISOString(),
      })),
    },
  };
};
