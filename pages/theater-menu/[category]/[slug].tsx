import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import PlainMarkdown from "@/components/PlainMarkdown";
import { TheaterMenuFavoriteButton } from "@/components/TheaterMenuFavoriteButton";
import { AddToPlanButton } from "@/components/AddToPlanButton";
import { InlineMenuTimer } from "@/components/InlineMenuTimer";
import StructuredData from "@/components/StructuredData";
import Head from "next/head";
import { prisma } from "@/lib/prisma";
import { TheaterMenuSidebar, SidebarCategory } from "@/components/TheaterMenuSidebar";
import { Users, Clock, Flame, Package, MapPin, Baby, Hand, Film, ExternalLink, MessageSquare, HelpCircle, Target as TargetIcon } from "lucide-react";

type Props = {
  categories: SidebarCategory[];
  menu: {
    id: number;
    slug: string;
    title: string;
    summary: string;
    content: string;
    imageUrl: string | null;
    images: string[];
    tags: string[];
    duration: number | null;
    minPeople: number | null;
    maxPeople: number | null;
    difficulty: number | null;
    aliases: string[];
    learningObjectives: string[];
    ageGroup: string | null;
    materials: string[];
    spaceRequirement: string | null;
    hasPhysicalContact: boolean | null;
    sideCoaching: string | null;
    reflectionQuestions: string[];
    videoUrl: string | null;
    credit: string | null;
    sourceUrl: string | null;
    category: { slug: string; name: string };
  };
  related: any[];
};

export default function TheaterMenuDetail({ categories, menu, related }: Props) {
  return (
    <Layout>
      <Seo
        pageTitle={`${menu.title} — ${menu.category.name}`}
        pageDescription={menu.summary}
        pagePath={`/theater-menu/${menu.category.slug}/${menu.slug}`}
        pageKeywords={["演劇", menu.category.name, ...menu.tags]}
        pageImg={
          menu.imageUrl ||
          `https://gikyokutosyokan.com/api/og?title=${encodeURIComponent(menu.title)}&tags=${encodeURIComponent([menu.category.name, ...menu.tags.slice(0, 3)].join(","))}`
        }
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "演劇メニュー", url: "https://gikyokutosyokan.com/theater-menu" },
          { name: menu.category.name, url: `https://gikyokutosyokan.com/theater-menu/${menu.category.slug}` },
          { name: menu.title, url: `https://gikyokutosyokan.com/theater-menu/${menu.category.slug}/${menu.slug}` },
        ]}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildHowToJsonLd(menu)),
          }}
        />
      </Head>
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <nav className="text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-rose-600">ホーム</Link>
          <span className="mx-2">/</span>
          <Link href="/theater-menu" className="hover:text-rose-600">演劇メニュー</Link>
          <span className="mx-2">/</span>
          <Link
            href={`/theater-menu/${menu.category.slug}`}
            className="hover:text-rose-600"
          >
            {menu.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{menu.title}</span>
        </nav>

        <div className="md:flex md:gap-6">
          <TheaterMenuSidebar categories={categories} />

          <main className="flex-1 min-w-0 mt-6 md:mt-0">
            {/* ヒーロー: 画像+情報を side-by-side */}
            <section className="mb-6">
              <div className="grid md:grid-cols-2 gap-5 items-start">
                {menu.imageUrl ? (
                  <div className="aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={menu.imageUrl} alt={menu.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-video md:aspect-[4/3] rounded-2xl bg-gradient-to-br from-rose-100 to-pink-50 flex items-center justify-center">
                    <span className="text-4xl text-rose-300">🎭</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-2">
                    {menu.category.name}
                  </p>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                    {menu.title}
                  </h1>
                  {menu.aliases.length > 0 && (
                    <p className="text-xs text-gray-500 mb-3">
                      別名: {menu.aliases.join(" / ")}
                    </p>
                  )}
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                    {menu.summary}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <TheaterMenuFavoriteButton menuId={menu.id} />
                    <AddToPlanButton menuId={menu.id} />
                    {menu.category.slug === "etude" && (
                      <Link
                        href="/theater-menu/etude-generator"
                        className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-300 bg-gradient-to-r from-rose-50 to-fuchsia-50 px-3 py-1.5 text-xs text-fuchsia-700 hover:from-rose-100 hover:to-fuchsia-100 transition"
                      >
                        🎲 このメニュー用にお題を振る
                      </Link>
                    )}
                  </div>

                  <dl className="grid grid-cols-2 gap-2 text-xs">
                    {menu.duration && (
                      <MetaCell icon={<Clock className="w-3.5 h-3.5" />} label="所要" value={`${menu.duration}分`} />
                    )}
                    {(menu.minPeople || menu.maxPeople) && (
                      <MetaCell
                        icon={<Users className="w-3.5 h-3.5" />}
                        label="人数"
                        value={
                          menu.minPeople === menu.maxPeople
                            ? `${menu.minPeople}人`
                            : `${menu.minPeople ?? "?"}〜${menu.maxPeople ?? "?"}人`
                        }
                      />
                    )}
                    {menu.difficulty && (
                      <MetaCell
                        icon={<Flame className="w-3.5 h-3.5" />}
                        label="難易度"
                        value={"★".repeat(menu.difficulty) + "☆".repeat(5 - menu.difficulty)}
                      />
                    )}
                    {menu.ageGroup && (
                      <MetaCell icon={<Baby className="w-3.5 h-3.5" />} label="対象" value={menu.ageGroup} />
                    )}
                  </dl>

                  {menu.hasPhysicalContact === true && (
                    <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 self-start">
                      <Hand className="w-3.5 h-3.5" /> 身体接触あり — 事前説明を推奨
                    </p>
                  )}
                </div>
              </div>
            </section>

            <article className="bg-white rounded-2xl border border-gray-200">
              <div className="p-5 md:p-8">

                {(menu.learningObjectives.length > 0 || menu.materials.length > 0 || menu.spaceRequirement) && (
                  <div className="grid gap-3 md:grid-cols-2 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                    {menu.learningObjectives.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-rose-700 mb-1 flex items-center gap-1">
                          <TargetIcon className="w-3.5 h-3.5" /> 学習目標
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-0.5">
                          {menu.learningObjectives.map((o, i) => (
                            <li key={i}>{o}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(menu.materials.length > 0 || menu.spaceRequirement) && (
                      <div>
                        <p className="text-xs font-semibold text-rose-700 mb-1 flex items-center gap-1">
                          <Package className="w-3.5 h-3.5" /> 必要な準備
                        </p>
                        <ul className="text-gray-700 space-y-0.5">
                          {menu.materials.length > 0 ? (
                            menu.materials.map((m, i) => <li key={i}>・{m}</li>)
                          ) : (
                            <li>・道具不要</li>
                          )}
                          {menu.spaceRequirement && (
                            <li className="flex items-start gap-1 mt-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                              {menu.spaceRequirement}
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {menu.videoUrl && (
                  <a
                    href={menu.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-red-600 hover:underline mb-4"
                  >
                    <Film className="w-4 h-4" /> 参考動画を見る
                  </a>
                )}

                {menu.duration && menu.duration > 0 && menu.duration <= 120 && (
                  <InlineMenuTimer minutes={menu.duration} />
                )}

                <div className="prose prose-sm md:prose-base max-w-none theater-menu-prose">
                  <PlainMarkdown content={menu.content} />
                </div>

                {menu.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    {menu.images.map((src) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={src}
                        src={src}
                        alt=""
                        className="rounded-lg border border-gray-200"
                      />
                    ))}
                  </div>
                )}

                {menu.sideCoaching && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> 進行役の声かけ例 (Side Coaching)
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {menu.sideCoaching}
                    </p>
                  </div>
                )}

                {menu.reflectionQuestions.length > 0 && (
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <p className="text-xs font-semibold text-emerald-700 mb-2 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" /> 振り返り質問
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {menu.reflectionQuestions.map((q, i) => (
                        <li key={i}>Q{i + 1}. {q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {(menu.credit || menu.sourceUrl) && (
                  <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
                    {menu.credit && (
                      <p>考案・出典: {menu.credit}</p>
                    )}
                    {menu.sourceUrl && (
                      <a
                        href={menu.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-rose-600 hover:underline"
                      >
                        参考リンク <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}

                {menu.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-100">
                    {menu.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>

            {related.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-bold text-gray-900 mb-3">
                  次におすすめのメニュー
                </h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {related.map((r) => (
                    <li key={r.id}>
                      <Link
                        href={`/theater-menu/${r.category?.slug || menu.category.slug}/${r.slug}`}
                        className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 hover:border-rose-200 hover:bg-rose-50 transition"
                      >
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}

function MetaCell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
      <div className="flex items-center gap-1 text-gray-500 text-[10px]">
        {icon}
        {label}
      </div>
      <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}

function buildHowToJsonLd(menu: Props["menu"]) {
  // Markdownの「## 手順」以降の見出しをステップとして抽出
  const steps = extractHowToSteps(menu.content);
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: menu.title,
    description: menu.summary,
    url: `https://gikyokutosyokan.com/theater-menu/${menu.category.slug}/${menu.slug}`,
    image: menu.imageUrl || undefined,
    totalTime: menu.duration ? `PT${menu.duration}M` : undefined,
    supply: menu.materials.map((m) => ({ "@type": "HowToSupply", name: m })),
    tool: menu.spaceRequirement
      ? [{ "@type": "HowToTool", name: menu.spaceRequirement }]
      : undefined,
    step: steps.length
      ? steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
        }))
      : undefined,
  };
  Object.keys(jsonLd).forEach((k) => jsonLd[k] === undefined && delete jsonLd[k]);
  return jsonLd;
}

function extractHowToSteps(content: string): { name: string; text: string }[] {
  const lines = content.split("\n");
  const steps: { name: string; text: string }[] = [];
  let inSteps = false;
  let current: { name: string; text: string } | null = null;
  for (const line of lines) {
    if (/^##\s+(手順|Procedure|Steps)/.test(line)) {
      inSteps = true;
      continue;
    }
    if (inSteps && /^##\s+/.test(line)) break; // 別のH2に移ったら終了
    if (!inSteps) continue;
    const h3 = line.match(/^###\s+(.+)/);
    if (h3) {
      if (current) steps.push(current);
      current = { name: h3[1].trim(), text: "" };
      continue;
    }
    if (current) current.text += line + "\n";
  }
  if (current) steps.push(current);
  return steps.map((s) => ({ name: s.name, text: s.text.trim().slice(0, 500) }));
}

export const getStaticPaths: GetStaticPaths = async () => {
  const menus = await prisma.theaterMenu.findMany({
    where: { published: true },
    select: { slug: true, category: { select: { slug: true } } },
  });
  return {
    paths: menus.map((m) => ({
      params: { category: m.category.slug, slug: m.slug },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = String(params?.slug);
  const menu = await prisma.theaterMenu.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!menu || !menu.published) return { notFound: true };

  // relatedSlugs があればそれを優先、なければ同カテゴリからフォールバック
  const manualRelated =
    menu.relatedSlugs.length > 0
      ? await prisma.theaterMenu.findMany({
          where: { slug: { in: menu.relatedSlugs }, published: true },
          select: {
            id: true,
            slug: true,
            title: true,
            category: { select: { slug: true } },
          },
        })
      : [];
  const [categoriesRaw, sameCategory] = await Promise.all([
    prisma.theaterMenuCategory.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: { _count: { select: { menus: { where: { published: true } } } } },
    }),
    prisma.theaterMenu.findMany({
      where: {
        published: true,
        categoryId: menu.categoryId,
        NOT: { id: menu.id },
      },
      take: 6,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        category: { select: { slug: true } },
      },
    }),
  ]);
  const related = manualRelated.length > 0 ? manualRelated : sameCategory;

  return {
    props: {
      categories: categoriesRaw.map((c) => ({
        slug: c.slug,
        name: c.name,
        count: c._count.menus,
        icon: c.icon,
      })),
      menu: {
        id: menu.id,
        slug: menu.slug,
        title: menu.title,
        summary: menu.summary,
        content: menu.content,
        imageUrl: menu.imageUrl,
        images: menu.images,
        tags: menu.tags,
        duration: menu.duration,
        minPeople: menu.minPeople,
        maxPeople: menu.maxPeople,
        difficulty: menu.difficulty,
        aliases: menu.aliases,
        learningObjectives: menu.learningObjectives,
        ageGroup: menu.ageGroup,
        materials: menu.materials,
        spaceRequirement: menu.spaceRequirement,
        hasPhysicalContact: menu.hasPhysicalContact,
        sideCoaching: menu.sideCoaching,
        reflectionQuestions: menu.reflectionQuestions,
        videoUrl: menu.videoUrl,
        credit: menu.credit,
        sourceUrl: menu.sourceUrl,
        category: { slug: menu.category.slug, name: menu.category.name },
      },
      related,
    },
    revalidate: 300,
  };
};
