import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import SocialLinks from '@/components/SocialLinks';
import { prisma } from '@/lib/prisma';
import { FaUniversity, FaUsers, FaCalendarAlt, FaChevronRight, FaBook, FaTheaterMasks, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';

const venueTypeLabels: Record<string, string> = {
  small: '小劇場', medium: '中劇場', large: '大劇場',
  SMALL: '小劇場', MEDIUM: '中劇場', LARGE: '大劇場',
  outdoor: '野外', other: 'その他',
};
const venueTypeColors: Record<string, string> = {
  small: 'bg-blue-100 text-blue-700', medium: 'bg-green-100 text-green-700', large: 'bg-purple-100 text-purple-700',
  SMALL: 'bg-blue-100 text-blue-700', MEDIUM: 'bg-green-100 text-green-700', LARGE: 'bg-purple-100 text-purple-700',
  outdoor: 'bg-yellow-100 text-yellow-700', other: 'bg-gray-100 text-gray-700',
};

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

type ActiveVenue = {
  id: number;
  name: string;
  slug: string;
  venueType: string;
  prefecture: string;
  performanceCount: number;
};

type Props = {
  group: any;
  relatedShogekijoGroups: RelatedGroup[];
  activeVenues: ActiveVenue[];
};

export default function TheaterGroupDetail({ group, relatedShogekijoGroups, activeVenues }: Props) {
  if (!group) return null;

  const prefecture = group.universities?.[0]?.university.prefecture || '';
  const isUniversity = ['STUDENT', 'INTERCOLLEGE', 'ACADEMIC'].includes(group.groupType);

  return (
    <Layout>
      <Seo
        pageTitle={group.name}
        pageDescription={group.description || `${group.name}の情報ページ`}
        pagePath={`/theater-groups/${group.slug}`}
        pageKeywords={[isUniversity ? '大学演劇' : '劇団', group.name]}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'ホーム', url: 'https://gikyokutosyokan.com' },
          ...(isUniversity
            ? [{ name: '大学演劇', url: 'https://gikyokutosyokan.com/university-theater' }]
            : []),
          { name: '劇団データベース', url: 'https://gikyokutosyokan.com/theater-groups' },
          { name: group.name, url: `https://gikyokutosyokan.com/theater-groups/${group.slug}` },
        ]}
      />

      <div className="px-4 py-6 max-w-3xl mx-auto">
        {/* パンくず */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4 flex-wrap">
          <Link href="/" className="hover:text-theater-primary-700">ホーム</Link>
          <FaChevronRight className="text-[8px]" />
          {isUniversity && (
            <>
              <Link href="/university-theater" className="hover:text-theater-primary-700">大学演劇</Link>
              <FaChevronRight className="text-[8px]" />
            </>
          )}
          <Link href="/theater-groups" className="hover:text-theater-primary-700">劇団データベース</Link>
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
                    className="text-sm text-theater-primary-700 hover:underline"
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
              <FaBook className="text-theater-primary-500" />
              関連記事
            </h2>
            <Link
              href={`/blog/ja/${group.blogPostSlug}`}
              className="text-sm text-theater-primary-700 hover:underline"
            >
              この劇団が掲載されているブログ記事を読む
            </Link>
          </section>
        )}

        {/* 活動劇場 */}
        {activeVenues && activeVenues.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
            <h2 className="font-serif font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
              <FaBuilding className="text-indigo-500" />
              活動劇場
            </h2>
            <ul className="space-y-2">
              {activeVenues.map((v) => (
                <li key={v.id} className="flex items-center gap-2">
                  <Link
                    href={`/venues/${v.slug}`}
                    className="text-sm text-theater-primary-700 hover:underline flex-1"
                  >
                    {v.name}
                  </Link>
                  <span className="text-xs text-gray-400">{v.prefecture}</span>
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${venueTypeColors[v.venueType] || 'bg-gray-100 text-gray-700'}`}>
                    {venueTypeLabels[v.venueType] || v.venueType}
                  </span>
                  <span className="text-xs text-gray-500">{v.performanceCount}公演</span>
                </li>
              ))}
            </ul>
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
  const groups = await prisma.theaterGroup.findMany({
    where: { groupType: { in: ['STUDENT', 'INTERCOLLEGE', 'ACADEMIC'] as any } },
    select: { slug: true },
  });
  return {
    paths: [],
    fallback: "blocking",
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

  // 活動劇場を取得（PostTheaterGroup + VenuePerformance から集約）
  const [postVenues, venuePerformances] = await Promise.all([
    prisma.postTheaterGroup.findMany({
      where: { theaterGroupId: group.id, venueId: { not: null } },
      select: {
        venue: { select: { id: true, name: true, slug: true, venueType: true, prefecture: true } },
      },
    }),
    prisma.venuePerformance.findMany({
      where: { theaterGroupId: group.id },
      select: {
        venue: { select: { id: true, name: true, slug: true, venueType: true, prefecture: true } },
      },
    }),
  ]);

  // Combine and count performances per venue
  const venueCountMap = new Map<number, { venue: { id: number; name: string; slug: string; venueType: string; prefecture: string }; count: number }>();
  for (const pv of postVenues) {
    if (!pv.venue) continue;
    const entry = venueCountMap.get(pv.venue.id);
    if (entry) { entry.count++; } else { venueCountMap.set(pv.venue.id, { venue: pv.venue, count: 1 }); }
  }
  for (const vp of venuePerformances) {
    const entry = venueCountMap.get(vp.venue.id);
    if (entry) { entry.count++; } else { venueCountMap.set(vp.venue.id, { venue: vp.venue, count: 1 }); }
  }

  const activeVenues: ActiveVenue[] = Array.from(venueCountMap.values())
    .sort((a, b) => b.count - a.count)
    .map(({ venue, count }) => ({
      id: venue.id,
      name: venue.name,
      slug: venue.slug,
      venueType: venue.venueType,
      prefecture: venue.prefecture,
      performanceCount: count,
    }));

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
      activeVenues,
    },
    // 劇団情報は参考資料的で更新頻度低い。7日に延長してISR Writes削減。
    revalidate: 604800,
  };
};
