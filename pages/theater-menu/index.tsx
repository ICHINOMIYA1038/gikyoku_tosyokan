import { GetStaticProps } from "next";
import Link from "next/link";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import { prisma } from "@/lib/prisma";
import { TheaterMenuSidebar, SidebarCategory } from "@/components/TheaterMenuSidebar";
import { FilterBar, useMenuFilter } from "@/components/TheaterMenuFilter";
import { Users, Clock, Flame } from "lucide-react";

export type MenuItem = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  imageUrl: string | null;
  tags: string[];
  duration: number | null;
  minPeople: number | null;
  maxPeople: number | null;
  difficulty: number | null;
  hasPhysicalContact: boolean | null;
  category: { slug: string; name: string };
};

type Props = {
  categories: SidebarCategory[];
  menus: MenuItem[];
};

export default function TheaterMenuIndex({ categories, menus }: Props) {
  const { filter, setFilter, filtered, isActive } = useMenuFilter(menus);
  const availableTags = Array.from(new Set(menus.flatMap((m) => m.tags))).sort();
  return (
    <Layout>
      <Seo
        pageTitle="演劇メニュー辞典 — 発声練習・エチュード・シアターゲーム"
        pageDescription="演劇レッスンや稽古に使える演劇メニューの辞典。発声練習、エチュード、シアターゲーム、ワークショップ台本などをジャンル別に収録。"
        pagePath="/theater-menu"
        pageKeywords={["演劇", "メニュー", "エチュード", "発声練習", "シアターゲーム", "ワークショップ"]}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "演劇メニュー辞典", url: "https://gikyokutosyokan.com/theater-menu" },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <nav className="text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-rose-600">ホーム</Link>
          <span className="mx-2">/</span>
          <span>演劇メニュー</span>
        </nav>
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            演劇メニュー辞典
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            演劇のレッスン・稽古で使えるメニューを辞典形式でまとめています。
            発声練習からエチュードのお題、シアターゲーム、短編ワークショップ台本まで、
            ジャンル別にどうぞ。
          </p>
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
            {isActive ? (
              <MenuGrid menus={filtered} />
            ) : (
              <div className="space-y-10">
            {categories.map((cat) => {
              const items = menus.filter((m) => m.category.slug === cat.slug);
              if (items.length === 0) return null;
              return (
                <section key={cat.slug}>
                  <div className="flex items-baseline justify-between mb-3 pb-2 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                      {cat.name}
                      <span className="ml-2 text-xs font-normal text-gray-400">
                        {items.length}件
                      </span>
                    </h2>
                    <Link
                      href={`/theater-menu/${cat.slug}`}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      このジャンルだけ見る →
                    </Link>
                  </div>
                  <MenuGrid menus={items} />
                </section>
              );
            })}
                <PopularTagCloud menus={menus} setFilter={setFilter} filter={filter} />
                <CrossLinkFooter />
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}

export function MenuGrid({ menus }: { menus: MenuItem[] }) {
  if (menus.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 py-16 text-center text-sm text-gray-500">
        メニューはまだありません。
      </p>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {menus.map((m) => (
        <Link
          key={m.id}
          href={`/theater-menu/${m.category.slug}/${m.slug}`}
          className="group block rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md hover:border-rose-200 transition"
        >
          {m.imageUrl && (
            <div className="aspect-video bg-gray-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.imageUrl}
                alt={m.title}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>
          )}
          <div className="p-4">
            <p className="text-[11px] text-rose-600 font-medium mb-1">
              {m.category.name}
            </p>
            <h3 className="font-bold text-gray-900 group-hover:text-rose-600 transition mb-2">
              {m.title}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-3">
              {m.summary}
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] text-gray-500">
              {m.duration && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {m.duration}分
                </span>
              )}
              {(m.minPeople || m.maxPeople) && (
                <span className="inline-flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {m.minPeople === m.maxPeople
                    ? `${m.minPeople}人`
                    : `${m.minPeople ?? "?"}〜${m.maxPeople ?? "?"}人`}
                </span>
              )}
              {m.difficulty && (
                <span className="inline-flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  {"★".repeat(m.difficulty)}
                </span>
              )}
            </div>
            {m.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {m.tags.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

function PopularTagCloud({
  menus,
  filter,
  setFilter,
}: {
  menus: MenuItem[];
  filter: any;
  setFilter: (f: any) => void;
}) {
  const counts = menus.flatMap((m) => m.tags).reduce<Record<string, number>>((acc, t) => {
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 20);
  return (
    <section>
      <h2 className="text-sm font-bold text-gray-700 mb-3">よく使われるタグ</h2>
      <div className="flex flex-wrap gap-2">
        {top.map(([t, n]) => (
          <button
            key={t}
            onClick={() => setFilter({ ...filter, tag: t })}
            className="text-xs bg-gray-100 hover:bg-rose-100 text-gray-700 hover:text-rose-700 px-3 py-1 rounded-full transition"
          >
            #{t} <span className="text-gray-400">({n})</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function CrossLinkFooter() {
  return (
    <section className="rounded-xl border border-gray-200 bg-gradient-to-br from-rose-50 to-pink-50 p-5">
      <h2 className="text-sm font-bold text-gray-800 mb-3">関連サービス</h2>
      <div className="grid gap-3 sm:grid-cols-3 text-xs">
        <Link href="/" className="rounded-lg bg-white p-3 border border-gray-100 hover:border-rose-200 transition">
          <p className="font-bold text-gray-900">戯曲を検索</p>
          <p className="text-gray-500 mt-1">人数・時間・ジャンルで戯曲を探す</p>
        </Link>
        <Link href="/tools" className="rounded-lg bg-white p-3 border border-gray-100 hover:border-rose-200 transition">
          <p className="font-bold text-gray-900">演劇ツール</p>
          <p className="text-gray-500 mt-1">上演時間見積・稽古タイマー・スケジューラ</p>
        </Link>
        <Link href="/announcements" className="rounded-lg bg-white p-3 border border-gray-100 hover:border-rose-200 transition">
          <p className="font-bold text-gray-900">上演告知</p>
          <p className="text-gray-500 mt-1">全国の上演情報を掲載</p>
        </Link>
      </div>
    </section>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [categoriesRaw, menus] = await Promise.all([
    prisma.theaterMenuCategory.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: { _count: { select: { menus: { where: { published: true } } } } },
    }),
    prisma.theaterMenu.findMany({
      where: { published: true },
      orderBy: [
        { category: { order: "asc" } },
        { order: "asc" },
        { id: "asc" },
      ],
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
      menus,
    },
    revalidate: 300,
  };
};
