import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { FaTheaterMasks, FaEye, FaPalette, FaMusic, FaLightbulb, FaUsers, FaFilm, FaChartLine } from "react-icons/fa";
import { useState } from "react";

export default function DirectingGuide() {
  const [activeTab, setActiveTab] = useState<string>("concept");

  // 演出の基本要素
  const directingElements = {
    concept: {
      title: "コンセプト設計",
      icon: FaLightbulb,
      description: "作品の核となる演出コンセプトを決める",
      steps: [
        {
          step: "作品分析",
          detail: "テーマ、時代背景、作者の意図を深く理解",
          techniques: ["複数回の精読", "作者研究", "時代考証", "他の演出例研究"]
        },
        {
          step: "現代的解釈",
          detail: "現代の観客に響く要素を見つける",
          techniques: ["社会問題との関連", "普遍的テーマの抽出", "観客層の分析", "時事性の検討"]
        },
        {
          step: "ビジュアルイメージ",
          detail: "舞台全体の視覚的な統一感を設計",
          techniques: ["カラーパレット決定", "時代設定の変更", "象徴的モチーフ", "空間コンセプト"]
        },
        {
          step: "演技スタイル",
          detail: "リアリズムか様式的か、演技の方向性",
          techniques: ["自然主義", "表現主義", "ブレヒト的異化", "身体表現重視"]
        }
      ]
    },
    space: {
      title: "空間演出",
      icon: FaPalette,
      description: "舞台空間を効果的に使う演出技法",
      techniques: [
        {
          name: "舞台の分割",
          description: "上手・下手・センターの使い分け",
          examples: [
            "上手＝過去、下手＝未来",
            "センター＝現在・重要シーン",
            "奥＝内面、手前＝現実",
            "高低差で力関係を表現"
          ]
        },
        {
          name: "動線設計",
          description: "役者の移動パターンで意味を作る",
          examples: [
            "円形の動き＝循環・永遠",
            "直線的＝意志・決意",
            "ジグザグ＝葛藤・混乱",
            "螺旋＝成長・発展"
          ]
        },
        {
          name: "群衆演出",
          description: "アンサンブルを使った空間構成",
          examples: [
            "コロスとしての群衆",
            "背景としての人間風景",
            "分割された意識の表現",
            "社会の圧力の可視化"
          ]
        }
      ]
    },
    rhythm: {
      title: "リズムとテンポ",
      icon: FaMusic,
      description: "時間軸での演出コントロール",
      elements: [
        {
          element: "緩急の付け方",
          techniques: [
            "序破急の構成",
            "クライマックスへの助走",
            "意図的な間（ま）",
            "テンポチェンジのタイミング"
          ]
        },
        {
          element: "反復と変奏",
          techniques: [
            "モチーフの繰り返し",
            "セリフのリフレイン",
            "動きのパターン化",
            "変化による強調"
          ]
        },
        {
          element: "同時多発",
          techniques: [
            "複数の会話の重なり",
            "時間軸の交錯",
            "フォーカスの切り替え",
            "カオスから秩序へ"
          ]
        }
      ]
    },
    actor: {
      title: "演技指導",
      icon: FaUsers,
      description: "役者から最高の演技を引き出す",
      methods: [
        {
          method: "役作りサポート",
          approaches: [
            "キャラクター分析シート作成",
            "バックストーリーの構築",
            "身体的特徴の設定",
            "内的独白の創作"
          ]
        },
        {
          method: "関係性の構築",
          approaches: [
            "エチュード（即興）練習",
            "ペアワークでの信頼構築",
            "アンサンブルゲーム",
            "感情の交流練習"
          ]
        },
        {
          method: "ブロッキング",
          approaches: [
            "有機的な動きの発見",
            "心理的距離の可視化",
            "視線の演出",
            "静と動のコントラスト"
          ]
        }
      ]
    }
  };

  // 演出プランの作り方
  const planningProcess = [
    {
      phase: "準備期（2-3ヶ月前）",
      tasks: [
        "脚本の徹底分析",
        "演出コンセプト決定",
        "キャスティング",
        "スタッフミーティング",
        "稽古計画立案"
      ]
    },
    {
      phase: "稽古前期（1.5-2ヶ月前）",
      tasks: [
        "読み合わせと分析",
        "キャラクター構築",
        "基本的なブロッキング",
        "シーンワーク",
        "衣装・美術打ち合わせ"
      ]
    },
    {
      phase: "稽古中期（3-4週間前）",
      tasks: [
        "詳細なシーン作り",
        "テンポとリズム調整",
        "技術スタッフとの合わせ",
        "通し稽古開始",
        "問題点の洗い出し"
      ]
    },
    {
      phase: "稽古後期（1-2週間前）",
      tasks: [
        "通し稽古の反復",
        "テクニカルリハーサル",
        "ゲネプロ",
        "最終調整",
        "メンタルケア"
      ]
    }
  ];

  // 演出スタイル
  const directingStyles = [
    {
      style: "リアリズム演出",
      characteristics: "日常的な自然な演技、写実的な舞台",
      techniques: ["第四の壁", "心理的リアリティ", "生活感のある動き"],
      suitable: "現代劇、社会派作品、心理劇",
      examples: "チェーホフ、イプセン作品"
    },
    {
      style: "様式的演出",
      characteristics: "型や形式を重視した演技、象徴的表現",
      techniques: ["型の美学", "誇張表現", "舞踊的動き"],
      suitable: "古典劇、詩劇、ミュージカル",
      examples: "歌舞伎、ギリシャ悲劇"
    },
    {
      style: "実験的演出",
      characteristics: "既成概念を破る新しい表現",
      techniques: ["空間の非日常的使用", "時間軸の解体", "メタシアター"],
      suitable: "前衛作品、翻案もの",
      examples: "ポストドラマ演劇"
    },
    {
      style: "参加型演出",
      characteristics: "観客を巻き込む双方向性",
      techniques: ["観客への直接呼びかけ", "選択式展開", "移動型公演"],
      suitable: "教育演劇、地域演劇",
      examples: "フォーラムシアター"
    }
  ];

  // よくある演出の失敗
  const commonMistakes = [
    {
      mistake: "過剰な演出",
      symptom: "アイデアを詰め込みすぎて焦点がぼやける",
      solution: "核となるコンセプトに集中し、引き算の美学を"
    },
    {
      mistake: "役者への過度な要求",
      symptom: "技術的に無理な演技を強要",
      solution: "役者の個性と能力を活かす演出に変更"
    },
    {
      mistake: "観客視点の欠如",
      symptom: "自己満足的で伝わらない演出",
      solution: "客観的な視点を持ち、第三者の意見を聞く"
    },
    {
      mistake: "技術との不調和",
      symptom: "照明・音響と演出がちぐはぐ",
      solution: "早い段階から技術スタッフと協議"
    }
  ];

  return (
    <Layout>
      <Seo
        pageTitle="演出の技法ガイド | 作品を立体化する演出術"
        pageDescription="演劇演出の基本から応用まで。コンセプト設計、空間演出、演技指導など、演出家に必要な技法と知識を詳しく解説。"
        pagePath="/guide/advanced/directing"
      />
      <StructuredData
        type="Article"
        title="演出の技法ガイド"
        description="演出家のための実践的技法集"
        url="https://gikyokutosyokan.com/guide/advanced/directing"
        datePublished="2024-01-01"
        dateModified="2024-01-01"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "ガイド", url: "https://gikyokutosyokan.com/guide" },
          { name: "上級者向け", url: "https://gikyokutosyokan.com/guide/advanced" },
          { name: "演出の技法", url: "https://gikyokutosyokan.com/guide/advanced/directing" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            演出の技法ガイド
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            脚本を立体的な舞台作品に変える演出術
          </p>
          <div className="inline-flex items-center text-sm text-gray-500 gap-4">
            <span>更新日: 2024年1月1日</span>
            <span>読了時間: 約20分</span>
          </div>
        </header>

        {/* イントロダクション */}
        <section className="mb-12 bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaTheaterMasks className="mr-3 text-purple-500" />
            演出とは何か
          </h2>
          <p className="mb-4 text-gray-700">
            演出とは、脚本という二次元の設計図を、生きた三次元の舞台作品に変換する創造的な作業です。
            演出家は、作品の解釈者であり、創造者であり、チームのリーダーでもあります。
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg">
              <FaEye className="text-2xl text-blue-500 mb-2" />
              <h3 className="font-semibold mb-1">解釈者として</h3>
              <p className="text-sm text-gray-600">
                作品の本質を見抜き、現代に通じる意味を発見
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <FaPalette className="text-2xl text-green-500 mb-2" />
              <h3 className="font-semibold mb-1">創造者として</h3>
              <p className="text-sm text-gray-600">
                独自の視点で作品世界を構築
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <FaUsers className="text-2xl text-purple-500 mb-2" />
              <h3 className="font-semibold mb-1">リーダーとして</h3>
              <p className="text-sm text-gray-600">
                キャストとスタッフをまとめ上げる
              </p>
            </div>
          </div>
        </section>

        {/* タブナビゲーション */}
        <nav className="mb-8">
          <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-lg">
            {Object.entries(directingElements).map(([key, element]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  activeTab === key
                    ? "bg-purple-500 text-white shadow"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <element.icon className="mr-2" />
                {element.title}
              </button>
            ))}
          </div>
        </nav>

        {/* タブコンテンツ */}
        <section className="mb-12">
          {activeTab === "concept" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaLightbulb className="mr-3 text-yellow-500" />
                {directingElements.concept.title}
              </h2>
              <p className="mb-6 text-gray-700">{directingElements.concept.description}</p>
              
              <div className="space-y-6">
                {directingElements.concept.steps.map((step, index) => (
                  <div key={index} className="bg-white border rounded-lg p-6">
                    <div className="flex items-start mb-4">
                      <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold mr-3">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">{step.step}</h3>
                        <p className="text-gray-600 mb-4">{step.detail}</p>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2 text-sm">実践テクニック</h4>
                          <div className="grid md:grid-cols-2 gap-2">
                            {step.techniques.map((technique, i) => (
                              <div key={i} className="flex items-center text-sm">
                                <span className="text-purple-500 mr-2">•</span>
                                {technique}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "space" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaPalette className="mr-3 text-blue-500" />
                {directingElements.space.title}
              </h2>
              <p className="mb-6 text-gray-700">{directingElements.space.description}</p>
              
              <div className="space-y-6">
                {directingElements.space.techniques.map((technique, index) => (
                  <div key={index} className="bg-white border rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-3">{technique.name}</h3>
                    <p className="text-gray-600 mb-4">{technique.description}</p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 text-sm">実例</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {technique.examples.map((example, i) => (
                          <div key={i} className="bg-white p-3 rounded text-sm">
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "rhythm" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaMusic className="mr-3 text-green-500" />
                {directingElements.rhythm.title}
              </h2>
              <p className="mb-6 text-gray-700">{directingElements.rhythm.description}</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {directingElements.rhythm.elements.map((element, index) => (
                  <div key={index} className="bg-white border rounded-lg p-5">
                    <h3 className="font-bold mb-3">{element.element}</h3>
                    <ul className="space-y-2">
                      {element.techniques.map((technique, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <span className="text-green-500 mr-2 mt-1">▶</span>
                          <span>{technique}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "actor" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaUsers className="mr-3 text-orange-500" />
                {directingElements.actor.title}
              </h2>
              <p className="mb-6 text-gray-700">{directingElements.actor.description}</p>
              
              <div className="space-y-6">
                {directingElements.actor.methods.map((method, index) => (
                  <div key={index} className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4">{method.method}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {method.approaches.map((approach, i) => (
                        <div key={i} className="bg-white p-4 rounded-lg">
                          <div className="flex items-center">
                            <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">
                              {i + 1}
                            </span>
                            <span className="text-sm">{approach}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 演出プランニング */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaChartLine className="mr-3 text-blue-500" />
            演出プランニングの流れ
          </h2>
          
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="space-y-6">
              {planningProcess.map((phase, index) => (
                <div key={index} className="flex items-start">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold mr-4 ${
                    index === 0 ? "bg-purple-500" :
                    index === 1 ? "bg-blue-500" :
                    index === 2 ? "bg-green-500" :
                    "bg-orange-500"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-3">{phase.phase}</h3>
                    <div className="bg-white p-4 rounded-lg">
                      <ul className="space-y-2">
                        {phase.tasks.map((task, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <span className="text-gray-400 mr-2">•</span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 演出スタイル比較 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">演出スタイルの選択</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {directingStyles.map((style, index) => (
              <div key={index} className="bg-white border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-3 text-purple-600">{style.style}</h3>
                <p className="text-sm text-gray-600 mb-4">{style.characteristics}</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">技法</h4>
                    <div className="flex flex-wrap gap-2">
                      {style.techniques.map((tech, i) => (
                        <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-1">適した作品</h4>
                    <p className="text-sm text-gray-600">{style.suitable}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-1">例</h4>
                    <p className="text-sm text-gray-500">{style.examples}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 具体的な演出例 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaFilm className="mr-3 text-red-500" />
            具体的な演出テクニック
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-bold mb-4">場面転換の演出</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">暗転を使わない転換</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 役者が舞台装置を動かす</li>
                    <li>• 照明のフェードで場面を切り替える</li>
                    <li>• 音楽でつなぐ</li>
                    <li>• 動きを止めずに流れるように</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">時間経過の表現</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 照明の色温度変化</li>
                    <li>• 衣装の一部を変える</li>
                    <li>• 音響で時計の音</li>
                    <li>• 役者の動きをスローモーション</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-bold mb-4">感情表現の演出</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">内面の可視化</h4>
                  <p className="text-sm">
                    分身を使った心の声、影絵での心理描写、コロスによる内面表現
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">関係性の表現</h4>
                  <p className="text-sm">
                    物理的距離で心理的距離を表現、高低差で力関係、背中合わせで対立
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">時間の操作</h4>
                  <p className="text-sm">
                    フラッシュバック、同時進行、リピート、フリーズ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* よくある失敗と対策 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">よくある演出の失敗と対策</h2>
          
          <div className="space-y-4">
            {commonMistakes.map((item, index) => (
              <div key={index} className="bg-red-50 border-l-4 border-red-500 p-6">
                <h3 className="font-bold mb-2 text-red-700">
                  ❌ {item.mistake}
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  <strong>症状：</strong>{item.symptom}
                </p>
                <div className="bg-white p-3 rounded">
                  <strong className="text-sm text-green-600">✓ 解決策：</strong>
                  <span className="text-sm ml-2">{item.solution}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 演出ノートの作り方 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">演出ノートの作り方</h2>
          
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-4">記録すべき内容</h3>
                <ul className="space-y-2 text-sm">
                  <li>📝 各シーンの演出意図</li>
                  <li>📐 ブロッキング図</li>
                  <li>🎨 舞台美術スケッチ</li>
                  <li>💡 照明・音響キュー</li>
                  <li>👥 キャラクター相関図</li>
                  <li>⏱️ タイムテーブル</li>
                  <li>📊 稽古の進捗記録</li>
                  <li>💭 アイデアメモ</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">効果的な使い方</h3>
                <ul className="space-y-2 text-sm">
                  <li>✅ 毎回の稽古前に確認</li>
                  <li>✅ 変更点は即座に記録</li>
                  <li>✅ スタッフと共有</li>
                  <li>✅ 写真や動画も活用</li>
                  <li>✅ 反省点も記録</li>
                  <li>✅ 次回への課題を明記</li>
                  <li>✅ 成功例も忘れずに</li>
                  <li>✅ デジタル化して保存</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* まとめ */}
        <section className="mb-12 bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">優れた演出家になるために</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-lg">
              <h3 className="font-semibold mb-2">📚 幅広い知識</h3>
              <p className="text-sm text-gray-600">
                演劇史、美術、音楽、文学など、多様な芸術に触れる
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg">
              <h3 className="font-semibold mb-2">👁️ 観察力</h3>
              <p className="text-sm text-gray-600">
                日常生活での人間観察、他の舞台作品の分析
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg">
              <h3 className="font-semibold mb-2">🤝 コミュニケーション</h3>
              <p className="text-sm text-gray-600">
                ビジョンを明確に伝え、チームをまとめる力
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg">
              <h3 className="font-semibold mb-2">🎯 決断力</h3>
              <p className="text-sm text-gray-600">
                多くの選択肢から最適なものを選ぶ勇気
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg">
              <h3 className="font-semibold mb-2">🔄 柔軟性</h3>
              <p className="text-sm text-gray-600">
                予期せぬ状況への対応、プランBの準備
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg">
              <h3 className="font-semibold mb-2">❤️ 情熱</h3>
              <p className="text-sm text-gray-600">
                作品と役者への愛、演劇への純粋な情熱
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">演出に挑戦してみよう</h2>
          <p className="mb-6 text-gray-700">
            まずは短編作品から始めて、<br />
            あなただけの演出スタイルを見つけてください。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/?minPlaytime=10&maxPlaytime=30" className="inline-block bg-purple-500 text-white px-8 py-3 rounded-lg hover:bg-purple-600 font-semibold">
              演出しやすい短編を探す
            </Link>
            <Link href="/guide/beginner/reading-script" className="inline-block bg-white text-purple-500 border-2 border-purple-500 px-8 py-3 rounded-lg hover:bg-purple-50 font-semibold">
              脚本分析ガイドを見る
            </Link>
          </div>
        </section>

        {/* 関連リンク */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">関連ガイド</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/guide/beginner/reading-script" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">脚本の読み方</h3>
              <p className="text-sm text-gray-600">演出の第一歩は分析から</p>
            </Link>
            <Link href="/guide/advanced/adaptation" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">翻案・潤色</h3>
              <p className="text-sm text-gray-600">作品の再創造</p>
            </Link>
            <Link href="/guide/advanced/stage-design" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">舞台美術</h3>
              <p className="text-sm text-gray-600">空間デザイン</p>
            </Link>
            <Link href="/guide/beginner/acting-basics" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">演技の基礎</h3>
              <p className="text-sm text-gray-600">役者への指導法</p>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}