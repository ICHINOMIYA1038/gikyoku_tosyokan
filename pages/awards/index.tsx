import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import { prisma } from '@/lib/prisma';
import { FaChevronRight, FaTrophy } from 'react-icons/fa';

type AwardSummary = {
  slug: string;
  name: string;
  description: string;
  organizer: string;
  winnerCount: number;
  yearRange: string;
};

type Props = {
  awards: AwardSummary[];
  totalWinners: number;
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

export default function AwardsIndex({ awards, totalWinners }: Props) {
  return (
    <Layout>
      <Seo
        pageTitle="戯曲賞・演劇賞データベース"
        pageDescription={`日本の主要な戯曲賞・演劇賞の受賞作品を網羅。${awards.length}つの賞、${totalWinners}件の受賞記録を掲載。`}
        pagePath="/awards"
        pageKeywords={['戯曲賞', '演劇賞', '岸田國士戯曲賞', '鶴屋南北戯曲賞', '受賞作品', '日本演劇']}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'ホーム', url: 'https://gikyokutosyokan.com' },
          { name: '戯曲賞・演劇賞データベース', url: 'https://gikyokutosyokan.com/awards' },
        ]}
      />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* パンくずリスト */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-theater-primary-600">ホーム</Link>
          <FaChevronRight className="text-[8px]" />
          <span className="text-gray-700">戯曲賞・演劇賞</span>
        </nav>

        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            戯曲賞・演劇賞データベース
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            日本の主要な戯曲賞・演劇賞の受賞作品一覧。{awards.length}つの賞、{totalWinners}件の受賞記録を掲載しています。
          </p>
        </div>

        {/* 賞の一覧 */}
        <div className="space-y-3">
          {awards.map((award) => (
            <Link key={award.slug} href={`/awards/${award.slug}`} className="block group">
              <div className="border border-gray-150 rounded-lg p-5 hover:border-theater-primary-300 hover:shadow-sm transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <FaTrophy className="text-gray-300 group-hover:text-theater-primary-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-base font-bold text-gray-900 group-hover:text-theater-primary-600 transition-colors">
                        {award.name}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{award.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>主催: {award.organizer}</span>
                      <span>{award.winnerCount}件の受賞記録</span>
                      {award.yearRange && <span>{award.yearRange}</span>}
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-300 group-hover:text-theater-primary-400 transition-colors flex-shrink-0 mt-1.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

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
  const postAwards = await prisma.postAward.groupBy({
    by: ['awardName'],
    _count: true,
    _min: { awardYear: true },
    _max: { awardYear: true },
  });

  const awards: AwardSummary[] = postAwards
    .map((pa) => {
      const meta = AWARD_METADATA[pa.awardName];
      if (!meta) return null;
      const minYear = pa._min.awardYear;
      const maxYear = pa._max.awardYear;
      const yearRange = minYear && maxYear
        ? minYear === maxYear ? `${minYear}年` : `${minYear}年 - ${maxYear}年`
        : '';
      return {
        slug: meta.slug,
        name: pa.awardName,
        description: meta.description,
        organizer: meta.organizer,
        winnerCount: pa._count,
        yearRange,
      };
    })
    .filter((a): a is AwardSummary => a !== null)
    .sort((a, b) => b.winnerCount - a.winnerCount);

  const totalWinners = awards.reduce((sum, a) => sum + a.winnerCount, 0);

  return {
    props: { awards, totalWinners },
    revalidate: 86400,
  };
};
