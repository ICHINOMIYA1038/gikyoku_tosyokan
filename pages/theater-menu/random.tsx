import { useState } from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import { prisma } from "@/lib/prisma";
import { TheaterMenuSidebar, SidebarCategory } from "@/components/TheaterMenuSidebar";
import { Shuffle, ArrowRight, RefreshCw } from "lucide-react";
import { trackTheaterMenuEvent } from "@/lib/gtag";
import { playDiceRoll, playClick } from "@/lib/theater-menu-sfx";

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
  const [muted, setMuted] = useState(false);

  const pick = async () => {
    if (!muted) playDiceRoll();
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
            <header className="mb-6 pb-5 border-b border-gray-200">
              <p className="text-[10px] font-semibold text-rose-600 tracking-widest uppercase mb-1.5">
                Random Picker
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                ランダムに1つ引く
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                今日の稽古メニュー、エチュードのお題、アイスブレイクに。ジャンルを選んで引くだけ。
              </p>
            </header>

            {/* ジャンル選択 */}
            <div className="mb-5">
              <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-2">
                Genre
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => { if (!muted) playClick(); setSelected(""); }}
                  className={`px-3 py-1.5 text-xs rounded transition ${
                    selected === ""
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
                  }`}
                >
                  すべて
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => { if (!muted) playClick(); setSelected(c.slug); }}
                    className={`px-3 py-1.5 text-xs rounded transition ${
                      selected === c.slug
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 引くボタン */}
            <button
              onClick={pick}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-white py-3.5 text-sm font-medium hover:bg-black disabled:opacity-60 transition"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  引いています…
                </>
              ) : (
                <>
                  <Shuffle className="w-4 h-4" />
                  {menu ? "もう一度引く" : "引く"}
                </>
              )}
            </button>

            {/* 結果 */}
            {menu && (
              <article
                key={menu.id}
                className="mt-6 rounded-xl border border-gray-200 bg-white overflow-hidden animate-fadeIn"
              >
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <p className="text-[10px] font-semibold text-gray-500 tracking-widest uppercase">
                    Today&apos;s Pick
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {menu.category.name}
                  </p>
                </div>
                <Link
                  href={`/theater-menu/${menu.category.slug}/${menu.slug}`}
                  className="block px-6 py-6 md:px-8 md:py-8 group hover:bg-gray-50/50 transition"
                >
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-3 leading-tight tracking-tight">
                    {menu.title}
                  </h2>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                    {menu.summary}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-900 font-medium group-hover:gap-2 transition-all">
                    詳細を見る
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </article>
            )}

            {!menu && (
              <p className="mt-6 text-center text-xs text-gray-400 py-8 border border-dashed border-gray-200 rounded-lg">
                「引く」ボタンでメニューを1つランダムに抽選します
              </p>
            )}

            <div className="mt-8 text-xs text-gray-500 leading-relaxed space-y-1">
              <p><span className="text-gray-400">TIP.</span> ジャンルを絞ると稽古の目的にあったメニューが引けます</p>
              <p><span className="text-gray-400">TIP.</span> 気に入らなければ「もう一度引く」で何度でも</p>
              <p><span className="text-gray-400">TIP.</span> 詳細ページには稽古タイマーが内蔵されています</p>
            </div>
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
