import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaTheaterMasks } from "react-icons/fa";
import AdSlot from "@/components/Ad/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";

const REACTIONS = [
  { key: "all", emoji: "🏆", label: "総合" },
  { key: "泣けた", emoji: "😢", label: "泣けた" },
  { key: "笑えた", emoji: "😂", label: "笑えた" },
  { key: "考えさせられた", emoji: "🤔", label: "考えさせられた" },
  { key: "感動した", emoji: "✨", label: "感動した" },
  { key: "演じたい", emoji: "🎭", label: "演じたい" },
  { key: "おすすめ", emoji: "👍", label: "おすすめ" },
];

const REACTION_EMOJI: Record<string, string> = {
  "泣けた": "😢",
  "笑えた": "😂",
  "考えさせられた": "🤔",
  "感動した": "✨",
  "演じたい": "🎭",
  "おすすめ": "👍",
};

interface RankedPost {
  id: number;
  title: string;
  image_url: string | null;
  playtime: number | null;
  totalNumber: number | null;
  averageRating: number | null;
  author: { id: number; name: string };
  categories: { id: number; name: string }[];
  reactionCount: number;
  reactions: Record<string, number>;
}

export default function ReactionsRankingPage() {
  const [filter, setFilter] = useState("all");
  const [posts, setPosts] = useState<RankedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = filter === "all" ? "" : `&reaction=${encodeURIComponent(filter)}`;
    fetch(`/api/reaction-ranking?limit=20${query}`)
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter]);

  const title = filter === "all"
    ? "みんなのリアクションランキング"
    : `「${filter}」が多い脚本ランキング`;

  return (
    <Layout>
      <Seo
        pageTitle="リアクションランキング｜読者の声で選ぶ脚本"
        pageDescription="読者のリアクション（泣けた・笑えた・演じたい等）が多い脚本をランキング形式で紹介。みんなの声で選ぶおすすめ戯曲。"
        pagePath="/ranking/reactions"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "リアクションランキング", url: "https://gikyokutosyokan.com/ranking/reactions" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <span className="text-3xl">🏆</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
          <p className="text-gray-600">
            読者のリアクションが多い作品をランキングで紹介
          </p>
        </header>

        {/* Filter tabs */}
        <div className="mb-8 bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-2 font-medium">リアクション別に見る</p>
          <div className="flex flex-wrap gap-2">
            {REACTIONS.map((r) => (
              <button
                key={r.key}
                onClick={() => setFilter(r.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  r.key === filter
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50"
                }`}
              >
                <span className="mr-1">{r.emoji}</span>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ranking list */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-amber-300 border-t-amber-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">ランキングを読み込み中...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <FaTheaterMasks className="text-4xl mx-auto mb-4 text-gray-300" />
            <p>まだリアクションがありません</p>
            <p className="text-sm mt-2">作品ページで感想ボタンを押してみましょう！</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="flex items-start gap-4 bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-amber-200 transition-all group"
              >
                {/* Rank number */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  index === 0 ? "bg-yellow-400 text-white" :
                  index === 1 ? "bg-gray-300 text-white" :
                  index === 2 ? "bg-amber-600 text-white" :
                  "bg-gray-100 text-gray-500"
                }`}>
                  {index + 1}
                </div>

                {/* Post info */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-gray-800 group-hover:text-amber-700 transition-colors truncate">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {post.author.name}
                    {post.totalNumber && <span className="ml-2">👥{post.totalNumber}人</span>}
                    {post.playtime && <span className="ml-2">⏱{post.playtime}分</span>}
                  </p>

                  {/* Reaction breakdown */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {Object.entries(post.reactions)
                      .sort((a, b) => b[1] - a[1])
                      .map(([key, count]) => (
                        <span
                          key={key}
                          className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-50 border border-amber-100 rounded-full text-xs text-amber-700"
                        >
                          {REACTION_EMOJI[key] || ""} {key} {count}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Total count */}
                <div className="flex-shrink-0 text-center">
                  <div className="text-2xl font-bold text-amber-600">{post.reactionCount}</div>
                  <div className="text-xs text-gray-400">リアクション</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <AdSlot slot={AD_SLOTS.CATEGORY_AFTER_LIST} format="horizontal" />

        {/* Related links */}
        <section className="mt-12 bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">関連ページ</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/search/comedy" className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 text-sm">
              コメディ戯曲
            </Link>
            <Link href="/search/school" className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 text-sm">
              学校演劇向け
            </Link>
            <Link href="/lp/shindan" className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 text-sm">
              脚本診断
            </Link>
            <Link href="/guide/cast-size" className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 text-sm">
              人数別ガイド
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
