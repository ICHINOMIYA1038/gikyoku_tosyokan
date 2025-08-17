import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { FaPencilAlt, FaGlobeAsia, FaClock, FaTheaterMasks, FaLightbulb, FaBook, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { useState } from "react";

export default function AdaptationGuide() {
  const [activeSection, setActiveSection] = useState<string>("basics");

  // 翻案の種類
  const adaptationTypes = [
    {
      type: "時代翻案",
      description: "作品の時代設定を現代や別の時代に移す",
      examples: [
        { original: "ロミオとジュリエット（中世イタリア）", adapted: "ウエスト・サイド物語（1950年代NY）" },
        { original: "マクベス（中世スコットランド）", adapted: "蜘蛛巣城（戦国時代日本）" },
        { original: "十二夜（ルネサンス期）", adapted: "現代の高校を舞台に" }
      ],
      techniques: [
        "時代考証をしっかり行う",
        "その時代特有の問題に置き換える",
        "言葉遣いを時代に合わせる",
        "衣装や音楽で時代感を演出"
      ],
      cautions: [
        "本質的なテーマを損なわない",
        "時代錯誤に注意",
        "観客の理解度を考慮"
      ]
    },
    {
      type: "文化翻案",
      description: "異文化の作品を自国の文化に置き換える",
      examples: [
        { original: "シェイクスピア作品", adapted: "歌舞伎化（NINAGAWA十二夜など）" },
        { original: "ギリシャ悲劇", adapted: "能・狂言風にアレンジ" },
        { original: "チェーホフ作品", adapted: "日本の地方都市に舞台を移す" }
      ],
      techniques: [
        "文化的な価値観の違いを理解",
        "置き換え可能な要素を見極める",
        "固有名詞の扱い方を決める",
        "文化的な笑いの違いを考慮"
      ],
      cautions: [
        "文化の盗用にならないよう配慮",
        "ステレオタイプを避ける",
        "オリジナルへのリスペクト"
      ]
    },
    {
      type: "ジャンル翻案",
      description: "作品のジャンルを変更する",
      examples: [
        { original: "悲劇", adapted: "コメディに転換" },
        { original: "ストレートプレイ", adapted: "ミュージカル化" },
        { original: "リアリズム劇", adapted: "ファンタジー化" }
      ],
      techniques: [
        "トーンの統一",
        "新ジャンルの約束事を理解",
        "キャラクターの再構築",
        "結末の再検討"
      ],
      cautions: [
        "原作ファンの反応",
        "著作権の確認",
        "改変の必然性"
      ]
    }
  ];

  // 潤色のテクニック
  const polishingTechniques = {
    dialogue: {
      title: "セリフの現代化",
      methods: [
        {
          name: "言葉の置き換え",
          description: "古語や難解な表現を現代語に",
          examples: [
            "「いかにせん」→「どうしよう」",
            "「されど」→「でも」",
            "「御身」→「あなた」"
          ],
          tips: "格調を保ちながら分かりやすく"
        },
        {
          name: "長セリフの分割",
          description: "独白を対話に変換",
          examples: [
            "1人の長い説明→複数人の会話",
            "内的独白→相手への問いかけ",
            "説明的セリフ→アクションで表現"
          ],
          tips: "テンポを良くしつつ情報量は維持"
        },
        {
          name: "現代的な言い回し",
          description: "若者言葉やSNS用語の活用",
          examples: [
            "手紙→LINE・メール",
            "噂話→SNSでの拡散",
            "密会→ビデオ通話"
          ],
          tips: "やりすぎると陳腐になるので注意"
        }
      ]
    },
    structure: {
      title: "構成の調整",
      methods: [
        {
          name: "場面の統合・削除",
          description: "冗長な部分をカット",
          techniques: [
            "複数の場面を1つに統合",
            "サブプロットの削除",
            "回想シーンの活用",
            "ナレーションでの要約"
          ]
        },
        {
          name: "上演時間の調整",
          description: "目標時間に合わせる",
          techniques: [
            "各場面の時間配分",
            "カット可能な部分の特定",
            "テンポアップで時短",
            "幕間の有無を検討"
          ]
        },
        {
          name: "クライマックスの再構成",
          description: "盛り上がりを強化",
          techniques: [
            "伏線の追加",
            "対立の先鋭化",
            "感情の振れ幅を大きく",
            "視覚的インパクト"
          ]
        }
      ]
    },
    character: {
      title: "キャラクター調整",
      methods: [
        {
          name: "人物の統合",
          description: "複数の役を1人に",
          reasons: [
            "キャスト人数の制限",
            "物語の簡略化",
            "主要人物の際立たせ"
          ]
        },
        {
          name: "性別の変更",
          description: "男女比の調整",
          considerations: [
            "関係性の変化",
            "時代背景との整合性",
            "新たな解釈の可能性"
          ]
        },
        {
          name: "年齢の変更",
          description: "キャストに合わせる",
          effects: [
            "テーマの変化",
            "関係性の再構築",
            "言動の調整"
          ]
        }
      ]
    }
  };

  // 翻案・潤色のプロセス
  const adaptationProcess = [
    {
      step: 1,
      phase: "原作分析",
      tasks: [
        "作品の核となるテーマを抽出",
        "削れない要素と変更可能な要素を分類",
        "時代背景と現代の対応関係を検討",
        "著作権状況の確認"
      ],
      duration: "1-2週間"
    },
    {
      step: 2,
      phase: "コンセプト決定",
      tasks: [
        "翻案の方向性を決める",
        "ターゲット観客層の設定",
        "上演条件との照合",
        "チームとの合意形成"
      ],
      duration: "1週間"
    },
    {
      step: 3,
      phase: "第一稿作成",
      tasks: [
        "構成の大枠を作る",
        "主要シーンの書き換え",
        "セリフの調整",
        "ト書きの追加"
      ],
      duration: "2-3週間"
    },
    {
      step: 4,
      phase: "読み合わせ・修正",
      tasks: [
        "キャストと読み合わせ",
        "不自然な部分の特定",
        "演出家との調整",
        "第二稿の作成"
      ],
      duration: "1-2週間"
    },
    {
      step: 5,
      phase: "稽古中の調整",
      tasks: [
        "実際の動きに合わせて修正",
        "セリフの微調整",
        "カットや追加",
        "最終稿の確定"
      ],
      duration: "稽古期間中"
    }
  ];

  // 成功事例
  const successCases = [
    {
      title: "シェイクスピアの高校翻案",
      original: "真夏の夜の夢",
      adapted: "文化祭前夜の夢",
      concept: "妖精の森→学校の屋上、恋の媚薬→恋愛アプリのバグ",
      result: "現代の高校生にも共感できる作品に。SNSでの話題化にも成功。",
      keyPoints: [
        "魔法を現代技術に置き換え",
        "森の迷い→学校での迷走",
        "職人たちの劇→演劇部の練習"
      ]
    },
    {
      title: "チェーホフの地域翻案",
      original: "桜の園",
      adapted: "商店街最後の日",
      concept: "ロシアの貴族→地方商店街の店主、桜の園→昭和からの商店街",
      result: "地域の問題を描き、観客の共感を得た。地元メディアでも話題に。",
      keyPoints: [
        "没落貴族→シャッター商店街",
        "近代化の波→大型ショッピングモール",
        "郷愁と変化への抵抗"
      ]
    }
  ];

  // 注意点と法的問題
  const legalConsiderations = [
    {
      issue: "著作権",
      details: [
        "著作権保護期間の確認（死後70年）",
        "翻案権・上演権の取得",
        "二次創作の許諾",
        "クレジット表記の方法"
      ],
      solution: "必ず権利者に確認を取る"
    },
    {
      issue: "著作者人格権",
      details: [
        "同一性保持権への配慮",
        "作品の本質を損なわない",
        "作者の名誉を傷つけない",
        "改変の明示"
      ],
      solution: "「翻案」であることを明記"
    },
    {
      issue: "翻訳権",
      details: [
        "外国作品の翻訳権",
        "既存翻訳の使用許可",
        "新訳の作成",
        "翻訳者のクレジット"
      ],
      solution: "翻訳者・出版社に確認"
    }
  ];

  return (
    <Layout>
      <Seo
        pageTitle="脚本の翻案・潤色ガイド | 作品を現代に蘇らせる技術"
        pageDescription="古典作品や外国作品を現代的にアレンジする翻案・潤色の技法。時代翻案、文化翻案から著作権まで、実践的な方法を詳しく解説。"
        pagePath="/guide/advanced/adaptation"
      />
      <StructuredData
        type="Article"
        title="脚本の翻案・潤色ガイド"
        description="作品を現代に蘇らせる翻案技術"
        url="https://gikyokutosyokan.com/guide/advanced/adaptation"
        datePublished="2024-01-01"
        dateModified="2024-01-01"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "ガイド", url: "https://gikyokutosyokan.com/guide" },
          { name: "上級者向け", url: "https://gikyokutosyokan.com/guide/advanced" },
          { name: "翻案・潤色", url: "https://gikyokutosyokan.com/guide/advanced/adaptation" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            脚本の翻案・潤色ガイド
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            古典を現代に、外国作品を日本に。作品に新たな命を吹き込む技術
          </p>
          <div className="inline-flex items-center text-sm text-gray-500 gap-4">
            <span>更新日: 2024年1月1日</span>
            <span>読了時間: 約18分</span>
          </div>
        </header>

        {/* イントロダクション */}
        <section className="mb-12 bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaPencilAlt className="mr-3 text-indigo-500" />
            翻案・潤色とは
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-2">翻案（Adaptation）</h3>
              <p className="text-sm text-gray-700 mb-3">
                原作の本質を保ちながら、時代・文化・ジャンルを大胆に変更する創造的な再構築。
                新たな解釈と現代的な意味を加えて、作品を生まれ変わらせます。
              </p>
              <div className="bg-white p-3 rounded">
                <strong className="text-sm">例：</strong>
                <span className="text-sm ml-2">シェイクスピアを現代日本に移す</span>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-2">潤色（Polish/Revision）</h3>
              <p className="text-sm text-gray-700 mb-3">
                原作の枠組みは維持しながら、言葉遣いや構成を調整して上演しやすくする作業。
                現代の観客に伝わりやすく、演じやすい形に整えます。
              </p>
              <div className="bg-white p-3 rounded">
                <strong className="text-sm">例：</strong>
                <span className="text-sm ml-2">古語を現代語に、3時間を90分に</span>
              </div>
            </div>
          </div>
        </section>

        {/* タブナビゲーション */}
        <nav className="mb-8">
          <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-lg">
            <button
              onClick={() => setActiveSection("basics")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeSection === "basics"
                  ? "bg-indigo-500 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              基本知識
            </button>
            <button
              onClick={() => setActiveSection("types")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeSection === "types"
                  ? "bg-indigo-500 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              翻案の種類
            </button>
            <button
              onClick={() => setActiveSection("techniques")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeSection === "techniques"
                  ? "bg-indigo-500 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              潤色技法
            </button>
            <button
              onClick={() => setActiveSection("process")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeSection === "process"
                  ? "bg-indigo-500 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              実践プロセス
            </button>
            <button
              onClick={() => setActiveSection("legal")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeSection === "legal"
                  ? "bg-indigo-500 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              法的注意点
            </button>
          </div>
        </nav>

        {/* 基本知識 */}
        {activeSection === "basics" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">翻案・潤色の基本</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-bold mb-3 text-green-700">翻案・潤色が必要な理由</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ 現代の観客に響く作品にするため</li>
                  <li>✓ 上演条件（時間・人数）に合わせるため</li>
                  <li>✓ 文化的な違いを橋渡しするため</li>
                  <li>✓ 新しい解釈を提示するため</li>
                  <li>✓ 言葉の壁を越えるため</li>
                </ul>
              </div>
              
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="font-bold mb-3 text-red-700">失敗しないための心得</h3>
                <ul className="space-y-2 text-sm">
                  <li>⚠️ 原作の本質を見失わない</li>
                  <li>⚠️ 変更の必然性を明確にする</li>
                  <li>⚠️ 一貫性のある世界観を保つ</li>
                  <li>⚠️ 著作権を必ず確認する</li>
                  <li>⚠️ オリジナルへの敬意を忘れない</li>
                </ul>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-bold mb-4">翻案・潤色を行う前のチェックリスト</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">作品理解</h4>
                  <ul className="space-y-1 text-sm">
                    <li>□ 原作を複数回読んだ</li>
                    <li>□ 作者の意図を理解した</li>
                    <li>□ 時代背景を調査した</li>
                    <li>□ 既存の翻案例を研究した</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm">実務確認</h4>
                  <ul className="space-y-1 text-sm">
                    <li>□ 著作権状況を確認した</li>
                    <li>□ 上演条件を整理した</li>
                    <li>□ チームの合意を得た</li>
                    <li>□ スケジュールを立てた</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 翻案の種類 */}
        {activeSection === "types" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">翻案の種類と手法</h2>
            
            {adaptationTypes.map((type, index) => (
              <div key={index} className="mb-8 bg-white border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-indigo-600">{type.type}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">実例</h4>
                    <div className="space-y-2">
                      {type.examples.map((example, i) => (
                        <div key={i} className="bg-gray-50 p-3 rounded text-sm">
                          <strong>{example.original}</strong>
                          <div className="text-indigo-600 mt-1">→ {example.adapted}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">テクニック</h4>
                    <ul className="space-y-1 text-sm">
                      {type.techniques.map((technique, i) => (
                        <li key={i}>• {technique}</li>
                      ))}
                    </ul>
                    
                    <h4 className="font-semibold mb-2 mt-4">注意点</h4>
                    <ul className="space-y-1 text-sm text-red-600">
                      {type.cautions.map((caution, i) => (
                        <li key={i}>⚠️ {caution}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* 潤色技法 */}
        {activeSection === "techniques" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">潤色の具体的技法</h2>
            
            {Object.entries(polishingTechniques).map(([key, section]) => (
              <div key={key} className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-purple-600">{section.title}</h3>
                
                <div className="space-y-4">
                  {section.methods.map((method, index) => (
                    <div key={index} className="bg-white border rounded-lg p-5">
                      <h4 className="font-bold mb-3">{method.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                      
                      {method.examples && (
                        <div className="bg-purple-50 p-4 rounded mb-3">
                          <h5 className="font-semibold text-sm mb-2">例</h5>
                          <ul className="space-y-1 text-sm">
                            {method.examples.map((example, i) => (
                              <li key={i}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {method.techniques && (
                        <div className="grid md:grid-cols-2 gap-3">
                          {method.techniques.map((technique, i) => (
                            <div key={i} className="bg-gray-50 p-3 rounded text-sm">
                              • {technique}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {method.tips && (
                        <div className="mt-3 text-sm text-blue-600">
                          💡 {method.tips}
                        </div>
                      )}
                      
                      {method.reasons && (
                        <div>
                          <h5 className="font-semibold text-sm mb-2">理由</h5>
                          <ul className="space-y-1 text-sm">
                            {method.reasons.map((reason, i) => (
                              <li key={i}>• {reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {method.considerations && (
                        <div>
                          <h5 className="font-semibold text-sm mb-2">考慮点</h5>
                          <ul className="space-y-1 text-sm">
                            {method.considerations.map((consideration, i) => (
                              <li key={i}>• {consideration}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {method.effects && (
                        <div>
                          <h5 className="font-semibold text-sm mb-2">影響</h5>
                          <ul className="space-y-1 text-sm">
                            {method.effects.map((effect, i) => (
                              <li key={i}>• {effect}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* 実践プロセス */}
        {activeSection === "process" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">翻案・潤色の実践プロセス</h2>
            
            <div className="relative">
              <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-indigo-200"></div>
              
              {adaptationProcess.map((step, index) => (
                <div key={index} className="relative flex items-start mb-8">
                  <div className="bg-indigo-500 text-white rounded-full w-24 h-24 flex flex-col items-center justify-center flex-shrink-0 z-10">
                    <span className="text-2xl font-bold">STEP</span>
                    <span className="text-3xl font-bold">{step.step}</span>
                  </div>
                  <div className="ml-6 flex-1">
                    <div className="bg-white border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg">{step.phase}</h3>
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                          {step.duration}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {step.tasks.map((task, i) => (
                          <li key={i} className="flex items-start">
                            <FaCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 法的注意点 */}
        {activeSection === "legal" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaExclamationTriangle className="mr-3 text-red-500" />
              法的注意点
            </h2>
            
            <div className="bg-red-50 p-6 rounded-lg mb-6">
              <p className="text-sm text-red-700">
                <strong>重要：</strong>翻案・潤色を行う際は、必ず著作権法を遵守してください。
                不明な点は専門家に相談することをお勧めします。
              </p>
            </div>
            
            <div className="space-y-6">
              {legalConsiderations.map((item, index) => (
                <div key={index} className="bg-white border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-3 text-red-600">{item.issue}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">確認事項</h4>
                      <ul className="space-y-1 text-sm">
                        {item.details.map((detail, i) => (
                          <li key={i}>• {detail}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">対処法</h4>
                      <div className="bg-green-50 p-4 rounded">
                        <p className="text-sm">{item.solution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold mb-3">著作権フリーの作品</h3>
              <p className="text-sm mb-3">
                以下の作品は基本的に自由に翻案・潤色が可能です：
              </p>
              <ul className="grid md:grid-cols-2 gap-2 text-sm">
                <li>• 著作権保護期間が切れた作品（死後70年）</li>
                <li>• パブリックドメインの作品</li>
                <li>• クリエイティブ・コモンズライセンスの作品</li>
                <li>• 自作のオリジナル作品</li>
              </ul>
            </div>
          </section>
        )}

        {/* 成功事例 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaTheaterMasks className="mr-3 text-green-500" />
            翻案・潤色の成功事例
          </h2>
          
          <div className="space-y-6">
            {successCases.map((case_, index) => (
              <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3">{case_.title}</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <strong className="text-sm">原作：</strong>
                    <p className="text-sm">{case_.original}</p>
                  </div>
                  <div>
                    <strong className="text-sm">翻案版：</strong>
                    <p className="text-sm">{case_.adapted}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  <strong>コンセプト：</strong>{case_.concept}
                </p>
                <p className="text-sm text-green-700 mb-3">
                  <strong>結果：</strong>{case_.result}
                </p>
                <div className="bg-white p-4 rounded">
                  <h4 className="font-semibold text-sm mb-2">成功のポイント</h4>
                  <ul className="space-y-1 text-sm">
                    {case_.keyPoints.map((point, i) => (
                      <li key={i}>• {point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 実践ワークシート */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">翻案・潤色計画シート</h2>
          
          <div className="bg-white border rounded-lg p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2">原作品名</label>
                  <input type="text" className="w-full p-3 border rounded-lg" placeholder="例：ロミオとジュリエット" />
                </div>
                <div>
                  <label className="block font-semibold mb-2">作者</label>
                  <input type="text" className="w-full p-3 border rounded-lg" placeholder="例：ウィリアム・シェイクスピア" />
                </div>
              </div>
              
              <div>
                <label className="block font-semibold mb-2">翻案のタイプ</label>
                <select className="w-full p-3 border rounded-lg">
                  <option>時代翻案</option>
                  <option>文化翻案</option>
                  <option>ジャンル翻案</option>
                  <option>その他</option>
                </select>
              </div>
              
              <div>
                <label className="block font-semibold mb-2">翻案コンセプト</label>
                <textarea className="w-full p-3 border rounded-lg" rows={3} placeholder="どのように翻案するか、具体的に記述" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2">目標上演時間</label>
                  <input type="text" className="w-full p-3 border rounded-lg" placeholder="例：60分" />
                </div>
                <div>
                  <label className="block font-semibold mb-2">想定キャスト数</label>
                  <input type="text" className="w-full p-3 border rounded-lg" placeholder="例：8-10人" />
                </div>
              </div>
              
              <div>
                <label className="block font-semibold mb-2">主な変更点</label>
                <textarea className="w-full p-3 border rounded-lg" rows={4} placeholder="時代設定、場所、キャラクターなど" />
              </div>
              
              <div className="flex gap-4">
                <button type="button" className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600">
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
        <section className="mb-12 bg-gradient-to-r from-purple-100 to-indigo-100 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">翻案・潤色を成功させるために</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-lg">
              <FaBook className="text-2xl text-purple-500 mb-2" />
              <h3 className="font-semibold mb-2">深い理解</h3>
              <p className="text-sm text-gray-600">
                原作の本質を理解し、何を残し何を変えるか明確に
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg">
              <FaLightbulb className="text-2xl text-yellow-500 mb-2" />
              <h3 className="font-semibold mb-2">創造性</h3>
              <p className="text-sm text-gray-600">
                大胆な発想と繊細な配慮のバランス
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg">
              <FaCheckCircle className="text-2xl text-green-500 mb-2" />
              <h3 className="font-semibold mb-2">実践性</h3>
              <p className="text-sm text-gray-600">
                上演可能で観客に伝わる作品に
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">翻案・潤色に挑戦しよう</h2>
          <p className="mb-6 text-gray-700">
            まずは短編作品から始めて、<br />
            あなたの解釈で作品を生まれ変わらせてください。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="inline-block bg-indigo-500 text-white px-8 py-3 rounded-lg hover:bg-indigo-600 font-semibold">
              翻案可能な作品を探す
            </Link>
            <Link href="/guide/advanced/directing" className="inline-block bg-white text-indigo-500 border-2 border-indigo-500 px-8 py-3 rounded-lg hover:bg-indigo-50 font-semibold">
              演出の技法を学ぶ
            </Link>
          </div>
        </section>

        {/* 関連リンク */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">関連ガイド</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/guide/beginner/reading-script" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">脚本の読み方</h3>
              <p className="text-sm text-gray-600">原作分析の基礎</p>
            </Link>
            <Link href="/guide/advanced/directing" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">演出の技法</h3>
              <p className="text-sm text-gray-600">翻案作品の演出</p>
            </Link>
            <Link href="/guide/advanced/stage-design" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">舞台美術</h3>
              <p className="text-sm text-gray-600">世界観の視覚化</p>
            </Link>
            <Link href="/glossary" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">演劇用語集</h3>
              <p className="text-sm text-gray-600">専門用語の確認</p>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}