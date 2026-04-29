import { GetStaticProps } from 'next';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import { prisma } from '@/lib/prisma';
import { FaSearch, FaChevronRight, FaMapMarkerAlt, FaUsers, FaGlobe, FaMap, FaList } from 'react-icons/fa';

const TYPE_LABELS: Record<string, string> = {
  small: '小劇場',
  medium: '中劇場',
  large: '大劇場',
};

const TYPE_COLORS: Record<string, string> = {
  small: 'bg-blue-500',
  medium: 'bg-green-500',
  large: 'bg-purple-500',
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
  prefectureCounts: Record<string, number>;
};

export default function VenuesIndex({ venues, stats, prefectures, prefectureCounts }: Props) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPrefecture, setSelectedPrefecture] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const filtered = useMemo(() => {
    return venues.filter((v) => {
      if (search) {
        const q = search.toLowerCase();
        if (!v.name.toLowerCase().includes(q) &&
            !v.prefecture.includes(q) &&
            !(v.address || '').includes(q)) return false;
      }
      if (selectedType && v.venueType !== selectedType) return false;
      if (selectedPrefecture && v.prefecture !== selectedPrefecture) return false;
      return true;
    });
  }, [venues, search, selectedType, selectedPrefecture]);

  return (
    <Layout>
      <Seo
        pageTitle="劇場データベース | 全国の劇場・ホールを検索"
        pageDescription={`全国${stats.total}件の劇場・ホール情報を掲載。小劇場から大劇場まで、座席数・アクセス・公式サイト情報を網羅。`}
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">劇場データベース</h1>
          <p className="text-sm text-gray-500 mt-1">全国{stats.total}件の劇場・ホール情報</p>
        </div>

        {/* 統計 + 表示切替 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-bold">小劇場 {stats.small}</span>
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded font-bold">中劇場 {stats.medium}</span>
            <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded font-bold">大劇場 {stats.large}</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}><FaList className="text-sm" /></button>
            <button onClick={() => setViewMode('map')} className={`p-2 rounded ${viewMode === 'map' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}><FaMap className="text-sm" /></button>
          </div>
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
            {prefectures.map((p) => <option key={p} value={p}>{p}（{prefectureCounts[p] || 0}）</option>)}
          </select>
        </div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length}件の劇場</p>

        {/* 地図ビュー */}
        {viewMode === 'map' && (
          <div className="mb-6">
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <iframe
                src={`https://www.google.com/maps/d/embed?mid=1&q=${encodeURIComponent(selectedPrefecture ? selectedPrefecture + ' 劇場' : '日本 劇場')}&hl=ja`}
                width="100%"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                title="劇場マップ"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">都道府県を選択すると、その地域の劇場が表示されます</p>
          </div>
        )}

        {/* 一覧 */}
        {filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map((v) => (
              <Link key={v.id} href={`/venues/${v.slug}`} className="block group">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  {/* タイプインジケーター */}
                  <div className={`w-1 h-10 rounded-full flex-shrink-0 ${TYPE_COLORS[v.venueType] || 'bg-gray-300'}`} />

                  {/* メイン情報 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-sm text-gray-900 group-hover:text-theater-primary-600 truncate">{v.name}</h2>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">{TYPE_LABELS[v.venueType]}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      <span>{v.prefecture}</span>
                      {v.capacity && <span>{v.capacity}席</span>}
                    </div>
                  </div>

                  {/* Webリンクアイコン */}
                  {v.website && <FaGlobe className="text-gray-300 text-xs flex-shrink-0" />}
                </div>
              </Link>
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
  const prefectureCounts: Record<string, number> = {};
  venues.forEach((v) => { prefectureCounts[v.prefecture] = (prefectureCounts[v.prefecture] || 0) + 1; });

  const stats = {
    total: venues.length,
    small: venues.filter((v) => v.venueType === 'small').length,
    medium: venues.filter((v) => v.venueType === 'medium').length,
    large: venues.filter((v) => v.venueType === 'large').length,
  };

  return {
    props: { venues: JSON.parse(JSON.stringify(venues)), stats, prefectures, prefectureCounts },
    revalidate: 604800,
  };
};
