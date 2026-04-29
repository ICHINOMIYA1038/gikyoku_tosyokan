import { GetStaticProps } from 'next';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import { prisma } from '@/lib/prisma';
import { FaSearch, FaChevronRight, FaMapMarkerAlt, FaUsers, FaGlobe } from 'react-icons/fa';

const TYPE_LABELS: Record<string, string> = {
  small: '小劇場',
  medium: '中劇場',
  large: '大劇場',
  outdoor: '野外',
  other: 'その他',
};

const TYPE_TABS = [
  { key: '', label: 'すべて' },
  { key: 'small', label: '小劇場' },
  { key: 'medium', label: '中劇場' },
  { key: 'large', label: '大劇場' },
];

type Venue = {
  id: number;
  name: string;
  slug: string;
  venueType: string;
  capacity: number | null;
  prefecture: string;
  address: string | null;
  website: string | null;
  description: string | null;
};

type Props = {
  venues: Venue[];
  stats: { total: number; small: number; medium: number; large: number };
  prefectures: string[];
};

export default function VenuesIndex({ venues, stats, prefectures }: Props) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPrefecture, setSelectedPrefecture] = useState('');

  const filtered = useMemo(() => {
    return venues.filter((v) => {
      if (search && !v.name.toLowerCase().includes(search.toLowerCase()) &&
          !v.prefecture.includes(search) &&
          !(v.address || '').includes(search)) return false;
      if (selectedType && v.venueType !== selectedType) return false;
      if (selectedPrefecture && v.prefecture !== selectedPrefecture) return false;
      return true;
    });
  }, [venues, search, selectedType, selectedPrefecture]);

  return (
    <Layout>
      <Seo
        pageTitle="劇場データベース | 全国の劇場・ホールを検索"
        pageDescription={`全国${stats.total}件の劇場・ホール情報を掲載。小劇場${stats.small}件、中劇場${stats.medium}件、大劇場${stats.large}件を検索できます。`}
        pagePath="/venues"
        pageKeywords={['劇場', 'ホール', '小劇場', '演劇', '劇場一覧', '座席数']}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'ホーム', url: 'https://gikyokutosyokan.com' },
          { name: '劇場データベース', url: 'https://gikyokutosyokan.com/venues' },
        ]}
      />

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-theater-primary-600">ホーム</Link>
          <FaChevronRight className="text-[8px]" />
          <span className="text-gray-700">劇場データベース</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FaMapMarkerAlt className="text-theater-primary-500" />
            劇場データベース
          </h1>
          <p className="text-sm text-gray-500 mt-1">全国{stats.total}件の劇場・ホール情報</p>
        </div>

        {/* 統計 */}
        <div className="flex flex-wrap gap-3 mb-5 text-sm">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-bold">小劇場 {stats.small}</span>
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-bold">中劇場 {stats.medium}</span>
          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-bold">大劇場 {stats.large}</span>
        </div>

        {/* タブ */}
        <div className="flex gap-0 border-b border-gray-200 mb-4">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedType(tab.key)}
              className={`px-3 py-2 text-sm font-bold transition-colors relative whitespace-nowrap
                ${selectedType === tab.key ? 'text-theater-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab.label}
              {selectedType === tab.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-theater-primary-500" />}
            </button>
          ))}
        </div>

        {/* 検索 + 都道府県 */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="劇場名・地域で検索"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-theater-primary-200"
            />
          </div>
          <select
            value={selectedPrefecture}
            onChange={(e) => setSelectedPrefecture(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-theater-primary-200"
          >
            <option value="">全都道府県</option>
            {prefectures.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length}件の劇場</p>

        {/* 一覧 */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((v) => (
              <div key={v.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="font-bold text-sm text-gray-900">{v.name}</h2>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    v.venueType === 'large' ? 'bg-purple-100 text-purple-700' :
                    v.venueType === 'medium' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {TYPE_LABELS[v.venueType] || v.venueType}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-gray-500">
                  <p className="flex items-center gap-1"><FaMapMarkerAlt className="text-[10px]" />{v.prefecture}{v.address ? ` ${v.address}` : ''}</p>
                  {v.capacity && <p className="flex items-center gap-1"><FaUsers className="text-[10px]" />{v.capacity}席</p>}
                </div>
                {v.description && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{v.description}</p>
                )}
                {v.website && (
                  <a href={v.website} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-theater-primary-600 hover:underline mt-2">
                    <FaGlobe className="text-[10px]" /> 公式サイト
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>条件に一致する劇場が見つかりませんでした</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const venues = await prisma.venue.findMany({
    select: {
      id: true, name: true, slug: true, venueType: true, capacity: true,
      prefecture: true, address: true, website: true, description: true,
    },
    orderBy: [{ prefecture: 'asc' }, { name: 'asc' }],
  });

  const prefectures = Array.from(new Set(venues.map((v) => v.prefecture))).sort();
  const stats = {
    total: venues.length,
    small: venues.filter((v) => v.venueType === 'small').length,
    medium: venues.filter((v) => v.venueType === 'medium').length,
    large: venues.filter((v) => v.venueType === 'large').length,
  };

  return {
    props: { venues: JSON.parse(JSON.stringify(venues)), stats, prefectures },
    revalidate: 604800,
  };
};
