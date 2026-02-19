import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import SocialLinks from '@/components/SocialLinks';
import { prisma } from '@/lib/prisma';
import { generateTheaterGroupDescription } from '@/lib/seoUtils';
import { FaUniversity, FaUsers, FaCalendarAlt, FaChevronRight, FaBook, FaTheaterMasks, FaMapMarkerAlt } from 'react-icons/fa';
import PostCardSmall from '@/components/PostCardSmall';

const groupTypeLabels: Record<string, string> = {
  STUDENT: '学生劇団',
  INTERCOLLEGE: 'インカレ',
  ACADEMIC: '大学学科',
  AMATEUR: '社会人',
  PROFESSIONAL: 'プロ',
  YOUTH: 'ユース',
};

type RelatedGroup = {
  name: string;
  slug: string;
  groupType: string;
};

type Props = {
  group: any;
  relatedShogekijoGroups: RelatedGroup[];
};

export default function TheaterGroupDetail({ group, relatedShogekijoGroups }: Props) {
  if (!group) return null;

  const prefecture = group.universities?.[0]?.university.prefecture || '';
  const typeLabel = groupTypeLabels[group.groupType] || group.groupType;
  const universityNames = group.universities?.map((u: any) => u.university.name) || [];

  const pageDescription = group.description
    || generateTheaterGroupDescription(group)
    || `${group.name}の情報ページ`;

  const pageKeywords = [
    group.name,
    typeLabel,
    '大学演劇',
    '学生劇団',
    ...(prefecture ? [prefecture] : []),
    ...universityNames,
  ];

  // JSON-LD: PerformingGroup
  const sameAs: string[] = [];
  if (group.website) sameAs.push(group.website);
  if (group.twitter) sameAs.push(`https://x.com/${group.twitter}`);
  if (group.instagram) sameAs.push(`https://www.instagram.com/${group.instagram}`);
  if (group.corich) sameAs.push(group.corich);

  const performingGroupJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PerformingGroup',
    name: group.name,
    url: `https://gikyokutosyokan.com/theater-groups/${group.slug}`,
    ...(group.foundedYear && { foundingDate: String(group.foundedYear) }),
    ...(prefecture && { areaServed: prefecture }),
    ...(group.description && { description: group.description }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://gikyokutosyokan.com' },
      { '@type': 'ListItem', position: 2, name: '大学演劇', item: 'https://gikyokutosyokan.com/university-theater' },
      { '@type': 'ListItem', position: 3, name: '劇団一覧', item: 'https://gikyokutosyokan.com/theater-groups' },
      { '@type': 'ListItem', position: 4, name: group.name },
    ],
  };

  return (
    <Layout>
      <Seo
        pageTitle={group.name}
        pageDescription={pageDescription}
        pagePath={`/theater-groups/${group.slug}`}
        pageKeywords={pageKeywords}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'ホーム', url: 'https://gikyokutosyokan.com' },
          { name: '大学演劇', url: 'https://gikyokutosyokan.com/university-theater' },
          { name: '劇団一覧', url: 'https://gikyokutosyokan.com/theater-groups' },
          { name: group.name, url: `https://gikyokutosyokan.com/theater-groups/${group.slug}` },
        ]}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(performingGroupJsonLd) }}
        />
      </Head>

      <div className="px-4 py-6 max-w-3xl mx-auto">
        {/* パンくず */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4 flex-wrap">
          <Link href="/" className="hover:text-pink-700">ホーム</Link>
          <FaChevronRight className="text-[8px]" />
          <Link href="/university-theater" className="hover:text-pink-700">大学演劇</Link>
          <FaChevronRight className="text-[8px]" />
          <Link href="/theater-groups" className="hover:text-pink-700">劇団一覧</Link>
          <FaChevronRight className="text-[8px]" />
          <span className="text-gray-800">{group.name}</span>
        </nav>

        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 md:p-8 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800">
              {group.name}
            </h1>
            <span className="shrink-0 mt-1 px-2 py-0.5 text-xs font-medium rounded bg-white/80 text-gray-700">
              {groupTypeLabels[group.groupType] || group.groupType}
            </span>
          </div>

          {group.description && (
            <p className="text-sm text-gray-600 mb-4">{group.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {group.memberCount && (
              <div className="flex items-center gap-1">
                <FaUsers className="text-blue-500" />
                <span>部員数: {group.memberCount}名</span>
              </div>
            )}
            {group.foundedYear && (
              <div className="flex items-center gap-1">
                <FaCalendarAlt className="text-green-500" />
                <span>設立: {group.foundedYear}年</span>
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
                    className="text-sm text-pink-700 hover:underline"
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

        {/* 上演作品 */}
        {group.posts && group.posts.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
            <h2 className="font-serif font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
              <FaBook className="text-green-500" />
              上演作品
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {group.posts.map((ptg: any) => (
                <PostCardSmall key={ptg.post.id} post={ptg.post} />
              ))}
            </div>
          </section>
        )}

        {/* 関連ブログ記事 */}
        {group.blogPostSlug && (
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
            <h2 className="font-serif font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
              <FaBook className="text-pink-500" />
              関連記事
            </h2>
            <Link
              href={`/blog/ja/${group.blogPostSlug}`}
              className="text-sm text-pink-700 hover:underline"
            >
              この劇団が掲載されているブログ記事を読む
            </Link>
          </section>
        )}

        {/* この地域の小劇場 */}
        {relatedShogekijoGroups.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
            <h2 className="font-serif font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
              <FaTheaterMasks className="text-orange-500" />
              {prefecture ? `${prefecture}の劇団` : 'この地域の劇団'}
            </h2>
            <ul className="space-y-2">
              {relatedShogekijoGroups.map((rg) => (
                <li key={rg.slug} className="flex items-center gap-2">
                  <FaTheaterMasks className="text-orange-400 text-sm shrink-0" />
                  <Link
                    href={`/shogekijo/${rg.slug}`}
                    className="text-sm text-orange-700 hover:underline flex-1"
                  >
                    {rg.name}
                  </Link>
                  <span className="text-[10px] text-gray-400">
                    {groupTypeLabels[rg.groupType] || rg.groupType}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-gray-50">
              <Link
                href="/shogekijo"
                className="text-xs text-orange-600 hover:text-orange-800 transition-colors"
              >
                小劇場データベースを見る →
              </Link>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
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
      posts: {
        include: {
          post: {
            select: {
              id: true,
              title: true,
              image_url: true,
              playtime: true,
              totalNumber: true,
              man: true,
              woman: true,
              author: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!group) return { notFound: true };

  // 同じ都道府県の小劇場劇団を取得（学生系以外）
  const shogekijoGroupTypes = ['AMATEUR', 'PROFESSIONAL', 'YOUTH'];
  let relatedShogekijoGroups: { name: string; slug: string; groupType: string }[] = [];

  const groupPref = group.universities?.[0]?.university.prefecture;
  if (groupPref) {
    const related = await prisma.theaterGroup.findMany({
      where: {
        isActive: true,
        slug: { not: group.slug },
        groupType: { in: shogekijoGroupTypes as any },
        prefecture: groupPref,
      },
      select: { name: true, slug: true, groupType: true },
      orderBy: { name: 'asc' },
      take: 10,
    });
    relatedShogekijoGroups = related;
  }

  return {
    props: {
      group: JSON.parse(JSON.stringify(group)),
      relatedShogekijoGroups,
    },
  };
};
