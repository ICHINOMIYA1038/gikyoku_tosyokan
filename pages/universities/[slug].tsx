import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import TheaterGroupCard from '@/components/TheaterGroupCard';
import { prisma } from '@/lib/prisma';
import { FaChevronRight, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

const typeLabels: Record<string, string> = {
  NATIONAL: '国立',
  PUBLIC: '公立',
  PRIVATE: '私立',
};

const regionLabels: Record<string, string> = {
  HOKKAIDO: '北海道',
  TOHOKU: '東北',
  KANTO: '関東',
  CHUBU: '中部',
  KANSAI: '関西',
  CHUGOKU_SHIKOKU: '中国・四国',
  KYUSHU_OKINAWA: '九州・沖縄',
};

type Props = {
  university: any;
};

export default function UniversityDetail({ university }: Props) {
  if (!university) return null;

  const groups = university.theaterGroups?.map((tgu: any) => ({
    ...tgu.theaterGroup,
    universities: [{ university: { name: university.name, slug: university.slug, prefecture: university.prefecture } }],
  })) ?? [];

  return (
    <Layout>
      <Seo
        pageTitle={university.name}
        pageDescription={`${university.name}の学生劇団・演劇サークル一覧`}
        pagePath={`/universities/${university.slug}`}
        pageKeywords={['大学演劇', university.name, '学生劇団']}
      />

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* パンくず */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4 flex-wrap">
          <Link href="/" className="hover:text-pink-700">ホーム</Link>
          <FaChevronRight className="text-[8px]" />
          <Link href="/universities" className="hover:text-pink-700">大学一覧</Link>
          <FaChevronRight className="text-[8px]" />
          <span className="text-gray-800">{university.name}</span>
        </nav>

        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 md:p-8 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800">
              {university.name}
            </h1>
            <span className="shrink-0 mt-1 px-2 py-0.5 text-xs font-medium rounded bg-white/80 text-gray-700">
              {typeLabels[university.universityType] || university.universityType}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-pink-500" />
              <span>{university.prefecture}（{regionLabels[university.region] || university.region}）</span>
            </div>
            {university.website && (
              <a href={university.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-pink-700 hover:underline">
                <FaGlobe />
                <span>公式サイト</span>
              </a>
            )}
          </div>
        </div>

        {/* 劇団一覧 */}
        <section>
          <h2 className="font-serif font-bold text-lg text-gray-800 mb-4">
            演劇サークル・劇団（{groups.length}団体）
          </h2>
          {groups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groups.map((g: any) => (
                <TheaterGroupCard key={g.slug} group={g} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-8 text-center">
              登録されている劇団はありません
            </p>
          )}
        </section>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const universities = await prisma.university.findMany({
    select: { slug: true },
  });

  return {
    paths: universities.map((u) => ({ params: { slug: u.slug } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  const university = await prisma.university.findUnique({
    where: { slug },
    include: {
      theaterGroups: {
        include: {
          theaterGroup: {
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
              isActive: true,
            },
          },
        },
      },
    },
  });

  if (!university) return { notFound: true };

  return {
    props: { university: JSON.parse(JSON.stringify(university)) },
    revalidate: 3600,
  };
};
