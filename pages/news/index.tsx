import { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import NewsList from '@/components/NewsList';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { FaHome, FaChevronRight } from 'react-icons/fa';

interface Props {
  news: Array<{
    id: number;
    date: string;
    category: string;
    title: string;
    url: string;
  }>;
}

export default function NewsPage({ news }: Props) {
  return (
    <Layout>
      <Seo
        pageTitle="お知らせ一覧"
        pageDescription="戯曲図書館のお知らせ・更新情報一覧"
        pagePath="/news"
      />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <nav className="mb-6">
          <ol className="flex items-center gap-1 text-sm text-gray-600">
            <li className="flex items-center">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                <FaHome className="inline mr-1" />ホーム
              </Link>
            </li>
            <li className="flex items-center">
              <FaChevronRight className="mx-2 text-gray-400" size={10} />
              <span className="text-gray-900 font-medium">お知らせ</span>
            </li>
          </ol>
        </nav>

        <NewsList news={news} showAll={true} />
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const newsData = await prisma.news.findMany({
    orderBy: { date: 'desc' },
    select: {
      id: true,
      date: true,
      url: true,
      category: true,
      title: true,
    },
  });

  const news = newsData.map((n) => ({
    id: n.id,
    date: n.date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
    category: n.category,
    title: n.title,
    url: n.url || '',
  }));

  return {
    props: { news },
    // ニュースは1日1回の再生成で十分(編集時は on-demand revalidate を別途検討)
    revalidate: 86400,
  };
};
