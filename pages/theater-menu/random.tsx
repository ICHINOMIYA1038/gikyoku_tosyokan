import { useState } from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import { prisma } from "@/lib/prisma";
import { TheaterMenuSidebar, SidebarCategory } from "@/components/TheaterMenuSidebar";
import { Shuffle } from "lucide-react";
import { trackTheaterMenuEvent } from "@/lib/gtag";

type Menu = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  category: { slug: string; name: string };
};

type Props = { categories: SidebarCategory[] };

export default function RandomPickerPage({ categories }: Props) {
  const [selected, setSelected] = useState<string>("");
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(false);

  const pick = async () => {
    setLoading(true);
    const qs = selected ? `?category=${selected}` : "";
    const r = await fetch(`/api/theater-menu/random${qs}`);
    const data = await r.json();
    const picked = data.menus?.[0] || null;
    setMenu(picked);
    setLoading(false);
    if (picked) trackTheaterMenuEvent("random_pick", selected || "all", { menuSlug: picked.slug });
  };

  return (
    <Layout>
      <Seo
        pageTitle="ランダムに1つ引く — 演劇メニュー"
        pageDescription="演劇メニューをランダムに1つ引くツール。エチュードのお題出しや練習メニュー選びに。"
        pagePath="/theater-menu/random"
      />
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <nav className="text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-rose-600">ホーム</Link>
          <span className="mx-2">/</span>
          <Link href="/theater-menu" className="hover:text-rose-600">演劇メニュー</Link>
          <span className="mx-2">/</span>
          <span>ランダム</span>
        </nav>

        <div className="md:flex md:gap-6">
          <TheaterMenuSidebar categories={categories} />

          <main className="flex-1 min-w-0 mt-6 md:mt-0">
            <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white p-6 md:p-10 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Shuffle className="w-5 h-5" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold">
                  ランダムに1つ引く
                </h1>
              </div>
              <p className="text-sm text-rose-50/90 mb-6">
                エチュードのお題出し、今日のワークショップメニュー選び、
                稽古の一発目のアイスブレイクに。ジャンルを選んで引くだけ。
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelected("")}
                  className={`px-3 py-1.5 text-xs rounded-full border transition ${
                    selected === ""
                      ? "bg-white text-rose-700 border-white font-medium"
                      : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                  }`}
                >
                  すべて
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setSelected(c.slug)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition ${
                      selected === c.slug
                        ? "bg-white text-rose-700 border-white font-medium"
                        : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <button
                onClick={pick}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 text-white py-4 text-base font-bold hover:bg-black disabled:opacity-60 transition shadow-lg"
              >
                <Shuffle className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                {loading ? "引いています…" : menu ? "もう一度引く" : "引く"}
              </button>
            </div>

            {menu && (
              <div key={menu.id} className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 md:p-8 animate-fadeIn">
                <p className="text-xs text-rose-600 font-medium mb-2">
                  今回のお題 — {menu.category.name}
                </p>
                <Link
                  href={`/theater-menu/${menu.category.slug}/${menu.slug}`}
                  className="block group"
                >
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-rose-600 mb-3 transition">
                    {menu.title}
                  </h2>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    {menu.summary}
                  </p>
                  <span className="inline-block mt-4 text-sm text-rose-600 group-hover:underline font-medium">
                    詳しく見る →
                  </span>
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const cats = await prisma.theaterMenuCategory.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
    include: { _count: { select: { menus: { where: { published: true } } } } },
  });
  return {
    props: {
      categories: cats.map((c) => ({
        slug: c.slug,
        name: c.name,
        count: c._count.menus,
        icon: c.icon,
      })),
    },
    revalidate: 600,
  };
};
