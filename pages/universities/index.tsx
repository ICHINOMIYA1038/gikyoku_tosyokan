import { GetStaticProps } from 'next';
import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import UniversityCard from '@/components/UniversityCard';
import { prisma } from '@/lib/prisma';
import { FaSearch, FaFilter } from 'react-icons/fa';

const regionLabels: Record<string, string> = {
  HOKKAIDO: '北海道',
  TOHOKU: '東北',
  KANTO: '関東',
  CHUBU: '中部',
  KANSAI: '関西',
  CHUGOKU_SHIKOKU: '中国・四国',
  KYUSHU_OKINAWA: '九州・沖縄',
};

const typeLabels: Record<string, string> = {
  NATIONAL: '国立',
  PUBLIC: '公立',
  PRIVATE: '私立',
};

type Props = {
  universities: any[];
  regions: string[];
  prefectures: string[];
};

export default function UniversitiesIndex({ universities, regions, prefectures }: Props) {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPrefecture, setSelectedPrefecture] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const filteredPrefectures = useMemo(() => {
    if (!selectedRegion) return prefectures;
    return Array.from(new Set(
      universities.filter((u) => u.region === selectedRegion).map((u) => u.prefecture)
    )).sort();
  }, [selectedRegion, universities, prefectures]);

  const filtered = useMemo(() => {
    return universities.filter((u) => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedType && u.universityType !== selectedType) return false;
      if (selectedRegion && u.region !== selectedRegion) return false;
      if (selectedPrefecture && u.prefecture !== selectedPrefecture) return false;
      return true;
    });
  }, [universities, search, selectedRegion, selectedPrefecture, selectedType]);

  return (
    <Layout>
      <Seo
        pageTitle="大学一覧"
        pageDescription="演劇サークル・学生劇団がある全国の大学一覧です。地域、種別で検索できます。"
        pagePath="/universities"
        pageKeywords={['大学演劇', '大学一覧', '演劇サークル']}
      />

      <div className="px-4 py-6">
        {/* ヒーロー */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 md:p-8 mb-6">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            大学一覧
          </h1>
          <p className="text-sm text-gray-600">
            演劇サークル・学生劇団がある全国{universities.length}校の大学
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
                placeholder="大学名で検索"
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
              {Object.entries(typeLabels).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 件数 */}
        <p className="text-sm text-gray-500 mb-4">{filtered.length}校の大学</p>

        {/* カード一覧 */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((u: any) => (
              <UniversityCard key={u.slug} university={u} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>条件に一致する大学が見つかりませんでした</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const universities = await prisma.university.findMany({
    select: {
      name: true,
      slug: true,
      universityType: true,
      prefecture: true,
      region: true,
      _count: { select: { theaterGroups: true } },
    },
    orderBy: { name: 'asc' },
  });

  const allPrefectures = Array.from(new Set(universities.map((u) => u.prefecture))).sort();
  const allRegions = Array.from(new Set(universities.map((u) => u.region)));

  return {
    props: {
      universities: JSON.parse(JSON.stringify(universities)),
      regions: allRegions,
      prefectures: allPrefectures,
    },
    revalidate: 3600,
  };
};
