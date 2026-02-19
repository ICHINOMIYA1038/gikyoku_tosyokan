import Head from "next/head";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import { Author } from "@prisma/client";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FaChevronRight } from "react-icons/fa";

interface AuthorListPageProps {
  authors: (Author & { posts: any[] })[];
}

function AuthorListPage({ authors }: AuthorListPageProps) {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '作者一覧',
    numberOfItems: authors.length,
    itemListElement: authors.slice(0, 50).map((a: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: a.name,
      url: `https://gikyokutosyokan.com/authors/${a.id}`,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://gikyokutosyokan.com' },
      { '@type': 'ListItem', position: 2, name: '作者一覧' },
    ],
  };

  return (
    <>
      <Seo
        pageTitle="作者一覧"
        pageDescription={`戯曲図書館に登録されている${authors.length}名の脚本家・劇作家の一覧ページです。作品を探す際にご活用ください。`}
        pagePath="/authors"
        pageKeywords={['脚本家一覧', '劇作家', '演劇作者', '戯曲作家']}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          {/* パンくず */}
          <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4">
            <Link href="/" className="hover:text-pink-700">ホーム</Link>
            <FaChevronRight className="text-[8px]" />
            <span className="text-gray-800">作者一覧</span>
          </nav>

          <h1 className="text-3xl font-bold mb-8 text-center">作者一覧</h1>
          {authors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {authors.map((author: any) => (
                <Link
                  key={author.id}
                  href={`/authors/${author.id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h2 className="text-lg font-semibold">{author.name}</h2>
                  {author.posts && author.posts.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      作品数: {author.posts.length}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">現在、表示できる作者がいません。</p>
          )}
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  try {
    const authors = await prisma.author.findMany({
      include: {
        posts: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return {
      props: {
        authors: JSON.parse(JSON.stringify(authors)),
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}

export default AuthorListPage;
