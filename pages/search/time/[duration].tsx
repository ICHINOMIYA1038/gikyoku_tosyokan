import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostCardList from "@/components/PostCardList";
import { FaClock, FaTheaterMasks } from "react-icons/fa";
import { GetStaticProps, GetStaticPaths } from "next";

const TIME_CONFIGS: Record<string, { title: string; description: string; label: string; min: number; max: number }> = {
  "15": {
    title: "15分以内の短編脚本・台本",
    description: "15分以内で上演できる超短編の脚本一覧。朝礼やイベントの余興、演技練習、オーディション課題にぴったり。初心者でもすぐに取り組めます。",
    label: "〜15分",
    min: 0, max: 15,
  },
  "30": {
    title: "30分以内の脚本・短編戯曲",
    description: "30分以内で上演できる短編脚本一覧。文化祭、学園祭、授業発表に最適。準備期間が短くても取り組みやすい作品が見つかります。",
    label: "〜30分",
    min: 0, max: 30,
  },
  "45": {
    title: "45分以内の脚本・台本",
    description: "45分以内で上演できる脚本一覧。高校演劇コンクールの規定時間（60分以内）にも対応。見応えのある中編作品が揃います。",
    label: "〜45分",
    min: 31, max: 45,
  },
  "60": {
    title: "60分以内の脚本・台本",
    description: "60分以内で上演できる脚本一覧。演劇部の定期公演や高校演劇コンクールに最適な長さ。本格的な作品に挑戦できます。",
    label: "〜60分",
    min: 31, max: 60,
  },
  "90": {
    title: "90分前後の脚本・台本",
    description: "61〜90分で上演できる脚本一覧。市民劇団やアマチュア劇団の本公演にぴったり。観客を飽きさせない充実した内容の作品。",
    label: "60〜90分",
    min: 61, max: 90,
  },
  "120": {
    title: "120分以上の長編脚本・台本",
    description: "90分以上の長編脚本一覧。プロ劇団や本格的な公演向け。じっくり物語を描く大作に挑戦したい方へ。",
    label: "90分以上",
    min: 91, max: 9999,
  },
};

const ALL_DURATIONS = ["15", "30", "45", "60", "90", "120"];

interface Props {
  posts: any[];
  totalCount: number;
  duration: string;
  config: (typeof TIME_CONFIGS)[string];
}

export default function TimeDurationPage({ posts, totalCount, duration, config }: Props) {
  return (
    <Layout>
      <Seo
        pageTitle={`${config.title}｜${totalCount}作品掲載`}
        pageDescription={config.description}
        pagePath={`/search/time/${duration}`}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "上演時間別脚本", url: "https://gikyokutosyokan.com/guide/time" },
          { name: config.label, url: `https://gikyokutosyokan.com/search/time/${duration}` },
        ]}
      />
      <StructuredData
        type="Article"
        title={config.title}
        description={config.description}
        url={`https://gikyokutosyokan.com/search/time/${duration}`}
        datePublished="2024-01-01"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <FaClock className="text-3xl text-emerald-500" />
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

        {/* 時間クイックナビ */}
        <div className="mb-8 bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-2 font-medium">上演時間で絞り込み</p>
          <div className="flex flex-wrap gap-2">
            {ALL_DURATIONS.map((d) => (
              <Link
                key={d}
                href={`/search/time/${d}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  d === duration
                    ? "bg-emerald-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-300 hover:bg-emerald-50"
                }`}
              >
                {TIME_CONFIGS[d].label}
              </Link>
            ))}
          </div>
        </div>

        {/* ヒント */}
        {duration === "60" && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>高校演劇コンクール</strong>の規定時間は60分以内です。この一覧からコンクール向けの作品を探せます。
          </div>
        )}
        {duration === "30" && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <strong>文化祭・学園祭</strong>のクラス劇には30分以内の作品がおすすめ。準備も短時間で済みます。
          </div>
        )}

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
            <Link href="/guide/time" className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 text-sm">
              上演時間別の選び方ガイド
            </Link>
            <Link href="/guide/cast-size" className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 text-sm">
              人数別の選び方ガイド
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
    paths: ALL_DURATIONS.map((duration) => ({ params: { duration } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const duration = params?.duration as string;
  const config = TIME_CONFIGS[duration];

  if (!config) return { notFound: true };

  try {
    const posts = await prisma.post.findMany({
      where: {
        playtime: {
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
      take: 50,
    });

    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
        totalCount: posts.length,
        duration,
        config,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error:", error);
    return { props: { posts: [], totalCount: 0, duration, config } };
  }
};
