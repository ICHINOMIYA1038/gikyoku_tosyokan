import { useState, useMemo, useCallback } from "react";
import { GetStaticProps } from "next";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Pace = "fast" | "normal" | "slow";

interface ReferencPlay {
  id: number;
  title: string;
  authorName: string;
  playtime: number;
}

interface Props {
  referencePlays: ReferencPlay[];
}

const PACE_CONFIG: Record<Pace, { label: string; rate: number; description: string }> = {
  fast: { label: "速め", rate: 450, description: "450字/分 - テンポの速い会話劇向け" },
  normal: { label: "標準", rate: 400, description: "400字/分 - 一般的な演劇の基準" },
  slow: { label: "ゆっくり", rate: 350, description: "350字/分 - 間を活かす演出向け" },
};

/**
 * Strip stage directions enclosed in various bracket types.
 * Keeps dialogue text (content inside Japanese quotation marks is NOT stripped).
 * Strips: （...）, (...), 【...】, ト書き lines starting with ※ or ★
 */
function stripStageDirections(text: string): string {
  let result = text;
  // Remove content in full-width parentheses （...）
  result = result.replace(/（[^）]*）/g, "");
  // Remove content in half-width parentheses (...)
  result = result.replace(/\([^)]*\)/g, "");
  // Remove content in 【...】
  result = result.replace(/【[^】]*】/g, "");
  // Remove lines that start with ※ or ★ (common stage direction markers)
  result = result.replace(/^[※★].+$/gm, "");
  // Remove common stage direction patterns: lines starting with "ト書き" markers
  result = result.replace(/^[\s]*[─―—]+[\s]*$/gm, "");
  // Collapse multiple newlines
  result = result.replace(/\n{3,}/g, "\n\n");
  return result.trim();
}

function countCharacters(text: string): number {
  // Count only meaningful characters (exclude whitespace)
  return text.replace(/[\s\n\r\t　]/g, "").length;
}

export default function PlaytimeEstimator({ referencePlays }: Props) {
  const [scriptText, setScriptText] = useState("");
  const [pace, setPace] = useState<Pace>("normal");
  const [showDirections, setShowDirections] = useState(false);

  const analysis = useMemo(() => {
    if (!scriptText.trim()) {
      return null;
    }

    const totalChars = countCharacters(scriptText);
    const strippedText = stripStageDirections(scriptText);
    const dialogueChars = countCharacters(strippedText);
    const directionChars = totalChars - dialogueChars;

    const rate = PACE_CONFIG[pace].rate;
    const estimatedMinutes = Math.round(dialogueChars / rate);

    return {
      totalChars,
      dialogueChars,
      directionChars,
      estimatedMinutes,
      rate,
    };
  }, [scriptText, pace]);

  const equivalentPlay = useMemo(() => {
    if (!analysis || analysis.estimatedMinutes === 0) return null;

    const target = analysis.estimatedMinutes;
    let closest: ReferencPlay | null = null;
    let minDiff = Infinity;

    for (const play of referencePlays) {
      const diff = Math.abs(play.playtime - target);
      if (diff < minDiff) {
        minDiff = diff;
        closest = play;
      }
    }

    return closest;
  }, [analysis, referencePlays]);

  const handleClear = useCallback(() => {
    setScriptText("");
  }, []);

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}分`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours}時間`;
    return `${hours}時間${mins}分`;
  };

  return (
    <Layout>
      <Seo
        pageTitle="上演時間見積もりツール"
        pageDescription="脚本のテキストを貼り付けるだけで上演時間を推定。文字数から演劇の上演時間を計算し、既存の戯曲と比較できます。文化祭・学園祭の公演準備に。"
        pagePath="/tools/playtime-estimator"
        pageKeywords={["上演時間", "見積もり", "脚本", "文字数", "演劇", "計算", "ツール"]}
      />
      <StructuredData
        type="FAQPage"
        faqItems={[
          {
            question: "上演時間はどうやって計算していますか？",
            answer:
              "日本の演劇の一般的な基準である1分あたり約400文字（標準ペース）を基に、台詞の文字数から上演時間を推定しています。テンポの速い作品は450字/分、ゆっくりした作品は350字/分で計算できます。",
          },
          {
            question: "ト書き（舞台指示）はどう扱われますか？",
            answer:
              "（）や【】で囲まれたト書き・舞台指示は自動的に除外し、台詞部分のみの文字数で上演時間を計算します。",
          },
        ]}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com/" },
          {
            name: "上演時間見積もりツール",
            url: "https://gikyokutosyokan.com/tools/playtime-estimator",
          },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">
              ホーム
            </Link>
            <span className="mx-2">/</span>
            <span>上演時間見積もりツール</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            上演時間見積もりツール
          </h1>
          <p className="text-gray-600">
            脚本のテキストを貼り付けて、上演時間の目安を確認できます。
            ト書き（舞台指示）を自動除外し、台詞の文字数から上演時間を推定します。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Input Area - takes 2 columns */}
          <div className="md:col-span-2 space-y-4">
            {/* Textarea */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="script-text"
                  className="block text-sm font-medium text-gray-700"
                >
                  脚本テキスト
                </label>
                {scriptText && (
                  <button
                    onClick={handleClear}
                    className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    クリア
                  </button>
                )}
              </div>
              <textarea
                id="script-text"
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder={`ここに脚本のテキストを貼り付けてください。\n\n例：\n太郎「今日はいい天気だね」\n花子「そうね、散歩にでも行きましょうか」\n（太郎、窓の外を見る）\n太郎「うん、そうしよう」`}
                className="w-full h-64 md:h-80 p-4 border border-gray-300 rounded-lg resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm leading-relaxed font-mono"
              />
            </div>

            {/* Pace Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ペース設定
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(PACE_CONFIG) as Pace[]).map((key) => {
                  const config = PACE_CONFIG[key];
                  const isSelected = pace === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setPace(key)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-bold text-sm">{config.label}</div>
                      <div className="text-xs mt-1">{config.rate}字/分</div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {PACE_CONFIG[pace].description}
              </p>
            </div>

            {/* How it works */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-2">
                計算方法について
              </h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>
                  ・日本の演劇では、1分あたり約400文字が標準的な目安とされています
                </li>
                <li>
                  ・（）や【】で囲まれたト書き・舞台指示は自動的に除外されます
                </li>
                <li>
                  ・実際の上演時間は演出や間の取り方で大きく変わることがあります
                </li>
                <li>
                  ・暗転・転換・音響効果などの時間は含まれていません
                </li>
              </ul>
            </div>
          </div>

          {/* Results Panel - takes 1 column */}
          <div className="space-y-4">
            {/* Estimated Time - Hero Result */}
            <div
              className={`rounded-lg p-6 text-center ${
                analysis
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <div className="text-sm mb-1">推定上演時間</div>
              <div className="text-4xl font-bold mb-1">
                {analysis ? formatTime(analysis.estimatedMinutes) : "--"}
              </div>
              {analysis && (
                <div className="text-blue-200 text-xs">
                  {PACE_CONFIG[pace].label}ペース（{PACE_CONFIG[pace].rate}
                  字/分）
                </div>
              )}
            </div>

            {/* Character Count Breakdown */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">
                文字数の内訳
              </h3>
              {analysis ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">全体の文字数</span>
                    <span className="font-mono font-bold">
                      {analysis.totalChars.toLocaleString()}字
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      台詞の文字数
                    </span>
                    <span className="font-mono font-bold text-blue-600">
                      {analysis.dialogueChars.toLocaleString()}字
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      ト書き（除外分）
                    </span>
                    <span className="font-mono text-gray-400">
                      {analysis.directionChars.toLocaleString()}字
                    </span>
                  </div>

                  {/* Progress bar showing dialogue vs directions ratio */}
                  {analysis.totalChars > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${(analysis.dialogueChars / analysis.totalChars) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>
                          台詞{" "}
                          {Math.round(
                            (analysis.dialogueChars / analysis.totalChars) * 100
                          )}
                          %
                        </span>
                        <span>ト書き</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">
                  テキストを入力すると表示されます
                </p>
              )}
            </div>

            {/* Pace Comparison */}
            {analysis && analysis.dialogueChars > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-bold text-gray-700 mb-3">
                  ペース別の目安
                </h3>
                <div className="space-y-2">
                  {(Object.keys(PACE_CONFIG) as Pace[]).map((key) => {
                    const config = PACE_CONFIG[key];
                    const minutes = Math.round(
                      analysis.dialogueChars / config.rate
                    );
                    const isActive = pace === key;
                    return (
                      <div
                        key={key}
                        className={`flex justify-between items-center text-sm p-2 rounded ${
                          isActive ? "bg-blue-50 font-bold" : ""
                        }`}
                      >
                        <span className="text-gray-600">
                          {config.label}（{config.rate}字/分）
                        </span>
                        <span
                          className={
                            isActive ? "text-blue-600" : "text-gray-700"
                          }
                        >
                          {formatTime(minutes)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Equivalent Play */}
            {equivalentPlay && analysis && analysis.estimatedMinutes > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="text-sm font-bold text-amber-800 mb-2">
                  同じくらいの長さの作品
                </h3>
                <p className="text-sm text-amber-900">
                  この長さは
                  <Link
                    href={`/posts/${equivalentPlay.id}`}
                    className="font-bold text-amber-700 hover:underline"
                  >
                    {`『${equivalentPlay.title}』`}
                  </Link>
                  <span className="text-xs text-amber-600 ml-1">
                    （{equivalentPlay.authorName}作・
                    {formatTime(equivalentPlay.playtime)}）
                  </span>
                  と同じくらいです。
                </p>
              </div>
            )}

            {/* Reference Plays List */}
            {referencePlays.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-bold text-gray-700 mb-3">
                  参考：有名戯曲の上演時間
                </h3>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {referencePlays.map((play) => (
                    <div
                      key={play.id}
                      className="flex justify-between items-center text-xs"
                    >
                      <Link
                        href={`/posts/${play.id}`}
                        className="text-gray-600 hover:text-blue-600 truncate mr-2"
                        title={`${play.title}（${play.authorName}）`}
                      >
                        {play.title}
                      </Link>
                      <span className="text-gray-400 whitespace-nowrap">
                        {formatTime(play.playtime)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  // Fetch a diverse set of plays with known playtimes for reference
  // Get plays across different time ranges to provide good comparison points
  const plays = await prisma.post.findMany({
    where: {
      playtime: {
        not: null,
        gt: 0,
      },
    },
    select: {
      id: true,
      title: true,
      playtime: true,
      averageRating: true,
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      playtime: "asc",
    },
  });

  // Select representative plays across different time ranges
  // Pick well-rated plays at various playtime points
  const timeRanges = [10, 15, 20, 30, 45, 60, 90, 120, 150, 180];
  const selectedPlays: ReferencPlay[] = [];
  const usedIds = new Set<number>();

  for (const targetTime of timeRanges) {
    // Find the best play closest to this target time
    let bestPlay = null;
    let bestScore = Infinity;

    for (const play of plays) {
      if (!play.playtime || usedIds.has(play.id)) continue;
      const timeDiff = Math.abs(play.playtime - targetTime);
      // Prefer plays closer to target, with higher ratings as tiebreaker
      const score = timeDiff - (play.averageRating ?? 0) * 0.1;
      if (score < bestScore) {
        bestScore = score;
        bestPlay = play;
      }
    }

    if (bestPlay && bestPlay.playtime) {
      usedIds.add(bestPlay.id);
      selectedPlays.push({
        id: bestPlay.id,
        title: bestPlay.title,
        authorName: bestPlay.author.name,
        playtime: bestPlay.playtime,
      });
    }
  }

  // Sort by playtime for display
  selectedPlays.sort((a, b) => a.playtime - b.playtime);

  return {
    props: {
      referencePlays: selectedPlays,
    },
    revalidate: 86400, // Revalidate daily
  };
};
