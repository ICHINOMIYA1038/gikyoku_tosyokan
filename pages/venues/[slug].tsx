import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import { prisma } from '@/lib/prisma';
import { FaChevronRight, FaMapMarkerAlt, FaUsers, FaExternalLinkAlt, FaTwitter, FaTheaterMasks, FaInfoCircle } from 'react-icons/fa';

const venueTypeLabels: Record<string, string> = {
  small: '小劇場', medium: '中劇場', large: '大劇場',
  SMALL: '小劇場', MEDIUM: '中劇場', LARGE: '大劇場',
};
const venueTypeColors: Record<string, string> = {
  small: 'bg-blue-100 text-blue-700', medium: 'bg-green-100 text-green-700', large: 'bg-purple-100 text-purple-700',
  SMALL: 'bg-blue-100 text-blue-700', MEDIUM: 'bg-green-100 text-green-700', LARGE: 'bg-purple-100 text-purple-700',
};

type NearbyVenue = { name: string; slug: string; venueType: string; capacity: number | null };
type AnnouncementItem = { id: number; title: string; performanceDate: string | null; theaterGroupName: string | null; post: { id: number; title: string } | null };
type TheaterGroupItem = { name: string; slug: string; groupType: string };

type Props = {
  venue: {
    id: number; name: string; slug: string; venueType: string; capacity: number | null;
    prefecture: string | null; address: string | null; website: string | null;
    twitter: string | null; description: string | null; latitude: number | null; longitude: number | null;
  };
  nearbyVenues: NearbyVenue[];
  announcements: AnnouncementItem[];
  theaterGroups: TheaterGroupItem[];
};

const groupTypeLabelsShort: Record<string, string> = {
  PROFESSIONAL: 'プロ', AMATEUR: '社会人', STUDENT: '学生',
  INTERCOLLEGE: 'インカレ', ACADEMIC: '大学学科', YOUTH: 'ユース',
};

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

export default function VenueDetail({ venue, nearbyVenues, announcements, theaterGroups }: Props) {
  if (!venue) return null;

  const typeLabel = venueTypeLabels[venue.venueType] || venue.venueType;
  const insights = getVenueInsight(venue);
  const mapQuery = encodeURIComponent(venue.name + ' ' + (venue.address || venue.prefecture || ''));

  const placeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PerformingArtsTheater',
    name: venue.name,
    ...(venue.description && { description: venue.description }),
    ...(venue.address && {
      address: { '@type': 'PostalAddress', streetAddress: venue.address, addressRegion: venue.prefecture || undefined, addressCountry: 'JP' },
    }),
    ...(venue.latitude && venue.longitude && {
      geo: { '@type': 'GeoCoordinates', latitude: venue.latitude, longitude: venue.longitude },
    }),
    ...(venue.capacity && { maximumAttendeeCapacity: venue.capacity }),
    ...(venue.website && { url: venue.website }),
  };

  return (
    <Layout>
      <Seo
        pageTitle={`${venue.name}（${typeLabel}・${venue.prefecture}）| 劇場データベース`}
        pageDescription={
          venue.description
            ? `${venue.description} ${venue.capacity ? `座席数${venue.capacity}席。` : ''}${venue.prefecture}の${typeLabel}。`
            : `${venue.name}は${venue.prefecture}にある${typeLabel}です。${venue.capacity ? `座席数${venue.capacity}席。` : ''}アクセス・施設情報をご紹介。`
        }
        pagePath={`/venues/${venue.slug}`}
        pageKeywords={[venue.name, typeLabel, venue.prefecture || '', '劇場', '演劇', 'ホール'].filter(Boolean)}
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

      <div className="px-4 py-6 max-w-3xl mx-auto">
        {/* パンくず */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4 flex-wrap">
          <Link href="/" className="hover:text-theater-primary-700">ホーム</Link>
          <FaChevronRight className="text-[8px]" />
          <Link href="/venues" className="hover:text-theater-primary-700">劇場データベース</Link>
          <FaChevronRight className="text-[8px]" />
          <span className="text-gray-800">{venue.name}</span>
        </nav>

        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-start gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{venue.name}</h1>
            <span className={`shrink-0 mt-1.5 px-2 py-0.5 text-xs font-bold rounded ${venueTypeColors[venue.venueType] || 'bg-gray-100 text-gray-700'}`}>
              {typeLabel}
            </span>
          </div>

          {/* スペック */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            {venue.capacity && (
              <span className="flex items-center gap-1"><FaUsers className="text-blue-400" />{venue.capacity}席</span>
            )}
            {venue.prefecture && (
              <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-red-400" />{venue.prefecture}</span>
            )}
          </div>

          {/* 紹介文 */}
          <div className="text-sm text-gray-700 leading-relaxed space-y-2">
            {venue.description && <p>{venue.description}</p>}
            {insights.map((text, i) => (
              <p key={i} className={venue.description ? 'text-gray-500' : ''}>{text}</p>
            ))}
          </div>

          {/* 外部リンク */}
          {(venue.website || venue.twitter) && (
            <div className="flex flex-wrap gap-4 mt-4">
              {venue.website && (
                <a href={venue.website} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-theater-primary-600 hover:underline">
                  <FaExternalLinkAlt className="text-xs" /> 公式サイト
                </a>
              )}
              {venue.twitter && (
                <a href={venue.twitter.startsWith('http') ? venue.twitter : `https://twitter.com/${venue.twitter.replace('@', '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:underline">
                  <FaTwitter className="text-xs" /> Twitter
                </a>
              )}
            </div>
          )}
        </div>

        {/* アクセス + 地図 */}
        {(venue.address || venue.prefecture) && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-400" />アクセス
            </h2>
            {venue.address && (
              <p className="text-sm text-gray-700 mb-3">{venue.prefecture} {venue.address}</p>
            )}
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <iframe
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed&hl=ja`}
                width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title={`${venue.name}の地図`}
              />
            </div>
            <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-theater-primary-600 hover:underline mt-2">
              <FaExternalLinkAlt className="text-[10px]" /> Google Mapsで大きく表示
            </a>
          </section>
        )}

        {/* この劇場を利用するには */}
        <section className="mb-6 bg-amber-50/50 rounded-lg p-5">
          <h2 className="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
            <FaInfoCircle className="text-amber-500" />この劇場で公演するには
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {venue.website
              ? `利用料金や空き状況については、公式サイトをご確認ください。多くの劇場では、利用申込書の提出と事前の打ち合わせが必要です。`
              : `利用については劇場に直接お問い合わせください。多くの劇場では、利用申込書の提出と事前の打ち合わせが必要です。`
            }
          </p>
          {venue.website && (
            <a href={venue.website} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-theater-primary-600 hover:underline mt-2 font-medium">
              <FaExternalLinkAlt className="text-xs" /> 公式サイトで詳細を確認
            </a>
          )}
        </section>

        {/* この劇場での上演 */}
        {announcements.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FaTheaterMasks className="text-theater-primary-500" />この劇場での上演
            </h2>
            <ul className="space-y-2">
              {announcements.map((a) => (
                <li key={a.id}>
                  <Link href={`/announcements/${a.id}`} className="text-sm text-gray-700 hover:text-theater-primary-600">
                    <span className="font-medium">{a.title}</span>
                    {a.theaterGroupName && <span className="text-xs text-gray-400 ml-2">{a.theaterGroupName}</span>}
                    {a.performanceDate && <span className="text-xs text-gray-400 ml-2">{new Date(a.performanceDate).toLocaleDateString('ja-JP')}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* この地域の劇団 */}
        {theaterGroups.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{venue.prefecture}で活動する劇団</h2>
            <div className="flex flex-wrap gap-2">
              {theaterGroups.map((g) => (
                <Link key={g.slug} href={`/theater-groups/${g.slug}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 hover:bg-theater-primary-50 rounded text-xs font-medium text-gray-700 hover:text-theater-primary-600 transition-colors">
                  {g.name}
                  <span className="text-[10px] text-gray-400">{groupTypeLabelsShort[g.groupType] || ''}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 近くの劇場 */}
        {nearbyVenues.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{venue.prefecture}の他の劇場</h2>
            <ul className="space-y-2">
              {nearbyVenues.map((nv) => (
                <li key={nv.slug}>
                  <Link href={`/venues/${nv.slug}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-theater-primary-600 transition-colors">
                    <span className="text-gray-400">›</span>
                    <span className="font-medium">{nv.name}</span>
                    <span className="text-xs text-gray-400">
                      {venueTypeLabels[nv.venueType] || nv.venueType}
                      {nv.capacity ? ` · ${nv.capacity}席` : ''}
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

  const nearbyVenues = venue.prefecture
    ? await prisma.venue.findMany({
        where: { prefecture: venue.prefecture, id: { not: venue.id } },
        select: { name: true, slug: true, venueType: true, capacity: true },
        orderBy: { name: 'asc' }, take: 5,
      })
    : [];

  const announcements = await prisma.announcement.findMany({
    where: { venueId: venue.id },
    select: { id: true, title: true, performanceDate: true, theaterGroupName: true, post: { select: { id: true, title: true } } },
    orderBy: { performanceDate: 'desc' }, take: 10,
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
      theaterGroups: JSON.parse(JSON.stringify(theaterGroups)),
    },
    revalidate: 604800,
  };
};
