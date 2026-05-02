import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import { prisma } from '@/lib/prisma';
import { FaChevronRight, FaTrophy, FaUser, FaBook, FaCalendarAlt } from 'react-icons/fa';

type Winner = {
  awardYear: number;
  awardType: string;
  postId: number;
  postTitle: string;
  authorId: number;
  authorName: string;
  awardDetail: string | null;
};

type TopAuthor = {
  name: string;
  authorId: number;
  count: number;
};

type Props = {
  award: {
    slug: string;
    name: string;
    description: string;
    organizer: string;
  };
  winners: Winner[];
  stats: {
    totalWinners: number;
    yearRange: string;
    uniqueAuthors: number;
  };
  topAuthors: TopAuthor[];
  yearGroups: { year: number; winners: Winner[] }[];
};

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

export default function AwardDetailPage({ award, winners, stats, topAuthors, yearGroups }: Props) {
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
          { name: '戯曲賞・演劇賞', url: 'https://gikyokutosyokan.com/awards' },
          { name: award.name, url: `https://gikyokutosyokan.com/awards/${award.slug}` },
        ]}
      />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* パンくずリスト */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-theater-primary-600">ホーム</Link>
          <FaChevronRight className="text-[8px]" />
          <Link href="/awards" className="hover:text-theater-primary-600">戯曲賞・演劇賞</Link>
          <FaChevronRight className="text-[8px]" />
          <span className="text-gray-700">{award.name}</span>
        </nav>

        {/* ヒーローセクション */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <FaTrophy className="text-gray-400 text-lg" />
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
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{stats.totalWinners}</p>
            <p className="text-xs text-gray-500 mt-1">受賞記録</p>
          </div>
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{stats.uniqueAuthors}</p>
            <p className="text-xs text-gray-500 mt-1">受賞作家</p>
          </div>
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-bold text-gray-900 leading-tight">{stats.yearRange}</p>
            <p className="text-xs text-gray-500 mt-1">掲載期間</p>
          </div>
        </div>

        {/* 最多受賞作家 */}
        {topAuthors.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <FaUser className="text-gray-400 text-xs" />
              複数受賞の作家
            </h2>
            <div className="flex flex-wrap gap-2">
              {topAuthors.map((author) => (
                <Link
                  key={author.authorId}
                  href={`/authors/${author.authorId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-150 rounded-full text-sm text-gray-700 hover:border-theater-primary-300 hover:text-theater-primary-600 transition-colors"
                >
                  {author.name}
                  <span className="text-xs text-gray-400">{author.count}回</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 年別受賞一覧 */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400 text-sm" />
            受賞作品一覧
          </h2>
          <div className="space-y-1">
            {yearGroups.map((group) => (
              <div key={group.year} className="border-b border-gray-100 last:border-b-0">
                {group.winners.map((winner, idx) => (
                  <div key={`${group.year}-${idx}`} className="flex items-start gap-4 py-3">
                    {/* 年表示（グループ最初のみ） */}
                    <div className="w-14 flex-shrink-0">
                      {idx === 0 ? (
                        <span className="text-sm font-bold text-gray-900 tabular-nums">{group.year}</span>
                      ) : (
                        <span className="text-sm text-gray-300 tabular-nums">{group.year}</span>
                      )}
                    </div>

                    {/* 受賞情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/posts/${winner.postId}`}
                          className="text-sm font-bold text-gray-800 hover:text-theater-primary-600 transition-colors"
                        >
                          {winner.postTitle}
                        </Link>
                        {winner.awardType !== '受賞' && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                            {winner.awardType}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Link
                          href={`/authors/${winner.authorId}`}
                          className="text-xs text-gray-500 hover:text-theater-primary-600 transition-colors"
                        >
                          {winner.authorName}
                        </Link>
                        {winner.awardDetail && (
                          <span className="text-xs text-gray-400">
                            {winner.awardDetail}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 作品リンクアイコン */}
                    <Link
                      href={`/posts/${winner.postId}`}
                      className="flex-shrink-0 text-gray-300 hover:text-theater-primary-500 transition-colors mt-0.5"
                      title="作品ページを見る"
                    >
                      <FaBook className="text-xs" />
                    </Link>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 他の賞へのリンク */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 mb-3">他の戯曲賞・演劇賞</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(AWARD_CONFIG)
              .filter(([slug]) => slug !== award.slug)
              .map(([slug, config]) => (
                <Link
                  key={slug}
                  href={`/awards/${slug}`}
                  className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-600 hover:border-theater-primary-300 hover:text-theater-primary-600 transition-colors"
                >
                  {config.name}
                </Link>
              ))}
          </div>
        </div>

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
    postId: pa.post.id,
    postTitle: pa.post.title,
    authorId: pa.post.author.id,
    authorName: pa.post.author.name,
    awardDetail: null,
  }));

  // 年別グループ化
  const yearMap = new Map<number, Winner[]>();
  winners.forEach((w) => {
    const existing = yearMap.get(w.awardYear) || [];
    existing.push(w);
    yearMap.set(w.awardYear, existing);
  });
  const yearGroups = Array.from(yearMap.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, ws]) => ({ year, winners: ws }));

  // 統計
  const uniqueAuthors = new Set(winners.map((w) => w.authorId)).size;
  const years = winners.map((w) => w.awardYear);
  const minYear = years.length > 0 ? Math.min(...years) : 0;
  const maxYear = years.length > 0 ? Math.max(...years) : 0;
  const yearRange = minYear && maxYear
    ? minYear === maxYear ? `${minYear}年` : `${minYear}年 - ${maxYear}年`
    : '';

  // 複数受賞の作家
  const authorCountMap = new Map<number, { name: string; count: number }>();
  winners.forEach((w) => {
    const existing = authorCountMap.get(w.authorId);
    if (existing) {
      existing.count++;
    } else {
      authorCountMap.set(w.authorId, { name: w.authorName, count: 1 });
    }
  });
  const topAuthors: TopAuthor[] = Array.from(authorCountMap.entries())
    .filter(([, v]) => v.count >= 2)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([authorId, v]) => ({ authorId, name: v.name, count: v.count }));

  return {
    props: {
      award: {
        slug,
        name: config.name,
        description: config.description,
        organizer: config.organizer,
      },
      winners,
      stats: {
        totalWinners: winners.length,
        yearRange,
        uniqueAuthors,
      },
      topAuthors,
      yearGroups,
    },
    revalidate: 86400,
  };
};
