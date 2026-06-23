import { useState } from "react";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import Link from "next/link";
import { FaTheaterMasks, FaRedo, FaSearch, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import AdSlot from "@/components/Ad/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";

type Question = {
  id: string;
  text: string;
  options: {
    label: string;
    emoji: string;
    next?: string;
    result?: string;
  }[];
};

type Result = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  searchUrl: string;
  emoji: string;
};

const QUESTIONS: Question[] = [
  {
    id: "purpose",
    text: "どんな場面で上演しますか？",
    options: [
      { label: "文化祭・学園祭", emoji: "🏫", next: "school_size" },
      { label: "演劇部・サークル公演", emoji: "🎭", next: "club_tone" },
      { label: "市民劇団・アマチュア公演", emoji: "🎪", next: "amateur_tone" },
      { label: "朗読劇・リーディング", emoji: "📖", next: "reading_size" },
      { label: "まだ決まっていない", emoji: "🤔", next: "free_tone" },
    ],
  },
  {
    id: "school_size",
    text: "出演者は何人くらいですか？",
    options: [
      { label: "少人数（2〜5人）", emoji: "👥", next: "school_time_small" },
      { label: "中人数（6〜15人）", emoji: "👨‍👩‍👧‍👦", next: "school_time_medium" },
      { label: "大人数（16人以上）", emoji: "🏟️", result: "school_large" },
    ],
  },
  {
    id: "school_time_small",
    text: "上演時間はどのくらい？",
    options: [
      { label: "30分以内", emoji: "⏱️", result: "school_small_short" },
      { label: "30分〜60分", emoji: "⏰", result: "school_small_medium" },
      { label: "60分以上", emoji: "🕐", result: "school_small_long" },
    ],
  },
  {
    id: "school_time_medium",
    text: "上演時間はどのくらい？",
    options: [
      { label: "30分以内", emoji: "⏱️", result: "school_medium_short" },
      { label: "30分〜60分", emoji: "⏰", result: "school_medium_medium" },
      { label: "60分以上", emoji: "🕐", result: "school_medium_long" },
    ],
  },
  {
    id: "club_tone",
    text: "どんな雰囲気の作品がいい？",
    options: [
      { label: "笑える・明るい", emoji: "😄", result: "club_comedy" },
      { label: "泣ける・感動", emoji: "😢", result: "club_drama" },
      { label: "考えさせられる", emoji: "🤔", result: "club_think" },
      { label: "ミステリー・サスペンス", emoji: "🔍", result: "club_mystery" },
    ],
  },
  {
    id: "amateur_tone",
    text: "どんなジャンルに興味がありますか？",
    options: [
      { label: "現代劇", emoji: "🏙️", result: "amateur_modern" },
      { label: "コメディ", emoji: "😂", result: "amateur_comedy" },
      { label: "社会派・問題提起", emoji: "📢", result: "amateur_social" },
      { label: "古典・時代劇", emoji: "⛩️", result: "amateur_classic" },
    ],
  },
  {
    id: "reading_size",
    text: "朗読する人数は？",
    options: [
      { label: "1人（モノローグ）", emoji: "🎤", result: "reading_solo" },
      { label: "2人", emoji: "👫", result: "reading_duo" },
      { label: "3人以上", emoji: "👥", result: "reading_group" },
    ],
  },
  {
    id: "free_tone",
    text: "気になるジャンルは？",
    options: [
      { label: "コメディ・笑い", emoji: "😂", result: "free_comedy" },
      { label: "ヒューマンドラマ", emoji: "💛", result: "free_drama" },
      { label: "不条理・前衛的", emoji: "🌀", result: "free_absurd" },
      { label: "泣ける・感動もの", emoji: "😢", result: "free_emotional" },
      { label: "何でもいいからおすすめ", emoji: "✨", result: "free_recommend" },
    ],
  },
];

const RESULTS: Result[] = [
  {
    id: "school_small_short",
    title: "文化祭にぴったり！少人数×短時間の脚本",
    description: "2〜5人で30分以内に上演できる作品。準備期間が短くても取り組みやすく、初めての演劇にも最適です。コメディ系が特に人気。",
    tags: ["文化祭", "少人数", "短時間"],
    searchUrl: "/posts?maxTime=30&maxPeople=5",
    emoji: "🎓",
  },
  {
    id: "school_small_medium",
    title: "じっくり魅せる少人数劇",
    description: "2〜5人で30〜60分の上演。一人ひとりの演技力が試される見応えのある作品が見つかります。二人芝居の名作も多数。",
    tags: ["少人数", "中編"],
    searchUrl: "/posts?minTime=30&maxTime=60&maxPeople=5",
    emoji: "🌟",
  },
  {
    id: "school_small_long",
    title: "本格派の少人数劇",
    description: "少人数でも60分以上の長編に挑戦！密度の濃い芝居で、役者一人ひとりの力量が問われる上級者向けの作品です。",
    tags: ["少人数", "長編", "上級"],
    searchUrl: "/posts?minTime=60&maxPeople=5",
    emoji: "🏆",
  },
  {
    id: "school_medium_short",
    title: "クラス劇にぴったりの短編",
    description: "6〜15人で30分以内。文化祭のクラス演劇で一番使いやすいサイズ感。全員に見せ場がある作品を選ぶのがコツ。",
    tags: ["文化祭", "クラス劇", "短時間"],
    searchUrl: "/posts?maxTime=30&minPeople=6&maxPeople=15",
    emoji: "🏫",
  },
  {
    id: "school_medium_medium",
    title: "文化祭の王道！中人数×中編",
    description: "6〜15人で30〜60分。文化祭や学園祭で最も多い構成。コメディからシリアスまで選択肢が豊富です。",
    tags: ["文化祭", "学園祭", "中人数"],
    searchUrl: "/posts?minTime=30&maxTime=60&minPeople=6&maxPeople=15",
    emoji: "🎪",
  },
  {
    id: "school_medium_long",
    title: "演劇部向け！本格中人数劇",
    description: "6〜15人で60分以上の本格公演。演劇部の定期公演やコンクール向けの力作が揃います。",
    tags: ["演劇部", "コンクール", "本格"],
    searchUrl: "/posts?minTime=60&minPeople=6&maxPeople=15",
    emoji: "🎭",
  },
  {
    id: "school_large",
    title: "大人数で盛り上がる脚本",
    description: "16人以上で上演できる作品。学芸会やクラス全員参加の劇に。群像劇やミュージカル風の作品がおすすめ。",
    tags: ["大人数", "学芸会", "群像劇"],
    searchUrl: "/posts?minPeople=16",
    emoji: "🏟️",
  },
  {
    id: "club_comedy",
    title: "笑いで客席を沸かせる脚本",
    description: "演劇部・サークル公演にぴったりのコメディ作品。観客を笑わせる演技力が磨けます。",
    tags: ["コメディ", "演劇部"],
    searchUrl: "/search/comedy",
    emoji: "😄",
  },
  {
    id: "club_drama",
    title: "泣ける・感動のヒューマンドラマ",
    description: "心に響く人間ドラマの脚本。観客の涙を誘う感動作品で、役者としても大きく成長できます。",
    tags: ["ヒューマンドラマ", "感動", "泣ける"],
    searchUrl: "/posts?category=ヒューマンドラマ",
    emoji: "😢",
  },
  {
    id: "club_think",
    title: "社会派・考えさせる演劇",
    description: "観た人の心に問いかけを残す作品。社会問題やテーマ性のある脚本で、深い芝居に挑戦できます。",
    tags: ["社会問題", "テーマ性"],
    searchUrl: "/posts?category=社会問題",
    emoji: "🤔",
  },
  {
    id: "club_mystery",
    title: "ミステリー・サスペンス劇",
    description: "ハラハラドキドキの展開で観客を引き込む脚本。伏線回収の演出が楽しめます。",
    tags: ["ミステリー", "サスペンス"],
    searchUrl: "/posts?category=ミステリ",
    emoji: "🔍",
  },
  {
    id: "amateur_modern",
    title: "市民劇団向け現代劇",
    description: "現代を舞台にしたリアルな人間ドラマ。共感しやすいテーマが多く、客層を選ばない安定した作品です。",
    tags: ["現代劇", "市民劇団"],
    searchUrl: "/posts?category=現代劇",
    emoji: "🏙️",
  },
  {
    id: "amateur_comedy",
    title: "市民劇団向けコメディ",
    description: "幅広い年齢層が楽しめるコメディ作品。地域公演で客席を温かい笑いで包みます。",
    tags: ["コメディ", "市民劇団"],
    searchUrl: "/search/comedy",
    emoji: "😂",
  },
  {
    id: "amateur_social",
    title: "社会派・問題提起の演劇",
    description: "社会問題をテーマにした作品。演劇を通じて地域や社会に問いかける意欲的な作品です。",
    tags: ["社会問題", "問題提起"],
    searchUrl: "/posts?category=社会問題",
    emoji: "📢",
  },
  {
    id: "amateur_classic",
    title: "古典・時代劇の名作",
    description: "日本の歴史や古典を題材にした作品。衣装や舞台美術にもこだわれる本格派。",
    tags: ["時代劇", "古典"],
    searchUrl: "/posts?category=時代劇",
    emoji: "⛩️",
  },
  {
    id: "reading_solo",
    title: "一人朗読・モノローグ作品",
    description: "一人で演じる朗読劇。発表会やイベント、練習にも最適。短い作品から長編まで。",
    tags: ["朗読劇", "一人芝居", "モノローグ"],
    searchUrl: "/posts?maxPeople=1",
    emoji: "🎤",
  },
  {
    id: "reading_duo",
    title: "二人朗読・対話劇",
    description: "二人で演じる朗読劇。掛け合いの面白さが味わえる作品。二人芝居の名作は朗読にも最適。",
    tags: ["朗読劇", "二人芝居"],
    searchUrl: "/posts?maxPeople=2",
    emoji: "👫",
  },
  {
    id: "reading_group",
    title: "グループ朗読・群読",
    description: "3人以上での朗読劇。声の重なりやリズムを楽しめる群読作品もおすすめ。",
    tags: ["朗読劇", "群読"],
    searchUrl: "/posts?minPeople=3&maxTime=30",
    emoji: "👥",
  },
  {
    id: "free_comedy",
    title: "おすすめコメディ作品",
    description: "思わず笑ってしまうコメディ作品を集めました。演じても観ても楽しい名作揃い。",
    tags: ["コメディ"],
    searchUrl: "/search/comedy",
    emoji: "😂",
  },
  {
    id: "free_drama",
    title: "心に響くヒューマンドラマ",
    description: "人間の温かさや弱さを描いた作品。誰もが共感できるテーマの名作を探せます。",
    tags: ["ヒューマンドラマ"],
    searchUrl: "/posts?category=ヒューマンドラマ",
    emoji: "💛",
  },
  {
    id: "free_absurd",
    title: "不条理・前衛的な作品",
    description: "常識を覆す不条理劇。別役実、安部公房など、独特の世界観を持つ作品に出会えます。",
    tags: ["不条理劇", "前衛"],
    searchUrl: "/posts?category=不条理劇",
    emoji: "🌀",
  },
  {
    id: "free_emotional",
    title: "泣ける・感動の脚本",
    description: "涙なしには読めない名作脚本。上演すれば客席の涙を誘うこと間違いなし。",
    tags: ["泣ける", "感動"],
    searchUrl: "/posts?category=泣ける",
    emoji: "😢",
  },
  {
    id: "free_recommend",
    title: "人気作品ランキング",
    description: "戯曲図書館で評価の高い作品をチェック！多くの人に選ばれた名作から探せます。",
    tags: ["人気", "おすすめ"],
    searchUrl: "/popular",
    emoji: "✨",
  },
];

export default function ShindanPage() {
  const [history, setHistory] = useState<string[]>(["purpose"]);
  const [resultId, setResultId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQuestionId = history[history.length - 1];
  const currentQuestion = QUESTIONS.find((q) => q.id === currentQuestionId);
  const result = resultId ? RESULTS.find((r) => r.id === resultId) : null;
  const progress = resultId ? 100 : Math.min(((history.length) / 3) * 100, 90);

  const handleOption = (option: (typeof QUESTIONS)[0]["options"][0]) => {
    setSelectedOption(option.label);

    setTimeout(() => {
      setSelectedOption(null);
      if (option.result) {
        setResultId(option.result);
      } else if (option.next) {
        setHistory((prev) => [...prev, option.next!]);
      }
    }, 300);
  };

  const handleBack = () => {
    if (resultId) {
      setResultId(null);
    } else if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const handleReset = () => {
    setHistory(["purpose"]);
    setResultId(null);
    setSelectedOption(null);
  };

  const shareText = result
    ? `【脚本診断結果】${result.emoji} ${result.title}\n${result.description}\n\n戯曲図書館で脚本を探してみよう！`
    : "";

  return (
    <>
      <Seo
        pageTitle="台本の選び方診断｜あなたにぴったりの脚本を見つけよう"
        pageDescription="いくつかの質問に答えるだけで、あなたの劇団や目的にぴったりの脚本タイプが見つかります。文化祭、演劇部、市民劇団、朗読劇など、シーン別におすすめの脚本を診断。"
        pagePath="/lp/shindan"
        pageType="website"
      />
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 py-8 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200/50 text-amber-800 text-sm font-medium mb-3">
                <FaTheaterMasks />
                かんたん脚本診断
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                あなたにぴったりの脚本は？
              </h1>
              <p className="text-gray-600 text-sm">
                質問に答えるだけで、おすすめの脚本タイプがわかります
              </p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-4 py-8">
            {/* プログレスバー */}
            <div className="mb-8">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">
                  {resultId ? "診断完了！" : `ステップ ${history.length}`}
                </span>
                {history.length > 1 && !resultId && (
                  <button
                    onClick={handleBack}
                    className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                  >
                    <FaArrowLeft className="w-2 h-2" />
                    戻る
                  </button>
                )}
              </div>
            </div>

            {/* 質問 */}
            {!resultId && currentQuestion && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                  {currentQuestion.text}
                </h2>
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => handleOption(option)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 min-h-[56px] ${
                        selectedOption === option.label
                          ? "border-amber-400 bg-amber-50 scale-[0.98]"
                          : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 active:scale-[0.98]"
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{option.emoji}</span>
                      <span className="font-medium text-gray-800">{option.label}</span>
                      <FaArrowRight className="w-3 h-3 text-gray-300 ml-auto flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 結果 */}
            {result && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-6 md:p-8 text-center">
                  <div className="text-5xl mb-4">{result.emoji}</div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                    {result.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {result.description}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {result.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={result.searchUrl}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full transition-colors text-lg"
                  >
                    <FaSearch />
                    この条件で脚本を探す
                  </Link>
                </div>

                {/* アクション */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <FaRedo className="w-3 h-3" />
                    もう一度診断する
                  </button>
                  <button
                    onClick={() => {
                      const url = `https://gikyokutosyokan.com/lp/shindan`;
                      window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
                        "_blank"
                      );
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-colors text-sm font-medium"
                  >
                    結果をシェア
                  </button>
                </div>

                <AdSlot slot={AD_SLOTS.CATEGORY_AFTER_LIST} format="horizontal" />
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
