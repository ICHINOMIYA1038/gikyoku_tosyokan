import { useRouter } from "next/router";
import Link from "next/link";

type HeroSearchBandProps = {
  totalPosts?: number;
  onSearch?: () => void;
};

const QUICK_FILTERS = [
  { label: "30分以内", href: "/?maxPlaytime=30" },
  { label: "2〜5人", href: "/?minTotalCount=2&maxTotalCount=5" },
  { label: "二人芝居", href: "/?minTotalCount=2&maxTotalCount=2" },
  { label: "一人芝居", href: "/?minTotalCount=1&maxTotalCount=1" },
  { label: "女性のみ", href: "/?maxMaleCount=0" },
  { label: "無料で読める", href: "/categories/4" },
  { label: "コメディ", href: "/categories/14" },
  { label: "ヒューマンドラマ", href: "/categories/11" },
  { label: "岸田國士戯曲賞", href: "/categories/1" },
];

// トップの入口。紅の帯に人数・上演時間・キーワードを並べ、検索結果（トップ下部）へ送る
export default function HeroSearchBand({ totalPosts, onSearch }: HeroSearchBandProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const query: Record<string, string> = {};
    const min = String(fd.get("minTotalCount") || "").trim();
    const max = String(fd.get("maxTotalCount") || "").trim();
    const playtime = String(fd.get("maxPlaytime") || "").trim();
    const keyword = String(fd.get("keyword") || "").trim();
    if (min) query.minTotalCount = min;
    if (max) query.maxTotalCount = max;
    if (playtime) query.maxPlaytime = playtime;
    if (keyword) query.keyword = keyword;
    router.push({ pathname: "/", query });
    onSearch?.();
  };

  const field = "w-full h-12 px-3 rounded bg-white text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/70";

  return (
    <section className="bg-white -mx-3 -mt-3 md:-mx-12 md:-mt-6">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-6 md:pt-14">
        <h1 className="text-[28px] md:text-[40px] font-serif font-bold text-gray-900 leading-tight">
          人数と上演時間で、戯曲を探す。
        </h1>
        <p className="mt-3 text-base text-gray-600">
          {totalPosts ? `${totalPosts.toLocaleString()}作品` : "1,000作品以上"}のあらすじ・人数・上演時間と、上演した人の感想を集めています。
        </p>
      </div>

      <div className="bg-theater-primary-600">
        <form onSubmit={handleSubmit} role="search" className="mx-auto max-w-6xl px-4 py-5 grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,1.6fr)_auto] md:items-end">
          <div>
            <span className="block text-sm font-medium text-white/90 mb-1">人数</span>
            <div className="flex items-center gap-2">
              <input name="minTotalCount" type="number" inputMode="numeric" min={1} placeholder="下限" aria-label="人数の下限" className={field} />
              <span className="text-white">〜</span>
              <input name="maxTotalCount" type="number" inputMode="numeric" min={1} placeholder="上限" aria-label="人数の上限" className={field} />
            </div>
          </div>
          <label className="block">
            <span className="block text-sm font-medium text-white/90 mb-1">上演時間（分まで）</span>
            <input name="maxPlaytime" type="number" inputMode="numeric" min={1} placeholder="例：60" className={field} />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-white/90 mb-1">キーワード</span>
            <input name="keyword" type="search" placeholder="作品名・作者名・キーワード" className={field} />
          </label>
          <button type="submit" className="h-12 px-6 rounded bg-white text-theater-primary-700 font-bold text-base hover:bg-theater-primary-50 transition-colors">
            この条件で探す
          </button>
        </form>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-500 mr-1">よく使われる条件</span>
          {QUICK_FILTERS.map((f) => (
            <Link key={f.href} href={f.href} className="px-3 py-1 rounded-full border border-gray-300 text-gray-800 hover:border-theater-primary-600 hover:text-theater-primary-700 transition-colors">
              {f.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
