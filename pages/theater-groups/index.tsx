import { GetStaticProps } from 'next';
import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import TheaterGroupCard from '@/components/TheaterGroupCard';
import { prisma } from '@/lib/prisma';
import { groupTypeLabels } from '@/lib/university-theater-constants';
import { FaSearch, FaChevronRight, FaTheaterMasks } from 'react-icons/fa';

const PAGE_SIZE = 60;

const TYPE_TABS = [
  { key: '', label: 'すべて' },
  { key: 'STUDENT,INTERCOLLEGE,ACADEMIC', label: '大学演劇' },
  { key: 'PROFESSIONAL', label: 'プロ劇団' },
  { key: 'AMATEUR', label: '社会人劇団' },
  { key: 'YOUTH', label: 'ユース' },
];

const PREFECTURES = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
  '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県',
  '三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県',
  '鳥取県','島根県','岡山県','広島県','山口県',
  '徳島県','香川県','愛媛県','高知県',
  '福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県',
];

type Props = {
  theaterGroups: any[];
  prefecturesWithData: string[];
  stats: { total: number; student: number; pro: number; amateur: number };
};

export default function TheaterGroupsIndex({ theaterGroups, prefecturesWithData, stats }: Props) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPrefecture, setSelectedPrefecture] = useState('');
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    return theaterGroups.filter((g: any) => {
      if (search) {
        const q = search.toLowerCase();
        const nameMatch = g.name.toLowerCase().includes(q);
        const prefMatch = g.prefecture?.toLowerCase().includes(q);
        const uniMatch = g.universities?.some((u: any) => u.university.name.toLowerCase().includes(q));
        if (!nameMatch && !prefMatch && !uniMatch) return false;
      }
      if (selectedType) {
        const types = selectedType.split(',');
        if (!types.includes(g.groupType)) return false;
      }
      if (selectedPrefecture && g.prefecture !== selectedPrefecture) return false;
      return true;
    });
  }, [theaterGroups, search, selectedType, selectedPrefecture]);

  const displayed = useMemo(() => filtered.slice(0, displayCount), [filtered, displayCount]);
  const hasMore = filtered.length > displayCount;

  // Reset display count when filters change
  const handleFilterChange = useCallback((setter: (v: string) => void, value: string) => {
    setter(value);
    setDisplayCount(PAGE_SIZE);
  }, []);

  return (
    <Layout>
      <Seo
        pageTitle="劇団データベース | 全国の劇団・演劇団体を検索"
        pageDescription={`全国${stats.total}団体の劇団情報を掲載。大学演劇${stats.student}団体、プロ劇団${stats.pro}団体、社会人劇団${stats.amateur}団体を検索できます。`}
        pagePath="/theater-groups"
        pageKeywords={['劇団', '演劇', '大学演劇', '学生劇団', '小劇場', '劇団一覧', '演劇団体']}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'ホーム', url: 'https://gikyokutosyokan.com' },
          { name: '劇団データベース', url: 'https://gikyokutosyokan.com/theater-groups' },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        title="劇団データベース | 全国の劇団・演劇団体を検索"
        description={`全国${stats.total}団体の劇団情報を掲載。大学演劇・プロ劇団・社会人劇団を検索できます。`}
        url="https://gikyokutosyokan.com/theater-groups"
        numberOfItems={stats.total}
      />

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* パンくず */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-theater-primary-600">ホーム</Link>
          <FaChevronRight className="text-[8px]" />
          <span className="text-gray-700">劇団データベース</span>
        </nav>

        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FaTheaterMasks className="text-theater-primary-500" />
            劇団データベース
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            全国{stats.total}団体の演劇団体を検索できます
          </p>
        </div>

        {/* 統計バー */}
        <div className="flex flex-wrap gap-3 mb-5 text-sm">
          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-bold">大学演劇 {stats.student}</span>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-bold">プロ {stats.pro}</span>
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-bold">社会人 {stats.amateur}</span>
        </div>

        {/* タイプタブ */}
        <div className="flex gap-0 border-b border-gray-200 mb-4">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleFilterChange(setSelectedType, tab.key)}
              className={`px-3 py-2 text-sm font-bold transition-colors relative whitespace-nowrap
                ${selectedType === tab.key ? 'text-theater-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab.label}
              {selectedType === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-theater-primary-500" />
              )}
            </button>
          ))}
        </div>

        {/* 検索 + 都道府県フィルター */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="劇団名・大学名・地域で検索"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setDisplayCount(PAGE_SIZE); }}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-theater-primary-200"
            />
          </div>
          <select
            value={selectedPrefecture}
            onChange={(e) => handleFilterChange(setSelectedPrefecture, e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-theater-primary-200"
          >
            <option value="">全都道府県</option>
            {prefecturesWithData.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* 件数 */}
        <p className="text-sm text-gray-500 mb-4">{filtered.length}件の劇団</p>

        {/* カード一覧 */}
        {filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayed.map((g: any) => (
                <TheaterGroupCard key={g.slug} group={g} />
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setDisplayCount((prev) => prev + PAGE_SIZE)}
                  className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                >
                  さらに表示する（残り{filtered.length - displayCount}件）
                </button>
              </div>
            )}
          </>
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
      prefecture: true,
      website: true,
      twitter: true,
      universities: {
        include: {
          university: {
            select: { name: true, prefecture: true },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  const prefecturesWithData = Array.from(new Set(
    theaterGroups.map((g) => g.prefecture).filter(Boolean)
  )).sort() as string[];

  const stats = {
    total: theaterGroups.length,
    student: theaterGroups.filter((g) => ['STUDENT', 'INTERCOLLEGE', 'ACADEMIC'].includes(g.groupType)).length,
    pro: theaterGroups.filter((g) => g.groupType === 'PROFESSIONAL').length,
    amateur: theaterGroups.filter((g) => g.groupType === 'AMATEUR').length,
  };

  const slimGroups = theaterGroups.map((g) => ({
    name: g.name,
    slug: g.slug,
    groupType: g.groupType,
    description: g.description ? g.description.substring(0, 80) : null,
    prefecture: g.prefecture,
    website: g.website || null,
    twitter: g.twitter || null,
    universities: g.universities?.map((u: any) => ({
      university: { name: u.university.name, prefecture: u.university.prefecture },
    })),
  }));

  return {
    props: {
      theaterGroups: JSON.parse(JSON.stringify(slimGroups)),
      prefecturesWithData,
      stats,
    },
    revalidate: 604800,
  };
};
