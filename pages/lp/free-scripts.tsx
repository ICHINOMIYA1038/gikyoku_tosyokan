import { GetStaticProps } from "next";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import PostCard from "@/components/PostCard";
import FAQ from "@/components/FAQ";
import Link from "next/link";
import Head from "next/head";
import { prisma } from "@/lib/prisma";
import { FaExternalLinkAlt, FaSearch, FaBookOpen } from "react-icons/fa";
import AdSlot from "@/components/Ad/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";

interface FreeScriptsPageProps {
  posts: any[];
  totalCount: number;
}

export default function FreeScriptsPage({ posts, totalCount }: FreeScriptsPageProps) {
  const faqItems = [
    {
      question: "演劇台本を無料で読めるサイトはありますか？",
      answer:
        "はい、青空文庫やハヤカワ演劇文庫の一部作品、作者個人のウェブサイトなどで無料公開されている台本があります。戯曲図書館では、外部リンクが登録されている作品を一覧で確認できます。",
    },
    {
      question: "高校演劇のコンクールでフリー台本を使えますか？",
      answer:
        "フリーで公開されている台本でも、上演許可が必要な場合があります。必ず作者の利用規約を確認し、必要に応じて上演許可を取得してください。無料公開＝自由に上演可能とは限りません。",
    },
    {
      question: "無料で使える短編台本を探しています",
      answer:
        "このページでは外部サイトで台本が公開されている作品を掲載しています。上演時間や人数でさらに絞り込みたい場合は、戯曲図書館のトップページから詳細検索をご利用ください。",
    },
  ];

  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "無料で使える演劇台本・フリー脚本まとめ",
    description:
      "外部サイトで台本が公開されている演劇脚本の一覧。高校演劇やアマチュア公演の台本探しに。",
    numberOfItems: totalCount,
    itemListElement: posts.slice(0, 20).map((post: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: `https://gikyokutosyokan.com/posts/${post.id}`,
    })),
  };

  return (
    <Layout>
      <Seo
        pageTitle="無料で使える演劇台本・フリー脚本まとめ"
        pageDescription="無料で読める演劇台本・フリー脚本を一覧で紹介。高校演劇やアマチュア公演の台本探しに。外部サイトで全文公開されている戯曲をまとめました。"
        pagePath="/lp/free-scripts"
        pageKeywords={[
          "演劇台本 フリー",
          "高校演劇 台本 フリー",
          "無料 脚本",
          "演劇 台本 無料",
          "フリー台本",
        ]}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          {
            name: "無料で使える演劇台本",
            url: "https://gikyokutosyokan.com/lp/free-scripts",
          },
        ]}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListStructuredData),
          }}
        />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            無料で使える演劇台本・フリー脚本まとめ
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            外部サイトで台本が公開されている戯曲を集めました。高校演劇のコンクールやアマチュア公演の台本探しにご活用ください。
          </p>
          <p className="text-sm text-gray-500 mt-3">
            {totalCount}作品が見つかりました
          </p>
        </header>

        {/* 注意書き */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-10">
          <h2 className="font-bold text-gray-800 mb-2">ご利用にあたって</h2>
          <ul className="text-sm text-gray-600 space-y-1.5 list-disc list-inside">
            <li>
              ここに掲載されている作品は、作者や出版社のウェブサイトで台本が公開されているものです。
            </li>
            <li>
              上演する場合は各作品の利用規約を確認し、必要に応じて上演許可を取得してください。
            </li>
            <li>
              リンク先の内容は各サイト管理者によるものです。リンク切れの場合はご了承ください。
            </li>
          </ul>
        </div>

        {/* ブログ記事リンク */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-10">
          <div className="flex items-start gap-3">
            <FaBookOpen className="text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <h2 className="font-bold text-gray-800 mb-1">
                フリー台本サイトの総合ガイド
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                無料で台本を公開しているサイトの特徴や使い方を詳しく解説しています。
              </p>
              <Link
                href="/blog/ja/2026-02-15-free-script-sites"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                フリー台本サイトまとめ記事を読む
                <FaExternalLinkAlt className="text-xs" />
              </Link>
            </div>
          </div>
        </div>

        {/* 作品一覧 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            台本が公開されている作品一覧
          </h2>
          {posts.length > 0 ? (
            <div className="space-y-0">
              {posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              作品が見つかりませんでした
            </p>
          )}
        </section>

        <AdSlot slot={AD_SLOTS.CATEGORY_AFTER_LIST} format="horizontal" />

        {/* 詳細検索リンク */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">
            もっと詳しい条件で探したい場合は
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 font-medium"
          >
            <FaSearch className="text-sm" />
            詳細検索で探す
          </Link>
        </div>

        {/* 関連ページ */}
        <section className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">関連ページ</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/lp/school-festival"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
            >
              文化祭におすすめの台本
            </Link>
            <Link
              href="/lp/two-person-plays"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
            >
              二人芝居の名作
            </Link>
            <Link
              href="/lp/crying-plays"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
            >
              泣ける演劇台本
            </Link>
            <Link
              href="/search/bunkasai"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
            >
              文化祭向け戯曲
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <FAQ items={faqItems} />
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { website1: { not: null } },
          { website2: { not: null } },
          { link_to_plot: { not: null } },
        ],
      },
      select: {
        id: true,
        title: true,
        synopsis: true,
        image_url: true,
        playtime: true,
        totalNumber: true,
        man: true,
        woman: true,
        averageRating: true,
        website1: true,
        website2: true,
        link_to_plot: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: [{ averageRating: "desc" }, { id: "desc" }],
      take: 80,
    });

    // Filter out posts where all link fields are empty strings
    const filtered = posts.filter(
      (p) =>
        (p.website1 && p.website1.trim() !== "") ||
        (p.website2 && p.website2.trim() !== "") ||
        (p.link_to_plot && p.link_to_plot.trim() !== "")
    );

    return {
      props: {
        posts: JSON.parse(JSON.stringify(filtered)),
        totalCount: filtered.length,
      },
      revalidate: 2592000,
    };
  } catch (error) {
    console.error("Error fetching free scripts:", error);
    return {
      props: {
        posts: [],
        totalCount: 0,
      },
    };
  }
};
