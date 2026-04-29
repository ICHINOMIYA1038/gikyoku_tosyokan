import { GetStaticProps } from 'next';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import { prisma } from '@/lib/prisma';
import { FaSearch, FaChevronRight, FaMapMarkerAlt, FaUsers, FaGlobe, FaMap, FaList, FaChevronDown, FaExternalLinkAlt } from 'react-icons/fa';

const JapanMap = dynamic(() => import('@/components/map/JapanMap'), {
  ssr: false,
  loading: () => <div className="text-center py-12 text-gray-400">地図を読み込み中...</div>,
});

const TYPE_LABELS: Record<string, string> = {
  small: '小劇場', medium: '中劇場', large: '大劇場',
};
const TYPE_COLORS: Record<string, string> = {
  small: 'bg-blue-500', medium: 'bg-green-500', large: 'bg-purple-500',
};
const TYPE_TABS = [
  { key: '', label: 'すべて' },
  { key: 'small', label: '小劇場' },
  { key: 'medium', label: '中劇場' },
  { key: 'large', label: '大劇場' },
];

type Venue = {
  id: number; name: string; slug: string; venueType: string;
  capacity: number | null; prefecture: string; address: string | null;
  website: string | null; description: string | null;
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
  const [selectedCapacity, setSelectedCapacity] = useState<'' | 'small' | 'medium' | 'large'>('');
  const [sortBy, setSortBy] = useState<'name' | 'capacity-asc' | 'capacity-desc'>('name');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [expandedVenue, setExpandedVenue] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  // Default to list view on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setViewMode('list');
    }
  }, []);

  const filtered = useMemo(() => {
    const result = venues.filter((v) => {
      if (search) {
        const q = search.toLowerCase();
        if (!v.name.toLowerCase().includes(q) && !v.prefecture.includes(q) && !(v.address || '').includes(q)) return false;
      }
      if (selectedType && v.venueType !== selectedType) return false;
      if (selectedPrefecture && v.prefecture !== selectedPrefecture) return false;
      if (selectedCapacity) {
        const cap = v.capacity || 0;
        if (selectedCapacity === 'small' && cap > 100) return false;
        if (selectedCapacity === 'medium' && (cap <= 100 || cap > 300)) return false;
        if (selectedCapacity === 'large' && cap <= 300) return false;
      }
      return true;
    });
    if (sortBy === 'capacity-asc') {
      result.sort((a, b) => (a.capacity || 0) - (b.capacity || 0));
    } else if (sortBy === 'capacity-desc') {
      result.sort((a, b) => (b.capacity || 0) - (a.capacity || 0));
    }
    // 'name' keeps the default order (prefecture + name from server)
    return result;
  }, [venues, search, selectedType, selectedPrefecture, selectedCapacity, sortBy]);

  const hasData = useCallback((prefName: string) => {
    return (prefectureCounts[prefName] || 0) > 0;
  }, [prefectureCounts]);

  const getTooltip = useCallback((prefName: string) => {
    const count = prefectureCounts[prefName] || 0;
    if (count === 0) return null;
    return { label: `${count}件` };
  }, [prefectureCounts]);

  const handlePrefClick = useCallback((prefName: string) => {
    setSelectedPrefecture((prev) => prev === prefName ? '' : prefName);
    setTimeout(() => {
      if (detailRef.current && window.innerWidth < 768) {
        detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, []);

  return (
    <Layout>
      <Seo
        pageTitle="劇場データベース | 全国の劇場・ホールを検索"
        pageDescription={`全国${stats.total}件の劇場・ホール情報を掲載。小劇場から大劇場まで、座席数・アクセス・地図情報を網羅。`}
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

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">劇場データベース</h1>
            <p className="text-sm text-gray-500 mt-1">全国{stats.total}件の劇場・ホール</p>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            <button onClick={() => setViewMode('map')} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${viewMode === 'map' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
              <FaMap className="inline mr-1" />地図
            </button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
              <FaList className="inline mr-1" />一覧
            </button>
          </div>
        </div>

        {/* 統計バー */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-bold">小劇場 {stats.small}</span>
          <span className="px-2 py-1 bg-green-50 text-green-700 rounded font-bold">中劇場 {stats.medium}</span>
          <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded font-bold">大劇場 {stats.large}</span>
        </div>

        {/* 地図ビュー */}
        {viewMode === 'map' && (
          <div className="mb-6">
            {/* 地図（大きく表示） */}
            <div className="max-w-2xl mx-auto mb-6">
              <JapanMap
                onClick={handlePrefClick}
                onHover={() => {}}
                hasData={hasData}
                getTooltip={getTooltip}
                selectedPref={selectedPrefecture || null}
                hoveredPref={null}
              />
            </div>

            {/* 都道府県の劇場一覧（地図の下） */}
            <div ref={detailRef}>
              {selectedPrefecture ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-gray-900">
                      {selectedPrefecture}の劇場（{prefectureCounts[selectedPrefecture] || 0}件）
                    </h2>
                    <button onClick={() => setSelectedPrefecture('')} className="text-xs text-gray-400 hover:text-gray-600">
                      クリア
                    </button>
                  </div>
                  <div className="space-y-1">
                    {venues
                      .filter((v) => v.prefecture === selectedPrefecture)
                      .map((v) => {
                        const isExpanded = expandedVenue === v.id;
                        return (
                          <div key={v.id} className="border border-gray-100 rounded-lg overflow-hidden">
                            <button
                              onClick={() => setExpandedVenue(isExpanded ? null : v.id)}
                              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                            >
                              <div className={`w-1 h-8 rounded-full flex-shrink-0 ${TYPE_COLORS[v.venueType] || 'bg-gray-300'}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-800 truncate">{v.name}</p>
                                <p className="text-[11px] text-gray-400">{TYPE_LABELS[v.venueType]}{v.capacity ? ` · ${v.capacity}席` : ''}</p>
                              </div>
                              <FaChevronDown className={`text-gray-300 text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            {isExpanded && (
                              <div className="px-4 pb-4 pt-1 bg-gray-50 border-t border-gray-100">
                                {v.description && <p className="text-xs text-gray-600 mb-2">{v.description}</p>}
                                {v.address && (
                                  <p className="text-xs text-gray-500 mb-2">
                                    <FaMapMarkerAlt className="inline text-red-400 mr-1" />
                                    {v.prefecture} {v.address}
                                  </p>
                                )}
                                <div className="flex gap-3">
                                  <Link href={`/venues/${v.slug}`} className="text-xs text-theater-primary-600 hover:underline font-bold">
                                    詳細を見る →
                                  </Link>
                                  {v.website && (
                                    <a href={v.website} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:underline flex items-center gap-1">
                                      <FaExternalLinkAlt className="text-[9px]" /> 公式サイト
                                    </a>
                                  )}
                                  <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.name + ' ' + (v.address || v.prefecture))}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="text-xs text-gray-500 hover:underline flex items-center gap-1"
                                  >
                                    <FaMapMarkerAlt className="text-[9px]" /> 地図
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">地図の都道府県をクリックすると劇場一覧が表示されます</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* リストビュー */}
        {viewMode === 'list' && (
          <>
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

            {/* 座席数フィルター */}
            <div className="flex flex-wrap gap-2 mb-3">
              {([['', '全て'], ['small', '〜100席'], ['medium', '100〜300席'], ['large', '300〜']] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCapacity(key)}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${selectedCapacity === key ? 'bg-theater-primary-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 検索 */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input type="text" placeholder="劇場名・地域で検索" value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-theater-primary-200" />
              </div>
              <select value={selectedPrefecture} onChange={(e) => setSelectedPrefecture(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-theater-primary-200">
                <option value="">全都道府県</option>
                {prefectures.map((p) => <option key={p} value={p}>{p}（{prefectureCounts[p] || 0}）</option>)}
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-theater-primary-200">
                <option value="name">名前順</option>
                <option value="capacity-asc">座席数（少→多）</option>
                <option value="capacity-desc">座席数（多→少）</option>
              </select>
            </div>

            <p className="text-sm text-gray-500 mb-4">{filtered.length}件の劇場</p>

            {filtered.length > 0 ? (
              <div className="space-y-1">
                {filtered.map((v) => (
                  <Link key={v.id} href={`/venues/${v.slug}`} className="block group">
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-1 h-10 rounded-full flex-shrink-0 ${TYPE_COLORS[v.venueType] || 'bg-gray-300'}`} />
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
                      {v.website && <FaGlobe className="text-gray-300 text-xs flex-shrink-0" />}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">条件に一致する劇場が見つかりませんでした</div>
            )}
          </>
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
