import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import { prisma } from '@/lib/prisma';
import { FaChevronRight, FaTrophy } from 'react-icons/fa';
import AdSlot from '@/components/Ad/AdSlot';
import { AD_SLOTS } from '@/lib/adSlots';

type LatestWinner = {
  awardYear: number;
  postId: number;
  postTitle: string;
  authorName: string;
};

type AwardSummary = {
  slug: string;
  name: string;
  description: string;
  organizer: string;
  winnerCount: number;
  finalistCount: number;
  otherCount: number;
  yearRange: string;
  latestWinner: LatestWinner | null;
};

type Props = {
  awards: AwardSummary[];
  totalRecords: number;
};

const AWARD_METADATA: Record<string, { slug: string; description: string; organizer: string }> = {
  '岸田國士戯曲賞': {
    slug: 'kishida',
    description: '新人劇作家の登竜門として最も権威ある戯曲賞。白水社主催。1955年創設。',
    organizer: '白水社',
  },
  '鶴屋南北戯曲賞': {
    slug: 'tsuruyaNanboku',
    description: '優れた戯曲作品に贈られる賞。光文文化財団主催。1997年創設。',
    organizer: '公益財団法人光文文化財団',
  },
  '日本劇作家協会新人戯曲賞': {
    slug: 'gekisakka-shinjin',
    description: '新人劇作家の発掘・育成を目的とした賞。日本劇作家協会主催。1996年創設。',
    organizer: '日本劇作家協会',
  },
  'OMS戯曲賞': {
    slug: 'oms',
    description: '大阪を拠点とする戯曲賞。関西の演劇シーンを支える重要な賞。',
    organizer: '大阪ガスネットワーク',
  },
  '読売演劇大賞': {
    slug: 'yomiuri',
    description: '読売新聞社が主催する総合的な演劇賞。作品賞・演出家賞・男優賞・女優賞など複数部門。',
    organizer: '読売新聞社',
  },
  'AAF戯曲賞': {
    slug: 'aaf',
    description: '愛知県芸術劇場が主催する戯曲賞。新しい演劇表現の可能性を追求する作品を対象。',
    organizer: '愛知県芸術劇場',
  },
};

// Fixed display order
const AWARD_ORDER = [
  '岸田國士戯曲賞',
  '鶴屋南北戯曲賞',
  '日本劇作家協会新人戯曲賞',
  'OMS戯曲賞',
  '読売演劇大賞',
  'AAF戯曲賞',
];

export default function AwardsIndex({ awards, totalRecords }: Props) {
  return (
    <Layout>
      <Seo
        pageTitle="戯曲賞データベース"
        pageDescription={`日本の主要な戯曲賞・演劇賞の受賞作品を網羅。${awards.length}つの賞、${totalRecords}件の記録を掲載。`}
        pagePath="/awards"
        pageKeywords={['戯曲賞', '演劇賞', '岸田國士戯曲賞', '鶴屋南北戯曲賞', '受賞作品', '日本演劇']}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'ホーム', url: 'https://gikyokutosyokan.com' },
          { name: '戯曲賞データベース', url: 'https://gikyokutosyokan.com/awards' },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        title="戯曲賞データベース"
        description={`日本の主要な戯曲賞・演劇賞の受賞作品を網羅。${awards.length}つの賞、${totalRecords}件の記録を掲載。`}
        url="https://gikyokutosyokan.com/awards"
        numberOfItems={totalRecords}
        collectionItems={awards.map(a => ({
          name: a.name,
          url: `https://gikyokutosyokan.com/awards/${a.slug}`,
          description: a.description,
        }))}
      />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* パンくずリスト */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-theater-primary-600">ホーム</Link>
          <FaChevronRight className="text-[8px]" />
          <span className="text-gray-700">戯曲賞データベース</span>
        </nav>

        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            戯曲賞データベース
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            日本の主要な戯曲賞・演劇賞の受賞作品一覧。{awards.length}つの賞、{totalRecords}件の記録を掲載しています。
          </p>
        </div>

        {/* 賞の一覧 */}
        <div className="space-y-4">
          {awards.map((award) => (
            <Link key={award.slug} href={`/awards/${award.slug}`} className="block group">
              <div className="border border-gray-150 rounded-lg p-5 hover:border-theater-primary-300 hover:shadow-sm transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <FaTrophy className="text-amber-300 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-base font-bold text-gray-900 group-hover:text-theater-primary-600 transition-colors">
                        {award.name}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{award.description}</p>

                    {/* Type-split counts */}
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                      <span>主催: {award.organizer}</span>
                      {award.yearRange && <span>{award.yearRange}</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-amber-700">受賞: {award.winnerCount}件</span>
                      {award.finalistCount > 0 && (
                        <span className="text-gray-400">最終候補: {award.finalistCount}件</span>
                      )}
                      {award.otherCount > 0 && (
                        <span className="text-gray-400">その他: {award.otherCount}件</span>
                      )}
                    </div>

                    {/* Latest winner */}
                    {award.latestWinner && (
                      <div className="mt-3 pt-2 border-t border-gray-50">
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">最新の受賞</p>
                        <p className="text-xs text-gray-600">
                          <span className="tabular-nums">{award.latestWinner.awardYear}年</span>
                          {' '}
                          <span className="font-medium text-gray-700">{award.latestWinner.postTitle}</span>
                          {' '}
                          <span className="text-gray-400">{award.latestWinner.authorName}</span>
                        </p>
                      </div>
                    )}
                  </div>
                  <FaChevronRight className="text-gray-300 group-hover:text-theater-primary-400 transition-colors flex-shrink-0 mt-1.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <AdSlot slot={AD_SLOTS.CATEGORY_AFTER_LIST} format="horizontal" />

        {/* フッター説明 */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 leading-relaxed">
            ※ 当サイトに掲載されている受賞情報は、各賞の公式発表をもとに編集部が独自に収集・整理したものです。
            掲載内容の正確性には万全を期しておりますが、最新の情報は各賞の公式サイトをご確認ください。
          </p>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // Fetch all post awards with post info for latest winner display
  const allPostAwards = await prisma.postAward.findMany({
    include: {
      post: {
        select: {
          id: true,
          title: true,
          author: { select: { name: true } },
        },
      },
    },
    orderBy: { awardYear: 'desc' },
  });

  // Group by award name
  const awardMap = new Map<string, typeof allPostAwards>();
  allPostAwards.forEach((pa) => {
    const list = awardMap.get(pa.awardName) || [];
    list.push(pa);
    awardMap.set(pa.awardName, list);
  });

  const awards: AwardSummary[] = AWARD_ORDER
    .map((awardName) => {
      const meta = AWARD_METADATA[awardName];
      const entries = awardMap.get(awardName);
      if (!meta || !entries || entries.length === 0) return null;

      const winnerEntries = entries.filter((e) => e.awardType === '受賞' || e.awardType === '大賞');
      const finalistEntries = entries.filter((e) => e.awardType === '最終候補');
      const otherEntries = entries.filter(
        (e) => e.awardType !== '受賞' && e.awardType !== '大賞' && e.awardType !== '最終候補'
      );

      const years = entries.map((e) => e.awardYear);
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      const yearRange = minYear === maxYear ? `${minYear}年` : `${minYear}年 - ${maxYear}年`;

      // Latest actual winner (not finalist)
      const latestWinnerEntry = winnerEntries.length > 0 ? winnerEntries[0] : null;
      const latestWinner: LatestWinner | null = latestWinnerEntry
        ? {
            awardYear: latestWinnerEntry.awardYear,
            postId: latestWinnerEntry.post?.id ?? 0,
            postTitle: latestWinnerEntry.post?.title ?? latestWinnerEntry.title ?? '',
            authorName: latestWinnerEntry.post?.author?.name ?? latestWinnerEntry.authorName ?? '',
          }
        : null;

      return {
        slug: meta.slug,
        name: awardName,
        description: meta.description,
        organizer: meta.organizer,
        winnerCount: winnerEntries.length,
        finalistCount: finalistEntries.length,
        otherCount: otherEntries.length,
        yearRange,
        latestWinner,
      };
    })
    .filter((a): a is AwardSummary => a !== null);

  const totalRecords = allPostAwards.length;

  return {
    props: { awards, totalRecords },
    revalidate: 2592000,
  };
};
