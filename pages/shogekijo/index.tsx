import { GetStaticProps } from 'next';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import TheaterGroupCard from '@/components/TheaterGroupCard';
import { prisma } from '@/lib/prisma';
import { regionLabels, groupTypeLabels } from '@/lib/university-theater-constants';
import Link from 'next/link';
import { FaSearch, FaFilter, FaTheaterMasks, FaMapMarkerAlt, FaSortAmountDown, FaTimes, FaUniversity, FaChevronRight } from 'react-icons/fa';

const ShogekijoMapView = dynamic(
  () => import('@/components/shogekijo/ShogekijoMapView'),
  { ssr: false, loading: () => <div className="text-center py-12 text-gray-400">地図を読み込み中...</div> }
);

type TheaterGroup = {
  name: string;
  slug: string;
  groupType: string;
  description?: string | null;
  memberCount?: number | null;
  foundedYear?: number | null;
  prefecture?: string | null;
  region?: string | null;
  website?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  corich?: string | null;
  universities?: { university: { name: string; slug: string; prefecture: string } }[];
};

type PrefectureGroupData = {
  groupCount: number;
  groups: { name: string; slug: string; groupType: string }[];
};

type SortOption = 'name-asc' | 'name-desc' | 'founded-asc' | 'founded-desc' | 'prefecture';

const sortLabels: Record<SortOption, string> = {
  'name-asc': '名前（あ→わ）',
  'name-desc': '名前（わ→あ）',
  'founded-asc': '設立年（古い順）',
  'founded-desc': '設立年（新しい順）',
  'prefecture': '都道府県順',
};

type Props = {
  theaterGroups: TheaterGroup[];
  prefectureData: Record<string, PrefectureGroupData>;
  totalGroups: number;
  totalPrefectures: number;
  regions: string[];
  prefectures: string[];
};

export default function ShogekijoIndex({
  theaterGroups, prefectureData, totalGroups, totalPrefectures,
  regions, prefectures,
}: Props) {
  const router = useRouter();

  // URLクエリから初期値を読み取り
  const [groupSearch, setGroupSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPrefecture, setSelectedPrefecture] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [isInitialized, setIsInitialized] = useState(false);

  // URLクエリパラメータから状態を復元（初回のみ）
  useEffect(() => {
    if (!router.isReady || isInitialized) return;
    const { q, region, type, pref, sort } = router.query;
    if (typeof q === 'string') setGroupSearch(q);
    if (typeof region === 'string') setSelectedRegion(region);
    if (typeof type === 'string') setSelectedType(type);
    if (typeof pref === 'string') setSelectedPrefecture(pref);
    if (typeof sort === 'string' && sort in sortLabels) setSortBy(sort as SortOption);
    setIsInitialized(true);
  }, [router.isReady, isInitialized]);

  // フィルタ変更時にURLを更新
  const updateUrl = useCallback((params: Record<string, string>) => {
    const query: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v) query[k] = v;
    }
    // デフォルト値は除外
    if (query.sort === 'name-asc') delete query.sort;
    router.replace({ pathname: '/shogekijo', query }, undefined, { shallow: true });
  }, [router]);

  useEffect(() => {
    if (!isInitialized) return;
    updateUrl({ q: groupSearch, region: selectedRegion, type: selectedType, pref: selectedPrefecture, sort: sortBy });
  }, [groupSearch, selectedRegion, selectedType, selectedPrefecture, sortBy, isInitialized, updateUrl]);

  const filteredPrefectures = useMemo(() => {
    if (!selectedRegion) return prefectures;
    return prefectures.filter((p) =>
      theaterGroups.some((g) => {
        const pref = g.prefecture || g.universities?.[0]?.university.prefecture;
        const region = g.region || undefined;
        return pref === p && region === selectedRegion;
      })
    );
  }, [selectedRegion, prefectures, theaterGroups]);

  const filteredGroups = useMemo(() => {
    let results = theaterGroups.filter((g) => {
      if (groupSearch) {
        const q = groupSearch.toLowerCase();
        const nameMatch = g.name.toLowerCase().includes(q);
        const descMatch = g.description?.toLowerCase().includes(q) || false;
        if (!nameMatch && !descMatch) return false;
      }
      if (selectedType && g.groupType !== selectedType) return false;
      if (selectedRegion && g.region !== selectedRegion) return false;
      if (selectedPrefecture) {
        const pref = g.prefecture || g.universities?.[0]?.university.prefecture;
        if (pref !== selectedPrefecture) return false;
      }
      return true;
    });

    // ソート
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name, 'ja');
        case 'name-desc':
          return b.name.localeCompare(a.name, 'ja');
        case 'founded-asc':
          return (a.foundedYear || 9999) - (b.foundedYear || 9999);
        case 'founded-desc':
          return (b.foundedYear || 0) - (a.foundedYear || 0);
        case 'prefecture':
          return (a.prefecture || '').localeCompare(b.prefecture || '', 'ja');
        default:
          return 0;
      }
    });

    return results;
  }, [theaterGroups, groupSearch, selectedRegion, selectedType, selectedPrefecture, sortBy]);

  const hasActiveFilter = groupSearch || selectedRegion || selectedType || selectedPrefecture;

  const clearFilters = () => {
    setGroupSearch('');
    setSelectedRegion('');
    setSelectedType('');
    setSelectedPrefecture('');
    setSortBy('name-asc');
  };

  return (
    <Layout>
      <Seo
        pageTitle="小劇場データベース"
        pageDescription={`全国${totalGroups}団体の小劇場・劇団のデータベース。日本地図から都道府県別に探せます。プロ劇団・アマチュア劇団・ユース劇団の情報を掲載。`}
        pagePath="/shogekijo"
        pageKeywords={['小劇場', '劇団', '演劇', 'アマチュア劇団', 'プロ劇団', '劇団一覧', '全国劇団']}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: '小劇場データベース',
              description: `全国${totalGroups}団体の小劇場・劇団情報`,
              numberOfItems: totalGroups,
              itemListElement: theaterGroups.slice(0, 50).map((g, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `https://gikyokutosyokan.com/shogekijo/${g.slug}`,
                name: g.name,
              })),
            }),
          }}
        />
      </Head>

      <div className="px-4 py-6">
        {/* ヒーロー */}
        <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-xl p-6 md:p-8 mb-6">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            小劇場データベース
          </h1>
          <p className="text-sm text-gray-600 mb-5">
            全国の劇団・演劇団体の情報を検索できます
          </p>
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            <div className="text-center">
              <FaTheaterMasks className="mx-auto text-lg md:text-xl text-purple-500 mb-1" />
              <div className="text-xl md:text-3xl font-bold text-gray-800">
                {totalGroups}<span className="text-sm md:text-base font-normal text-gray-500 ml-0.5">団体</span>
              </div>
              <div className="text-[10px] md:text-xs text-gray-500">劇団</div>
            </div>
            <div className="text-center">
              <FaMapMarkerAlt className="mx-auto text-lg md:text-xl text-pink-500 mb-1" />
              <div className="text-xl md:text-3xl font-bold text-gray-800">
                {totalPrefectures}
              </div>
              <div className="text-[10px] md:text-xs text-gray-500">都道府県</div>
            </div>
          </div>
        </div>

        {/* 地図セクション */}
        <div className="mb-8">
          <h2 className="font-serif text-lg font-bold text-gray-800 mb-4">地図から探す</h2>
          <ShogekijoMapView prefectureData={prefectureData} />
        </div>

        {/* フィルタ＋劇団一覧 */}
        <div>
          <h2 className="font-serif text-lg font-bold text-gray-800 mb-4">劇団一覧</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">絞り込み</span>
              </div>
              {hasActiveFilter && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 transition-colors"
                >
                  <FaTimes className="text-[10px]" />
                  クリア
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
              <div className="relative sm:col-span-2 lg:col-span-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="劇団名・説明文で検索"
                  value={groupSearch}
                  onChange={(e) => setGroupSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <select
                value={selectedRegion}
                onChange={(e) => { setSelectedRegion(e.target.value); setSelectedPrefecture(''); }}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                <option value="">全地域</option>
                {regions.map((r) => (
                  <option key={r} value={r}>{regionLabels[r] || r}</option>
                ))}
              </select>
              <select
                value={selectedPrefecture}
                onChange={(e) => setSelectedPrefecture(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                <option value="">全都道府県</option>
                {filteredPrefectures.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                <option value="">全種別</option>
                {Object.entries(groupTypeLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
              <div className="relative">
                <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  {Object.entries(sortLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            {filteredGroups.length}件の劇団
            {hasActiveFilter && <span className="text-gray-400">（全{totalGroups}件中）</span>}
          </p>
          {filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredGroups.map((g) => (
                <TheaterGroupCard key={g.slug} group={g} linkPrefix="/shogekijo" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>条件に一致する劇団が見つかりませんでした</p>
              <button
                onClick={clearFilters}
                className="mt-3 text-sm text-orange-600 hover:text-orange-800 underline"
              >
                フィルタをクリア
              </button>
            </div>
          )}
        </div>

        {/* 大学演劇への相互リンク */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 md:p-6">
          <div className="flex items-center gap-3 mb-2">
            <FaUniversity className="text-purple-500 text-lg" />
            <h2 className="font-serif font-bold text-lg text-gray-800">大学演劇データベース</h2>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            全国の大学学生劇団・演劇サークルの情報も掲載しています。
          </p>
          <Link
            href="/university-theater"
            className="inline-flex items-center gap-1 text-sm text-pink-700 hover:text-pink-900 font-medium transition-colors"
          >
            大学演劇データベースを見る <FaChevronRight className="text-[10px]" />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const theaterGroups = await prisma.theaterGroup.findMany({
    where: { isActive: true },
    select: {
      name: true,
      slug: true,
      groupType: true,
      description: true,
      memberCount: true,
      foundedYear: true,
      prefecture: true,
      region: true,
      website: true,
      twitter: true,
      instagram: true,
      corich: true,
      universities: {
        include: {
          university: {
            select: { name: true, slug: true, prefecture: true },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  // 都道府県別データを構築
  const prefectureData: Record<string, { groupCount: number; groups: { name: string; slug: string; groupType: string }[] }> = {};
  const prefecturesWithData = new Set<string>();
  const regionsWithData = new Set<string>();

  for (const group of theaterGroups) {
    // prefectureフィールド優先、なければ大学から取得
    const pref = group.prefecture || group.universities?.[0]?.university.prefecture;
    if (!pref) continue;

    if (!prefectureData[pref]) {
      prefectureData[pref] = { groupCount: 0, groups: [] };
    }
    prefectureData[pref].groupCount++;
    prefectureData[pref].groups.push({
      name: group.name,
      slug: group.slug,
      groupType: group.groupType,
    });
    prefecturesWithData.add(pref);
    if (group.region) regionsWithData.add(group.region);
  }

  const allPrefectures = Array.from(prefecturesWithData).sort();
  const allRegions = Array.from(regionsWithData);

  // カード表示に必要なフィールドのみ送信（データサイズ削減）
  const slimGroups = theaterGroups.map((g) => ({
    name: g.name,
    slug: g.slug,
    groupType: g.groupType,
    description: g.description ? g.description.slice(0, 100) : null,
    memberCount: g.memberCount,
    foundedYear: g.foundedYear,
    prefecture: g.prefecture,
    region: g.region,
    website: g.website,
    twitter: g.twitter,
    instagram: g.instagram,
    corich: g.corich,
    ...(g.universities && g.universities.length > 0 ? { universities: g.universities } : {}),
  }));

  return {
    props: {
      theaterGroups: JSON.parse(JSON.stringify(slimGroups)),
      prefectureData: JSON.parse(JSON.stringify(prefectureData)),
      totalGroups: theaterGroups.length,
      totalPrefectures: prefecturesWithData.size,
      regions: allRegions,
      prefectures: allPrefectures,
    },
    revalidate: 3600,
  };
};
