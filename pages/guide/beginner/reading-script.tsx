import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { FaBook, FaHighlighter, FaUsers, FaTheaterMasks, FaPencilAlt, FaLightbulb, FaQuestionCircle, FaClipboardList } from "react-icons/fa";
import { useState } from "react";

export default function ReadingScript() {
  const [activeStep, setActiveStep] = useState<number>(1);

  // 脚本分析のステップ
  const analysisSteps = [
    {
      step: 1,
      title: "初読み - 全体を把握する",
      icon: FaBook,
      description: "まず通して読み、物語の全体像をつかみます",
      tasks: [
        "メモを取らずに最後まで読む",
        "第一印象を大切にする",
        "感じたことを書き留める",
        "全体の雰囲気をつかむ",
        "上演時間を概算する"
      ],
      tips: "批判的にならず、素直な気持ちで読むことが大切です。観客として楽しむつもりで。"
    },
    {
      step: 2,
      title: "構造分析 - 骨組みを理解する",
      icon: FaClipboardList,
      description: "物語の構造と展開を分析します",
      tasks: [
        "起承転結を明確にする",
        "クライマックスを特定",
        "場面転換をチェック",
        "時間軸を整理",
        "伏線と回収を確認"
      ],
      tips: "物語の山場がどこにあるかを把握することで、演出の緩急がつけやすくなります。"
    },
    {
      step: 3,
      title: "人物分析 - キャラクターを深く知る",
      icon: FaUsers,
      description: "登場人物の性格や関係性を詳しく分析します",
      tasks: [
        "人物相関図を作成",
        "各キャラクターの目的を明確化",
        "性格・背景を想像",
        "人物の変化を追う",
        "セリフの特徴を分析"
      ],
      tips: "キャラクターの「したいこと」「障害」「結果」を整理すると、演技プランが立てやすくなります。"
    },
    {
      step: 4,
      title: "テーマ探求 - 作品の核心を見つける",
      icon: FaQuestionCircle,
      description: "作者が伝えたいメッセージを探ります",
      tasks: [
        "繰り返される言葉やモチーフ",
        "対立構造の意味",
        "タイトルの意味を考察",
        "現代との関連性",
        "普遍的なテーマを発見"
      ],
      tips: "テーマが明確になると、演出の方向性が定まり、観客に伝わりやすい舞台になります。"
    },
    {
      step: 5,
      title: "演出プラン - 具体的な舞台化",
      icon: FaTheaterMasks,
      description: "実際の上演に向けた具体的なプランを立てます",
      tasks: [
        "舞台美術のイメージ",
        "衣装・メイクの方向性",
        "音響・照明の使い方",
        "演技スタイルの決定",
        "観客へのメッセージ"
      ],
      tips: "予算や会場の制約も考慮しながら、実現可能なプランを立てましょう。"
    }
  ];

  // セリフ分析の方法
  const dialogueAnalysis = {
    surface: {
      title: "表面的な意味",
      description: "セリフの文字通りの意味",
      examples: [
        "「今日はいい天気だね」→ 天気について話している",
        "「お腹すいた」→ 空腹を訴えている",
        "「もう帰る」→ 帰宅の意思表示"
      ]
    },
    subtext: {
      title: "サブテキスト",
      description: "セリフの裏にある本当の意味",
      examples: [
        "「今日はいい天気だね」→ 会話を始めたい、気まずさを解消したい",
        "「お腹すいた」→ 一緒に食事に行きたい、かまってほしい",
        "「もう帰る」→ 引き止めてほしい、怒っている"
      ]
    },
    action: {
      title: "行動目的",
      description: "そのセリフで何をしようとしているか",
      examples: [
        "「今日はいい天気だね」→ 相手との距離を縮める",
        "「お腹すいた」→ 相手を誘う、注目を集める",
        "「もう帰る」→ 相手を試す、決別する"
      ]
    }
  };

  // ト書きの読み方
  const stageDirections = [
    {
      type: "動作指示",
      example: "（立ち上がる）",
      interpretation: "感情の高まり、決意、逃避などを表現",
      actingTip: "なぜ立ち上がるのか、内面を考える"
    },
    {
      type: "感情指示",
      example: "（悲しそうに）",
      interpretation: "表現の手がかり、ただし固定しすぎない",
      actingTip: "「悲しい」にも様々な表現がある"
    },
    {
      type: "間の指示",
      example: "（沈黙）",
      interpretation: "言葉にできない感情、緊張感",
      actingTip: "沈黙の間も演技は続いている"
    },
    {
      type: "場面説明",
      example: "（夕暮れ時、公園のベンチ）",
      interpretation: "雰囲気や心情を暗示",
      actingTip: "時間帯や場所が与える影響を考慮"
    }
  ];

  // 実践ワークシート
  const worksheetItems = [
    { label: "作品名", placeholder: "例：ロミオとジュリエット" },
    { label: "作者", placeholder: "例：ウィリアム・シェイクスピア" },
    { label: "ジャンル", placeholder: "例：悲劇、恋愛劇" },
    { label: "上演時間", placeholder: "例：約120分" },
    { label: "登場人物数", placeholder: "例：男性7名、女性4名" },
    { label: "舞台設定", placeholder: "例：14世紀イタリア、ヴェローナ" },
    { label: "あらすじ（100字）", placeholder: "物語を簡潔にまとめる", multiline: true },
    { label: "テーマ", placeholder: "例：愛と憎しみ、運命", multiline: true },
    { label: "見どころ", placeholder: "例：バルコニーシーン", multiline: true }
  ];

  return (
    <Layout>
      <Seo
        pageTitle="脚本の読み方・分析ガイド | 演技と演出の第一歩"
        pageDescription="演劇脚本の正しい読み方と分析方法を解説。初読みから演出プランまで、5つのステップで作品を深く理解する方法を詳しく紹介。"
        pagePath="/guide/beginner/reading-script"
        pageType="article"
      />
      <StructuredData
        type="Article"
        title="脚本の読み方・分析ガイド"
        description="演技と演出のための脚本分析法"
        url="https://gikyokutosyokan.com/guide/beginner/reading-script"
        datePublished="2024-01-01"
        dateModified="2024-01-01"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "ガイド", url: "https://gikyokutosyokan.com/guide" },
          { name: "初心者向け", url: "https://gikyokutosyokan.com/guide/beginner" },
          { name: "脚本の読み方", url: "https://gikyokutosyokan.com/guide/beginner/reading-script" }
        ]}
      />
      
      <article className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            脚本の読み方・分析ガイド
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            作品を深く理解し、素晴らしい舞台を作るための第一歩
          </p>
          <div className="inline-flex items-center text-sm text-gray-500 gap-4">
            <span>更新日: 2024年1月1日</span>
            <span>読了時間: 約15分</span>
          </div>
        </header>

        {/* イントロダクション */}
        <section className="mb-12 bg-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">なぜ脚本分析が重要なのか</h2>
          <p className="mb-4 text-gray-700">
            脚本は演劇の設計図です。正しく読み解くことで、作者の意図を理解し、
            観客に伝わる演技・演出が可能になります。
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg">
              <FaTheaterMasks className="text-2xl text-blue-500 mb-2" />
              <h3 className="font-semibold mb-1">演者にとって</h3>
              <p className="text-sm text-gray-600">
                役の内面を理解し、説得力のある演技ができる
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <FaPencilAlt className="text-2xl text-green-500 mb-2" />
              <h3 className="font-semibold mb-1">演出家にとって</h3>
              <p className="text-sm text-gray-600">
                作品の核心を捉え、統一感のある演出が可能
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <FaUsers className="text-2xl text-purple-500 mb-2" />
              <h3 className="font-semibold mb-1">スタッフにとって</h3>
              <p className="text-sm text-gray-600">
                作品世界を共有し、一体感のある舞台を作れる
              </p>
            </div>
          </div>
        </section>

        {/* 5つのステップ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">脚本分析の5つのステップ</h2>
          
          {/* ステップナビゲーション */}
          <div className="flex justify-between mb-8 relative">
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0"></div>
            {analysisSteps.map((step) => (
              <button
                key={step.step}
                onClick={() => setActiveStep(step.step)}
                className={`relative z-10 flex flex-col items-center ${
                  activeStep === step.step ? "" : "opacity-60"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  activeStep === step.step ? "bg-blue-500" : "bg-gray-400"
                }`}>
                  {step.step}
                </div>
                <span className="text-xs mt-1 hidden md:block max-w-[100px] text-center">
                  {step.title.split(" - ")[0]}
                </span>
              </button>
            ))}
          </div>

          {/* アクティブなステップの詳細 */}
          {analysisSteps.map((step) => (
            <div
              key={step.step}
              className={`${activeStep === step.step ? "block" : "hidden"}`}
            >
              <div className="bg-white border rounded-lg p-8">
                <header className="mb-6">
                  <div className="flex items-center mb-3">
                    <step.icon className="text-3xl text-blue-500 mr-3" />
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </header>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">やること</h4>
                    <ul className="space-y-2">
                      {step.tasks.map((task, index) => (
                        <li key={index} className="flex items-start">
                          <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs mr-2 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-sm">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">
                      <FaLightbulb className="inline mr-1 text-yellow-500" />
                      ポイント
                    </h4>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">{step.tips}</p>
                    </div>
                    
                    {step.step === 1 && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm">
                          <strong>推奨時間：</strong>60-90分程度の作品なら30分以内で読む
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                    className={`px-4 py-2 rounded ${
                      activeStep === 1 
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                        : "bg-gray-500 text-white hover:bg-gray-600"
                    }`}
                    disabled={activeStep === 1}
                  >
                    ← 前のステップ
                  </button>
                  <button
                    onClick={() => setActiveStep(Math.min(5, activeStep + 1))}
                    className={`px-4 py-2 rounded ${
                      activeStep === 5 
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    disabled={activeStep === 5}
                  >
                    次のステップ →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* セリフの読み解き方 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaHighlighter className="mr-3 text-green-500" />
            セリフの3層構造を理解する
          </h2>
          
          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <p className="text-sm text-gray-700">
              セリフには表面的な意味だけでなく、複数の層があります。
              これらを理解することで、深みのある演技が可能になります。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(dialogueAnalysis).map(([key, layer]) => (
              <div key={key} className="bg-white border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-3 text-green-600">
                  {layer.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {layer.description}
                </p>
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">例：</h4>
                  {layer.examples.map((example, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded text-xs">
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-yellow-50 p-6 rounded-lg">
            <h3 className="font-bold mb-3">セリフ分析の実践</h3>
            <p className="text-sm text-gray-700 mb-3">
              一つのセリフを選んで、以下の質問に答えてみましょう：
            </p>
            <ol className="space-y-2 text-sm">
              <li>1. このセリフの前に何が起きた？</li>
              <li>2. なぜこのセリフを言う？</li>
              <li>3. 相手に何を期待している？</li>
              <li>4. 本当に言いたいことは何？</li>
              <li>5. このセリフの後、どうなってほしい？</li>
            </ol>
          </div>
        </section>

        {/* ト書きの読み方 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">ト書きの読み方と解釈</h2>
          
          <div className="bg-purple-50 p-6 rounded-lg mb-6">
            <p className="text-sm text-gray-700">
              ト書きは作者からの重要なヒントです。
              ただし、それに縛られすぎず、創造的に解釈することも大切です。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {stageDirections.map((direction, index) => (
              <div key={index} className="bg-white border rounded-lg p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold">{direction.type}</h3>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {direction.example}
                  </code>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {direction.interpretation}
                </p>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs">
                    <strong>演技のヒント：</strong>{direction.actingTip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 人物相関図の作り方 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaUsers className="mr-3 text-purple-500" />
            人物相関図の作り方
          </h2>
          
          <div className="bg-white border rounded-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">基本の作り方</h3>
                <ol className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm mr-2">1</span>
                    <div>
                      <strong>登場人物をリストアップ</strong>
                      <p className="text-sm text-gray-600">主要人物から脇役まですべて</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm mr-2">2</span>
                    <div>
                      <strong>関係性を線で結ぶ</strong>
                      <p className="text-sm text-gray-600">家族、恋愛、友人、敵対など</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm mr-2">3</span>
                    <div>
                      <strong>感情や状態を記号化</strong>
                      <p className="text-sm text-gray-600">→（一方的）、⇄（相互）、×（対立）</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm mr-2">4</span>
                    <div>
                      <strong>変化を時系列で</strong>
                      <p className="text-sm text-gray-600">幕ごとに関係の変化を追う</p>
                    </div>
                  </li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">記入する情報</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">各人物について</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 名前と年齢</li>
                      <li>• 職業や立場</li>
                      <li>• 主な性格特徴</li>
                      <li>• 目的や欲求</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">関係性について</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 関係の種類</li>
                      <li>• 力関係（上下）</li>
                      <li>• 感情の方向</li>
                      <li>• 秘密や裏切り</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm">
                <strong>💡 デジタルツール：</strong>
                draw.io、Miro、Canvaなどを使うと、きれいな相関図が作れます。
                手書きの場合は、大きな紙を使って余白を十分に取りましょう。
              </p>
            </div>
          </div>
        </section>

        {/* 実践ワークシート */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaClipboardList className="mr-3 text-orange-500" />
            脚本分析ワークシート
          </h2>
          
          <div className="bg-orange-50 p-6 rounded-lg mb-6">
            <p className="text-sm text-gray-700">
              このワークシートを使って、実際に脚本を分析してみましょう。
              すべての項目を埋めることで、作品の理解が深まります。
            </p>
          </div>

          <div className="bg-white border rounded-lg p-8">
            <form className="space-y-4">
              {worksheetItems.map((item, index) => (
                <div key={index}>
                  <label className="block font-semibold mb-2">
                    {item.label}
                  </label>
                  {item.multiline ? (
                    <textarea
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder={item.placeholder}
                    />
                  ) : (
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={item.placeholder}
                    />
                  )}
                </div>
              ))}
            </form>
            
            <div className="mt-6 flex gap-4">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                保存する
              </button>
              <button className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
                印刷する
              </button>
            </div>
          </div>
        </section>

        {/* よくある間違い */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">脚本読みでよくある間違い</h2>
          
          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-6">
              <h3 className="font-semibold mb-2 text-red-700">
                ❌ 表面的な読み
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                セリフを文字通りにしか理解せず、深層の意味を見逃してしまう。
              </p>
              <p className="text-sm">
                <strong>対策：</strong>「なぜこのセリフを言うのか」を常に問いかける
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6">
              <h3 className="font-semibold mb-2 text-red-700">
                ❌ 固定観念での解釈
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                有名作品の既存の演出に縛られ、新しい解釈ができない。
              </p>
              <p className="text-sm">
                <strong>対策：</strong>まず自分なりの解釈を作ってから、他の演出を参考にする
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6">
              <h3 className="font-semibold mb-2 text-red-700">
                ❌ 部分的な理解
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                自分の役やシーンだけを読み、全体の流れを把握していない。
              </p>
              <p className="text-sm">
                <strong>対策：</strong>必ず全体を通して読み、自分の役の位置づけを理解する
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6">
              <h3 className="font-semibold mb-2 text-red-700">
                ❌ ト書きの無視
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                セリフだけを読んで、ト書きの重要な情報を見落とす。
              </p>
              <p className="text-sm">
                <strong>対策：</strong>ト書きも作者からの大切なメッセージとして丁寧に読む
              </p>
            </div>
          </div>
        </section>

        {/* 読み合わせのコツ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">効果的な読み合わせの方法</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold mb-4 text-blue-600">
                第1回読み合わせ
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                作品との出会い、全体像の共有
              </p>
              <ul className="space-y-2 text-sm">
                <li>• 配役なしで順番に読む</li>
                <li>• 感想を自由に話し合う</li>
                <li>• 疑問点をリストアップ</li>
                <li>• 作品の第一印象を大切に</li>
              </ul>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold mb-4 text-green-600">
                第2回読み合わせ
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                役の理解、関係性の確認
              </p>
              <ul className="space-y-2 text-sm">
                <li>• 配役を決めて読む</li>
                <li>• キャラクターについて議論</li>
                <li>• 関係性を整理</li>
                <li>• 疑問を解決していく</li>
              </ul>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold mb-4 text-purple-600">
                第3回読み合わせ
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                演出プランの共有、イメージ統一
              </p>
              <ul className="space-y-2 text-sm">
                <li>• 演出の方向性を説明</li>
                <li>• 各シーンの狙いを共有</li>
                <li>• 舞台イメージの確認</li>
                <li>• 稽古計画の説明</li>
              </ul>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold mb-4 text-orange-600">
                本読み稽古
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                セリフを体に入れる、感情を探る
              </p>
              <ul className="space-y-2 text-sm">
                <li>• 感情を込めて読む</li>
                <li>• 相手との掛け合い重視</li>
                <li>• テンポや間を意識</li>
                <li>• 繰り返し練習</li>
              </ul>
            </div>
          </div>
        </section>

        {/* まとめ */}
        <section className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">脚本分析マスターへの道</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-lg">
              <h3 className="font-semibold mb-2">📚 たくさんの作品を読む</h3>
              <p className="text-sm text-gray-600">
                様々なジャンル、時代、作者の作品を読むことで、分析力が向上します。
                月に最低1本は新しい脚本を読む習慣をつけましょう。
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg">
              <h3 className="font-semibold mb-2">🎭 実際の舞台を観る</h3>
              <p className="text-sm text-gray-600">
                脚本がどう舞台化されるかを観察することで、読み方が深まります。
                同じ作品の異なる演出を比較するのも勉強になります。
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg">
              <h3 className="font-semibold mb-2">✍️ 分析ノートを作る</h3>
              <p className="text-sm text-gray-600">
                読んだ作品の分析を記録しておくと、自分の成長が実感できます。
                演出アイデアや気づきも書き留めておきましょう。
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg">
              <h3 className="font-semibold mb-2">👥 仲間と議論する</h3>
              <p className="text-sm text-gray-600">
                同じ作品でも人によって解釈が異なります。
                議論することで新しい視点が得られ、理解が深まります。
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">次のステップ</h2>
          <p className="mb-6 text-gray-700">
            脚本の読み方を学んだら、実際に作品を選んで分析してみましょう。
            素晴らしい作品があなたを待っています。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-semibold">
              作品を探す
            </Link>
            <Link href="/guide/beginner/acting-basics" className="inline-block bg-white text-blue-500 border-2 border-blue-500 px-8 py-3 rounded-lg hover:bg-blue-50 font-semibold">
              演技の基礎を学ぶ
            </Link>
          </div>
        </section>

        {/* 関連記事 */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">関連ガイド</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/guide/beginner/how-to-choose-script" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">脚本の選び方</h3>
              <p className="text-sm text-gray-600">上演に適した作品の選び方</p>
            </Link>
            <Link href="/guide/beginner/acting-basics" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">演技の基礎</h3>
              <p className="text-sm text-gray-600">役作りのための基礎トレーニング</p>
            </Link>
            <Link href="/glossary" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">演劇用語集</h3>
              <p className="text-sm text-gray-600">脚本に出てくる専門用語を理解</p>
            </Link>
          </div>
        </section>
      </article>
    </Layout>
  );
}