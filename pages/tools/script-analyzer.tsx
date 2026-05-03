import React, { useState, useMemo, useCallback } from "react";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";

// ---- Types ----

interface CharacterStats {
  name: string;
  lineCount: number;
  charCount: number;
  percentage: number;
  estimatedMinutes: number;
}

interface SceneData {
  sceneName: string;
  characters: CharacterStats[];
}

// ---- Constants ----

const CHARS_PER_MINUTE = 400;
const BAR_COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316", "#06b6d4", "#84cc16",
  "#e11d48", "#7c3aed", "#0ea5e9", "#d946ef", "#22c55e",
];

// ---- Helpers ----

function detectCharacters(text: string): Map<string, { lines: string[]; charCount: number }> {
  const characters = new Map<string, { lines: string[]; charCount: number }>();

  const lines = text.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let name: string | null = null;
    let dialogue: string | null = null;

    // Pattern 1: 太郎「セリフセリフ」
    const p1 = trimmed.match(/^([^\s「」：:（()）\d]{1,20})\s*「(.+?)」/);
    if (p1) {
      name = p1[1];
      dialogue = p1[2];
    }

    // Pattern 2: 太郎：セリフセリフ or 太郎:セリフセリフ
    if (!name) {
      const p2 = trimmed.match(/^([^\s「」：:（()）\d]{1,20})\s*[：:]\s*(.+)/);
      if (p2) {
        name = p2[1];
        dialogue = p2[2];
      }
    }

    // Pattern 3: 太郎　セリフセリフ (full-width space separator)
    if (!name) {
      const p3 = trimmed.match(/^([^\s「」：:（()）\d]{1,20})[\u3000]{1,}\s*(.+)/);
      if (p3) {
        name = p3[1];
        dialogue = p3[2];
      }
    }

    if (name && dialogue) {
      // Filter out likely non-character lines (stage directions etc.)
      const skipPatterns = ["ト書き", "場面", "シーン", "第", "幕", "照明", "音楽", "効果", "転換"];
      if (skipPatterns.some((p) => name!.includes(p))) continue;

      const existing = characters.get(name) || { lines: [], charCount: 0 };
      existing.lines.push(dialogue);
      existing.charCount += dialogue.replace(/[\s　]/g, "").length;
      characters.set(name, existing);
    }
  }

  return characters;
}

function detectScenes(text: string): { sceneName: string; content: string }[] {
  // Match scene markers: 場面1, シーン1, 第一幕, 第1場, etc.
  const scenePattern = /^((?:場面|シーン)\s*\d+|第[一二三四五六七八九十\d]+[幕場]|Scene\s*\d+)/gim;

  const markers: { index: number; name: string }[] = [];
  let match: RegExpExecArray | null;

  while ((match = scenePattern.exec(text)) !== null) {
    markers.push({ index: match.index, name: match[1] });
  }

  if (markers.length === 0) return [];

  const scenes: { sceneName: string; content: string }[] = [];
  for (let i = 0; i < markers.length; i++) {
    const start = markers[i].index;
    const end = i + 1 < markers.length ? markers[i + 1].index : text.length;
    scenes.push({
      sceneName: markers[i].name,
      content: text.slice(start, end),
    });
  }

  return scenes;
}

function calculateStats(charMap: Map<string, { lines: string[]; charCount: number }>): CharacterStats[] {
  const totalChars = Array.from(charMap.values()).reduce((sum, c) => sum + c.charCount, 0);

  return Array.from(charMap.entries())
    .map(([name, data]) => ({
      name,
      lineCount: data.lines.length,
      charCount: data.charCount,
      percentage: totalChars > 0 ? (data.charCount / totalChars) * 100 : 0,
      estimatedMinutes: data.charCount / CHARS_PER_MINUTE,
    }))
    .sort((a, b) => b.charCount - a.charCount);
}

function calculateBiasIndex(stats: CharacterStats[]): number {
  // Gini coefficient: 0 = perfectly even, 1 = all lines to one character
  if (stats.length <= 1) return 0;
  const n = stats.length;
  const values = stats.map((s) => s.charCount).sort((a, b) => a - b);
  const totalChars = values.reduce((s, v) => s + v, 0);
  if (totalChars === 0) return 0;

  let sumOfDiffs = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      sumOfDiffs += Math.abs(values[i] - values[j]);
    }
  }
  return sumOfDiffs / (2 * n * totalChars);
}

function biasLabel(gini: number): { text: string; color: string } {
  if (gini < 0.2) return { text: "均等", color: "#10b981" };
  if (gini < 0.4) return { text: "やや偏りあり", color: "#f59e0b" };
  if (gini < 0.6) return { text: "偏りあり", color: "#f97316" };
  return { text: "かなり偏りあり", color: "#ef4444" };
}

function formatMinutes(m: number): string {
  if (m < 1) return `${Math.round(m * 60)}秒`;
  const mins = Math.floor(m);
  const secs = Math.round((m - mins) * 60);
  return secs > 0 ? `${mins}分${secs}秒` : `${mins}分`;
}

// ---- Component ----

export default function ScriptAnalyzerPage() {
  const [scriptText, setScriptText] = useState("");
  const [manualNames, setManualNames] = useState<string[]>([]);
  const [newName, setNewName] = useState("");
  const [copied, setCopied] = useState(false);

  const analysis = useMemo(() => {
    if (!scriptText.trim()) return null;

    const charMap = detectCharacters(scriptText);

    // Merge manual names: add empty entries if not already detected
    for (const name of manualNames) {
      if (!charMap.has(name)) {
        // Try to find lines for manually added characters with a broader search
        const lines: string[] = [];
        let charCount = 0;
        const regex = new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s　：:「]`, "m");
        for (const line of scriptText.split("\n")) {
          if (regex.test(line.trim())) {
            const dialoguePart = line.trim().slice(name.length).replace(/^[\s　：:「]+/, "").replace(/」$/, "");
            if (dialoguePart) {
              lines.push(dialoguePart);
              charCount += dialoguePart.replace(/[\s　]/g, "").length;
            }
          }
        }
        if (lines.length > 0) {
          charMap.set(name, { lines, charCount });
        }
      }
    }

    const stats = calculateStats(charMap);
    const bias = calculateBiasIndex(stats);
    const totalChars = stats.reduce((s, c) => s + c.charCount, 0);
    const totalLines = stats.reduce((s, c) => s + c.lineCount, 0);

    // Scene breakdown
    const scenes = detectScenes(scriptText);
    const sceneData: SceneData[] = scenes.map((scene) => {
      const sceneChars = detectCharacters(scene.content);
      return {
        sceneName: scene.sceneName,
        characters: calculateStats(sceneChars),
      };
    });

    return { stats, bias, totalChars, totalLines, sceneData };
  }, [scriptText, manualNames]);

  const handleAddName = useCallback(() => {
    const trimmed = newName.trim();
    if (trimmed && !manualNames.includes(trimmed)) {
      setManualNames((prev) => [...prev, trimmed]);
    }
    setNewName("");
  }, [newName, manualNames]);

  const handleRemoveName = useCallback((name: string) => {
    setManualNames((prev) => prev.filter((n) => n !== name));
  }, []);

  const handleCopyResults = useCallback(() => {
    if (!analysis) return;

    const { stats, bias, totalChars, totalLines, sceneData } = analysis;
    const biasInfo = biasLabel(bias);

    let text = "=== セリフ量分析結果 ===\n\n";
    text += `登場人物: ${stats.length}人 / 総セリフ数: ${totalLines}行 / 総文字数: ${totalChars.toLocaleString()}字\n`;
    text += `出番の偏り度: ${biasInfo.text} (${(bias * 100).toFixed(1)}%)\n\n`;

    text += "--- 役ごとの内訳 ---\n";
    for (const s of stats) {
      text += `${s.name}: ${s.lineCount}行 / ${s.charCount.toLocaleString()}字 (${s.percentage.toFixed(1)}%) / 推定 ${formatMinutes(s.estimatedMinutes)}\n`;
    }

    if (sceneData.length > 0) {
      text += "\n--- 場面別内訳 ---\n";
      for (const scene of sceneData) {
        text += `\n[${scene.sceneName}]\n`;
        for (const c of scene.characters) {
          text += `  ${c.name}: ${c.lineCount}行 / ${c.charCount.toLocaleString()}字 (${c.percentage.toFixed(1)}%)\n`;
        }
      }
    }

    text += "\n分析ツール: 戯曲図書館 セリフ量分析ツール\nhttps://gikyokutosyokan.com/tools/script-analyzer";

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [analysis]);

  return (
    <Layout>
      <Seo
        pageTitle="セリフ量分析ツール — 台本の役ごとのセリフ量を可視化"
        pageDescription="台本のテキストを貼り付けるだけで、登場人物ごとのセリフ量・文字数・推定発話時間を自動分析。演出家のキャスティングや役者の役作りに。"
        pagePath="/tools/script-analyzer"
        pageKeywords={["セリフ量", "台本分析", "脚本分析", "セリフ分析", "戯曲", "演劇ツール", "台本ツール"]}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            セリフ量分析ツール
          </h1>
          <p className="text-gray-600">
            台本のテキストを貼り付けると、登場人物ごとのセリフ量を自動で分析します。
          </p>
        </div>

        {/* Usage guide */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
          <h2 className="font-bold text-indigo-900 mb-2 text-sm">対応フォーマット</h2>
          <div className="text-sm text-indigo-800 space-y-1">
            <p><code className="bg-indigo-100 px-1.5 py-0.5 rounded text-xs">太郎「セリフセリフ」</code></p>
            <p><code className="bg-indigo-100 px-1.5 py-0.5 rounded text-xs">太郎：セリフセリフ</code></p>
            <p><code className="bg-indigo-100 px-1.5 py-0.5 rounded text-xs">太郎　セリフセリフ</code>（全角スペース区切り）</p>
          </div>
          <p className="text-xs text-indigo-600 mt-2">
            場面・シーン・幕の区切りがあれば、場面別の分析も表示します。
          </p>
        </div>

        {/* Text input */}
        <div className="mb-6">
          <label htmlFor="script-input" className="block text-sm font-medium text-gray-700 mb-2">
            台本テキスト
          </label>
          <textarea
            id="script-input"
            className="w-full h-64 md:h-80 border border-gray-300 rounded-lg p-4 text-sm font-mono resize-y focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={"太郎「おはよう。今日はいい天気だね。」\n花子「そうね。散歩にでも行きましょうか。」\n太郎「いいね。公園まで歩こう。」\n花子「じゃあ、支度してくるわ。」"}
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
          />
        </div>

        {/* Manual character names */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-sm font-medium text-gray-700 mb-2">
            キャラクター名を手動で追加（自動検出されない場合）
          </h2>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="キャラクター名"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddName();
                }
              }}
            />
            <button
              onClick={handleAddName}
              className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
            >
              追加
            </button>
          </div>
          {manualNames.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {manualNames.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm"
                >
                  {name}
                  <button
                    onClick={() => handleRemoveName(name)}
                    className="text-gray-400 hover:text-red-500 ml-0.5"
                    aria-label={`${name}を削除`}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        {analysis && analysis.stats.length > 0 && (
          <div>
            {/* Summary */}
            <div className="flex flex-wrap items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">分析結果</h2>
              <button
                onClick={handleCopyResults}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {copied ? "コピーしました" : "結果をコピー"}
              </button>
            </div>

            {/* Overview cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{analysis.stats.length}</div>
                <div className="text-xs text-gray-500 mt-1">登場人物</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{analysis.totalLines.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">総セリフ数</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{analysis.totalChars.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">総文字数</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatMinutes(analysis.totalChars / CHARS_PER_MINUTE)}
                </div>
                <div className="text-xs text-gray-500 mt-1">推定総発話時間</div>
              </div>
            </div>

            {/* Bias indicator */}
            <div className="mb-8 p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">出番の偏り度</h3>
                <span
                  className="text-sm font-bold px-2 py-0.5 rounded"
                  style={{
                    color: biasLabel(analysis.bias).color,
                    backgroundColor: `${biasLabel(analysis.bias).color}18`,
                  }}
                >
                  {biasLabel(analysis.bias).text}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(analysis.bias * 100, 100)}%`,
                    background: `linear-gradient(90deg, #10b981, #f59e0b, #ef4444)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>均等</span>
                <span>偏りあり</span>
              </div>
            </div>

            {/* Per-character bar chart */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">登場人物別セリフ量</h3>
              <div className="space-y-3">
                {analysis.stats.map((s, i) => {
                  const color = BAR_COLORS[i % BAR_COLORS.length];
                  const maxCharCount = analysis.stats[0]?.charCount || 1;
                  const barWidth = (s.charCount / maxCharCount) * 100;

                  return (
                    <div key={s.name} className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-medium text-gray-900 text-sm">{s.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {s.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-5 mb-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: color,
                            minWidth: "2px",
                          }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
                        <span>{s.lineCount}行</span>
                        <span>{s.charCount.toLocaleString()}字</span>
                        <span>推定 {formatMinutes(s.estimatedMinutes)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pie-chart-like stacked bar */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">セリフ量の割合</h3>
              <div className="w-full h-8 rounded-full overflow-hidden flex">
                {analysis.stats.map((s, i) => (
                  <div
                    key={s.name}
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${s.percentage}%`,
                      backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                      minWidth: s.percentage > 0 ? "2px" : "0",
                    }}
                    title={`${s.name}: ${s.percentage.toFixed(1)}%`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                {analysis.stats.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-1 text-xs text-gray-600">
                    <span
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
                    />
                    {s.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Scene breakdown */}
            {analysis.sceneData.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">場面別分析</h3>
                <div className="space-y-4">
                  {analysis.sceneData.map((scene) => (
                    <div
                      key={scene.sceneName}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <h4 className="font-bold text-gray-800 mb-3">{scene.sceneName}</h4>
                      {scene.characters.length === 0 ? (
                        <p className="text-sm text-gray-400">セリフが検出されませんでした</p>
                      ) : (
                        <div className="space-y-2">
                          {scene.characters.map((c, i) => {
                            const color = BAR_COLORS[
                              analysis.stats.findIndex((s) => s.name === c.name) % BAR_COLORS.length
                            ] || BAR_COLORS[i % BAR_COLORS.length];
                            const maxInScene = scene.characters[0]?.charCount || 1;

                            return (
                              <div key={c.name} className="flex items-center gap-3">
                                <span className="text-sm text-gray-700 w-20 truncate flex-shrink-0">
                                  {c.name}
                                </span>
                                <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${(c.charCount / maxInScene) * 100}%`,
                                      backgroundColor: color,
                                      minWidth: "2px",
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 w-16 text-right flex-shrink-0">
                                  {c.charCount}字
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed table */}
            <div className="mb-8 overflow-x-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4">詳細データ</h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 px-3 text-gray-600 font-medium">キャラクター</th>
                    <th className="text-right py-2 px-3 text-gray-600 font-medium">セリフ数</th>
                    <th className="text-right py-2 px-3 text-gray-600 font-medium">文字数</th>
                    <th className="text-right py-2 px-3 text-gray-600 font-medium">割合</th>
                    <th className="text-right py-2 px-3 text-gray-600 font-medium">推定時間</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.stats.map((s, i) => (
                    <tr key={s.name} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
                          />
                          {s.name}
                        </div>
                      </td>
                      <td className="text-right py-2 px-3 tabular-nums">{s.lineCount}</td>
                      <td className="text-right py-2 px-3 tabular-nums">{s.charCount.toLocaleString()}</td>
                      <td className="text-right py-2 px-3 tabular-nums">{s.percentage.toFixed(1)}%</td>
                      <td className="text-right py-2 px-3">{formatMinutes(s.estimatedMinutes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No results state */}
        {analysis && analysis.stats.length === 0 && scriptText.trim() && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 mb-2">セリフを検出できませんでした</p>
            <p className="text-sm text-gray-400">
              対応フォーマットで台本テキストを貼り付けてください。
              <br />
              または、上のフォームからキャラクター名を手動で追加してください。
            </p>
          </div>
        )}

        {/* About section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">このツールについて</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              セリフ量分析ツールは、台本テキストから登場人物ごとのセリフ量を自動で分析するツールです。
              分析処理はすべてブラウザ上で行われます。「保存」機能を使用した場合のみ、データがサーバーに保存されます。
            </p>
            <p className="font-medium text-gray-700">こんな方におすすめ:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>演出家 ― キャスティング時の負荷バランスの確認に</li>
              <li>役者 ― 自分の役のセリフ量を事前に把握したい方に</li>
              <li>劇団 ― メンバー数に合った脚本選びの参考に</li>
            </ul>
            <p className="text-xs text-gray-400 mt-4">
              推定発話時間は400字/分で計算しています。実際の上演では演技・間・演出により異なります。
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
