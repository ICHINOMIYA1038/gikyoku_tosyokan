import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import { prisma } from '@/lib/prisma';
import Breadcrumb from '@/components/Breadcrumb';
import { performanceDateParts } from '@/lib/date-format';

const venueTypeLabels: Record<string, string> = {
  small: '小劇場', medium: '中劇場', large: '大劇場',
  SMALL: '小劇場', MEDIUM: '中劇場', LARGE: '大劇場',
};

type NearbyVenue = { name: string; slug: string; venueType: string; capacity: number | null; distance: number | null };
type AnnouncementItem = { id: number; title: string; performanceDate: string | null; theaterGroupName: string | null; post: { id: number; title: string } | null };
type PerformanceItem = {
  performanceYear: number | null;
  sourceUrl: string | null;
  post: { id: number; title: string; author: { name: string } } | null;
  theaterGroup: { name: string; slug: string } | null;
  // VenuePerformance用フィールド
  title?: string;
  artistName?: string | null;
  performanceType?: string;
  description?: string | null;
};
type TheaterGroupItem = { name: string; slug: string; groupType: string };

type Props = {
  venue: {
    id: number; name: string; slug: string; venueType: string; capacity: number | null;
    prefecture: string | null; address: string | null; website: string | null;
    twitter: string | null; description: string | null; latitude: number | null; longitude: number | null;
  };
  nearbyVenues: NearbyVenue[];
  announcements: AnnouncementItem[];
  performances: PerformanceItem[];
  theaterGroups: TheaterGroupItem[];
};

const groupTypeLabelsShort: Record<string, string> = {
  PROFESSIONAL: 'プロ', AMATEUR: '社会人', STUDENT: '学生',
  INTERCOLLEGE: 'インカレ', ACADEMIC: '大学学科', YOUTH: 'ユース',
};

// 全体の h2 の余白と大きさ（globals.css）を打ち消す
const SECTION_TITLE = '!my-0 !pb-0 !text-lg !font-bold !text-gray-900';
const ROW = 'group flex flex-wrap items-baseline gap-x-3 py-3 px-1 hover:bg-[#F4F2EE]';

function SpecRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 py-3 px-1 border-b border-[#D9D5CF]">
      <dt className="text-sm text-gray-600">{label}</dt>
      <dd className="text-base text-gray-900 break-words">{children}</dd>
    </div>
  );
}

// 劇場の規模に応じた補足情報を生成
function getVenueInsight(venue: Props['venue']): string[] {
  const insights: string[] = [];
  const cap = venue.capacity || 0;
  const type = venue.venueType;

  if (type === 'small' || cap <= 200) {
    insights.push('客席と舞台の距離が近く、役者の表情や息遣いまで伝わる親密な空間です。');
    if (cap <= 100) {
      insights.push('少人数での公演やワークショップ、リーディング公演に適しています。');
    } else {
      insights.push('小〜中規模の劇団公演やプロデュース公演に適したサイズです。');
    }
  } else if (type === 'medium' || (cap > 200 && cap <= 800)) {
    insights.push('演劇からミュージカルまで幅広いジャンルの公演に対応できる規模です。');
    insights.push('照明・音響設備が充実しており、本格的な舞台演出が可能です。');
  } else {
    insights.push('大規模な演劇公演やミュージカル、コンサートに対応する本格的な劇場です。');
    insights.push('プロの劇団や商業公演が中心に行われています。');
  }

  return insights;
}

export default function VenueDetail({ venue, nearbyVenues, announcements, performances, theaterGroups }: Props) {
  if (!venue) return null;

  const typeLabel = venueTypeLabels[venue.venueType] || venue.venueType;
  const insights = getVenueInsight(venue);
  const hasCoords = venue.latitude !== null && venue.longitude !== null;
  const mapQuery = encodeURIComponent(venue.name + ' ' + (venue.address || venue.prefecture || ''));
  const mapSrc = hasCoords
    ? `https://maps.google.com/maps?q=${venue.latitude},${venue.longitude}&z=16&output=embed&hl=ja`
    : `https://www.google.com/maps?q=${mapQuery}&output=embed&hl=ja`;
  const mapLink = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const twitterUrl = venue.twitter
    ? (venue.twitter.startsWith('http') ? venue.twitter : `https://twitter.com/${venue.twitter.replace('@', '')}`)
    : null;

  const placeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PerformingArtsTheater',
    name: venue.name,
    ...(venue.description && { description: venue.description }),
    ...(venue.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: venue.address,
        addressRegion: venue.prefecture || undefined,
        addressCountry: 'JP',
      },
    }),
    ...(venue.latitude && venue.longitude && {
      geo: { '@type': 'GeoCoordinates', latitude: venue.latitude, longitude: venue.longitude },
    }),
    ...(venue.capacity && { maximumAttendeeCapacity: venue.capacity }),
    ...(venue.website && { url: venue.website }),
    image: 'https://gikyokutosyokan.com/logo.png',
    ...(twitterUrl && { sameAs: [twitterUrl] }),
  };

  // 住所からエリア名を抽出（例: "世田谷区北沢2-10-15" → "世田谷区"）
  const areaMatch = venue.address?.match(/^(.+?[区市町村])/);
  const areaName = areaMatch ? areaMatch[1] : null;
  const locationLabel = areaName ? `${venue.prefecture}・${areaName}` : venue.prefecture || '';

  return (
    <Layout>
      <Seo
        pageTitle={`${venue.name}（${locationLabel}）| 劇場データベース`}
        pageDescription={
          venue.description
            ? `${venue.description} ${venue.capacity ? `座席数${venue.capacity}席。` : ''}${venue.prefecture}の${typeLabel}。アクセス・地図・上演実績など。`
            : `${venue.name}は${locationLabel}にある${typeLabel}です。${venue.capacity ? `座席数${venue.capacity}席。` : ''}アクセス・地図・施設情報・上演実績をご紹介。`
        }
        pagePath={`/venues/${venue.slug}`}
        pageKeywords={[venue.name, typeLabel, venue.prefecture || '', areaName || '', '劇場', '演劇', 'ホール', 'アクセス', '座席数'].filter(Boolean)}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'ホーム', url: 'https://gikyokutosyokan.com' },
          { name: '劇場データベース', url: 'https://gikyokutosyokan.com/venues' },
          { name: venue.name, url: `https://gikyokutosyokan.com/venues/${venue.slug}` },
        ]}
      />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd) }} />
      </Head>

      <div className="max-w-3xl mx-auto pt-6 md:pt-8 pb-12 [&>section]:pt-8 [&>section]:mt-8 [&>section]:border-t [&>section]:border-[#D9D5CF]">
        <Breadcrumb items={[{ name: 'ホーム', href: '/' }, { name: '劇場データベース', href: '/venues' }, { name: venue.name }]} />

        <header>
          <p className="text-sm text-gray-600">{[typeLabel, locationLabel].filter(Boolean).join('　/　')}</p>
          <h1 className="mt-1 text-[26px] md:text-[34px] font-serif font-bold text-gray-900 leading-snug">{venue.name}</h1>
          <div className="mt-4 text-base leading-relaxed text-gray-800 space-y-2">
            {venue.description && <p>{venue.description}</p>}
            {insights.map((text, i) => (
              <p key={i} className={venue.description ? 'text-gray-600' : ''}>{text}</p>
            ))}
          </div>

          <dl className="mt-6 border-t border-[#D9D5CF]">
            {venue.capacity && <SpecRow label="座席数">{venue.capacity.toLocaleString()}席（{typeLabel}）</SpecRow>}
            {venue.address && <SpecRow label="住所">{venue.prefecture} {venue.address}</SpecRow>}
            {(venue.website || twitterUrl) && (
              <SpecRow label="公式">
                <span className="flex flex-wrap gap-x-4">
                  {venue.website && (
                    <a href={venue.website} target="_blank" rel="noopener noreferrer" className="text-theater-primary-700 underline underline-offset-4">公式サイト</a>
                  )}
                  {twitterUrl && (
                    <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-theater-primary-700 underline underline-offset-4">X（Twitter）</a>
                  )}
                </span>
              </SpecRow>
            )}
          </dl>

          <p className="mt-4 text-sm text-gray-600">
            共有する：
            <a className="ml-1 underline underline-offset-4 hover:text-gray-900" target="_blank" rel="noopener noreferrer"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${venue.name}（${venue.prefecture}）- 劇場データベース｜戯曲図書館`)}&url=${encodeURIComponent(`https://gikyokutosyokan.com/venues/${venue.slug}`)}`}>X</a>
            <span className="mx-2">・</span>
            <a className="underline underline-offset-4 hover:text-gray-900" target="_blank" rel="noopener noreferrer"
              href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(`https://gikyokutosyokan.com/venues/${venue.slug}`)}`}>LINE</a>
          </p>
        </header>

        {(venue.address || venue.prefecture) && (
          <section>
            <h2 className={SECTION_TITLE}>地図</h2>
            <div className="mt-3 border border-[#D9D5CF]">
              <iframe
                src={mapSrc}
                width="100%" height="300" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title={`${venue.name}の地図`}
              />
            </div>
            <a href={mapLink} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-theater-primary-700 underline underline-offset-4">
              Google マップで開く
            </a>
          </section>
        )}

        <section>
          <h2 className={SECTION_TITLE}>この劇場で上演する</h2>
          <p className="mt-2 text-sm text-gray-700">ここで公演の予定があれば、上演告知に載せられます（無料）。</p>
          <Link href="/announcements/new" className="mt-3 inline-flex items-center h-11 px-5 rounded bg-theater-primary-600 hover:bg-theater-primary-700 text-white text-sm font-bold">
            公演を告知する
          </Link>
          <dl className="mt-6 border-t border-[#D9D5CF] text-sm">
            {[
              ['空き状況', '公演希望日の6〜12か月前からの予約が一般的です。人気の劇場は早めに問い合わせましょう。'],
              ['申し込み', '利用申込書の提出と、公演内容・舞台プランなどの事前の打ち合わせが必要です。'],
              ['問い合わせ', venue.website ? '料金・設備・技術スタッフの有無などは、公式サイトで確かめてください。' : '料金・設備は、劇場に直接問い合わせてください。'],
              ['確かめたいこと', '搬入口の大きさ、楽屋の数、音響・照明設備、客席の配置を変えられるか、ピアノなどの備品。'],
            ].map(([label, text]) => (
              <div key={label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 py-3 px-1 border-b border-[#D9D5CF]">
                <dt className="text-gray-600">{label}</dt>
                <dd className="text-gray-900">{text}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-gray-500">
            <span className="mr-1 px-1 border border-[#D9D5CF] rounded">PR</span>
            チラシ・パンフレットの印刷なら
            <a href="https://px.a8.net/svt/ejp?a8mat=4BA6D7+G3AUP6+4JZ2+5YJRM" target="_blank" rel="nofollow noopener noreferrer sponsored" className="ml-1 text-gray-700 underline underline-offset-2">いろぷり（ネット印刷）</a>
            <img src="https://www17.a8.net/0.gif?a8mat=4BA6D7+G3AUP6+4JZ2+5YJRM" width="1" height="1" alt="" style={{ border: 0, display: 'inline' }} />
          </p>
        </section>

        {announcements.length > 0 && (
          <section>
            <h2 className={SECTION_TITLE}>この劇場での上演告知</h2>
            <ul className="mt-3 border-t border-[#D9D5CF]">
              {announcements.map((a) => (
                <li key={a.id} className="border-b border-[#D9D5CF]">
                  <Link href={`/announcements/${a.id}`} className={ROW}>
                    <span className="flex-1 min-w-0 font-bold text-gray-900 group-hover:text-theater-primary-700">{a.title}</span>
                    <span className="text-sm text-gray-600">
                      {[a.theaterGroupName, a.performanceDate && (({ year, monthDay }) => `${year ?? ''}${monthDay}`)(performanceDateParts(a.performanceDate))].filter(Boolean).join('・')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {performances.length > 0 && (
          <section>
            <h2 className={SECTION_TITLE}>この劇場で上演された作品</h2>
            <ul className="mt-3 border-t border-[#D9D5CF]">
              {performances.map((p, i) => {
                const typeName = p.performanceType && p.performanceType !== 'play'
                  ? ({ reading: 'リーディング', festival: '演劇祭', workshop: 'ワークショップ' } as Record<string, string>)[p.performanceType] || p.performanceType
                  : null;
                return (
                  <li key={i} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-3 py-3 px-1 border-b border-[#D9D5CF]">
                    <span className="text-sm text-gray-600 tabular-nums">{p.performanceYear ?? '—'}</span>
                    <div className="min-w-0">
                      {p.post ? (
                        <Link href={`/posts/${p.post.id}`} className="font-serif font-bold text-gray-900 hover:text-theater-primary-700">
                          {p.post.title}
                          <span className="ml-2 font-sans font-normal text-sm text-gray-600">{p.post.author.name}</span>
                        </Link>
                      ) : (
                        <span className="font-bold text-gray-900">
                          {p.artistName && `${p.artistName} `}『{p.title || ''}』
                          {typeName && <span className="ml-2 px-1.5 py-px border border-[#D9D5CF] rounded text-xs font-normal text-gray-700">{typeName}</span>}
                        </span>
                      )}
                      <p className="mt-0.5 text-sm text-gray-600">
                        {p.theaterGroup ? (
                          <Link href={`/theater-groups/${p.theaterGroup.slug}`} className="hover:underline">{p.theaterGroup.name}</Link>
                        ) : p.description}
                        {p.sourceUrl && (
                          <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-2 underline underline-offset-2 hover:text-gray-900">出典</a>
                        )}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {theaterGroups.length > 0 && (
          <section>
            <h2 className={SECTION_TITLE}>{venue.prefecture}で活動する劇団</h2>
            <ul className="mt-3 border-t border-[#D9D5CF] grid sm:grid-cols-2 sm:gap-x-6">
              {theaterGroups.map((g) => (
                <li key={g.slug} className="border-b border-[#D9D5CF]">
                  <Link href={`/theater-groups/${g.slug}`} className={ROW}>
                    <span className="flex-1 min-w-0 font-serif font-bold text-gray-900 group-hover:text-theater-primary-700">{g.name}</span>
                    <span className="text-sm text-gray-600">{groupTypeLabelsShort[g.groupType] || ''}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {nearbyVenues.length > 0 && (
          <section>
            <h2 className={SECTION_TITLE}>
              {nearbyVenues[0].distance !== null ? '近くの劇場' : `${venue.prefecture}の他の劇場`}
            </h2>
            <ul className="mt-3 border-t border-[#D9D5CF]">
              {nearbyVenues.map((nv) => (
                <li key={nv.slug} className="border-b border-[#D9D5CF]">
                  <Link href={`/venues/${nv.slug}`} className={ROW}>
                    <span className="flex-1 min-w-0 font-bold text-gray-900 group-hover:text-theater-primary-700">{nv.name}</span>
                    <span className="text-sm text-gray-600 tabular-nums">
                      {[
                        venueTypeLabels[nv.venueType] || nv.venueType,
                        nv.capacity ? `${nv.capacity}席` : null,
                        nv.distance !== null ? (nv.distance < 0.1 ? '0.1km未満' : `${Math.round(nv.distance * 10) / 10}km`) : null,
                      ].filter(Boolean).join('・')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const venue = await prisma.venue.findUnique({ where: { slug } });
  if (!venue) return { notFound: true };

  // 近くの劇場: 座標があれば距離計算、なければ同県フォールバック
  let nearbyVenues: NearbyVenue[] = [];
  if (venue.latitude && venue.longitude) {
    // Haversine formula で距離計算
    const allVenues = await prisma.venue.findMany({
      where: { id: { not: venue.id }, latitude: { not: null }, longitude: { not: null } },
      select: { name: true, slug: true, venueType: true, capacity: true, latitude: true, longitude: true },
    });
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const haversine = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
      const R = 6371; // km
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };
    nearbyVenues = allVenues
      .map((v) => ({
        name: v.name,
        slug: v.slug,
        venueType: v.venueType,
        capacity: v.capacity,
        distance: Math.round(haversine(venue.latitude!, venue.longitude!, v.latitude!, v.longitude!) * 10) / 10,
      }))
      .sort((a, b) => a.distance! - b.distance!)
      .slice(0, 5);
  } else if (venue.prefecture) {
    const prefectureVenues = await prisma.venue.findMany({
      where: { prefecture: venue.prefecture, id: { not: venue.id } },
      select: { name: true, slug: true, venueType: true, capacity: true },
      orderBy: { name: 'asc' }, take: 5,
    });
    nearbyVenues = prefectureVenues.map((v) => ({ ...v, distance: null }));
  }

  const announcements = await prisma.announcement.findMany({
    where: { venueId: venue.id },
    select: { id: true, title: true, performanceDate: true, theaterGroupName: true, post: { select: { id: true, title: true } } },
    orderBy: { performanceDate: 'desc' }, take: 10,
  });

  // この劇場で上演された作品（PostTheaterGroup + VenuePerformance統合）
  const postPerformances = await prisma.postTheaterGroup.findMany({
    where: { venueId: venue.id },
    select: {
      performanceYear: true,
      sourceUrl: true,
      post: { select: { id: true, title: true, author: { select: { name: true } } } },
      theaterGroup: { select: { name: true, slug: true } },
    },
    orderBy: { performanceYear: 'desc' },
    take: 30,
  });

  const venuePerformances = await prisma.venuePerformance.findMany({
    where: { venueId: venue.id },
    select: {
      title: true, artistName: true, performanceType: true, description: true,
      year: true, sourceUrl: true,
      post: { select: { id: true, title: true, author: { select: { name: true } } } },
      theaterGroup: { select: { name: true, slug: true } },
    },
    orderBy: { year: 'desc' },
    take: 50,
  });

  // 統合: PostTheaterGroupのデータとVenuePerformanceのデータをマージ
  const performances: PerformanceItem[] = [
    ...postPerformances.map(p => ({
      performanceYear: p.performanceYear,
      sourceUrl: p.sourceUrl,
      post: p.post,
      theaterGroup: p.theaterGroup,
    })),
    ...venuePerformances.map(vp => ({
      performanceYear: vp.year,
      sourceUrl: vp.sourceUrl,
      post: vp.post,
      theaterGroup: vp.theaterGroup,
      title: vp.title,
      artistName: vp.artistName,
      performanceType: vp.performanceType,
      description: vp.description,
    })),
  ].sort((a, b) => {
    if (!a.performanceYear && !b.performanceYear) return 0;
    if (!a.performanceYear) return 1;
    if (!b.performanceYear) return -1;
    return b.performanceYear - a.performanceYear;
  });

  const theaterGroups = venue.prefecture
    ? await prisma.theaterGroup.findMany({
        where: { prefecture: venue.prefecture, isActive: true },
        select: { name: true, slug: true, groupType: true },
        orderBy: { name: 'asc' }, take: 10,
      })
    : [];

  return {
    props: {
      venue: JSON.parse(JSON.stringify(venue)),
      nearbyVenues: JSON.parse(JSON.stringify(nearbyVenues)),
      announcements: JSON.parse(JSON.stringify(announcements)),
      performances: JSON.parse(JSON.stringify(performances)),
      theaterGroups: JSON.parse(JSON.stringify(theaterGroups)),
    },
    revalidate: 2592000,
  };
};
