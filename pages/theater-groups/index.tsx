import { GetStaticProps } from 'next';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import TheaterGroupCard from '@/components/TheaterGroupCard';
import { prisma } from '@/lib/prisma';
import { regionLabels, groupTypeLabels } from '@/lib/university-theater-constants';
import { FaSearch, FaFilter, FaChevronRight } from 'react-icons/fa';

type Props = {
  theaterGroups: any[];
  regions: string[];
  prefectures: string[];
};

export default function TheaterGroupsIndex({ theaterGroups, regions, prefectures }: Props) {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPrefecture, setSelectedPrefecture] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const filteredPrefectures = useMemo(() => {
    if (!selectedRegion) return prefectures;
    return Array.from(new Set(
      theaterGroups
        .filter((g) => g.universities?.some((u: any) => u.university.region === selectedRegion))
        .flatMap((g) => g.universities?.map((u: any) => u.university.prefecture) ?? [])
    )).sort();
  }, [selectedRegion, theaterGroups, prefectures]);

  const filtered = useMemo(() => {
    return theaterGroups.filter((g) => {
      if (search && !g.name.toLowerCase().includes(search.toLowerCase()) &&
          !g.universities?.some((u: any) => u.university.name.includes(search))) return false;
      if (selectedType && g.groupType !== selectedType) return false;
      if (selectedRegion && !g.universities?.some((u: any) => u.university.region === selectedRegion)) return false;
      if (selectedPrefecture && !g.universities?.some((u: any) => u.university.prefecture === selectedPrefecture)) return false;
      return true;
    });
  }, [theaterGroups, search, selectedRegion, selectedPrefecture, selectedType]);

  return (
    <Layout>
      <Seo
        pageTitle="大学演劇 劇団一覧"
        pageDescription="全国の大学学生劇団・演劇サークルの一覧です。地域、都道府県、種別で検索できます。"
        pagePath="/theater-groups"
        pageKeywords={['大学演劇', '学生劇団', '演劇サークル', '劇団一覧']}
      />

      <div className="px-4 py-6">
        {/* パンくず */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-pink-600">ホーム</Link>
          <FaChevronRight className="text-[8px]" />
          <Link href="/university-theater" className="hover:text-pink-600">大学演劇</Link>
          <FaChevronRight className="text-[8px]" />
          <span className="text-gray-700">劇団一覧</span>
        </nav>

        {/* ヒーロー */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 md:p-8 mb-6">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            大学演劇 劇団一覧
          </h1>
          <p className="text-sm text-gray-600">
            全国{theaterGroups.length}団体の学生劇団・演劇サークル情報
          </p>
        </div>

        {/* フィルタ */}
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
                placeholder="劇団名・大学名で検索"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => { setSelectedRegion(e.target.value); setSelectedPrefecture(''); }}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
            >
              <option value="">全地域</option>
              {regions.map((r) => (
                <option key={r} value={r}>{regionLabels[r] || r}</option>
              ))}
            </select>
            <select
              value={selectedPrefecture}
              onChange={(e) => setSelectedPrefecture(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
            >
              <option value="">全都道府県</option>
              {filteredPrefectures.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
            >
              <option value="">全種別</option>
              {Object.entries(groupTypeLabels).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 件数 */}
        <p className="text-sm text-gray-500 mb-4">{filtered.length}件の劇団</p>

        {/* カード一覧 */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((g: any) => (
              <TheaterGroupCard key={g.slug} group={g} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>条件に一致する劇団が見つかりませんでした</p>
          </div>
        )}
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
  });

  const allPrefectures = Array.from(new Set(
    theaterGroups.flatMap((g) => g.universities.map((u) => u.university.prefecture))
  )).sort();

  const allRegions = Array.from(new Set(
    theaterGroups.flatMap((g) => g.universities.map((u) => u.university.region))
  ));

  return {
    props: {
      theaterGroups: JSON.parse(JSON.stringify(theaterGroups)),
      regions: allRegions,
      prefectures: allPrefectures,
    },
    revalidate: 3600,
  };
};
