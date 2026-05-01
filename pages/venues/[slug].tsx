import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import { prisma } from '@/lib/prisma';
import { FaChevronRight, FaMapMarkerAlt, FaUsers, FaExternalLinkAlt, FaTwitter, FaTheaterMasks, FaInfoCircle, FaShareAlt, FaCalendarAlt, FaCheckCircle, FaPhoneAlt, FaFileAlt } from 'react-icons/fa';

const venueTypeLabels: Record<string, string> = {
  small: '小劇場', medium: '中劇場', large: '大劇場',
  SMALL: '小劇場', MEDIUM: '中劇場', LARGE: '大劇場',
};
const venueTypeColors: Record<string, string> = {
  small: 'bg-blue-100 text-blue-700', medium: 'bg-green-100 text-green-700', large: 'bg-purple-100 text-purple-700',
  SMALL: 'bg-blue-100 text-blue-700', MEDIUM: 'bg-green-100 text-green-700', LARGE: 'bg-purple-100 text-purple-700',
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

// キャパシティの視覚化コンポーネント
function CapacityBar({ capacity, venueType }: { capacity: number | null; venueType: string }) {
  if (!capacity) return null;
  // 対数スケールで表示 (50席 → 大体左端, 2000席 → 大体右端)
  const minLog = Math.log(30);
  const maxLog = Math.log(2500);
  const pct = Math.min(100, Math.max(5, ((Math.log(capacity) - minLog) / (maxLog - minLog)) * 100));

  const labels = [
    { pos: 0, text: '50席' },
    { pos: 33, text: '150席' },
    { pos: 66, text: '500席' },
    { pos: 100, text: '2000席+' },
  ];

  const barColor = venueType === 'large' || venueType === 'LARGE'
    ? 'bg-purple-500' : venueType === 'medium' || venueType === 'MEDIUM'
    ? 'bg-green-500' : 'bg-blue-500';

  return (
    <div className="mt-3 mb-1">
      <p className="text-[11px] text-gray-400 mb-1.5 font-medium">劇場の規模感</p>
      <div className="relative h-2 bg-gray-100 rounded-full overflow-visible">
        <div className={`absolute left-0 top-0 h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
        <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md ${barColor}`} style={{ left: `calc(${pct}% - 8px)` }} />
      </div>
      <div className="relative flex justify-between mt-1">
        {labels.map((l) => (
          <span key={l.pos} className="text-[10px] text-gray-300" style={{ position: 'absolute', left: `${l.pos}%`, transform: 'translateX(-50%)' }}>{l.text}</span>
        ))}
      </div>
    </div>
  );
}

// シェアボタンコンポーネント
function ShareButtons({ venue }: { venue: Props['venue'] }) {
  const url = `https://gikyokutosyokan.com/venues/${venue.slug}`;
  const text = `${venue.name}（${venue.prefecture}）- 劇場データベース｜戯曲図書館`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-gray-400"><FaShareAlt className="inline mr-0.5" />共有</span>
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-500 hover:text-blue-500 transition-colors"
        title="Twitterでシェア">
        <FaTwitter className="text-sm" />
      </a>
      <a href={lineUrl} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-green-50 text-gray-500 hover:text-green-500 transition-colors"
        title="LINEでシェア">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" /></svg>
      </a>
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
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-start gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{venue.name}</h1>
              <span className={`shrink-0 mt-1.5 px-2 py-0.5 text-xs font-bold rounded ${venueTypeColors[venue.venueType] || 'bg-gray-100 text-gray-700'}`}>
                {typeLabel}
              </span>
            </div>
            <ShareButtons venue={venue} />
          </div>

          {/* スペック */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
            {venue.capacity && (
              <span className="flex items-center gap-1"><FaUsers className="text-blue-400" />{venue.capacity}席</span>
            )}
            {venue.prefecture && (
              <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-red-400" />{venue.prefecture}</span>
            )}
          </div>

          {/* キャパシティ視覚化 */}
          <CapacityBar capacity={venue.capacity} venueType={venue.venueType} />

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
                src={mapSrc}
                width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title={`${venue.name}の地図`}
              />
            </div>
            <a href={mapLink}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-theater-primary-600 hover:underline mt-2">
              <FaExternalLinkAlt className="text-[10px]" /> Google Mapsで大きく表示
            </a>
          </section>
        )}

        {/* この劇場を利用するには */}
        <section className="mb-6 bg-amber-50/50 rounded-lg p-5">
          <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FaInfoCircle className="text-amber-500" />この劇場で公演するには
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <FaCalendarAlt className="text-amber-400 mt-0.5 flex-shrink-0 text-xs" />
              <div>
                <p className="text-sm font-medium text-gray-700">空き状況の確認</p>
                <p className="text-xs text-gray-500">公演希望日の6〜12ヶ月前からの予約が一般的です。人気の劇場は早めの問い合わせを推奨します。</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <FaFileAlt className="text-amber-400 mt-0.5 flex-shrink-0 text-xs" />
              <div>
                <p className="text-sm font-medium text-gray-700">利用申込</p>
                <p className="text-xs text-gray-500">利用申込書の提出と、公演内容・舞台プラン等についての事前打ち合わせが必要です。</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <FaPhoneAlt className="text-amber-400 mt-0.5 flex-shrink-0 text-xs" />
              <div>
                <p className="text-sm font-medium text-gray-700">問い合わせ先</p>
                <p className="text-xs text-gray-500">
                  {venue.website
                    ? '料金・設備・技術スタッフの有無などは公式サイトをご確認ください。'
                    : '料金・設備については劇場に直接お問い合わせください。'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <FaCheckCircle className="text-amber-400 mt-0.5 flex-shrink-0 text-xs" />
              <div>
                <p className="text-sm font-medium text-gray-700">確認しておきたいポイント</p>
                <p className="text-xs text-gray-500">搬入口の大きさ、楽屋の数、音響・照明設備、客席の配置変更可否、ピアノ等の備品。</p>
              </div>
            </div>
          </div>
          {venue.website && (
            <a href={venue.website} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-white bg-theater-primary-500 hover:bg-theater-primary-600 rounded-lg px-4 py-2 mt-4 font-medium transition-colors">
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

        {/* この劇場で上演された作品 - タイムライン */}
        {performances.length > 0 && (() => {
          // 年ごとにグループ化
          const byYear: Record<string, typeof performances> = {};
          performances.forEach((p) => {
            const yr = p.performanceYear ? String(p.performanceYear) : '年不明';
            if (!byYear[yr]) byYear[yr] = [];
            byYear[yr].push(p);
          });
          const years = Object.keys(byYear).sort((a, b) => {
            if (a === '年不明') return 1;
            if (b === '年不明') return -1;
            return Number(b) - Number(a);
          });

          return (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaTheaterMasks className="text-theater-primary-500" />この劇場で上演された作品
              </h2>
              <div className="relative">
                {years.map((year, yi) => (
                  <div key={year} className="flex gap-4 mb-0 last:mb-0">
                    {/* 年ラベル */}
                    <div className="w-14 flex-shrink-0 pt-1 text-right">
                      <span className="text-sm font-bold text-gray-400">{year === '年不明' ? '—' : year}</span>
                    </div>
                    {/* タイムラインの線とドット */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-theater-primary-400 border-2 border-theater-primary-100 mt-2 z-10" />
                      {yi < years.length - 1 && <div className="w-px flex-1 bg-gray-200" />}
                    </div>
                    {/* コンテンツ */}
                    <div className="flex-1 pb-5">
                      {byYear[year].map((p, i) => (
                        <div key={i} className="py-1.5 first:pt-0">
                          {p.post ? (
                            <Link href={`/posts/${p.post.id}`} className="text-sm font-medium text-gray-800 hover:text-theater-primary-600">
                              {p.post.author.name}『{p.post.title}』
                            </Link>
                          ) : (
                            <span className="text-sm font-medium text-gray-800">
                              {p.artistName && `${p.artistName} `}『{p.title || ''}』
                              {p.performanceType && p.performanceType !== 'play' && (
                                <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 font-bold">
                                  {p.performanceType === 'reading' ? 'リーディング' : p.performanceType === 'festival' ? '演劇祭' : p.performanceType === 'workshop' ? 'ワークショップ' : p.performanceType}
                                </span>
                              )}
                            </span>
                          )}
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            {p.theaterGroup ? (
                              <Link href={`/theater-groups/${p.theaterGroup.slug}`} className="text-xs text-gray-400 hover:text-gray-600">
                                {p.theaterGroup.name}
                              </Link>
                            ) : p.description ? (
                              <span className="text-xs text-gray-400">{p.description}</span>
                            ) : null}
                            {p.sourceUrl && (
                              <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer"
                                className="text-[10px] text-blue-400 hover:text-blue-600 flex items-center gap-0.5">
                                <FaExternalLinkAlt className="text-[8px]" />出典
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })()}

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
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              {nearbyVenues[0].distance !== null ? '近くの劇場' : `${venue.prefecture}の他の劇場`}
            </h2>
            <ul className="space-y-2">
              {nearbyVenues.map((nv) => (
                <li key={nv.slug}>
                  <Link href={`/venues/${nv.slug}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-theater-primary-600 transition-colors">
                    <span className="text-gray-400">›</span>
                    <span className="font-medium">{nv.name}</span>
                    <span className="text-xs text-gray-400">
                      {venueTypeLabels[nv.venueType] || nv.venueType}
                      {nv.capacity ? ` · ${nv.capacity}席` : ''}
                      {nv.distance !== null && ` · ${nv.distance < 0.1 ? '0.1km未満' : `${Math.round(nv.distance * 10) / 10}km`}`}
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
    revalidate: 604800,
  };
};
