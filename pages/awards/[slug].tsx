import { GetStaticProps, GetStaticPaths } from 'next';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import { prisma } from '@/lib/prisma';
import { FaChevronRight, FaTrophy, FaUser, FaBook, FaCalendarAlt } from 'react-icons/fa';
import AdSlot from '@/components/Ad/AdSlot';
import { AD_SLOTS } from '@/lib/adSlots';

const INITIAL_YEARS = 15;

type Winner = {
  awardYear: number;
  awardType: string;
  postId: number | null;
  postTitle: string;
  authorId: number | null;
  authorName: string;
};

type TopAuthor = {
  name: string;
  authorId: number;
  count: number;
};

type TypeCount = {
  type: string;
  count: number;
};

type Props = {
  award: {
    slug: string;
    name: string;
    description: string;
    organizer: string;
  };
  stats: {
    totalWinners: number;
    yearRange: string;
    uniqueAuthors: number;
    typeCounts: TypeCount[];
  };
  topAuthors: TopAuthor[];
  yearGroups: { year: number; winners: Winner[] }[];
};

const AWARD_NAV: { slug: string; name: string; shortName: string }[] = [
  { slug: 'kishida', name: '岸田國士戯曲賞', shortName: '岸田國士' },
  { slug: 'tsuruyaNanboku', name: '鶴屋南北戯曲賞', shortName: '鶴屋南北' },
  { slug: 'gekisakka-shinjin', name: '日本劇作家協会新人戯曲賞', shortName: '劇作家新人' },
  { slug: 'oms', name: 'OMS戯曲賞', shortName: 'OMS' },
  { slug: 'yomiuri', name: '読売演劇大賞', shortName: '読売演劇' },
  { slug: 'aaf', name: 'AAF戯曲賞', shortName: 'AAF' },
];

const AWARD_CONFIG: Record<string, { name: string; description: string; organizer: string; longDescription: string }> = {
  kishida: {
    name: '岸田國士戯曲賞',
    description: '新人劇作家の登竜門として最も権威ある戯曲賞。1955年に白水社が創設。',
    organizer: '白水社',
    longDescription: '岸田國士戯曲賞は、劇作家・岸田國士の功績を記念して1955年に創設された、日本で最も歴史と権威のある新人戯曲賞です。毎年、前年に発表された戯曲の中から最も優れた作品に贈られます。過去の受賞者には、別役実、つかこうへい、野田秀樹、鴻上尚史、ケラリーノ・サンドロヴィッチなど、日本演劇を代表する劇作家が名を連ねています。',
  },
  tsuruyaNanboku: {
    name: '鶴屋南北戯曲賞',
    description: '優れた戯曲作品に贈られる賞。1997年に光文文化財団が創設。',
    organizer: '公益財団法人光文文化財団',
    longDescription: '鶴屋南北戯曲賞は、江戸時代の歌舞伎作者・四代目鶴屋南北の名を冠した戯曲賞で、1997年に創設されました。キャリアを問わず、年間で最も優れた戯曲に贈られるため、ベテラン劇作家の受賞も多いのが特徴です。岸田賞が新人向けであるのに対し、鶴屋南北戯曲賞はより広い対象を持ちます。',
  },
  'gekisakka-shinjin': {
    name: '日本劇作家協会新人戯曲賞',
    description: '新人劇作家の発掘・育成を目的とした賞。1996年創設。',
    organizer: '日本劇作家協会',
    longDescription: '日本劇作家協会新人戯曲賞は、1996年に日本劇作家協会によって創設された新人戯曲賞です。応募制であり、プロ・アマチュアを問わず広く作品を募集しています。受賞者には後に岸田國士戯曲賞を受賞する劇作家も多く、新しい才能の発掘に大きな役割を果たしています。',
  },
  oms: {
    name: 'OMS戯曲賞',
    description: '関西の演劇シーンを支える重要な戯曲賞。',
    organizer: '大阪ガスネットワーク',
    longDescription: 'OMS戯曲賞は、大阪ガスネットワーク（旧・大阪ガス）が主催する戯曲賞です。関西を拠点に活動する劇作家を中心に、新しい才能を発掘・支援しています。大阪の扇町ミュージアムスクエア（OMS）の名を冠し、関西演劇シーンの活性化に大きく貢献しています。',
  },
  yomiuri: {
    name: '読売演劇大賞',
    description: '読売新聞社が主催する総合的な演劇賞。',
    organizer: '読売新聞社',
    longDescription: '読売演劇大賞は、1994年に読売新聞社が創設した演劇賞です。作品賞、演出家賞、男優賞、女優賞、スタッフ賞など複数の部門があり、日本の演劇界全体を対象とした総合的な賞です。選考委員会による審査で受賞者が決定されます。',
  },
  aaf: {
    name: 'AAF戯曲賞',
    description: '新しい演劇表現の可能性を追求する作品を対象とした賞。',
    organizer: '愛知県芸術劇場',
    longDescription: 'AAF戯曲賞（愛知県芸術劇場戯曲賞）は、愛知県芸術劇場が主催する戯曲賞です。「戯曲」の新たな可能性を切り開く作品を対象とし、受賞作はリーディング公演が行われるなど、作品の実践的な発表の場も提供しています。',
  },
};

/** Sort order for award types */
function awardTypeSortOrder(type: string): number {
  switch (type) {
    case '大賞': return 0;
    case '受賞': return 1;
    case '佳作': return 2;
    case '最終候補': return 3;
    default: return 4;
  }
}

/** Group label for non-winner types */
function awardTypeGroupLabel(type: string): string {
  switch (type) {
    case '最終候補': return '最終候補作品';
    case '佳作': return '佳作';
    default: return type;
  }
}

/** Check if this type is a "winner" (main award) */
function isWinnerType(type: string): boolean {
  return type === '受賞' || type === '大賞';
}

function WinnerEntry({ winner, showGrandPrize }: { winner: Winner; showGrandPrize: boolean }) {
  const titleEl = winner.postId ? (
    <Link href={`/posts/${winner.postId}`} className="text-sm font-bold text-gray-800 hover:text-theater-primary-600 transition-colors">
      {winner.postTitle}
    </Link>
  ) : (
    <span className="text-sm font-bold text-gray-800">{winner.postTitle}</span>
  );
  const authorEl = winner.authorId ? (
    <Link href={`/authors/${winner.authorId}`} className="text-xs text-gray-500 hover:text-theater-primary-600 transition-colors mt-0.5 inline-block">
      {winner.authorName}
    </Link>
  ) : (
    <span className="text-xs text-gray-500 mt-0.5 inline-block">{winner.authorName}</span>
  );

  return (
    <div className="flex items-start gap-3 py-1.5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {titleEl}
          {showGrandPrize && winner.awardType === '大賞' && (
            <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded font-medium">大賞</span>
          )}
        </div>
        {authorEl}
      </div>
      {winner.postId && (
        <Link href={`/posts/${winner.postId}`} className="flex-shrink-0 text-gray-300 hover:text-theater-primary-500 transition-colors mt-1" title="作品ページを見る">
          <FaBook className="text-xs" />
        </Link>
      )}
    </div>
  );
}

function SubEntry({ winner }: { winner: Winner }) {
  const titleEl = winner.postId ? (
    <Link href={`/posts/${winner.postId}`} className="text-xs text-gray-600 hover:text-theater-primary-600 transition-colors">
      {winner.postTitle}
    </Link>
  ) : (
    <span className="text-xs text-gray-600">{winner.postTitle}</span>
  );
  const authorEl = winner.authorId ? (
    <Link href={`/authors/${winner.authorId}`} className="text-[11px] text-gray-400 hover:text-theater-primary-600 transition-colors inline-block">
      {winner.authorName}
    </Link>
  ) : (
    <span className="text-[11px] text-gray-400 inline-block">{winner.authorName}</span>
  );

  return (
    <div className="flex items-start gap-3 py-1">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">{titleEl}</div>
        {authorEl}
      </div>
      {winner.postId && (
        <Link href={`/posts/${winner.postId}`} className="flex-shrink-0 text-gray-200 hover:text-theater-primary-500 transition-colors mt-0.5" title="作品ページを見る">
          <FaBook className="text-[10px]" />
        </Link>
      )}
    </div>
  );
}

export default function AwardDetailPage({ award, stats, topAuthors, yearGroups }: Props) {
  const [showAll, setShowAll] = useState(false);
  const displayedYearGroups = useMemo(
    () => showAll ? yearGroups : yearGroups.slice(0, INITIAL_YEARS),
    [yearGroups, showAll]
  );
  const hiddenYearCount = yearGroups.length - INITIAL_YEARS;

  return (
    <Layout>
      <Seo
        pageTitle={`${award.name} 受賞作品一覧`}
        pageDescription={`${award.name}の受賞作品一覧。${stats.yearRange}の${stats.totalWinners}件の受賞記録を掲載。`}
        pagePath={`/awards/${award.slug}`}
        pageKeywords={[award.name, '受賞作品', '戯曲賞', '演劇賞', '受賞者一覧']}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'ホーム', url: 'https://gikyokutosyokan.com' },
          { name: '戯曲賞データベース', url: 'https://gikyokutosyokan.com/awards' },
          { name: award.name, url: `https://gikyokutosyokan.com/awards/${award.slug}` },
        ]}
      />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* パンくずリスト */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-theater-primary-600">ホーム</Link>
          <FaChevronRight className="text-[8px]" />
          <Link href="/awards" className="hover:text-theater-primary-600">戯曲賞データベース</Link>
          <FaChevronRight className="text-[8px]" />
          <span className="text-gray-700">{award.name}</span>
        </nav>

        {/* 賞ナビゲーションタブ */}
        <div className="mb-6 -mx-4 px-4 sticky top-0 z-10 bg-white border-b border-gray-200">
          <nav className="flex overflow-x-auto no-scrollbar gap-0" aria-label="賞の切り替え">
            {AWARD_NAV.map((nav) => {
              const isCurrent = nav.slug === award.slug;
              return (
                <Link
                  key={nav.slug}
                  href={`/awards/${nav.slug}`}
                  className={`flex-shrink-0 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isCurrent
                      ? 'border-amber-500 text-amber-700 bg-amber-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  <span className="hidden sm:inline">{nav.name}</span>
                  <span className="sm:hidden">{nav.shortName}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ヒーローセクション */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <FaTrophy className="text-amber-400 text-lg" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{award.name}</h1>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {AWARD_CONFIG[award.slug]?.longDescription || award.description}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>主催: {award.organizer}</span>
          </div>
        </div>

        {/* 統計セクション */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{stats.totalWinners}</p>
            <p className="text-xs text-gray-500 mt-1">掲載作品</p>
          </div>
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{stats.uniqueAuthors}</p>
            <p className="text-xs text-gray-500 mt-1">作家数</p>
          </div>
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-bold text-gray-900 leading-tight">{stats.yearRange}</p>
            <p className="text-xs text-gray-500 mt-1">掲載期間</p>
          </div>
        </div>

        {/* タイプ別件数 */}
        {stats.typeCounts.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-8 text-xs text-gray-500">
            {stats.typeCounts.map((tc) => (
              <span key={tc.type}>
                {tc.type}: <span className="font-bold text-gray-700">{tc.count}件</span>
              </span>
            ))}
          </div>
        )}

        {/* 最多受賞作家 */}
        {topAuthors.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <FaUser className="text-gray-400 text-xs" />
              複数受賞の作家
            </h2>
            <div className="flex flex-wrap gap-2">
              {topAuthors.map((author, i) => {
                const inner = (
                  <>
                    {author.name}
                    <span className="text-xs text-gray-400">{author.count}回</span>
                  </>
                );
                return author.authorId ? (
                  <Link key={i} href={`/authors/${author.authorId}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-150 rounded-full text-sm text-gray-700 hover:border-theater-primary-300 hover:text-theater-primary-600 transition-colors">
                    {inner}
                  </Link>
                ) : (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-150 rounded-full text-sm text-gray-700">
                    {inner}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* 年別受賞一覧 */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400 text-sm" />
            受賞作品一覧
          </h2>
          <div className="space-y-0">
            {displayedYearGroups.map((group) => {
              const mainWinners = group.winners.filter((w) => isWinnerType(w.awardType));
              // Group non-winners by type
              const othersByType = new Map<string, Winner[]>();
              group.winners.forEach((w) => {
                if (!isWinnerType(w.awardType)) {
                  const list = othersByType.get(w.awardType) || [];
                  list.push(w);
                  othersByType.set(w.awardType, list);
                }
              });
              const hasGrandPrize = mainWinners.some((w) => w.awardType === '大賞');

              return (
                <div key={group.year} className="border-b border-gray-100 last:border-b-0 py-3">
                  {/* Year header */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 flex-shrink-0">
                      <span className="text-sm font-bold text-gray-900 tabular-nums">{group.year}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* 受賞 / 大賞 */}
                      {mainWinners.length > 0 ? (
                        <div>
                          {mainWinners.map((winner, idx) => (
                            <WinnerEntry
                              key={`main-${idx}`}
                              winner={winner}
                              showGrandPrize={hasGrandPrize}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic py-1">該当作品なし</p>
                      )}

                      {/* Non-winner sections, each clearly labeled */}
                      {Array.from(othersByType.entries())
                        .sort(([a], [b]) => awardTypeSortOrder(a) - awardTypeSortOrder(b))
                        .map(([type, entries]) => (
                          <div key={type} className="mt-2 pt-2 border-t border-gray-50">
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">
                              {awardTypeGroupLabel(type)}
                            </p>
                            {entries.map((winner, idx) => (
                              <SubEntry key={`sub-${idx}`} winner={winner} />
                            ))}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
            {!showAll && hiddenYearCount > 0 && (
              <div className="text-center pt-6 pb-2">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                >
                  すべて表示する（残り{hiddenYearCount}年分）
                </button>
              </div>
            )}
          </div>
        </div>

        <AdSlot slot={AD_SLOTS.BLOG_AFTER_TOC} format="horizontal" />

        {/* 免責事項 */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 leading-relaxed">
            ※ 受賞情報は各賞の公式発表をもとに編集部が収集・整理したものです。
            当サイトの戯曲データベースに掲載されている作品のみを表示しています。
          </p>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = Object.keys(AWARD_CONFIG);
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const config = AWARD_CONFIG[slug];

  if (!config) {
    return { notFound: true };
  }

  const postAwards = await prisma.postAward.findMany({
    where: { awardName: config.name },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          author: {
            select: { id: true, name: true },
          },
        },
      },
    },
    orderBy: [{ awardYear: 'desc' }],
  });

  const winners: Winner[] = postAwards.map((pa) => ({
    awardYear: pa.awardYear,
    awardType: pa.awardType,
    postId: pa.post?.id ?? null,
    postTitle: pa.post?.title ?? pa.title ?? '（作品名不明）',
    authorId: pa.post?.author?.id ?? null,
    authorName: pa.post?.author?.name ?? pa.authorName ?? '（作者不明）',
  }));

  // 年別グループ化 (sort winners within each year by type)
  const yearMap = new Map<number, Winner[]>();
  winners.forEach((w) => {
    const existing = yearMap.get(w.awardYear) || [];
    existing.push(w);
    yearMap.set(w.awardYear, existing);
  });
  const yearGroups = Array.from(yearMap.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, ws]) => ({
      year,
      winners: ws.sort((a, b) => awardTypeSortOrder(a.awardType) - awardTypeSortOrder(b.awardType)),
    }));

  // 統計
  const uniqueAuthors = new Set(winners.map((w) => w.authorId ?? w.authorName)).size;
  const years = winners.map((w) => w.awardYear);
  const minYear = years.length > 0 ? Math.min(...years) : 0;
  const maxYear = years.length > 0 ? Math.max(...years) : 0;
  const yearRange = minYear && maxYear
    ? minYear === maxYear ? `${minYear}年` : `${minYear}年 - ${maxYear}年`
    : '';

  // タイプ別件数
  const typeCountMap = new Map<string, number>();
  winners.forEach((w) => {
    typeCountMap.set(w.awardType, (typeCountMap.get(w.awardType) || 0) + 1);
  });
  const typeCounts: { type: string; count: number }[] = Array.from(typeCountMap.entries())
    .sort(([a], [b]) => awardTypeSortOrder(a) - awardTypeSortOrder(b))
    .map(([type, count]) => ({ type, count }));

  // 複数受賞の作家（受賞/大賞のみカウント、最終候補は除外）
  const authorCountMap = new Map<string, { name: string; authorId: number | null; count: number }>();
  winners.filter((w) => isWinnerType(w.awardType)).forEach((w) => {
    const key = w.authorId ? String(w.authorId) : w.authorName;
    const existing = authorCountMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      authorCountMap.set(key, { name: w.authorName, authorId: w.authorId, count: 1 });
    }
  });
  const topAuthors: TopAuthor[] = Array.from(authorCountMap.values())
    .filter((v) => v.count >= 2)
    .sort((a, b) => b.count - a.count)
    .map((v) => ({ authorId: v.authorId ?? 0, name: v.name, count: v.count }));

  return {
    props: {
      award: {
        slug,
        name: config.name,
        description: config.description,
        organizer: config.organizer,
      },
      stats: {
        totalWinners: winners.length,
        yearRange,
        uniqueAuthors,
        typeCounts,
      },
      topAuthors,
      yearGroups,
    },
    revalidate: 2592000,
  };
};
