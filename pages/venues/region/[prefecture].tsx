import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import { prisma } from '@/lib/prisma';
import { FaChevronRight, FaMapMarkerAlt, FaUsers, FaExternalLinkAlt, FaGlobe } from 'react-icons/fa';

const TYPE_LABELS: Record<string, string> = {
  small: '小劇場', medium: '中劇場', large: '大劇場',
};
const TYPE_COLORS: Record<string, string> = {
  small: 'bg-blue-500', medium: 'bg-green-500', large: 'bg-purple-500',
};
const TYPE_BADGE_COLORS: Record<string, string> = {
  small: 'bg-blue-50 text-blue-700', medium: 'bg-green-50 text-green-700', large: 'bg-purple-50 text-purple-700',
};

// 都道府県名 → URLスラッグ
const PREFECTURE_SLUG_MAP: Record<string, string> = {
  '北海道': 'hokkaido', '青森県': 'aomori', '岩手県': 'iwate', '宮城県': 'miyagi',
  '秋田県': 'akita', '山形県': 'yamagata', '福島県': 'fukushima',
  '茨城県': 'ibaraki', '栃木県': 'tochigi', '群馬県': 'gunma',
  '埼玉県': 'saitama', '千葉県': 'chiba', '東京都': 'tokyo', '神奈川県': 'kanagawa',
  '新潟県': 'niigata', '富山県': 'toyama', '石川県': 'ishikawa', '福井県': 'fukui',
  '山梨県': 'yamanashi', '長野県': 'nagano', '岐阜県': 'gifu', '静岡県': 'shizuoka', '愛知県': 'aichi',
  '三重県': 'mie', '滋賀県': 'shiga', '京都府': 'kyoto',
  '大阪府': 'osaka', '兵庫県': 'hyogo', '奈良県': 'nara', '和歌山県': 'wakayama',
  '鳥取県': 'tottori', '島根県': 'shimane', '岡山県': 'okayama',
  '広島県': 'hiroshima', '山口県': 'yamaguchi',
  '徳島県': 'tokushima', '香川県': 'kagawa', '愛媛県': 'ehime', '高知県': 'kochi',
  '福岡県': 'fukuoka', '佐賀県': 'saga', '長崎県': 'nagasaki',
  '熊本県': 'kumamoto', '大分県': 'oita', '宮崎県': 'miyazaki',
  '鹿児島県': 'kagoshima', '沖縄県': 'okinawa',
};

// スラッグ → 都道府県名の逆引き
const SLUG_PREFECTURE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(PREFECTURE_SLUG_MAP).map(([k, v]) => [v, k])
);

// 全47都道府県（getStaticPaths用）
const ALL_PREFECTURES = Object.keys(PREFECTURE_SLUG_MAP);

type VenueItem = {
  id: number;
  name: string;
  slug: string;
  venueType: string;
  capacity: number | null;
  address: string | null;
  website: string | null;
};

type Props = {
  prefecture: string;
  prefectureSlug: string;
  venues: VenueItem[];
  stats: {
    total: number;
    small: number;
    medium: number;
    large: number;
  };
};

function MiniCapacityBar({ capacity, venueType }: { capacity: number | null; venueType: string }) {
  if (!capacity) return null;
  const minLog = Math.log(30);
  const maxLog = Math.log(2500);
  const pct = Math.min(100, Math.max(8, ((Math.log(capacity) - minLog) / (maxLog - minLog)) * 100));
  const color = TYPE_COLORS[venueType] || 'bg-gray-400';
  return (
    <div className="w-16 flex items-center gap-1.5 flex-shrink-0">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-gray-400 tabular-nums">{capacity}</span>
    </div>
  );
}

export default function PrefectureVenues({ prefecture, prefectureSlug, venues, stats }: Props) {
  // Group venues by type
  const grouped: Record<string, VenueItem[]> = { small: [], medium: [], large: [] };
  venues.forEach((v) => {
    if (grouped[v.venueType]) {
      grouped[v.venueType].push(v);
    } else {
      // Fallback for unexpected types
      grouped['small'].push(v);
    }
  });

  const typeOrder = ['small', 'medium', 'large'] as const;

  const pageTitle = `${prefecture}の劇場・ホール一覧`;
  const pageDescription = `${prefecture}にある劇場・ホールを一覧で紹介。小劇場${stats.small}件、中劇場${stats.medium}件、大劇場${stats.large}件、全${stats.total}件の劇場情報を掲載。座席数・住所・公式サイトなど。`;

  // ItemList structured data
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${prefecture}の劇場・ホール`,
    numberOfItems: stats.total,
    itemListElement: venues.slice(0, 50).map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'PerformingArtsTheater',
        name: v.name,
        url: `https://gikyokutosyokan.com/venues/${v.slug}`,
        ...(v.address && {
          address: {
            '@type': 'PostalAddress',
            streetAddress: v.address,
            addressRegion: prefecture,
            addressCountry: 'JP',
          },
        }),
        ...(v.capacity && { maximumAttendeeCapacity: v.capacity }),
      },
    })),
  };

  return (
    <Layout>
      <Seo
        pageTitle={`${pageTitle} | 劇場データベース`}
        pageDescription={pageDescription}
        pagePath={`/venues/region/${prefectureSlug}`}
        pageKeywords={[prefecture, '劇場', 'ホール', '小劇場', '演劇', '劇場一覧', '座席数']}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'ホーム', url: 'https://gikyokutosyokan.com' },
          { name: '劇場データベース', url: 'https://gikyokutosyokan.com/venues' },
          { name: prefecture, url: `https://gikyokutosyokan.com/venues/region/${prefectureSlug}` },
        ]}
      />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      </Head>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4 flex-wrap">
          <Link href="/" className="hover:text-theater-primary-600">ホーム</Link>
          <FaChevronRight className="text-[8px]" />
          <Link href="/venues" className="hover:text-theater-primary-600">劇場データベース</Link>
          <FaChevronRight className="text-[8px]" />
          <span className="text-gray-700">{prefecture}</span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">全{stats.total}件の劇場・ホール</p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
            <span className="text-sm font-bold text-gray-700">{stats.total}</span>
            <span className="text-xs text-gray-500">件</span>
          </div>
          {stats.small > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs text-blue-700 font-bold">小劇場 {stats.small}</span>
            </div>
          )}
          {stats.medium > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-green-700 font-bold">中劇場 {stats.medium}</span>
            </div>
          )}
          {stats.large > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-xs text-purple-700 font-bold">大劇場 {stats.large}</span>
            </div>
          )}
        </div>

        {/* Venue groups by type */}
        {stats.total === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">{prefecture}に登録されている劇場はまだありません。</p>
            <Link href="/venues" className="text-sm text-theater-primary-600 hover:underline mt-2 inline-block">
              全国の劇場一覧へ戻る
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {typeOrder.map((type) => {
              const group = grouped[type];
              if (!group || group.length === 0) return null;
              return (
                <section key={type}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${TYPE_COLORS[type]}`} />
                    <h2 className="text-lg font-bold text-gray-900">
                      {TYPE_LABELS[type]}
                    </h2>
                    <span className="text-xs text-gray-400">({group.length}件)</span>
                  </div>
                  <div className="space-y-1">
                    {group.map((v) => (
                      <div key={v.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className={`w-1.5 self-stretch rounded-full flex-shrink-0 ${TYPE_COLORS[v.venueType] || 'bg-gray-300'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Link href={`/venues/${v.slug}`} className="font-bold text-sm text-gray-900 hover:text-theater-primary-600 truncate">
                              {v.name}
                            </Link>
                          </div>
                          {v.address && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate">
                              <FaMapMarkerAlt className="inline text-[9px] text-gray-300 mr-0.5" />
                              {v.address}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <MiniCapacityBar capacity={v.capacity} venueType={v.venueType} />
                          {v.website && (
                            <a
                              href={v.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-300 hover:text-theater-primary-500 transition-colors"
                              title="公式サイト"
                            >
                              <FaGlobe className="text-xs" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Back link */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link href="/venues" className="text-sm text-theater-primary-600 hover:underline">
            &larr; 全国の劇場データベースに戻る
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = ALL_PREFECTURES.map((pref) => ({
    params: { prefecture: PREFECTURE_SLUG_MAP[pref] },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.prefecture as string;
  const prefecture = SLUG_PREFECTURE_MAP[slug];

  if (!prefecture) {
    return { notFound: true };
  }

  const rawVenues = await prisma.venue.findMany({
    where: { prefecture },
    select: {
      id: true,
      name: true,
      slug: true,
      venueType: true,
      capacity: true,
      address: true,
      website: true,
    },
    orderBy: [{ venueType: 'asc' }, { name: 'asc' }],
  });

  const venues: VenueItem[] = rawVenues.map((v) => ({
    id: v.id,
    name: v.name,
    slug: v.slug,
    venueType: v.venueType,
    capacity: v.capacity,
    address: v.address,
    website: v.website,
  }));

  const stats = {
    total: rawVenues.length,
    small: rawVenues.filter((v) => v.venueType === 'small').length,
    medium: rawVenues.filter((v) => v.venueType === 'medium').length,
    large: rawVenues.filter((v) => v.venueType === 'large').length,
  };

  return {
    props: {
      prefecture,
      prefectureSlug: slug,
      venues,
      stats,
    },
    revalidate: 604800,
  };
};
