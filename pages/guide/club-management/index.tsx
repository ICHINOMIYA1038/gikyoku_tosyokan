import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { FaUsers, FaCalendarAlt, FaYenSign, FaChalkboardTeacher, FaHandshake, FaTrophy, FaExclamationTriangle, FaCheckSquare, FaTheaterMasks } from "react-icons/fa";
import { useState } from "react";

export default function ClubManagement() {
  const [activeTab, setActiveTab] = useState<string>("yearly-schedule");

  // 年間スケジュール
  const yearlySchedule = [
    {
      month: "4月",
      activities: ["新入部員勧誘", "年間計画立案", "部費徴収"],
      important: true,
      tips: "新入生歓迎会で実演を行うと効果的"
    },
    {
      month: "5月",
      activities: ["新入部員基礎練習", "春公演準備", "役職決定"],
      tips: "新入部員の定着率を上げる重要な時期"
    },
    {
      month: "6月",
      activities: ["春公演本番", "文化祭作品選定", "夏合宿計画"],
      tips: "上級生の引退時期を考慮"
    },
    {
      month: "7月",
      activities: ["文化祭稽古開始", "夏休み練習計画", "3年生引退式"],
      important: true,
      tips: "世代交代の準備期間"
    },
    {
      month: "8月",
      activities: ["夏合宿", "集中稽古", "文化祭準備"],
      tips: "合宿で一気に実力アップ"
    },
    {
      month: "9月",
      activities: ["文化祭リハーサル", "最終調整", "広報活動"],
      important: true,
      tips: "本番に向けた追い込み"
    },
    {
      month: "10月",
      activities: ["文化祭本番", "地区大会参加", "反省会"],
      important: true,
      tips: "一年で最も重要なイベント"
    },
    {
      month: "11月",
      activities: ["次期幹部選出", "秋公演準備", "基礎練習強化"],
      tips: "来年度に向けた体制作り"
    },
    {
      month: "12月",
      activities: ["冬公演", "大掃除", "忘年会"],
      tips: "一年の締めくくり"
    },
    {
      month: "1月",
      activities: ["新年練習開始", "卒業公演準備", "進路相談"],
      tips: "3年生の集大成に向けて"
    },
    {
      month: "2月",
      activities: ["卒業公演稽古", "新入生向け準備", "備品整理"],
      important: true,
      tips: "感動的な卒業公演を"
    },
    {
      month: "3月",
      activities: ["卒業公演本番", "送別会", "次年度準備"],
      important: true,
      tips: "思い出に残る送り出しを"
    }
  ];

  // 予算管理
  const budgetItems = [
    { category: "収入", items: [
      { name: "部費（月500円×20人×12ヶ月）", amount: 120000 },
      { name: "文化祭チケット売上", amount: 50000 },
      { name: "学校補助金", amount: 30000 },
      { name: "バザー・募金活動", amount: 20000 }
    ]},
    { category: "支出", items: [
      { name: "脚本・台本代", amount: 15000 },
      { name: "衣装製作・レンタル", amount: 40000 },
      { name: "大道具・小道具材料", amount: 30000 },
      { name: "照明・音響機材", amount: 25000 },
      { name: "練習場所使用料", amount: 20000 },
      { name: "合宿費用補助", amount: 40000 },
      { name: "印刷費（チラシ・パンフ）", amount: 15000 },
      { name: "その他消耗品", amount: 15000 }
    ]}
  ];

  // 役職と仕事内容
  const roles = [
    {
      title: "部長",
      responsibilities: [
        "部全体の統括・方針決定",
        "対外交渉（学校・他団体）",
        "部員のモチベーション管理",
        "公演の最終決定"
      ],
      skills: "リーダーシップ、決断力、調整力"
    },
    {
      title: "副部長",
      responsibilities: [
        "部長のサポート",
        "スケジュール管理",
        "部内の調整役",
        "部長不在時の代行"
      ],
      skills: "サポート力、コミュニケーション能力"
    },
    {
      title: "演出担当",
      responsibilities: [
        "作品の演出プラン作成",
        "稽古の進行",
        "演技指導",
        "舞台構成の決定"
      ],
      skills: "創造力、分析力、指導力"
    },
    {
      title: "舞台監督",
      responsibilities: [
        "公演全体の進行管理",
        "スタッフワークの統括",
        "タイムキーパー",
        "安全管理"
      ],
      skills: "管理能力、冷静さ、判断力"
    },
    {
      title: "会計",
      responsibilities: [
        "部費の管理",
        "予算案の作成",
        "支出の記録・報告",
        "領収書の管理"
      ],
      skills: "正確性、計画性、数字に強い"
    },
    {
      title: "広報",
      responsibilities: [
        "SNS運営",
        "チラシ・ポスター作成",
        "他校との連絡",
        "記録写真・動画撮影"
      ],
      skills: "発信力、デザインセンス、企画力"
    }
  ];

  // 稽古メニュー
  const practiceMenu = [
    {
      type: "基礎練習",
      time: "30分",
      contents: [
        "ストレッチ・筋トレ",
        "発声練習",
        "滑舌トレーニング",
        "表情筋体操"
      ]
    },
    {
      type: "エチュード",
      time: "45分",
      contents: [
        "即興劇",
        "感情表現練習",
        "シチュエーション練習",
        "キャラクター研究"
      ]
    },
    {
      type: "本読み",
      time: "60分",
      contents: [
        "脚本分析",
        "役作り討論",
        "セリフ合わせ",
        "感情の理解"
      ]
    },
    {
      type: "立ち稽古",
      time: "90分",
      contents: [
        "ブロッキング",
        "動きの確認",
        "場面練習",
        "通し稽古"
      ]
    }
  ];

  // トラブル対処法
  const troubleshooting = [
    {
      problem: "部員が集まらない",
      solutions: [
        "活動時間の見直し（朝練・昼練の活用）",
        "SNSで活動をアピール",
        "体験入部期間を延長",
        "先輩の成功体験を語る",
        "少人数でもできる作品を選ぶ"
      ]
    },
    {
      problem: "予算が足りない",
      solutions: [
        "手作りで衣装・小道具を製作",
        "他校と共同購入・レンタル",
        "募金活動やバザーの実施",
        "スポンサー探し",
        "ミニマルな演出を工夫"
      ]
    },
    {
      problem: "モチベーションが下がる",
      solutions: [
        "小さな目標を設定",
        "他校の公演を観に行く",
        "プロの舞台を鑑賞",
        "交流会の実施",
        "個人面談で悩みを聞く"
      ]
    },
    {
      problem: "演技力が向上しない",
      solutions: [
        "外部講師を招く",
        "ワークショップ参加",
        "基礎練習の見直し",
        "ビデオ撮影で客観視",
        "個別指導の時間を作る"
      ]
    },
    {
      problem: "人間関係のトラブル",
      solutions: [
        "定期的なミーティング",
        "役割分担の明確化",
        "レクリエーションで親睦",
        "第三者（顧問）の介入",
        "冷却期間を置く"
      ]
    }
  ];

  return (
    <Layout>
      <Seo
        pageTitle="演劇部運営完全ガイド | 年間スケジュールから予算管理まで"
        pageDescription="演劇部の運営に必要なすべてを解説。年間スケジュール、予算管理、役職分担、稽古メニュー、トラブル対処法まで、成功する演劇部運営のノウハウを詳しく紹介。"
        pagePath="/guide/club-management"
      />
      <StructuredData
        type="Article"
        title="演劇部運営完全ガイド"
        description="成功する演劇部の作り方"
        url="https://gikyokutosyokan.com/guide/club-management"
        datePublished="2024-01-01"
        dateModified="2024-01-01"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "ガイド", url: "https://gikyokutosyokan.com/guide" },
          { name: "演劇部運営", url: "https://gikyokutosyokan.com/guide/club-management" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            演劇部運営完全ガイド
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            活気ある演劇部を作るための実践的ノウハウ
          </p>
          <div className="inline-flex items-center text-sm text-gray-500 gap-4">
            <span>更新日: 2024年1月1日</span>
            <span>読了時間: 約20分</span>
          </div>
        </header>

        {/* タブナビゲーション */}
        <nav className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 bg-gray-100 p-2 rounded-lg">
            {[
              { id: "yearly-schedule", label: "年間スケジュール", icon: FaCalendarAlt },
              { id: "budget", label: "予算管理", icon: FaYenSign },
              { id: "roles", label: "役職分担", icon: FaUsers },
              { id: "practice", label: "稽古計画", icon: FaChalkboardTeacher },
              { id: "trouble", label: "トラブル対処", icon: FaExclamationTriangle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white shadow"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* 年間スケジュール */}
        {activeTab === "yearly-schedule" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaCalendarAlt className="mr-3 text-blue-500" />
              年間スケジュール
            </h2>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <p className="text-sm text-gray-700">
                演劇部の1年間の流れを把握し、計画的に活動を進めましょう。
                重要な月は特に早めの準備が必要です。
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {yearlySchedule.map((month, index) => (
                <div 
                  key={index} 
                  className={`border rounded-lg p-4 ${
                    month.important ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">{month.month}</h3>
                    {month.important && (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">重要</span>
                    )}
                  </div>
                  <ul className="space-y-1 mb-3">
                    {month.activities.map((activity, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-sm">{activity}</span>
                      </li>
                    ))}
                  </ul>
                  {month.tips && (
                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-600">
                        💡 {month.tips}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-bold mb-3">年間スケジュール作成のポイント</h3>
              <ul className="space-y-2 text-sm">
                <li>• 大きなイベント（文化祭・卒業公演）から逆算して計画</li>
                <li>• 定期テスト期間は活動を控えめに</li>
                <li>• 新入部員の定着を図る4-5月は特に重要</li>
                <li>• 世代交代の時期を明確に設定</li>
                <li>• 長期休暇を有効活用した集中練習</li>
              </ul>
            </div>
          </section>
        )}

        {/* 予算管理 */}
        {activeTab === "budget" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaYenSign className="mr-3 text-green-500" />
              予算管理
            </h2>

            <div className="bg-green-50 p-6 rounded-lg mb-6">
              <p className="text-sm text-gray-700">
                限られた予算を効率的に使うことが、演劇部運営の要です。
                収支を明確にし、計画的な運用を心がけましょう。
              </p>
            </div>

            {/* 予算表 */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {budgetItems.map((section, index) => (
                <div key={index} className="bg-white border rounded-lg p-6">
                  <h3 className={`font-bold text-lg mb-4 ${
                    section.category === "収入" ? "text-green-600" : "text-red-600"
                  }`}>
                    {section.category}
                  </h3>
                  <div className="space-y-2">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm">{item.name}</span>
                        <span className="font-semibold">
                          ¥{item.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="pt-3 flex justify-between items-center">
                      <span className="font-bold">合計</span>
                      <span className="font-bold text-lg">
                        ¥{section.items.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 収支バランス */}
            <div className="bg-gray-100 p-6 rounded-lg mb-6">
              <div className="text-center">
                <p className="text-lg mb-2">年間収支</p>
                <div className="text-3xl font-bold text-blue-600">
                  ¥{(220000 - 200000).toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  （収入 ¥220,000 - 支出 ¥200,000）
                </p>
              </div>
            </div>

            {/* 節約のコツ */}
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-bold mb-3">予算節約のコツ</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm">
                  <li>• 衣装は先輩の卒業時に寄付してもらう</li>
                  <li>• 他校と小道具を共有・交換</li>
                  <li>• 廃材を活用した大道具製作</li>
                  <li>• デジタルチラシでの宣伝</li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li>• 早期予約で会場費を割引</li>
                  <li>• 地域の助成金を活用</li>
                  <li>• OB・OGからの寄付募集</li>
                  <li>• 手作りパンフレットで印刷費削減</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* 役職分担 */}
        {activeTab === "roles" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaUsers className="mr-3 text-purple-500" />
              役職分担と仕事内容
            </h2>

            <div className="bg-purple-50 p-6 rounded-lg mb-6">
              <p className="text-sm text-gray-700">
                明確な役割分担が、スムーズな部活運営の鍵です。
                各自の適性を見極めて、最適な配置を行いましょう。
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {roles.map((role, index) => (
                <div key={index} className="bg-white border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-3 text-purple-600">
                    {role.title}
                  </h3>
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">主な仕事</h4>
                    <ul className="space-y-1">
                      {role.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start">
                          <FaCheckSquare className="text-green-500 mr-2 mt-1 flex-shrink-0 text-xs" />
                          <span className="text-sm">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-600">
                      <strong>必要なスキル：</strong>{role.skills}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold mb-3">組織運営のポイント</h3>
              <ul className="space-y-2 text-sm">
                <li>• 定期的な幹部会議（週1回）を開催</li>
                <li>• 役職は立候補と推薦を組み合わせて決定</li>
                <li>• 引き継ぎ期間を1ヶ月以上確保</li>
                <li>• マニュアルや記録を残して次世代へ</li>
                <li>• 役職以外のメンバーにも責任ある仕事を割り振る</li>
              </ul>
            </div>
          </section>
        )}

        {/* 稽古計画 */}
        {activeTab === "practice" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaChalkboardTeacher className="mr-3 text-orange-500" />
              効果的な稽古計画
            </h2>

            <div className="bg-orange-50 p-6 rounded-lg mb-6">
              <p className="text-sm text-gray-700">
                計画的な稽古が、確実な上達につながります。
                基礎から応用まで、段階的にスキルアップを図りましょう。
              </p>
            </div>

            {/* 週間スケジュール例 */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4">週間スケジュール例</h3>
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">曜日</th>
                      <th className="px-4 py-2 text-left">時間</th>
                      <th className="px-4 py-2 text-left">内容</th>
                      <th className="px-4 py-2 text-left">備考</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-2">月曜</td>
                      <td className="px-4 py-2">16:00-17:00</td>
                      <td className="px-4 py-2">基礎練習</td>
                      <td className="px-4 py-2 text-sm text-gray-600">発声・ストレッチ</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">火曜</td>
                      <td className="px-4 py-2">16:00-18:00</td>
                      <td className="px-4 py-2">本読み</td>
                      <td className="px-4 py-2 text-sm text-gray-600">脚本分析・読み合わせ</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">水曜</td>
                      <td className="px-4 py-2">休み</td>
                      <td className="px-4 py-2">-</td>
                      <td className="px-4 py-2 text-sm text-gray-600">自主練習推奨</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">木曜</td>
                      <td className="px-4 py-2">16:00-18:00</td>
                      <td className="px-4 py-2">立ち稽古</td>
                      <td className="px-4 py-2 text-sm text-gray-600">動きをつけた練習</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">金曜</td>
                      <td className="px-4 py-2">16:00-17:30</td>
                      <td className="px-4 py-2">エチュード</td>
                      <td className="px-4 py-2 text-sm text-gray-600">即興・表現練習</td>
                    </tr>
                    <tr className="border-t bg-blue-50">
                      <td className="px-4 py-2 font-semibold">土曜</td>
                      <td className="px-4 py-2 font-semibold">13:00-17:00</td>
                      <td className="px-4 py-2 font-semibold">通し稽古</td>
                      <td className="px-4 py-2 text-sm text-gray-600">本番想定の練習</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 練習メニュー詳細 */}
            <div className="grid md:grid-cols-2 gap-6">
              {practiceMenu.map((menu, index) => (
                <div key={index} className="bg-white border rounded-lg p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">{menu.type}</h3>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                      {menu.time}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {menu.contents.map((content, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs mr-2">
                          {i + 1}
                        </span>
                        <span className="text-sm">{content}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold mb-3">稽古を効果的にするコツ</h3>
              <ul className="space-y-2 text-sm">
                <li>• 稽古の目的を明確にして開始</li>
                <li>• ウォーミングアップを欠かさない</li>
                <li>• 集中力が切れる前に休憩を入れる</li>
                <li>• 個人練習の時間も確保</li>
                <li>• 稽古ノートをつけて振り返る</li>
                <li>• 動画撮影で客観的にチェック</li>
              </ul>
            </div>
          </section>
        )}

        {/* トラブル対処 */}
        {activeTab === "trouble" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaExclamationTriangle className="mr-3 text-red-500" />
              よくあるトラブルと対処法
            </h2>

            <div className="bg-red-50 p-6 rounded-lg mb-6">
              <p className="text-sm text-gray-700">
                演劇部運営には様々な困難がつきものです。
                事前に対策を知っておくことで、スムーズに解決できます。
              </p>
            </div>

            <div className="space-y-6">
              {troubleshooting.map((item, index) => (
                <div key={index} className="bg-white border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4 text-red-600">
                    問題: {item.problem}
                  </h3>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">解決策:</h4>
                    <ul className="space-y-2">
                      {item.solutions.map((solution, i) => (
                        <li key={i} className="flex items-start">
                          <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs mr-3 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-sm">{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold mb-3">トラブル予防の心得</h3>
              <ul className="space-y-2 text-sm">
                <li>• 問題は小さいうちに対処する</li>
                <li>• 定期的な個人面談でフォロー</li>
                <li>• 顧問の先生と密に連携</li>
                <li>• OB・OGからアドバイスをもらう</li>
                <li>• 記録を残して次年度に活かす</li>
              </ul>
            </div>
          </section>
        )}

        {/* 成功する演劇部の秘訣 */}
        <section className="mb-12 bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaTrophy className="mr-3 text-yellow-500" />
            成功する演劇部の10の秘訣
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">1. 明確なビジョン</h3>
                <p className="text-sm text-gray-600">
                  「どんな演劇部にしたいか」を全員で共有
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">2. 計画的な活動</h3>
                <p className="text-sm text-gray-600">
                  年間・月間・週間計画を立てて実行
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">3. 基礎の徹底</h3>
                <p className="text-sm text-gray-600">
                  発声・身体表現の基礎練習を継続
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">4. チームワーク</h3>
                <p className="text-sm text-gray-600">
                  全員が主役という意識で協力
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">5. 外部との交流</h3>
                <p className="text-sm text-gray-600">
                  他校との合同練習や観劇会
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">6. 記録と継承</h3>
                <p className="text-sm text-gray-600">
                  活動記録を残し、次世代へ引き継ぐ
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">7. 観客目線</h3>
                <p className="text-sm text-gray-600">
                  「観てもらう」意識を常に持つ
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">8. 挑戦と成長</h3>
                <p className="text-sm text-gray-600">
                  新しいジャンルや演出に挑戦
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">9. 楽しむ心</h3>
                <p className="text-sm text-gray-600">
                  厳しさの中にも楽しさを忘れない
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">10. 感謝の気持ち</h3>
                <p className="text-sm text-gray-600">
                  支えてくれる人への感謝を表現
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* お役立ちリンク集 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">お役立ちリンク集</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white border rounded-lg p-5">
              <FaHandshake className="text-3xl text-blue-500 mb-3" />
              <h3 className="font-semibold mb-2">他校との交流</h3>
              <p className="text-sm text-gray-600 mb-3">
                地域の演劇連盟や高校演劇連盟に参加して、他校と交流しましょう。
              </p>
              <Link href="/guide/school/culture-festival" className="text-blue-600 hover:underline text-sm">
                文化祭演劇ガイド →
              </Link>
            </div>
            
            <div className="bg-white border rounded-lg p-5">
              <FaChalkboardTeacher className="text-3xl text-green-500 mb-3" />
              <h3 className="font-semibold mb-2">演技力向上</h3>
              <p className="text-sm text-gray-600 mb-3">
                基礎から応用まで、演技力を向上させるトレーニング方法を学びましょう。
              </p>
              <Link href="/guide/beginner/acting-basics" className="text-blue-600 hover:underline text-sm">
                演技の基礎ガイド →
              </Link>
            </div>
            
            <div className="bg-white border rounded-lg p-5">
              <FaTheaterMasks className="text-3xl text-purple-500 mb-3" />
              <h3 className="font-semibold mb-2">作品選び</h3>
              <p className="text-sm text-gray-600 mb-3">
                部員数や実力に合った作品を選ぶことが成功の鍵です。
              </p>
              <Link href="/guide/beginner/how-to-choose-script" className="text-blue-600 hover:underline text-sm">
                脚本の選び方 →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">演劇部を盛り上げよう！</h2>
          <p className="mb-6 text-gray-700">
            素晴らしい演劇部を作るには、情熱と計画が必要です。<br />
            このガイドを参考に、あなたの演劇部を成功に導いてください。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-semibold">
              上演作品を探す
            </Link>
            <Link href="/guide" className="inline-block bg-white text-blue-500 border-2 border-blue-500 px-8 py-3 rounded-lg hover:bg-blue-50 font-semibold">
              他のガイドを見る
            </Link>
          </div>
        </section>

        {/* 関連記事 */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">関連ガイド</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/guide/cast-size" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">人数別ガイド</h3>
              <p className="text-sm text-gray-600">部員数に合った作品選び</p>
            </Link>
            <Link href="/guide/time" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">上演時間別</h3>
              <p className="text-sm text-gray-600">公演時間の計画</p>
            </Link>
            <Link href="/glossary" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">演劇用語集</h3>
              <p className="text-sm text-gray-600">専門用語を理解</p>
            </Link>
            <Link href="/guide/beginner/reading-script" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">脚本の読み方</h3>
              <p className="text-sm text-gray-600">作品分析の方法</p>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}