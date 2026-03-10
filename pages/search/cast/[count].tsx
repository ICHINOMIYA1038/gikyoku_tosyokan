import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostCardList from "@/components/PostCardList";
import { FaUsers, FaTheaterMasks } from "react-icons/fa";
import { GetStaticProps, GetStaticPaths } from "next";

const CAST_CONFIGS: Record<number, { title: string; description: string; label: string; min: number; max: number }> = {
  1: {
    title: "一人芝居・モノローグの脚本",
    description: "1人で演じられる一人芝居・モノローグの脚本一覧。朗読劇、オーディション課題、演技練習にもおすすめ。モノドラマの名作が見つかります。",
    label: "1人芝居",
    min: 0, max: 1,
  },
  2: {
    title: "二人芝居・2人で演じられる脚本",
    description: "2人で上演できる二人芝居の脚本一覧。少人数で取り組みやすく、掛け合いの面白さが魅力。文化祭や小劇場公演におすすめの二人芝居を多数掲載。",
    label: "2人芝居",
    min: 2, max: 2,
  },
  3: {
    title: "3人で演じられる脚本・台本",
    description: "3人で上演できる脚本一覧。少人数ながら多彩な関係性を描ける3人芝居。文化祭、演劇部、サークル公演におすすめの作品を掲載。",
    label: "3人芝居",
    min: 3, max: 3,
  },
  4: {
    title: "4人で演じられる脚本・台本",
    description: "4人で上演できる脚本一覧。小グループでも見応えのある芝居が可能。コメディからシリアスまで幅広いジャンルの4人芝居を掲載。",
    label: "4人芝居",
    min: 4, max: 4,
  },
  5: {
    title: "5人で演じられる脚本・台本",
    description: "5人で上演できる脚本一覧。グループ劇として人気の5人芝居。文化祭のクラス有志公演やサークル活動にぴったりの作品が見つかります。",
    label: "5人芝居",
    min: 5, max: 5,
  },
  6: {
    title: "6人で演じられる脚本・台本",
    description: "6人で上演できる脚本一覧。演劇部やサークルの定期公演に最適な規模。多彩なキャラクターが登場する作品が揃います。",
    label: "6人芝居",
    min: 6, max: 6,
  },
  7: {
    title: "7人で演じられる脚本・台本",
    description: "7人で上演できる脚本一覧。部活動やサークル公演にちょうどよい人数。群像劇やコメディなど多彩な作品を掲載。",
    label: "7人芝居",
    min: 7, max: 7,
  },
  8: {
    title: "8人で演じられる脚本・台本",
    description: "8人で上演できる脚本一覧。演劇部の公演や文化祭の本格的な舞台にぴったり。見応えのある作品が見つかります。",
    label: "8人芝居",
    min: 8, max: 8,
  },
  10: {
    title: "10人前後で演じられる脚本・台本",
    description: "9〜11人で上演できる脚本一覧。演劇部やクラス公演に最適な中人数の作品。文化祭・学園祭で人気の脚本を掲載。",
    label: "10人前後",
    min: 9, max: 11,
  },
  15: {
    title: "15人前後で演じられる脚本・台本",
    description: "12〜18人で上演できる脚本一覧。クラス公演や演劇部の大きめの舞台に。全員に見せ場がある群像劇やミュージカルが人気。",
    label: "15人前後",
    min: 12, max: 18,
  },
  20: {
    title: "20人以上の大人数で演じられる脚本",
    description: "20人以上で上演できる大人数向け脚本一覧。学芸会、クラス全員参加の劇、大規模公演向けの作品を掲載。群像劇やミュージカルがおすすめ。",
    label: "20人以上",
    min: 19, max: 999,
  },
};

const ALL_COUNTS = Object.keys(CAST_CONFIGS).map(Number);

interface Props {
  posts: any[];
  totalCount: number;
  count: number;
  config: (typeof CAST_CONFIGS)[number];
}

export default function CastCountPage({ posts, totalCount, count, config }: Props) {
  return (
    <Layout>
      <Seo
        pageTitle={`${config.title}｜${totalCount}作品掲載`}
        pageDescription={config.description}
        pagePath={`/search/cast/${count}`}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "人数別脚本", url: "https://gikyokutosyokan.com/guide/cast-size" },
          { name: config.label, url: `https://gikyokutosyokan.com/search/cast/${count}` },
        ]}
      />
      <StructuredData
        type="Article"
        title={config.title}
        description={config.description}
        url={`https://gikyokutosyokan.com/search/cast/${count}`}
        datePublished="2024-01-01"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <FaUsers className="text-3xl text-indigo-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {config.title}
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            {config.description.split("。")[0]}
          </p>
          <p className="text-sm text-gray-500">
            {totalCount}作品が見つかりました
          </p>
        </header>

        {/* 人数クイックナビ */}
        <div className="mb-8 bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-2 font-medium">人数で絞り込み</p>
          <div className="flex flex-wrap gap-2">
            {ALL_COUNTS.map((c) => (
              <Link
                key={c}
                href={`/search/cast/${c}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  c === count
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                {CAST_CONFIGS[c].label}
              </Link>
            ))}
          </div>
        </div>

        {/* 作品一覧 */}
        {posts.length > 0 ? (
          <PostCardList posts={posts} />
        ) : (
          <div className="text-center py-16 text-gray-500">
            <FaTheaterMasks className="text-4xl mx-auto mb-4 text-gray-300" />
            <p>該当する作品が見つかりませんでした</p>
          </div>
        )}

        {/* 関連ページ */}
        <section className="mt-12 bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">関連ページ</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/guide/cast-size" className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 text-sm">
              人数別の選び方ガイド
            </Link>
            <Link href="/search/short" className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 text-sm">
              短編戯曲（30分以内）
            </Link>
            <Link href="/search/school" className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 text-sm">
              学校演劇向け
            </Link>
            <Link href="/search/comedy" className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 text-sm">
              コメディ戯曲
            </Link>
            <Link href="/lp/shindan" className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 text-sm">
              脚本診断
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ALL_COUNTS.map((count) => ({ params: { count: String(count) } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const count = parseInt(params?.count as string);
  const config = CAST_CONFIGS[count];

  if (!config) return { notFound: true };

  try {
    const posts = await prisma.post.findMany({
      where: {
        totalNumber: {
          gte: config.min,
          lte: config.max,
        },
      },
      include: {
        author: { select: { id: true, name: true } },
        categories: { select: { id: true, name: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { averageRating: "desc" },
      take: 100,
    });

    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
        totalCount: posts.length,
        count,
        config,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return { props: { posts: [], totalCount: 0, count, config } };
  }
};
