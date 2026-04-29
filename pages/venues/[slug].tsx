import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import { prisma } from '@/lib/prisma';
import { FaChevronRight, FaMapMarkerAlt, FaUsers, FaExternalLinkAlt, FaTwitter } from 'react-icons/fa';

const venueTypeLabels: Record<string, string> = {
  SMALL: '小劇場',
  MEDIUM: '中劇場',
  LARGE: '大劇場',
};

const venueTypeColors: Record<string, string> = {
  SMALL: 'bg-emerald-100 text-emerald-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  LARGE: 'bg-purple-100 text-purple-800',
};

type Props = {
  venue: {
    id: number;
    name: string;
    slug: string;
    venueType: string;
    capacity: number | null;
    prefecture: string | null;
    address: string | null;
    website: string | null;
    twitter: string | null;
    description: string | null;
    latitude: number | null;
    longitude: number | null;
  };
};

export default function VenueDetail({ venue }: Props) {
  if (!venue) return null;

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
      geo: {
        '@type': 'GeoCoordinates',
        latitude: venue.latitude,
        longitude: venue.longitude,
      },
    }),
    ...(venue.capacity && {
      maximumAttendeeCapacity: venue.capacity,
    }),
    ...(venue.website && { url: venue.website }),
  };

  return (
    <Layout>
      <Seo
        pageTitle={venue.name}
        pageDescription={venue.description || `${venue.name}の劇場情報`}
        pagePath={`/venues/${venue.slug}`}
        pageKeywords={['劇場', '会場', venue.name, venue.prefecture || ''].filter(Boolean)}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'ホーム', url: 'https://gikyokutosyokan.com' },
          { name: '劇場一覧', url: 'https://gikyokutosyokan.com/venues' },
          { name: venue.name, url: `https://gikyokutosyokan.com/venues/${venue.slug}` },
        ]}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd) }}
        />
      </Head>

      <div className="px-4 py-6 max-w-3xl mx-auto">
        {/* パンくず */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4 flex-wrap">
          <Link href="/" className="hover:text-theater-primary-700">ホーム</Link>
          <FaChevronRight className="text-[8px]" />
          <Link href="/venues" className="hover:text-theater-primary-700">劇場一覧</Link>
          <FaChevronRight className="text-[8px]" />
          <span className="text-gray-800">{venue.name}</span>
        </nav>

        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 md:p-8 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800">
              {venue.name}
            </h1>
            {venue.venueType && (
              <span className={`shrink-0 mt-1 px-2 py-0.5 text-xs font-medium rounded ${venueTypeColors[venue.venueType] || 'bg-gray-100 text-gray-700'}`}>
                {venueTypeLabels[venue.venueType] || venue.venueType}
              </span>
            )}
          </div>

          {venue.description && (
            <p className="text-sm text-gray-600 mb-4">{venue.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {venue.capacity && (
              <div className="flex items-center gap-1">
                <FaUsers className="text-blue-500" />
                <span>座席数: {venue.capacity}席</span>
              </div>
            )}
            {venue.prefecture && (
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-red-500" />
                <span>{venue.prefecture}</span>
              </div>
            )}
          </div>
        </div>

        {/* 住所 */}
        {venue.address && (
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
            <h2 className="font-serif font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              アクセス
            </h2>
            <p className="text-sm text-gray-700">{venue.address}</p>
          </section>
        )}

        {/* 外部リンク */}
        {(venue.website || venue.twitter) && (
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
            <h2 className="font-serif font-bold text-lg text-gray-800 mb-3">公式リンク</h2>
            <div className="flex flex-wrap gap-3">
              {venue.website && (
                <a
                  href={venue.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-theater-primary-700 hover:underline"
                >
                  <FaExternalLinkAlt className="text-xs" />
                  公式サイト
                </a>
              )}
              {venue.twitter && (
                <a
                  href={venue.twitter.startsWith('http') ? venue.twitter : `https://twitter.com/${venue.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:underline"
                >
                  <FaTwitter className="text-xs" />
                  Twitter
                </a>
              )}
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

  const venue = await prisma.venue.findUnique({
    where: { slug },
  });

  if (!venue) return { notFound: true };

  return {
    props: {
      venue: JSON.parse(JSON.stringify(venue)),
    },
    revalidate: 604800,
  };
};
