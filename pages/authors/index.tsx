import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { FaSearch, FaUser, FaPen } from "react-icons/fa";
import AdSlot from "@/components/Ad/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";

const prisma = new PrismaClient();

type AuthorListItem = {
  id: number;
  name: string;
  group: string | null;
  postCount: number;
};

interface AuthorListPageProps {
  authors: AuthorListItem[];
}

function AuthorListPage({ authors }: AuthorListPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    if (!searchQuery) return authors;
    const q = searchQuery.toLowerCase();
    return authors.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.group && a.group.toLowerCase().includes(q))
    );
  }, [authors, searchQuery]);

  return (
    <>
      <Seo
        pageTitle={`作者一覧（${authors.length}名）`}
        pageDescription={`戯曲図書館に掲載されている劇作家・脚本家の一覧。${authors.length}名の作者を作品数順に掲載しています。別役実、平田オリザ、井上ひさし、野田秀樹など著名作家から、現代の小劇場作家まで。`}
        pagePath="/authors"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "作者一覧", url: "https://gikyokutosyokan.com/authors" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        title="作者一覧"
        description="戯曲図書館に掲載されている劇作家・脚本家の一覧"
        url="https://gikyokutosyokan.com/authors"
        numberOfItems={authors.length}
      />
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-theater-neutral-50 to-white">
          <div className="bg-gradient-to-r from-theater-primary-100 to-theater-primary-50 py-10 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <FaUser className="text-3xl text-theater-primary-500" />
                <h1 className="text-3xl md:text-4xl font-bold text-theater-neutral-900">
                  作者一覧
                </h1>
              </div>
              <p className="text-theater-neutral-700">
                {authors.length}名の劇作家・脚本家を作品数順で掲載しています。
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* 検索フィルタ */}
            <div className="mb-6 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="作者名・劇団名で絞り込み"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-theater-primary-400"
              />
              {searchQuery && (
                <p className="text-sm text-gray-500 mt-2">
                  {filtered.length}件ヒット
                </p>
              )}
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map((author) => (
                  <Link
                    key={author.id}
                    href={`/authors/${author.id}`}
                    className="block p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:border-theater-primary-300 transition-all"
                  >
                    <h2 className="text-base font-bold text-gray-900 group-hover:text-theater-primary-700 mb-1">
                      {author.name}
                    </h2>
                    {author.group && (
                      <p className="text-xs text-gray-500 truncate">{author.group}</p>
                    )}
                    <p className="text-xs text-theater-primary-600 mt-2 flex items-center gap-1">
                      <FaPen className="text-[10px]" />
                      {author.postCount}作品
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                該当する作者が見つかりませんでした。
              </p>
            )}

            <AdSlot slot={AD_SLOTS.CATEGORY_AFTER_LIST} format="horizontal" />
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  try {
    const authors = await prisma.author.findMany({
      select: {
        id: true,
        name: true,
        group: true,
        _count: { select: { posts: true } },
      },
    });

    // 作品数のあるものだけ＆作品数降順でソート
    const formatted: AuthorListItem[] = authors
      .filter((a) => a._count.posts > 0)
      .map((a) => ({
        id: a.id,
        name: a.name,
        group: a.group,
        postCount: a._count.posts,
      }))
      .sort((a, b) => b.postCount - a.postCount);

    return {
      props: {
        authors: formatted,
      },
      revalidate: 604800,
    };
  } catch {
    return {
      notFound: true,
    };
  } finally {
    await prisma.$disconnect();
  }
}

export default AuthorListPage;
