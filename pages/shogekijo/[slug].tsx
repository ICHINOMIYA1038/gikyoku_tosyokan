import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import SocialLinks from '@/components/SocialLinks';
import { prisma } from '@/lib/prisma';
import { groupTypeLabels, regionLabels } from '@/lib/university-theater-constants';
import { FaUniversity, FaUsers, FaCalendarAlt, FaChevronRight, FaBook, FaMapMarkerAlt, FaTheaterMasks } from 'react-icons/fa';

type RelatedGroup = {
  name: string;
  slug: string;
  groupType: string;
};

type Props = {
  group: any;
  relatedStudentGroups: RelatedGroup[];
};

export default function ShogekijoDetail({ group, relatedStudentGroups }: Props) {
  if (!group) return null;

  const typeInfo = groupTypeLabels[group.groupType] || { label: group.groupType };
  const prefecture = group.prefecture || group.universities?.[0]?.university.prefecture || '';
  const regionLabel = group.region ? (regionLabels[group.region] || group.region) : '';

  const seoDescription = group.description
    || `「${group.name}」の劇団情報。${prefecture ? `${prefecture}を拠点に活動。` : ''}`;
  const seoKeywords = [
    group.name,
    '小劇場',
    '劇団',
    '演劇',
    prefecture,
    typeInfo.label,
  ].filter(Boolean);

  // JSON-LD 構造化データ
  const sameAs: string[] = [];
  if (group.website) sameAs.push(group.website);
  if (group.twitter) sameAs.push(`https://x.com/${group.twitter}`);
  if (group.instagram) sameAs.push(`https://www.instagram.com/${group.instagram}`);
  if (group.corich) sameAs.push(group.corich);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PerformingGroup',
    name: group.name,
    url: `https://gikyokutosyokan.com/shogekijo/${group.slug}`,
    ...(group.foundedYear && { foundingDate: String(group.foundedYear) }),
    ...(prefecture && { areaServed: prefecture }),
    ...(group.description && { description: group.description }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  return (
    <Layout>
      <Seo
        pageTitle={group.name}
        pageDescription={seoDescription}
        pagePath={`/shogekijo/${group.slug}`}
        pageKeywords={seoKeywords}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className="px-4 py-6 max-w-3xl mx-auto">
        {/* パンくず */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4 flex-wrap">
          <Link href="/" className="hover:text-orange-700">ホーム</Link>
          <FaChevronRight className="text-[8px]" />
          <Link href="/shogekijo" className="hover:text-orange-700">小劇場データベース</Link>
          <FaChevronRight className="text-[8px]" />
          <span className="text-gray-800">{group.name}</span>
        </nav>

        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 md:p-8 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800">
              {group.name}
            </h1>
            <span className="shrink-0 mt-1 px-2 py-0.5 text-xs font-medium rounded bg-white/80 text-gray-700">
              {typeInfo.label}
            </span>
          </div>

          {group.description && (
            <p className="text-sm text-gray-600 mb-4">{group.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {prefecture && (
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-orange-500" />
                <span>{prefecture}{regionLabel ? `（${regionLabel}）` : ''}</span>
              </div>
            )}
            {group.foundedYear && (
              <div className="flex items-center gap-1">
                <FaCalendarAlt className="text-green-500" />
                <span>設立: {group.foundedYear}年</span>
              </div>
            )}
            {group.memberCount && (
              <div className="flex items-center gap-1">
                <FaUsers className="text-blue-500" />
                <span>部員数: {group.memberCount}名</span>
              </div>
            )}
          </div>
        </div>

        {/* 所属大学 */}
        {group.universities && group.universities.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
            <h2 className="font-serif font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
              <FaUniversity className="text-purple-500" />
              所属大学
            </h2>
            <ul className="space-y-2">
              {group.universities.map((u: any, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <Link
                    href={`/universities/${u.university.slug}`}
                    className="text-sm text-orange-700 hover:underline"
                  >
                    {u.university.name}
                  </Link>
                  {u.campus && (
                    <span className="text-xs text-gray-400">({u.campus})</span>
                  )}
                  <span className="text-xs text-gray-400">{u.university.prefecture}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* SNSリンク */}
        {(group.website || group.twitter || group.instagram || group.corich || (group.otherLinks && group.otherLinks.length > 0)) && (
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
            <h2 className="font-serif font-bold text-lg text-gray-800 mb-3">公式リンク</h2>
            <SocialLinks
              website={group.website}
              twitter={group.twitter}
              instagram={group.instagram}
              corich={group.corich}
              otherLinks={group.otherLinks}
            />
          </section>
        )}

        {/* 関連ブログ記事 */}
        {group.blogPostSlug && (
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
            <h2 className="font-serif font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
              <FaBook className="text-orange-500" />
              関連記事
            </h2>
            <Link
              href={`/blog/ja/${group.blogPostSlug}`}
              className="text-sm text-orange-700 hover:underline"
            >
              この劇団が掲載されているブログ記事を読む
            </Link>
          </section>
        )}

        {/* この地域の学生劇団 */}
        {relatedStudentGroups.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
            <h2 className="font-serif font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
              <FaUniversity className="text-purple-500" />
              {prefecture ? `${prefecture}の学生劇団` : 'この地域の学生劇団'}
            </h2>
            <ul className="space-y-2">
              {relatedStudentGroups.map((rg) => {
                const rgType = groupTypeLabels[rg.groupType];
                return (
                  <li key={rg.slug} className="flex items-center gap-2">
                    <FaTheaterMasks className="text-pink-400 text-sm shrink-0" />
                    <Link
                      href={`/theater-groups/${rg.slug}`}
                      className="text-sm text-pink-700 hover:underline flex-1"
                    >
                      {rg.name}
                    </Link>
                    {rgType && (
                      <span className={`px-1.5 py-0.5 text-[10px] rounded shrink-0 ${rgType.color}`}>
                        {rgType.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 pt-3 border-t border-gray-50">
              <Link
                href="/university-theater"
                className="text-xs text-pink-600 hover:text-pink-800 transition-colors"
              >
                大学演劇データベースを見る →
              </Link>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const groups = await prisma.theaterGroup.findMany({
    select: { slug: true },
    where: { isActive: true },
  });

  return {
    paths: groups.map((g) => ({ params: { slug: g.slug } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  const group = await prisma.theaterGroup.findUnique({
    where: { slug },
    include: {
      universities: {
        include: {
          university: {
            select: {
              name: true,
              slug: true,
              universityType: true,
              prefecture: true,
              region: true,
            },
          },
        },
      },
    },
  });

  if (!group) return { notFound: true };

  // 同じ都道府県の学生劇団を取得
  const studentGroupTypes = ['STUDENT', 'INTERCOLLEGE', 'ACADEMIC'];
  let relatedStudentGroups: { name: string; slug: string; groupType: string }[] = [];

  if (group.prefecture) {
    // 直接prefectureフィールドで検索 + 大学経由で検索
    const related = await prisma.theaterGroup.findMany({
      where: {
        isActive: true,
        slug: { not: group.slug },
        groupType: { in: studentGroupTypes as any },
        OR: [
          { prefecture: group.prefecture },
          { universities: { some: { university: { prefecture: group.prefecture } } } },
        ],
      },
      select: { name: true, slug: true, groupType: true },
      orderBy: { name: 'asc' },
      take: 10,
    });
    relatedStudentGroups = related;
  }

  return {
    props: {
      group: JSON.parse(JSON.stringify(group)),
      relatedStudentGroups,
    },
  };
};
