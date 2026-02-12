import { GetStaticProps } from 'next';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import StatsBar from '@/components/university-theater/StatsBar';
import TabNavigation from '@/components/university-theater/TabNavigation';
import PrefectureView from '@/components/university-theater/PrefectureView';
import TheaterGroupCard from '@/components/TheaterGroupCard';
import UniversityCard from '@/components/UniversityCard';
import { prisma } from '@/lib/prisma';
import { regionLabels, universityTypeLabels, groupTypeLabels } from '@/lib/university-theater-constants';
import Link from 'next/link';
import { FaSearch, FaFilter, FaMap, FaThLarge, FaTheaterMasks, FaChevronRight } from 'react-icons/fa';

// react-simple-maps はSSR非対応のため dynamic import
const JapanMapView = dynamic(
  () => import('@/components/university-theater/JapanMapView'),
  { ssr: false, loading: () => <div className="text-center py-12 text-gray-400">地図を読み込み中...</div> }
);

const tabs = [
  { key: 'map', label: '地図から探す' },
  { key: 'groups', label: '劇団一覧' },
  { key: 'universities', label: '大学一覧' },
];

type University = {
  name: string;
  slug: string;
  universityType: string;
  prefecture: string;
  region: string;
  groups: { name: string; slug: string; groupType: string }[];
  _count?: { theaterGroups: number };
};

type TheaterGroup = {
  name: string;
  slug: string;
  groupType: string;
  description?: string | null;
  memberCount?: number | null;
  website?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  corich?: string | null;
  universities?: { university: { name: string; slug: string; prefecture: string; region?: string } }[];
};

type PrefectureStats = {
  universityCount: number;
  groupCount: number;
  universities: {
    name: string;
    slug: string;
    universityType: string;
    groups: { name: string; slug: string; groupType: string }[];
  }[];
};

type Props = {
  universities: University[];
  theaterGroups: TheaterGroup[];
  prefectureData: Record<string, PrefectureStats>;
  totalPrefectures: number;
  regions: string[];
  prefectures: string[];
};

export default function UniversityTheaterIndex({
  universities, theaterGroups, prefectureData, totalPrefectures,
  regions, prefectures,
}: Props) {
  const [activeTab, setActiveTab] = useState('map');
  const [mapMode, setMapMode] = useState<'map' | 'grid'>('map');

  // 劇団タブのフィルタ
  const [groupSearch, setGroupSearch] = useState('');
  const [groupSelectedRegion, setGroupSelectedRegion] = useState('');
  const [groupSelectedType, setGroupSelectedType] = useState('');

  // 大学タブのフィルタ
  const [uniSearch, setUniSearch] = useState('');
  const [uniSelectedRegion, setUniSelectedRegion] = useState('');
  const [uniSelectedPrefecture, setUniSelectedPrefecture] = useState('');
  const [uniSelectedType, setUniSelectedType] = useState('');

  // 大学タブ: 都道府県の選択肢を地域で絞り込み
  const uniFilteredPrefectures = useMemo(() => {
    if (!uniSelectedRegion) return prefectures;
    return Array.from(new Set(
      universities.filter((u) => u.region === uniSelectedRegion).map((u) => u.prefecture)
    )).sort();
  }, [uniSelectedRegion, universities, prefectures]);

  const filteredGroups = useMemo(() => {
    return theaterGroups.filter((g) => {
      if (groupSearch) {
        const q = groupSearch.toLowerCase();
        if (!g.name.toLowerCase().includes(q) &&
            !g.universities?.some((u) => u.university.name.toLowerCase().includes(q))) return false;
      }
      if (groupSelectedType && g.groupType !== groupSelectedType) return false;
      if (groupSelectedRegion && !g.universities?.some((u) => u.university.region === groupSelectedRegion)) return false;
      return true;
    });
  }, [theaterGroups, groupSearch, groupSelectedRegion, groupSelectedType]);

  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      if (uniSearch && !u.name.toLowerCase().includes(uniSearch.toLowerCase())) return false;
      if (uniSelectedType && u.universityType !== uniSelectedType) return false;
      if (uniSelectedRegion && u.region !== uniSelectedRegion) return false;
      if (uniSelectedPrefecture && u.prefecture !== uniSelectedPrefecture) return false;
      return true;
    });
  }, [universities, uniSearch, uniSelectedRegion, uniSelectedPrefecture, uniSelectedType]);

  return (
    <Layout>
      <Seo
        pageTitle="大学演劇"
        pageDescription="全国の大学学生劇団・演劇サークルのデータベース。日本地図から都道府県別に探せます。"
        pagePath="/university-theater"
        pageKeywords={['大学演劇', '学生劇団', '演劇サークル', '大学一覧', '劇団一覧']}
      />

      <div className="px-4 py-6">
        {/* ヒーロー */}
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-xl p-6 md:p-8 mb-6">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            大学演劇データベース
          </h1>
          <p className="text-sm text-gray-600 mb-5">
            全国の大学学生劇団・演劇サークルの情報を検索できます
          </p>
          <StatsBar
            universityCount={universities.length}
            groupCount={theaterGroups.length}
            prefectureCount={totalPrefectures}
          />
        </div>

        {/* タブ */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
          <TabNavigation tabs={tabs} activeTab={activeTab} onChange={(key) => { setActiveTab(key); }} />
        </div>

        {/* 地図タブ */}
        {activeTab === 'map' && (
          <div>
            {/* 地図/グリッド切り替え */}
            <div className="flex justify-end mb-3">
              <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setMapMode('map')}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                    mapMode === 'map' ? 'bg-pink-50 text-pink-700' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <FaMap className="text-[10px]" /> 地図
                </button>
                <button
                  onClick={() => setMapMode('grid')}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                    mapMode === 'grid' ? 'bg-pink-50 text-pink-700' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <FaThLarge className="text-[10px]" /> 一覧
                </button>
              </div>
            </div>

            {mapMode === 'map' ? (
              <JapanMapView prefectureData={prefectureData} />
            ) : (
              <PrefectureView prefectureData={prefectureData} />
            )}
          </div>
        )}

        {/* 劇団タブ */}
        {activeTab === 'groups' && (
          <>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FaFilter className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">絞り込み</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="劇団名・大学名で検索"
                    value={groupSearch}
                    onChange={(e) => setGroupSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
                  />
                </div>
                <select
                  value={groupSelectedRegion}
                  onChange={(e) => setGroupSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
                >
                  <option value="">全地域</option>
                  {regions.map((r) => (
                    <option key={r} value={r}>{regionLabels[r] || r}</option>
                  ))}
                </select>
                <select
                  value={groupSelectedType}
                  onChange={(e) => setGroupSelectedType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
                >
                  <option value="">全種別</option>
                  {Object.entries(groupTypeLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">{filteredGroups.length}件の劇団</p>
            {filteredGroups.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredGroups.map((g) => (
                  <TheaterGroupCard key={g.slug} group={g} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>条件に一致する劇団が見つかりませんでした</p>
              </div>
            )}
          </>
        )}

        {/* 大学タブ */}
        {activeTab === 'universities' && (
          <>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FaFilter className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">絞り込み</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="大学名で検索"
                    value={uniSearch}
                    onChange={(e) => setUniSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
                  />
                </div>
                <select
                  value={uniSelectedRegion}
                  onChange={(e) => { setUniSelectedRegion(e.target.value); setUniSelectedPrefecture(''); }}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
                >
                  <option value="">全地域</option>
                  {regions.map((r) => (
                    <option key={r} value={r}>{regionLabels[r] || r}</option>
                  ))}
                </select>
                <select
                  value={uniSelectedPrefecture}
                  onChange={(e) => setUniSelectedPrefecture(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
                >
                  <option value="">全都道府県</option>
                  {uniFilteredPrefectures.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <select
                  value={uniSelectedType}
                  onChange={(e) => setUniSelectedType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
                >
                  <option value="">全種別</option>
                  {Object.entries(universityTypeLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">{filteredUniversities.length}校の大学</p>
            {filteredUniversities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredUniversities.map((u) => (
                  <UniversityCard key={u.slug} university={u} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>条件に一致する大学が見つかりませんでした</p>
              </div>
            )}
          </>
        )}

        {/* 小劇場への相互リンク */}
        <div className="mt-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 md:p-6">
          <div className="flex items-center gap-3 mb-2">
            <FaTheaterMasks className="text-orange-500 text-lg" />
            <h2 className="font-serif font-bold text-lg text-gray-800">小劇場データベース</h2>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            プロ劇団・アマチュア劇団・ユース劇団など、全国の小劇場・劇団情報も掲載しています。
          </p>
          <Link
            href="/shogekijo"
            className="inline-flex items-center gap-1 text-sm text-orange-700 hover:text-orange-900 font-medium transition-colors"
          >
            小劇場データベースを見る <FaChevronRight className="text-[10px]" />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const [universities, theaterGroups] = await Promise.all([
    prisma.university.findMany({
      select: {
        name: true,
        slug: true,
        universityType: true,
        prefecture: true,
        region: true,
        theaterGroups: {
          select: {
            theaterGroup: {
              select: { name: true, slug: true, groupType: true },
            },
          },
        },
        _count: { select: { theaterGroups: true } },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.theaterGroup.findMany({
      where: { isActive: true },
      select: {
        name: true,
        slug: true,
        groupType: true,
        description: true,
        memberCount: true,
        website: true,
        twitter: true,
        instagram: true,
        corich: true,
        universities: {
          include: {
            university: {
              select: { name: true, slug: true, prefecture: true, region: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  // 都道府県別データを構築
  type PrefStats = {
    universityCount: number;
    groupCount: number;
    universities: {
      name: string;
      slug: string;
      universityType: string;
      groups: { name: string; slug: string; groupType: string }[];
    }[];
  };

  const prefectureData: Record<string, PrefStats> = {};
  const prefecturesWithData = new Set<string>();

  for (const uni of universities) {
    const pref = uni.prefecture;
    if (!prefectureData[pref]) {
      prefectureData[pref] = { universityCount: 0, groupCount: 0, universities: [] };
    }
    prefectureData[pref].universityCount++;
    const groups = uni.theaterGroups.map((tg) => tg.theaterGroup);
    prefectureData[pref].groupCount += groups.length;
    prefectureData[pref].universities.push({
      name: uni.name,
      slug: uni.slug,
      universityType: uni.universityType,
      groups,
    });
    prefecturesWithData.add(pref);
  }

  // カード用データ
  const universitiesForCards = universities.map((u) => ({
    name: u.name,
    slug: u.slug,
    universityType: u.universityType,
    prefecture: u.prefecture,
    region: u.region,
    _count: u._count,
    groups: u.theaterGroups.map((tg) => tg.theaterGroup),
  }));

  const allPrefectures = Array.from(new Set(universities.map((u) => u.prefecture))).sort();
  const allRegions = Array.from(new Set(universities.map((u) => u.region)));

  return {
    props: {
      universities: JSON.parse(JSON.stringify(universitiesForCards)),
      theaterGroups: JSON.parse(JSON.stringify(theaterGroups)),
      prefectureData: JSON.parse(JSON.stringify(prefectureData)),
      totalPrefectures: prefecturesWithData.size,
      regions: allRegions,
      prefectures: allPrefectures,
    },
  };
};
