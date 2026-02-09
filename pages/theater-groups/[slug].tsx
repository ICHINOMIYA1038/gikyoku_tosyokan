import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import SocialLinks from '@/components/SocialLinks';
import { prisma } from '@/lib/prisma';
import { FaUniversity, FaUsers, FaCalendarAlt, FaChevronRight, FaBook } from 'react-icons/fa';

const groupTypeLabels: Record<string, string> = {
  STUDENT: '学生劇団',
  INTERCOLLEGE: 'インカレ',
  ACADEMIC: '大学学科',
  AMATEUR: '社会人',
  PROFESSIONAL: 'プロ',
  YOUTH: 'ユース',
};

type Props = {
  group: any;
};

export default function TheaterGroupDetail({ group }: Props) {
  if (!group) return null;

  return (
    <Layout>
      <Seo
        pageTitle={group.name}
        pageDescription={group.description || `${group.name}の情報ページ`}
        pagePath={`/theater-groups/${group.slug}`}
        pageKeywords={['大学演劇', '学生劇団', group.name]}
      />

      <div className="px-4 py-6 max-w-3xl mx-auto">
        {/* パンくず */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4 flex-wrap">
          <Link href="/" className="hover:text-pink-700">ホーム</Link>
          <FaChevronRight className="text-[8px]" />
          <Link href="/theater-groups" className="hover:text-pink-700">劇団一覧</Link>
          <FaChevronRight className="text-[8px]" />
          <span className="text-gray-800">{group.name}</span>
        </nav>

        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 md:p-8 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800">
              {group.name}
            </h1>
            <span className="shrink-0 mt-1 px-2 py-0.5 text-xs font-medium rounded bg-white/80 text-gray-700">
              {groupTypeLabels[group.groupType] || group.groupType}
            </span>
          </div>

          {group.description && (
            <p className="text-sm text-gray-600 mb-4">{group.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {group.memberCount && (
              <div className="flex items-center gap-1">
                <FaUsers className="text-blue-500" />
                <span>部員数: {group.memberCount}名</span>
              </div>
            )}
            {group.foundedYear && (
              <div className="flex items-center gap-1">
                <FaCalendarAlt className="text-green-500" />
                <span>設立: {group.foundedYear}年</span>
              </div>
            )}
          </div>
        </div>

        {/* 所属大学 */}
        {group.universities && group.universities.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
            <h2 className="font-serif font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
              <FaUniversity className="text-purple-500" />
              所属大学
            </h2>
            <ul className="space-y-2">
              {group.universities.map((u: any, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <Link
                    href={`/universities/${u.university.slug}`}
                    className="text-sm text-pink-700 hover:underline"
                  >
                    {u.university.name}
                  </Link>
                  {u.campus && (
                    <span className="text-xs text-gray-400">({u.campus})</span>
                  )}
                  <span className="text-xs text-gray-400">{u.university.prefecture}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* SNSリンク */}
        {(group.website || group.twitter || group.instagram || group.corich || (group.otherLinks && group.otherLinks.length > 0)) && (
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
            <h2 className="font-serif font-bold text-lg text-gray-800 mb-3">公式リンク</h2>
            <SocialLinks
              website={group.website}
              twitter={group.twitter}
              instagram={group.instagram}
              corich={group.corich}
              otherLinks={group.otherLinks}
            />
          </section>
        )}

        {/* 関連ブログ記事 */}
        {group.blogPostSlug && (
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
            <h2 className="font-serif font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
              <FaBook className="text-pink-500" />
              関連記事
            </h2>
            <Link
              href={`/blog/ja/${group.blogPostSlug}`}
              className="text-sm text-pink-700 hover:underline"
            >
              この劇団が掲載されているブログ記事を読む
            </Link>
          </section>
        )}
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const groups = await prisma.theaterGroup.findMany({
    select: { slug: true },
    where: { isActive: true },
  });

  return {
    paths: groups.map((g) => ({ params: { slug: g.slug } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  const group = await prisma.theaterGroup.findUnique({
    where: { slug },
    include: {
      universities: {
        include: {
          university: {
            select: {
              name: true,
              slug: true,
              universityType: true,
              prefecture: true,
              region: true,
            },
          },
        },
      },
    },
  });

  if (!group) return { notFound: true };

  return {
    props: { group: JSON.parse(JSON.stringify(group)) },
    revalidate: 3600,
  };
};
