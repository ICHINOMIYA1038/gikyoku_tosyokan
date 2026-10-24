import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import SocialLinks from '@/components/SocialLinks';
import { prisma } from '@/lib/prisma';
import Breadcrumb from '@/components/Breadcrumb';

const venueTypeLabels: Record<string, string> = {
  small: '小劇場', medium: '中劇場', large: '大劇場',
  SMALL: '小劇場', MEDIUM: '中劇場', LARGE: '大劇場',
  outdoor: '野外', other: 'その他',
};

const groupTypeLabels: Record<string, string> = {
  STUDENT: '学生劇団',
  INTERCOLLEGE: 'インカレ',
  ACADEMIC: '大学学科',
  AMATEUR: '社会人',
  PROFESSIONAL: 'プロ',
  YOUTH: 'ユース',
};

// 全体の h2 の余白と大きさ（globals.css）を打ち消す
const SECTION_TITLE = '!my-0 !pb-0 !text-lg !font-bold !text-gray-900';

const SpecRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-baseline gap-2 py-1">
    <dt className="text-gray-600 flex-shrink-0">{label}</dt>
    <span className="flex-1 border-b border-dotted border-gray-400 translate-y-[-4px]" aria-hidden="true" />
    <dd className="text-gray-900 text-right">{children}</dd>
  </div>
);

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

      <div className="max-w-3xl mx-auto pt-6 md:pt-8 pb-12 [&>section:last-child]:border-b-0">
        <Breadcrumb
          items={[
            { name: 'ホーム', href: '/' },
            ...(isUniversity ? [{ name: '大学演劇', href: '/university-theater' }] : []),
            { name: '劇団データベース', href: '/theater-groups' },
            { name: group.name },
          ]}
        />

        <header className="border-b border-[#D9D5CF] pb-6">
          <p className="text-sm text-gray-600">
            {[groupTypeLabels[group.groupType] || group.groupType, prefecture || group.prefecture].filter(Boolean).join('　/　')}
          </p>
          <h1 className="mt-1 text-[28px] md:text-[36px] font-serif font-bold text-gray-900 leading-tight">{group.name}</h1>
          {group.description && <p className="mt-4 text-base leading-relaxed text-gray-800">{group.description}</p>}

          {(group.foundedYear || group.memberCount || group.universities?.length > 0) && (
            <dl className="mt-5 max-w-md text-sm">
              {group.foundedYear && <SpecRow label="設立">{group.foundedYear}年</SpecRow>}
              {group.memberCount && <SpecRow label="部員数">{group.memberCount}名</SpecRow>}
              {group.universities?.length > 0 && (
                <SpecRow label="所属大学">
                  {group.universities.map((u: any, i: number) => (
                    <span key={i}>
                      {i > 0 && '、'}
                      <Link href={`/universities/${u.university.slug}`} className="text-theater-primary-700 hover:underline">
                        {u.university.name}
                      </Link>
                      {u.campus && `（${u.campus}）`}
                    </span>
                  ))}
                </SpecRow>
              )}
            </dl>
          )}

          {(group.website || group.twitter || group.instagram || group.corich || (group.otherLinks && group.otherLinks.length > 0)) && (
            <div className="mt-5">
              <SocialLinks
                website={group.website}
                twitter={group.twitter}
                instagram={group.instagram}
                corich={group.corich}
                otherLinks={group.otherLinks}
              />
            </div>
          )}
        </header>

        {/* 劇団の人に、告知と募集を書いてもらう入口 */}
        <section className="py-6 border-b border-[#D9D5CF]">
          <h2 className={SECTION_TITLE}>この劇団の方へ</h2>
          <p className="mt-2 text-sm text-gray-700">公演の告知や、劇団員・スタッフの募集を無料で載せられます。</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/announcements/new" className="inline-flex items-center h-11 px-5 rounded bg-theater-primary-600 hover:bg-theater-primary-700 text-white text-sm font-bold">
              公演を告知する
            </Link>
            <Link href="/recruit/new" className="inline-flex items-center h-11 px-5 rounded border border-theater-primary-600 text-theater-primary-700 text-sm font-bold hover:bg-theater-primary-50">
              劇団員を募集する
            </Link>
            <Link href="/support/posting-request" className="inline-flex items-center h-11 px-2 text-sm text-gray-700 underline underline-offset-4 hover:text-gray-900">
              情報の修正を依頼する
            </Link>
          </div>
        </section>

        {activeVenues && activeVenues.length > 0 && (
          <section className="py-6 border-b border-[#D9D5CF]">
            <h2 className={SECTION_TITLE}>公演実績のある劇場</h2>
            <ul className="mt-3 border-t border-[#D9D5CF]">
              {activeVenues.map((v) => (
                <li key={v.id} className="border-b border-[#D9D5CF]">
                  <Link href={`/venues/${v.slug}`} className="group flex items-baseline gap-3 py-3 px-2 hover:bg-[#F4F2EE]">
                    <span className="flex-1 font-medium text-gray-900 group-hover:text-theater-primary-700">{v.name}</span>
                    <span className="text-sm text-gray-600">{[v.prefecture, venueTypeLabels[v.venueType] || v.venueType].filter(Boolean).join('・')}</span>
                    <span className="w-14 text-right text-sm text-gray-600 tabular-nums">{v.performanceCount}公演</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {group.blogPostSlug && (
          <section className="py-6 border-b border-[#D9D5CF]">
            <h2 className={SECTION_TITLE}>関連記事</h2>
            <Link href={`/blog/ja/${group.blogPostSlug}`} className="mt-2 inline-block text-sm text-theater-primary-700 hover:underline">
              この劇団が載っているブログ記事を読む
            </Link>
          </section>
        )}

        {relatedShogekijoGroups.length > 0 && (
          <section className="py-6">
            <h2 className={SECTION_TITLE}>{prefecture ? `${prefecture}の劇団` : 'この地域の劇団'}</h2>
            <ul className="mt-3 border-t border-[#D9D5CF]">
              {relatedShogekijoGroups.map((rg) => (
                <li key={rg.slug} className="border-b border-[#D9D5CF]">
                  <Link href={`/shogekijo/${rg.slug}`} className="group flex items-baseline gap-3 py-3 px-2 hover:bg-[#F4F2EE]">
                    <span className="flex-1 font-serif font-bold text-gray-900 group-hover:text-theater-primary-700">{rg.name}</span>
                    <span className="text-sm text-gray-600">{groupTypeLabels[rg.groupType] || rg.groupType}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/shogekijo" className="mt-3 inline-block text-sm text-theater-primary-700 hover:underline">
              小劇場データベースを見る
            </Link>
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
    revalidate: 2592000,
  };
};
