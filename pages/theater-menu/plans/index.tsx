import { GetServerSideProps } from "next";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { TheaterMenuSidebar, SidebarCategory } from "@/components/TheaterMenuSidebar";
import { BookOpen, Plus } from "lucide-react";

type Plan = {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  itemCount: number;
  updatedAt: string;
};

type Props = { categories: SidebarCategory[]; plans: Plan[] };

export default function PlansIndex({ categories, plans }: Props) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");

  const create = async () => {
    if (!title.trim()) return;
    const r = await fetch("/api/theater-menu/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim() }),
    });
    if (r.ok) {
      const { plan } = await r.json();
      router.push(`/theater-menu/plans/${plan.id}`);
    }
  };

  return (
    <Layout>
      <Seo
        pageTitle="レッスンプラン — 演劇メニュー辞典"
        pageDescription="演劇メニューを組み合わせて自分のレッスンプランを作成・保存・共有。"
        pagePath="/theater-menu/plans"
      />
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <nav className="text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-rose-600">ホーム</Link>
          <span className="mx-2">/</span>
          <Link href="/theater-menu" className="hover:text-rose-600">演劇メニュー</Link>
          <span className="mx-2">/</span>
          <span>レッスンプラン</span>
        </nav>
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-rose-500" />
            レッスンプラン
          </h1>
          <p className="text-sm text-gray-600">
            演劇メニューを組み合わせて、あなただけの稽古プランを作成できます。
            公開設定にすればURLで仲間に共有できます。
          </p>
        </div>

        <div className="md:flex md:gap-6">
          <TheaterMenuSidebar categories={categories} />

          <main className="flex-1 min-w-0 mt-6 md:mt-0">
            <div className="mb-4">
              {creating ? (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && create()}
                    placeholder="プラン名 (例: 初日ワークショップ 90分)"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <button
                    onClick={create}
                    className="rounded-lg bg-rose-600 text-white px-4 py-2 text-sm hover:bg-rose-700"
                  >
                    作成
                  </button>
                  <button
                    onClick={() => setCreating(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                  >
                    キャンセル
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCreating(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-600 text-white px-4 py-2 text-sm hover:bg-rose-700"
                >
                  <Plus className="w-4 h-4" />
                  新しいプランを作る
                </button>
              )}
            </div>

            {plans.length === 0 ? (
              <p className="rounded-lg border border-dashed border-gray-300 py-16 text-center text-sm text-gray-500">
                まだプランはありません。上のボタンから作成してください。
              </p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {plans.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/theater-menu/plans/${p.id}`}
                      className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-rose-200 hover:shadow-sm transition"
                    >
                      <h3 className="font-bold text-gray-900 mb-1">{p.title}</h3>
                      {p.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">{p.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{p.itemCount} メニュー</span>
                        <span>更新: {new Date(p.updatedAt).toLocaleDateString("ja-JP")}</span>
                        {p.isPublic && (
                          <span className="text-emerald-700 bg-emerald-50 px-1.5 rounded">公開中</span>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
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
        destination: `/auth/signin?callbackUrl=${encodeURIComponent("/theater-menu/plans")}`,
        permanent: false,
      },
    };
  }
  const userId = session.user.id;
  const [categoriesRaw, plans] = await Promise.all([
    prisma.theaterMenuCategory.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: { _count: { select: { menus: { where: { published: true } } } } },
    }),
    prisma.lessonPlan.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { items: true } } },
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
      plans: plans.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        isPublic: p.isPublic,
        itemCount: p._count.items,
        updatedAt: p.updatedAt.toISOString(),
      })),
    },
  };
};
