import { GetStaticProps } from 'next';
import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import TheaterGroupList from '@/components/TheaterGroupList';
import Breadcrumb from '@/components/Breadcrumb';
import { prisma } from '@/lib/prisma';

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

  const typeCounts: Record<string, number> = {
    '': stats.total,
    'STUDENT,INTERCOLLEGE,ACADEMIC': stats.student,
    PROFESSIONAL: stats.pro,
    AMATEUR: stats.amateur,
  };

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

      <div className="max-w-5xl mx-auto pt-6 md:pt-8 pb-12">
        <Breadcrumb items={[{ name: 'ホーム', href: '/' }, { name: '劇団データベース' }]} />

        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[26px] md:text-[32px] font-serif font-bold text-gray-900 leading-tight">劇団データベース</h1>
            <p className="mt-2 text-base text-gray-600">全国{stats.total}団体の劇団・演劇団体を、名前・大学・地域から探せます。</p>
          </div>
          <Link href="/support/posting-request" className="text-sm text-theater-primary-700 underline underline-offset-4 hover:text-theater-primary-800 shrink-0">
            劇団の掲載・情報の修正を依頼する
          </Link>
        </div>

        <nav aria-label="種別" className="mt-6 flex gap-6 border-b border-[#D9D5CF] text-sm overflow-x-auto">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleFilterChange(setSelectedType, tab.key)}
              aria-pressed={selectedType === tab.key}
              className={`-mb-px py-2 whitespace-nowrap border-b-2 ${
                selectedType === tab.key
                  ? 'border-theater-primary-600 text-gray-900 font-bold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {typeCounts[tab.key] !== undefined && <span className="ml-1 text-gray-500 font-normal tabular-nums">{typeCounts[tab.key]}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-4 flex flex-wrap gap-2">
          <input
            type="search"
            placeholder="劇団名・大学名・地域"
            aria-label="劇団名・大学名・地域で絞り込む"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setDisplayCount(PAGE_SIZE); }}
            className="flex-1 min-w-[12rem] h-11 px-3 rounded border border-[#D9D5CF] text-base focus:outline-none focus:border-theater-primary-600"
          />
          <select
            value={selectedPrefecture}
            onChange={(e) => handleFilterChange(setSelectedPrefecture, e.target.value)}
            aria-label="都道府県"
            className="h-11 px-3 rounded border border-[#D9D5CF] bg-white text-sm"
          >
            <option value="">都道府県（すべて）</option>
            {prefecturesWithData.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <p className="mt-6 mb-2 text-sm text-gray-600 tabular-nums">{filtered.length}団体</p>

        {filtered.length > 0 ? (
          <>
            <TheaterGroupList groups={displayed} />
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setDisplayCount((prev) => prev + PAGE_SIZE)}
                  className="h-11 px-6 rounded border border-[#D9D5CF] text-sm font-medium text-gray-800 hover:bg-[#F4F2EE]"
                >
                  さらに表示する（残り{filtered.length - displayCount}団体）
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="border-y border-[#D9D5CF] py-12 text-center text-gray-700">
            <p>条件に合う劇団が見つかりませんでした。</p>
            <Link href="/support/posting-request" className="mt-3 inline-block text-sm text-theater-primary-700 underline underline-offset-4">
              劇団の掲載を依頼する
            </Link>
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
    revalidate: 2592000,
  };
};
