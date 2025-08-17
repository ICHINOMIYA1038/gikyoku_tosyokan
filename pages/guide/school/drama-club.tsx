import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { FaTheaterMasks, FaCalendarAlt, FaUsers, FaMoneyBillWave, FaClipboardList, FaGraduationCap, FaHeart, FaTrophy, FaLightbulb, FaExclamationTriangle } from "react-icons/fa";
import { useState } from "react";

interface Activity {
  id: string;
  title: string;
  icon: any;
  period: string;
  tasks: string[];
  tips: string[];
  challenges: string[];
}

export default function DramaClubGuide() {
  const [activeTab, setActiveTab] = useState<string>("yearly");

  // 年間活動計画
  const yearlyActivities: Activity[] = [
    {
      id: "april",
      title: "4月：新年度スタート",
      icon: FaGraduationCap,
      period: "新入生歓迎期",
      tasks: [
        "新入生勧誘活動",
        "歓迎公演の準備・実施",
        "部員顔合わせ会",
        "年間計画の策定",
        "役職決定"
      ],
      tips: [
        "新入生が参加しやすい雰囲気作り",
        "短めの作品で負担を軽減",
        "先輩後輩の交流を促進"
      ],
      challenges: [
        "新旧部員の関係構築",
        "引き継ぎ事項の確認"
      ]
    },
    {
      id: "may-june",
      title: "5-6月：基礎固め期",
      icon: FaClipboardList,
      period: "技術向上期",
      tasks: [
        "基礎練習の徹底",
        "ワークショップ実施",
        "春季公演の準備",
        "地域イベント参加検討",
        "夏合宿の計画"
      ],
      tips: [
        "新入部員の基礎力向上に注力",
        "エチュード練習を多めに",
        "外部講師の招聘も検討"
      ],
      challenges: [
        "中間テストとの両立",
        "モチベーション維持"
      ]
    },
    {
      id: "july-august",
      title: "7-8月：夏季集中期",
      icon: FaTrophy,
      period: "コンクール・合宿期",
      tasks: [
        "夏合宿の実施",
        "コンクール参加",
        "夏休み公演",
        "秋の文化祭準備開始",
        "脚本選定"
      ],
      tips: [
        "合宿で集中的な稽古",
        "チームビルディング活動",
        "OB・OGとの交流"
      ],
      challenges: [
        "暑さ対策",
        "長期休暇中の参加率確保"
      ]
    },
    {
      id: "september-october",
      title: "9-10月：文化祭期",
      icon: FaTheaterMasks,
      period: "最大イベント期",
      tasks: [
        "文化祭公演の準備",
        "リハーサル",
        "舞台装置制作",
        "広報活動",
        "当日運営"
      ],
      tips: [
        "全員が活躍できる配役",
        "他部活との協力体制",
        "保護者・地域への広報"
      ],
      challenges: [
        "学業との両立",
        "予算管理",
        "スケジュール調整"
      ]
    },
    {
      id: "november-december",
      title: "11-12月：充実期",
      icon: FaHeart,
      period: "地域貢献期",
      tasks: [
        "地域公演",
        "福祉施設訪問",
        "クリスマス公演",
        "次年度計画開始",
        "忘年会"
      ],
      tips: [
        "地域との繋がりを大切に",
        "社会貢献活動の実施",
        "部員の親睦を深める"
      ],
      challenges: [
        "期末テスト対策",
        "寒さ対策"
      ]
    },
    {
      id: "january-march",
      title: "1-3月：総括期",
      icon: FaCalendarAlt,
      period: "引き継ぎ準備期",
      tasks: [
        "卒業公演",
        "新入生向け準備",
        "年度総括",
        "備品整理",
        "引き継ぎ資料作成"
      ],
      tips: [
        "3年生の集大成となる作品選び",
        "後輩への技術伝承",
        "活動記録の整理"
      ],
      challenges: [
        "受験との両立",
        "新体制への移行"
      ]
    }
  ];

  // 部活運営のポイント
  const managementPoints = {
    organization: {
      title: "組織づくり",
      icon: FaUsers,
      content: [
        {
          heading: "役職と責任",
          items: [
            "部長：全体統括、対外交渉",
            "副部長：部長補佐、スケジュール管理",
            "会計：予算管理、収支記録",
            "舞台監督：公演の技術面統括",
            "広報：宣伝、SNS運営",
            "書記：議事録、活動記録"
          ]
        },
        {
          heading: "委員会制度",
          items: [
            "演技指導委員会",
            "舞台美術委員会",
            "衣装・メイク委員会",
            "音響・照明委員会",
            "脚本・演出委員会"
          ]
        }
      ]
    },
    finance: {
      title: "予算管理",
      icon: FaMoneyBillWave,
      content: [
        {
          heading: "収入源",
          items: [
            "部費（月額制）",
            "学校からの活動費",
            "チケット収入",
            "バザー・募金活動",
            "スポンサー・協賛",
            "OB・OG会からの支援"
          ]
        },
        {
          heading: "支出項目",
          items: [
            "脚本使用料",
            "舞台装置材料費",
            "衣装・小道具費",
            "音響・照明機材",
            "印刷・広報費",
            "合宿・遠征費"
          ]
        }
      ]
    },
    practice: {
      title: "稽古管理",
      icon: FaClipboardList,
      content: [
        {
          heading: "週間スケジュール例",
          items: [
            "月曜：ミーティング、読み合わせ",
            "火曜：基礎練習（発声・身体）",
            "水曜：シーン稽古",
            "木曜：技術稽古（照明・音響）",
            "金曜：通し稽古",
            "土曜：集中稽古、舞台製作"
          ]
        },
        {
          heading: "稽古のルール",
          items: [
            "開始10分前集合",
            "欠席は前日までに連絡",
            "稽古場の清掃・片付け",
            "稽古ノートの記録",
            "安全管理の徹底"
          ]
        }
      ]
    }
  };

  // 部員育成プログラム
  const trainingProgram = [
    {
      level: "1年生（初級）",
      focus: "基礎技術の習得",
      curriculum: [
        "発声・発音練習",
        "身体表現の基礎",
        "台本の読み方",
        "舞台用語の理解",
        "裏方業務の体験"
      ],
      goals: [
        "舞台に立つ楽しさを知る",
        "基本的な演技技術の習得",
        "チームワークの大切さを学ぶ"
      ]
    },
    {
      level: "2年生（中級）",
      focus: "応用技術と責任",
      curriculum: [
        "キャラクター分析",
        "感情表現の深化",
        "演出助手の経験",
        "技術スタッフとしての専門性",
        "後輩指導の開始"
      ],
      goals: [
        "主要な役を演じる",
        "専門分野を見つける",
        "リーダーシップを発揮"
      ]
    },
    {
      level: "3年生（上級）",
      focus: "統括と伝承",
      curriculum: [
        "演出・脚本への挑戦",
        "公演全体の企画運営",
        "外部との交渉",
        "後輩育成プログラム作成",
        "活動の記録と引き継ぎ"
      ],
      goals: [
        "部活動の中心として活動",
        "培った技術の集大成",
        "次世代への継承"
      ]
    }
  ];

  // 成功する部活動のコツ
  const successTips = [
    {
      category: "コミュニケーション",
      icon: FaUsers,
      tips: [
        "定期的なミーティングの実施",
        "LINEグループでの情報共有",
        "個人面談での悩み相談",
        "縦割りグループでの活動",
        "OB・OGとの交流会"
      ]
    },
    {
      category: "モチベーション維持",
      icon: FaHeart,
      tips: [
        "小さな成功体験の積み重ね",
        "個人の成長を認める",
        "表彰制度の導入",
        "楽しいイベントの企画",
        "明確な目標設定"
      ]
    },
    {
      category: "技術向上",
      icon: FaLightbulb,
      tips: [
        "外部ワークショップへの参加",
        "他校との合同練習",
        "プロの舞台鑑賞",
        "映像資料での研究",
        "定期的な発表会"
      ]
    },
    {
      category: "対外関係",
      icon: FaTrophy,
      tips: [
        "学校行事への積極参加",
        "地域イベントでの公演",
        "他部活との協力関係",
        "保護者会の開催",
        "SNSでの活動報告"
      ]
    }
  ];

  // よくある問題と解決策
  const commonProblems = [
    {
      problem: "部員不足",
      symptoms: ["新入部員が入らない", "途中退部が多い", "公演の配役が困難"],
      solutions: [
        "魅力的な勧誘公演の実施",
        "初心者歓迎の雰囲気作り",
        "部活動の負担軽減",
        "楽しさを重視した活動",
        "少人数でもできる作品選び"
      ]
    },
    {
      problem: "予算不足",
      symptoms: ["舞台装置が作れない", "衣装が揃わない", "活動が制限される"],
      solutions: [
        "リサイクル・再利用の工夫",
        "保護者・OBへの協力依頼",
        "クラウドファンディング",
        "地域スポンサーの獲得",
        "収益公演の企画"
      ]
    },
    {
      problem: "稽古場所の確保",
      symptoms: ["体育館が使えない", "音が出せない", "時間が限られる"],
      solutions: [
        "公民館など外部施設の利用",
        "時間帯をずらした練習",
        "分散型稽古の実施",
        "オンライン稽古の活用",
        "他部活との共同利用"
      ]
    },
    {
      problem: "学業との両立",
      symptoms: ["成績低下", "保護者の反対", "参加率の低下"],
      solutions: [
        "テスト期間の活動休止",
        "効率的な稽古計画",
        "学習時間の確保",
        "成績基準の設定",
        "保護者への活動報告"
      ]
    }
  ];

  return (
    <Layout>
      <Seo
        pageTitle="演劇部運営ガイド | 成功する部活動のノウハウ"
        pageDescription="高校演劇部の年間スケジュール、組織運営、部員育成、予算管理など、演劇部を成功に導く実践的なガイド。"
        pagePath="/guide/school/drama-club"
      />
      <StructuredData
        type="Article"
        title="演劇部運営ガイド"
        description="高校演劇部の運営ノウハウ"
        url="https://gikyokutosyokan.com/guide/school/drama-club"
        datePublished="2024-01-01"
        dateModified="2024-01-01"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "ガイド", url: "https://gikyokutosyokan.com/guide" },
          { name: "学校演劇", url: "https://gikyokutosyokan.com/guide/school" },
          { name: "演劇部運営", url: "https://gikyokutosyokan.com/guide/school/drama-club" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            演劇部運営ガイド
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            活気ある演劇部を作るための実践的ノウハウ
          </p>
          <div className="inline-flex items-center text-sm text-gray-500 gap-4">
            <span>更新日: 2024年1月1日</span>
            <span>読了時間: 約15分</span>
          </div>
        </header>

        {/* イントロダクション */}
        <section className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaTheaterMasks className="mr-3 text-purple-500" />
            演劇部運営の基本
          </h2>
          <p className="mb-4 text-gray-700">
            演劇部の運営は、単に演劇を上演するだけでなく、部員の成長、組織運営、
            地域との連携など、多岐にわたる要素を含んでいます。
            このガイドでは、活気ある演劇部を作るための実践的なノウハウをお伝えします。
          </p>
          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600">30+</div>
              <div className="text-sm text-gray-600">年間活動日数</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600">3-5</div>
              <div className="text-sm text-gray-600">年間公演回数</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600">15-30</div>
              <div className="text-sm text-gray-600">理想的な部員数</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-600">全員が主役</div>
            </div>
          </div>
        </section>

        {/* タブナビゲーション */}
        <nav className="mb-8">
          <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-lg">
            <button
              onClick={() => setActiveTab("yearly")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === "yearly"
                  ? "bg-purple-500 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              年間スケジュール
            </button>
            <button
              onClick={() => setActiveTab("management")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === "management"
                  ? "bg-purple-500 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              運営のポイント
            </button>
            <button
              onClick={() => setActiveTab("training")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === "training"
                  ? "bg-purple-500 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              部員育成
            </button>
            <button
              onClick={() => setActiveTab("problems")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === "problems"
                  ? "bg-purple-500 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              トラブル対策
            </button>
          </div>
        </nav>

        {/* タブコンテンツ */}
        <section className="mb-12">
          {activeTab === "yearly" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">年間活動スケジュール</h2>
              <div className="space-y-6">
                {yearlyActivities.map((activity, index) => (
                  <div key={activity.id} className="bg-white border rounded-lg overflow-hidden">
                    <div className={`p-4 bg-gradient-to-r ${
                      index === 0 ? "from-green-50 to-blue-50" :
                      index === 1 ? "from-blue-50 to-purple-50" :
                      index === 2 ? "from-yellow-50 to-orange-50" :
                      index === 3 ? "from-orange-50 to-red-50" :
                      index === 4 ? "from-purple-50 to-pink-50" :
                      "from-gray-50 to-blue-50"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <activity.icon className="text-2xl mr-3" />
                          <div>
                            <h3 className="font-bold text-lg">{activity.title}</h3>
                            <p className="text-sm text-gray-600">{activity.period}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 text-blue-600">主な活動</h4>
                          <ul className="space-y-2">
                            {activity.tasks.map((task, i) => (
                              <li key={i} className="flex items-start text-sm">
                                <span className="text-blue-400 mr-2">•</span>
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 text-green-600">ポイント</h4>
                          <ul className="space-y-2">
                            {activity.tips.map((tip, i) => (
                              <li key={i} className="flex items-start text-sm">
                                <span className="text-green-400 mr-2">✓</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 text-orange-600">注意点</h4>
                          <ul className="space-y-2">
                            {activity.challenges.map((challenge, i) => (
                              <li key={i} className="flex items-start text-sm">
                                <span className="text-orange-400 mr-2">!</span>
                                {challenge}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "management" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">部活運営のポイント</h2>
              <div className="space-y-8">
                {Object.entries(managementPoints).map(([key, section]) => (
                  <div key={key} className="bg-white border rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <section.icon className="mr-3 text-purple-500" />
                      {section.title}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {section.content.map((item, index) => (
                        <div key={index}>
                          <h4 className="font-semibold mb-3 text-gray-700">{item.heading}</h4>
                          <ul className="space-y-2">
                            {item.items.map((point, i) => (
                              <li key={i} className="flex items-start text-sm">
                                <span className="text-purple-400 mr-2 mt-1">▶</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "training" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">部員育成プログラム</h2>
              <div className="space-y-6">
                {trainingProgram.map((program, index) => (
                  <div key={index} className="bg-white border rounded-lg overflow-hidden">
                    <div className={`p-4 ${
                      index === 0 ? "bg-green-50" :
                      index === 1 ? "bg-blue-50" :
                      "bg-purple-50"
                    }`}>
                      <h3 className="font-bold text-lg">{program.level}</h3>
                      <p className="text-sm text-gray-600">{program.focus}</p>
                    </div>
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">カリキュラム</h4>
                          <ul className="space-y-2">
                            {program.curriculum.map((item, i) => (
                              <li key={i} className="flex items-center text-sm">
                                <span className="bg-gray-200 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                                  {i + 1}
                                </span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">到達目標</h4>
                          <ul className="space-y-2">
                            {program.goals.map((goal, i) => (
                              <li key={i} className="flex items-start text-sm">
                                <span className="text-green-500 mr-2">✓</span>
                                {goal}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 成功のコツ */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">成功する部活動のコツ</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {successTips.map((category, index) => (
                    <div key={index} className="bg-gray-50 p-5 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <category.icon className="mr-2 text-purple-500" />
                        {category.category}
                      </h4>
                      <ul className="space-y-1">
                        {category.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-gray-700">
                            • {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "problems" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaExclamationTriangle className="mr-3 text-yellow-500" />
                よくある問題と解決策
              </h2>
              <div className="space-y-6">
                {commonProblems.map((item, index) => (
                  <div key={index} className="bg-white border rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-3 text-red-600">
                      問題：{item.problem}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-700">症状</h4>
                        <ul className="space-y-1">
                          {item.symptoms.map((symptom, i) => (
                            <li key={i} className="text-sm text-gray-600">
                              • {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-green-700">解決策</h4>
                        <ul className="space-y-1">
                          {item.solutions.map((solution, i) => (
                            <li key={i} className="text-sm">
                              <span className="text-green-500 mr-1">✓</span>
                              {solution}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 年間予算計画例 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">年間予算計画の例</h2>
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">項目</th>
                  <th className="px-4 py-3 text-right">収入</th>
                  <th className="px-4 py-3 text-right">支出</th>
                  <th className="px-4 py-3 text-right">備考</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-3">部費（20人×500円×12ヶ月）</td>
                  <td className="px-4 py-3 text-right text-green-600">120,000円</td>
                  <td className="px-4 py-3 text-right">-</td>
                  <td className="px-4 py-3 text-sm text-gray-600">月額制</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3">学校活動費</td>
                  <td className="px-4 py-3 text-right text-green-600">50,000円</td>
                  <td className="px-4 py-3 text-right">-</td>
                  <td className="px-4 py-3 text-sm text-gray-600">年度配分</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3">文化祭チケット収入</td>
                  <td className="px-4 py-3 text-right text-green-600">30,000円</td>
                  <td className="px-4 py-3 text-right">-</td>
                  <td className="px-4 py-3 text-sm text-gray-600">300円×100枚</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3">脚本使用料</td>
                  <td className="px-4 py-3 text-right">-</td>
                  <td className="px-4 py-3 text-right text-red-600">30,000円</td>
                  <td className="px-4 py-3 text-sm text-gray-600">3作品分</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3">舞台装置・大道具</td>
                  <td className="px-4 py-3 text-right">-</td>
                  <td className="px-4 py-3 text-right text-red-600">60,000円</td>
                  <td className="px-4 py-3 text-sm text-gray-600">材料費</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3">衣装・小道具</td>
                  <td className="px-4 py-3 text-right">-</td>
                  <td className="px-4 py-3 text-right text-red-600">40,000円</td>
                  <td className="px-4 py-3 text-sm text-gray-600">レンタル含む</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3">音響・照明</td>
                  <td className="px-4 py-3 text-right">-</td>
                  <td className="px-4 py-3 text-right text-red-600">20,000円</td>
                  <td className="px-4 py-3 text-sm text-gray-600">消耗品</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3">合宿費補助</td>
                  <td className="px-4 py-3 text-right">-</td>
                  <td className="px-4 py-3 text-right text-red-600">30,000円</td>
                  <td className="px-4 py-3 text-sm text-gray-600">部分補助</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3">その他（印刷・雑費）</td>
                  <td className="px-4 py-3 text-right">-</td>
                  <td className="px-4 py-3 text-right text-red-600">20,000円</td>
                  <td className="px-4 py-3 text-sm text-gray-600">-</td>
                </tr>
                <tr className="border-t bg-gray-50 font-bold">
                  <td className="px-4 py-3">合計</td>
                  <td className="px-4 py-3 text-right text-green-600">200,000円</td>
                  <td className="px-4 py-3 text-right text-red-600">200,000円</td>
                  <td className="px-4 py-3 text-right">±0円</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm">
              <strong>💡 予算管理のポイント：</strong>
              収支のバランスを保ちながら、必要な投資は惜しまない。
              不足分は追加の資金調達活動（バザー、スポンサー獲得等）で補填。
            </p>
          </div>
        </section>

        {/* 部活動規約テンプレート */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">部活動規約テンプレート</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">第1条（目的）</h3>
                <p className="text-sm text-gray-700">
                  本部は、演劇活動を通じて部員の表現力・協調性・創造性を育み、
                  学校生活の充実と文化の発展に寄与することを目的とする。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">第2条（活動）</h3>
                <p className="text-sm text-gray-700">
                  定期公演の実施、コンクールへの参加、基礎練習、
                  地域貢献活動等を行う。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">第3条（部員）</h3>
                <p className="text-sm text-gray-700">
                  本校生徒で演劇に興味があり、部の規約を守れる者を部員とする。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">第4条（役職）</h3>
                <p className="text-sm text-gray-700">
                  部長1名、副部長2名、会計1名、書記1名を置く。
                  役職は部員の互選により決定する。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">第5条（会議）</h3>
                <p className="text-sm text-gray-700">
                  週1回の定例ミーティングを行い、活動計画や課題を協議する。
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white rounded">
              <p className="text-xs text-gray-600">
                ※これは基本的なテンプレートです。学校の規定に合わせて調整してください。
              </p>
            </div>
          </div>
        </section>

        {/* まとめ */}
        <section className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">演劇部を成功に導くために</h2>
          <p className="mb-6 text-gray-700">
            演劇部の運営は、計画性・組織力・情熱の3つが鍵となります。
            部員一人ひとりが主役となり、共に成長できる環境を作ることで、
            素晴らしい作品と忘れられない思い出を生み出すことができます。
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">📅 計画性</h3>
              <p className="text-sm text-gray-600">
                年間スケジュールと目標を明確にし、計画的に活動を進める
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🤝 組織力</h3>
              <p className="text-sm text-gray-600">
                役割分担を明確にし、全員が責任を持って活動に参加する
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">❤️ 情熱</h3>
              <p className="text-sm text-gray-600">
                演劇への愛と仲間への思いやりを大切にする
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">部活動に最適な作品を探そう</h2>
          <p className="mb-6 text-gray-700">
            演劇部の活動に適した作品を、人数や上演時間から検索できます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/?minPlaytime=30&maxPlaytime=60&minCast=10&maxCast=20" className="inline-block bg-purple-500 text-white px-8 py-3 rounded-lg hover:bg-purple-600 font-semibold">
              部活動向け作品を探す
            </Link>
            <Link href="/guide/school/culture-festival" className="inline-block bg-white text-purple-500 border-2 border-purple-500 px-8 py-3 rounded-lg hover:bg-purple-50 font-semibold">
              文化祭ガイドを見る
            </Link>
          </div>
        </section>

        {/* 関連リンク */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">関連ガイド</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/guide/school/recruitment" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">新入生勧誘</h3>
              <p className="text-sm text-gray-600">効果的な勧誘方法</p>
            </Link>
            <Link href="/guide/club-management" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">部活管理</h3>
              <p className="text-sm text-gray-600">詳細な運営ノウハウ</p>
            </Link>
            <Link href="/guide/school/culture-festival" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">文化祭演劇</h3>
              <p className="text-sm text-gray-600">文化祭成功の秘訣</p>
            </Link>
            <Link href="/guide/cast-size" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">人数別ガイド</h3>
              <p className="text-sm text-gray-600">部員数に応じた作品</p>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}