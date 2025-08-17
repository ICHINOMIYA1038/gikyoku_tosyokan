import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { FaPalette, FaLightbulb, FaPaintBrush, FaRuler, FaYenSign, FaTools, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { useState } from "react";

export default function StageDesignGuide() {
  const [activeTab, setActiveTab] = useState<string>("concept");

  // 舞台美術の基本要素
  const stageElements = {
    concept: {
      title: "美術コンセプト",
      elements: [
        {
          name: "世界観の構築",
          description: "作品の舞台となる世界を視覚化",
          considerations: [
            "時代設定（現代・過去・未来）",
            "場所設定（室内・屋外・抽象空間）",
            "リアリズムか様式的か",
            "色彩計画（カラーパレット）",
            "素材感（木・金属・布など）"
          ]
        },
        {
          name: "空間構成",
          description: "舞台空間の使い方を決定",
          types: [
            "箱馬と平台による段差構成",
            "センターステージ型",
            "マルチレベル（多層構造）",
            "オープンスペース（何もない空間）",
            "環境演劇型（観客席も含む）"
          ]
        },
        {
          name: "象徴性",
          description: "視覚的メタファーの活用",
          examples: [
            "階段＝社会的階層、成長",
            "扉＝選択、未知への入口",
            "窓＝外界との接点、希望",
            "鏡＝自己認識、真実",
            "壁＝障害、分断"
          ]
        }
      ]
    },
    practical: {
      title: "実践的な美術製作",
      items: [
        {
          category: "大道具",
          elements: [
            { name: "平台", description: "基本的な床面、高さ調整可能", cost: "5,000円〜/台" },
            { name: "箱馬", description: "高さを作る基本単位", cost: "3,000円〜/個" },
            { name: "パネル", description: "壁面や仕切り", cost: "8,000円〜/枚" },
            { name: "階段", description: "レベル差をつなぐ", cost: "15,000円〜" },
            { name: "幕類", description: "背景や場面転換", cost: "10,000円〜" }
          ]
        },
        {
          category: "小道具",
          elements: [
            { name: "家具類", description: "椅子、テーブル、ベッドなど", cost: "レンタル or 製作" },
            { name: "装飾品", description: "絵画、花瓶、時計など", cost: "100円ショップ活用" },
            { name: "実用品", description: "食器、文具、本など", cost: "借用 or 購入" },
            { name: "持ち道具", description: "傘、鞄、杖など", cost: "個人所有品活用" }
          ]
        }
      ]
    },
    lighting: {
      title: "照明デザイン",
      basics: [
        {
          type: "基本照明",
          description: "舞台全体を照らす",
          equipment: [
            "フレネルレンズスポット（地明かり）",
            "パーライト（色彩照明）",
            "ボーダーライト（前明かり）",
            "フットライト（足元照明）"
          ]
        },
        {
          type: "効果照明",
          description: "特定の演出効果",
          techniques: [
            "スポットライト（人物強調）",
            "ゴボ（模様投影）",
            "ムービングライト（動的効果）",
            "ストロボ（瞬間効果）",
            "ブラックライト（蛍光効果）"
          ]
        },
        {
          type: "色彩照明",
          description: "感情や時間を表現",
          colors: [
            { color: "青", meaning: "夜、悲しみ、冷たさ", gel: "#71, #79" },
            { color: "赤", meaning: "情熱、危険、暖かさ", gel: "#26, #27" },
            { color: "緑", meaning: "自然、不安、神秘", gel: "#89, #91" },
            { color: "アンバー", meaning: "夕暮れ、懐かしさ", gel: "#02, #04" },
            { color: "白", meaning: "昼間、現実、清潔", gel: "なし or #60" }
          ]
        }
      ]
    }
  };

  // 低予算での工夫
  const budgetTips = [
    {
      category: "材料の工夫",
      tips: [
        "段ボールを骨組みに使用（軽量で加工しやすい）",
        "布で質感を変える（安価で効果的）",
        "100円ショップの活用（小道具の宝庫）",
        "廃材の再利用（エコで経済的）",
        "ペンキより布や紙（再利用可能）"
      ]
    },
    {
      category: "借用・レンタル",
      tips: [
        "他校・他団体との共有",
        "地域の公民館から借用",
        "個人所有品の提供募集",
        "レンタル業者の学割利用",
        "終演後の買取交渉"
      ]
    },
    {
      category: "手作りテクニック",
      tips: [
        "パネルに絵を描いて背景に",
        "影絵で複雑な形を表現",
        "プロジェクターで背景投影",
        "照明で色を変える（塗装不要）",
        "観客の想像力を活用する演出"
      ]
    }
  ];

  // 照明プラン作成
  const lightingPlan = {
    preparation: [
      "脚本を読み込み、場面ごとの雰囲気を把握",
      "演出家と美術デザイナーとの打ち合わせ",
      "会場の電源容量と設備を確認",
      "必要な機材リストの作成",
      "レンタル機材の手配"
    ],
    design: [
      "場面ごとの明かりプラン作成",
      "キューシート（転換表）の作成",
      "色温度と明度の計画",
      "特殊効果の検討",
      "バックアッププランの準備"
    ],
    execution: [
      "仕込み（機材設置）",
      "シュート（角度調整）",
      "明かり合わせ（演出確認）",
      "テクニカルリハーサル",
      "本番オペレーション"
    ]
  };

  // 安全管理
  const safetyGuidelines = [
    {
      area: "舞台美術",
      points: [
        "重量物は必ず固定",
        "段差には蓄光テープ",
        "釘やビスの飛び出し注意",
        "防炎加工された素材使用",
        "避難経路の確保"
      ]
    },
    {
      area: "照明",
      points: [
        "漏電ブレーカーの確認",
        "ケーブルの養生",
        "熱を持つ機材の管理",
        "高所作業の安全確保",
        "予備電源の準備"
      ]
    },
    {
      area: "作業時",
      points: [
        "必ず複数人で作業",
        "適切な服装と保護具",
        "工具の安全な使用",
        "整理整頓の徹底",
        "事故時の連絡体制"
      ]
    }
  ];

  // 実例紹介
  const caseStudies = [
    {
      title: "ミニマル美術",
      production: "『ゴドーを待ちながら』",
      concept: "何もない空間に一本の木",
      execution: "黒い箱に白い照明、中央に枯れ木のオブジェのみ",
      effect: "観客の想像力を最大限に引き出し、作品の本質を浮き彫りに",
      budget: "3万円（木のオブジェ製作費のみ）"
    },
    {
      title: "廃材アート",
      production: "『夏の夜の夢』",
      concept: "都市のゴミ捨て場が妖精の森に",
      execution: "廃材で作った幻想的な森、カラフルな照明で変化",
      effect: "環境問題への問題提起も含んだ現代的解釈",
      budget: "5万円（主に照明レンタルと塗料）"
    },
    {
      title: "プロジェクションマッピング",
      production: "『ロミオとジュリエット』",
      concept: "変化する都市風景",
      execution: "白い壁面にプロジェクターで背景投影",
      effect: "瞬時の場面転換と幻想的な雰囲気",
      budget: "8万円（プロジェクターレンタルと映像制作）"
    }
  ];

  return (
    <Layout>
      <Seo
        pageTitle="舞台美術・照明ガイド | 空間と光で物語を描く"
        pageDescription="演劇の舞台美術と照明デザインの基礎から実践まで。低予算での工夫、安全管理、効果的な空間演出の方法を詳しく解説。"
        pagePath="/guide/advanced/stage-design"
      />
      <StructuredData
        type="Article"
        title="舞台美術・照明ガイド"
        description="視覚効果で作品を彩る技術"
        url="https://gikyokutosyokan.com/guide/advanced/stage-design"
        datePublished="2024-01-01"
        dateModified="2024-01-01"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "ガイド", url: "https://gikyokutosyokan.com/guide" },
          { name: "上級者向け", url: "https://gikyokutosyokan.com/guide/advanced" },
          { name: "舞台美術・照明", url: "https://gikyokutosyokan.com/guide/advanced/stage-design" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            舞台美術・照明ガイド
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            空間と光で物語を視覚化する創造的な技術
          </p>
          <div className="inline-flex items-center text-sm text-gray-500 gap-4">
            <span>更新日: 2024年1月1日</span>
            <span>読了時間: 約20分</span>
          </div>
        </header>

        {/* イントロダクション */}
        <section className="mb-12 bg-gradient-to-r from-orange-50 to-yellow-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaPalette className="mr-3 text-orange-500" />
            舞台美術・照明の役割
          </h2>
          <p className="mb-4 text-gray-700">
            舞台美術と照明は、脚本の世界を視覚的に具現化し、観客を物語の世界へ誘う重要な要素です。
            限られた空間と予算の中で、最大限の効果を生み出す創造力と技術が求められます。
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg">
              <FaPaintBrush className="text-2xl text-orange-500 mb-2" />
              <h3 className="font-semibold mb-1">空間デザイン</h3>
              <p className="text-sm text-gray-600">
                物語の舞台となる世界を構築
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <FaLightbulb className="text-2xl text-yellow-500 mb-2" />
              <h3 className="font-semibold mb-1">雰囲気演出</h3>
              <p className="text-sm text-gray-600">
                光と影で感情を表現
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <FaRuler className="text-2xl text-green-500 mb-2" />
              <h3 className="font-semibold mb-1">機能性</h3>
              <p className="text-sm text-gray-600">
                演技しやすく安全な環境
              </p>
            </div>
          </div>
        </section>

        {/* タブナビゲーション */}
        <nav className="mb-8">
          <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-lg">
            <button
              onClick={() => setActiveTab("concept")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === "concept"
                  ? "bg-orange-500 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              美術コンセプト
            </button>
            <button
              onClick={() => setActiveTab("practical")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === "practical"
                  ? "bg-orange-500 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              実践製作
            </button>
            <button
              onClick={() => setActiveTab("lighting")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === "lighting"
                  ? "bg-orange-500 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              照明デザイン
            </button>
            <button
              onClick={() => setActiveTab("budget")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === "budget"
                  ? "bg-orange-500 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              予算管理
            </button>
            <button
              onClick={() => setActiveTab("safety")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === "safety"
                  ? "bg-orange-500 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              安全管理
            </button>
          </div>
        </nav>

        {/* 美術コンセプト */}
        {activeTab === "concept" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">美術コンセプトの構築</h2>
            
            {stageElements.concept.elements.map((element, index) => (
              <div key={index} className="mb-8 bg-white border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-orange-600">{element.name}</h3>
                <p className="text-gray-600 mb-4">{element.description}</p>
                
                {element.considerations && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">検討事項</h4>
                    <ul className="space-y-1">
                      {element.considerations.map((item, i) => (
                        <li key={i} className="text-sm">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {element.types && (
                  <div className="grid md:grid-cols-2 gap-3 mt-4">
                    {element.types.map((type, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded text-sm">
                        {type}
                      </div>
                    ))}
                  </div>
                )}
                
                {element.examples && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">象徴的な使用例</h4>
                    <div className="space-y-2">
                      {element.examples.map((example, i) => (
                        <div key={i} className="bg-yellow-50 p-3 rounded text-sm">
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* 実践製作 */}
        {activeTab === "practical" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">実践的な美術製作</h2>
            
            {stageElements.practical.items.map((item, index) => (
              <div key={index} className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-green-600">{item.category}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {item.elements.map((element, i) => (
                    <div key={i} className="bg-white border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{element.name}</h4>
                        <span className="text-sm text-gray-500">{element.cost}</span>
                      </div>
                      <p className="text-sm text-gray-600">{element.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* 製作スケジュール */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold mb-4">美術製作スケジュール</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">1</span>
                  <div>
                    <strong>2ヶ月前：</strong>デザイン決定、材料リスト作成
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">2</span>
                  <div>
                    <strong>6週間前：</strong>材料調達、大道具製作開始
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">3</span>
                  <div>
                    <strong>4週間前：</strong>小道具製作、塗装作業
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">4</span>
                  <div>
                    <strong>2週間前：</strong>舞台設置、調整
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">5</span>
                  <div>
                    <strong>1週間前：</strong>最終チェック、補修
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 照明デザイン */}
        {activeTab === "lighting" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">照明デザインの基礎</h2>
            
            {stageElements.lighting.basics.map((item, index) => (
              <div key={index} className="mb-8 bg-white border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-yellow-600">{item.type}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                
                {item.equipment && (
                  <div>
                    <h4 className="font-semibold mb-2">使用機材</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {item.equipment.map((equip, i) => (
                        <div key={i} className="bg-yellow-50 p-3 rounded text-sm">
                          {equip}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {item.techniques && (
                  <div>
                    <h4 className="font-semibold mb-2">テクニック</h4>
                    <ul className="space-y-1">
                      {item.techniques.map((tech, i) => (
                        <li key={i} className="text-sm">• {tech}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {item.colors && (
                  <div>
                    <h4 className="font-semibold mb-3">色彩の意味</h4>
                    <div className="space-y-2">
                      {item.colors.map((color, i) => (
                        <div key={i} className="flex items-center bg-gray-50 p-3 rounded">
                          <div className={`w-8 h-8 rounded mr-3 ${
                            color.color === "青" ? "bg-blue-500" :
                            color.color === "赤" ? "bg-red-500" :
                            color.color === "緑" ? "bg-green-500" :
                            color.color === "アンバー" ? "bg-yellow-600" :
                            "bg-gray-200"
                          }`}></div>
                          <div className="flex-1">
                            <strong className="text-sm">{color.color}：</strong>
                            <span className="text-sm ml-2">{color.meaning}</span>
                            <span className="text-xs text-gray-500 ml-2">（{color.gel}）</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* 照明プラン作成 */}
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-bold mb-4">照明プラン作成の流れ</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. 準備段階</h4>
                  <ul className="space-y-1 text-sm">
                    {lightingPlan.preparation.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. デザイン段階</h4>
                  <ul className="space-y-1 text-sm">
                    {lightingPlan.design.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. 実行段階</h4>
                  <ul className="space-y-1 text-sm">
                    {lightingPlan.execution.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 予算管理 */}
        {activeTab === "budget" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaYenSign className="mr-3 text-green-500" />
              低予算での工夫
            </h2>
            
            {budgetTips.map((category, index) => (
              <div key={index} className="mb-6 bg-white border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4 text-green-600">{category.category}</h3>
                <ul className="space-y-2">
                  {category.tips.map((tip, i) => (
                    <li key={i} className="flex items-start">
                      <FaCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* 予算配分の目安 */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold mb-4">予算配分の目安（総予算10万円の場合）</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>大道具材料費</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-4 mr-3">
                      <div className="bg-green-500 h-4 rounded-full" style={{width: "30%"}}></div>
                    </div>
                    <span className="font-semibold">30,000円</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>小道具・装飾</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-4 mr-3">
                      <div className="bg-blue-500 h-4 rounded-full" style={{width: "20%"}}></div>
                    </div>
                    <span className="font-semibold">20,000円</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>照明レンタル</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-4 mr-3">
                      <div className="bg-yellow-500 h-4 rounded-full" style={{width: "25%"}}></div>
                    </div>
                    <span className="font-semibold">25,000円</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>衣装費</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-4 mr-3">
                      <div className="bg-purple-500 h-4 rounded-full" style={{width: "15%"}}></div>
                    </div>
                    <span className="font-semibold">15,000円</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>予備費</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-4 mr-3">
                      <div className="bg-red-500 h-4 rounded-full" style={{width: "10%"}}></div>
                    </div>
                    <span className="font-semibold">10,000円</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 安全管理 */}
        {activeTab === "safety" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaExclamationTriangle className="mr-3 text-red-500" />
              安全管理ガイドライン
            </h2>
            
            <div className="bg-red-50 p-6 rounded-lg mb-6">
              <p className="text-red-700 font-semibold">
                安全は全てに優先します。事故防止のため、必ずガイドラインを守ってください。
              </p>
            </div>
            
            {safetyGuidelines.map((guide, index) => (
              <div key={index} className="mb-6 bg-white border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4 text-red-600">{guide.area}</h3>
                <ul className="space-y-2">
                  {guide.points.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <FaExclamationTriangle className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* 緊急時対応 */}
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-bold mb-4">緊急時の対応</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">事故発生時</h4>
                  <ol className="space-y-1 text-sm">
                    <li>1. 負傷者の安全確保</li>
                    <li>2. 応急処置の実施</li>
                    <li>3. 必要に応じて救急車</li>
                    <li>4. 責任者への報告</li>
                    <li>5. 記録の作成</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">準備しておくもの</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 救急箱</li>
                    <li>• 緊急連絡先リスト</li>
                    <li>• 消火器の位置確認</li>
                    <li>• 避難経路図</li>
                    <li>• 懐中電灯</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 実例紹介 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">創造的な舞台美術の実例</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {caseStudies.map((study, index) => (
              <div key={index} className="bg-white border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2 text-purple-600">{study.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>作品：</strong>{study.production}
                </p>
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">コンセプト：</strong>
                    <p className="text-sm text-gray-700">{study.concept}</p>
                  </div>
                  <div>
                    <strong className="text-sm">実現方法：</strong>
                    <p className="text-sm text-gray-700">{study.execution}</p>
                  </div>
                  <div>
                    <strong className="text-sm">効果：</strong>
                    <p className="text-sm text-green-600">{study.effect}</p>
                  </div>
                  <div className="pt-3 border-t">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                      予算: {study.budget}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* デザインシート */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">舞台美術デザインシート</h2>
          
          <div className="bg-white border rounded-lg p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2">作品名</label>
                  <input type="text" className="w-full p-3 border rounded-lg" placeholder="上演作品名" />
                </div>
                <div>
                  <label className="block font-semibold mb-2">会場</label>
                  <input type="text" className="w-full p-3 border rounded-lg" placeholder="上演会場名" />
                </div>
              </div>
              
              <div>
                <label className="block font-semibold mb-2">美術コンセプト</label>
                <textarea className="w-full p-3 border rounded-lg" rows={3} placeholder="世界観、時代設定、全体的なイメージ" />
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block font-semibold mb-2">主要な色</label>
                  <input type="text" className="w-full p-3 border rounded-lg" placeholder="カラーパレット" />
                </div>
                <div>
                  <label className="block font-semibold mb-2">素材感</label>
                  <input type="text" className="w-full p-3 border rounded-lg" placeholder="木、金属、布など" />
                </div>
                <div>
                  <label className="block font-semibold mb-2">予算</label>
                  <input type="text" className="w-full p-3 border rounded-lg" placeholder="￥" />
                </div>
              </div>
              
              <div>
                <label className="block font-semibold mb-2">必要な大道具リスト</label>
                <textarea className="w-full p-3 border rounded-lg" rows={4} placeholder="平台、パネル、階段など" />
              </div>
              
              <div>
                <label className="block font-semibold mb-2">照明プラン概要</label>
                <textarea className="w-full p-3 border rounded-lg" rows={3} placeholder="基本照明、特殊効果など" />
              </div>
              
              <div className="flex gap-4">
                <button type="button" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600">
                  保存する
                </button>
                <button type="button" className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600">
                  印刷する
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* まとめ */}
        <section className="mb-12 bg-gradient-to-r from-orange-100 to-yellow-100 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">効果的な舞台美術・照明のために</h2>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <FaPalette className="text-2xl text-orange-500 mb-2" />
              <h3 className="font-semibold mb-2">統一感</h3>
              <p className="text-sm text-gray-600">
                コンセプトに基づいた一貫性のあるデザイン
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <FaTools className="text-2xl text-blue-500 mb-2" />
              <h3 className="font-semibold mb-2">実用性</h3>
              <p className="text-sm text-gray-600">
                安全で演技しやすい空間設計
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <FaYenSign className="text-2xl text-green-500 mb-2" />
              <h3 className="font-semibold mb-2">経済性</h3>
              <p className="text-sm text-gray-600">
                限られた予算での最大効果
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <FaLightbulb className="text-2xl text-yellow-500 mb-2" />
              <h3 className="font-semibold mb-2">創造性</h3>
              <p className="text-sm text-gray-600">
                独創的なアイデアで観客を魅了
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">舞台美術に挑戦しよう</h2>
          <p className="mb-6 text-gray-700">
            限られた資源の中でも、アイデア次第で素晴らしい舞台は作れます。<br />
            創造力を発揮して、観客を物語の世界へ誘いましょう。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 font-semibold">
              上演作品を探す
            </Link>
            <Link href="/guide/advanced/directing" className="inline-block bg-white text-orange-500 border-2 border-orange-500 px-8 py-3 rounded-lg hover:bg-orange-50 font-semibold">
              演出の技法を見る
            </Link>
          </div>
        </section>

        {/* 関連リンク */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">関連ガイド</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/guide/advanced/directing" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">演出の技法</h3>
              <p className="text-sm text-gray-600">空間演出との連携</p>
            </Link>
            <Link href="/guide/school/culture-festival" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">文化祭演劇</h3>
              <p className="text-sm text-gray-600">限られた条件での工夫</p>
            </Link>
            <Link href="/guide/club-management" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">演劇部運営</h3>
              <p className="text-sm text-gray-600">予算管理と計画</p>
            </Link>
            <Link href="/glossary" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">演劇用語集</h3>
              <p className="text-sm text-gray-600">技術用語の確認</p>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}