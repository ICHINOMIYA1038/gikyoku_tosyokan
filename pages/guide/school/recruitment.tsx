import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { FaUsers, FaTheaterMasks, FaBullhorn, FaCalendarCheck, FaHandshake, FaLightbulb, FaCheckCircle, FaTrophy } from "react-icons/fa";
import { useState } from "react";

export default function RecruitmentGuide() {
  const [activeSection, setActiveSection] = useState<string>("planning");

  // 新歓公演の種類
  const performanceTypes = [
    {
      type: "ダイジェスト公演",
      duration: "20-30分",
      cast: "5-8人",
      difficulty: "★★☆",
      description: "複数の有名作品の名場面を組み合わせた公演",
      pros: ["様々なジャンルを見せられる", "全員に見せ場を作れる", "飽きさせない"],
      cons: ["統一感を出すのが難しい", "著作権の確認が必要"],
      example: "ロミジュリのバルコニーシーン → ハムレットの独白 → 夏の夜の夢のコメディ"
    },
    {
      type: "オリジナル短編",
      duration: "15-20分",
      cast: "4-6人",
      difficulty: "★☆☆",
      description: "新入生向けに作った学園もののオリジナル作品",
      pros: ["共感しやすいテーマ", "著作権の心配なし", "部の特色を出せる"],
      cons: ["脚本作成の手間", "完成度の保証がない"],
      example: "「演劇部へようこそ！」新入部員が演劇部で成長する物語"
    },
    {
      type: "参加型パフォーマンス",
      duration: "10-15分",
      cast: "3-5人",
      difficulty: "★★★",
      description: "観客を巻き込むインプロや体験型の公演",
      pros: ["印象に残る", "楽しい雰囲気", "距離が縮まる"],
      cons: ["進行が難しい", "失敗のリスク", "経験が必要"],
      example: "即興劇、観客からお題をもらって演じる"
    },
    {
      type: "名作短編",
      duration: "30-40分",
      cast: "6-10人",
      difficulty: "★★☆",
      description: "定番の短編作品をしっかり演じる",
      pros: ["作品の質が保証", "本格的な演劇を見せられる", "実力アピール"],
      cons: ["時間が長め", "初心者には難しい", "退屈させるリスク"],
      example: "「12人の怒れる男」短縮版、「銀河鉄道の夜」抜粋"
    }
  ];

  // 新歓スケジュール
  const recruitmentSchedule = [
    {
      phase: "準備期（2-3月）",
      tasks: [
        { task: "新歓担当の決定", detail: "2-3名の担当者を決める" },
        { task: "年間計画立案", detail: "新歓期間の活動計画を作成" },
        { task: "作品選定", detail: "新歓公演の演目を決定" },
        { task: "稽古開始", detail: "春休みを利用して集中稽古" },
        { task: "宣伝物作成", detail: "ポスター、チラシ、SNS準備" }
      ]
    },
    {
      phase: "勧誘期（4月第1-2週）",
      tasks: [
        { task: "部活動紹介", detail: "全校集会での3分PR" },
        { task: "ブース出展", detail: "新入生歓迎会でのブース運営" },
        { task: "ビラ配り", detail: "校門や教室前でのチラシ配布" },
        { task: "SNS発信", detail: "活動の様子を毎日投稿" },
        { task: "教室訪問", detail: "1年生の教室を回って直接勧誘" }
      ]
    },
    {
      phase: "体験期（4月第2-3週）",
      tasks: [
        { task: "体験入部受入", detail: "見学者への対応マニュアル作成" },
        { task: "新歓公演", detail: "複数回公演で多くの人に見てもらう" },
        { task: "ワークショップ", detail: "演劇体験会の実施" },
        { task: "交流会", detail: "お菓子パーティーなど親睦会" },
        { task: "個別フォロー", detail: "興味を持った人への個別対応" }
      ]
    },
    {
      phase: "定着期（4月第4週-5月）",
      tasks: [
        { task: "正式入部手続き", detail: "入部届の提出、部費説明" },
        { task: "新入生歓迎会", detail: "正式な歓迎イベント" },
        { task: "基礎練習開始", detail: "新入部員向けの基礎トレーニング" },
        { task: "役割分担", detail: "新入部員の希望を聞いて配置" },
        { task: "次回公演準備", detail: "新入部員も参加する公演の計画" }
      ]
    }
  ];

  // 勧誘のコツ
  const recruitmentTips = {
    appeal: [
      {
        target: "演劇未経験者",
        message: "初心者大歓迎！基礎から丁寧に教えます",
        approach: [
          "演技だけでなく裏方の仕事も紹介",
          "先輩の成長ストーリーを語る",
          "「人前が苦手でも大丈夫」を強調",
          "少しずつステップアップできることを説明"
        ]
      },
      {
        target: "創作好きな人",
        message: "物語を形にする楽しさを体験できます",
        approach: [
          "脚本創作や演出の魅力を伝える",
          "舞台美術や衣装デザインの紹介",
          "創造性を発揮できる場であることを強調",
          "過去の創作作品を見せる"
        ]
      },
      {
        target: "友達を作りたい人",
        message: "一生の仲間ができる部活です",
        approach: [
          "アットホームな雰囲気をアピール",
          "合宿や打ち上げの楽しさを伝える",
          "チームワークの大切さを説明",
          "OB・OGとの交流も紹介"
        ]
      },
      {
        target: "自己表現したい人",
        message: "新しい自分を発見できる場所",
        approach: [
          "演技を通じた自己発見を強調",
          "人前で堂々と話せるようになる",
          "感情表現が豊かになる",
          "自信がつくことを体験談で語る"
        ]
      }
    ],
    common_concerns: [
      {
        concern: "演技経験がない",
        response: "部員の8割が初心者からスタート。基礎練習から始めるので心配なし。",
        solution: "体験会で簡単なゲームから始める"
      },
      {
        concern: "勉強との両立が心配",
        response: "テスト期間は活動休止。メリハリをつけて活動。",
        solution: "先輩の勉強法も教えます"
      },
      {
        concern: "人前が苦手",
        response: "裏方の仕事もたくさん。音響、照明、衣装、メイクなど。",
        solution: "まずは裏方から始めてもOK"
      },
      {
        concern: "体力的についていけるか",
        response: "個人のペースに合わせて活動。無理強いはしません。",
        solution: "休憩を取りながら楽しく活動"
      }
    ]
  };

  // 成功事例
  const successStories = [
    {
      title: "インパクト重視型",
      situation: "部員数5名の弱小演劇部",
      strategy: "校門前で毎朝ゲリラパフォーマンス",
      result: "話題になり15名の新入部員獲得",
      keyPoint: "印象に残る演出で注目を集める"
    },
    {
      title: "口コミ型",
      situation: "知名度の低い新設演劇部",
      strategy: "友人を誘って小規模体験会を複数回実施",
      result: "参加者の8割が入部、計12名獲得",
      keyPoint: "丁寧な対応で確実に入部につなげる"
    },
    {
      title: "実績アピール型",
      situation: "コンクール入賞経験のある演劇部",
      strategy: "受賞作品の再演と Trophy 展示",
      result: "実力を認められ20名の入部希望",
      keyPoint: "具体的な成果で信頼を得る"
    },
    {
      title: "エンタメ型",
      situation: "硬いイメージを払拭したい演劇部",
      strategy: "お笑い要素満載のコメディ公演",
      result: "「楽しそう」と評判になり18名入部",
      keyPoint: "楽しさを前面に出してハードルを下げる"
    }
  ];

  return (
    <Layout>
      <Seo
        pageTitle="新入生勧誘公演ガイド | 部員を増やす新歓戦略"
        pageDescription="演劇部の新入生勧誘を成功させるための完全ガイド。効果的な新歓公演の作り方、勧誘スケジュール、アピール方法を詳しく解説。"
        pagePath="/guide/school/recruitment"
      />
      <StructuredData
        type="Article"
        title="新入生勧誘公演ガイド"
        description="演劇部の新入部員を増やす戦略"
        url="https://gikyokutosyokan.com/guide/school/recruitment"
        datePublished="2024-01-01"
        dateModified="2024-01-01"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "ガイド", url: "https://gikyokutosyokan.com/guide" },
          { name: "学校演劇", url: "https://gikyokutosyokan.com/guide/school" },
          { name: "新入生勧誘", url: "https://gikyokutosyokan.com/guide/school/recruitment" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            新入生勧誘公演ガイド
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            魅力的な新歓で部員を増やす戦略的アプローチ
          </p>
          <div className="inline-flex items-center text-sm text-gray-500 gap-4">
            <span>更新日: 2024年1月1日</span>
            <span>読了時間: 約15分</span>
          </div>
        </header>

        {/* イントロダクション */}
        <section className="mb-12 bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaBullhorn className="mr-3 text-orange-500" />
            新入生勧誘の重要性
          </h2>
          <p className="mb-4 text-gray-700">
            新入生勧誘は演劇部の未来を決める最重要イベントです。
            魅力的な新歓公演と戦略的な勧誘活動で、演劇部を盛り上げる仲間を増やしましょう。
          </p>
          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-orange-500 mb-1">73%</div>
              <p className="text-sm text-gray-600">新歓公演を見て入部を決める割合</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-1">2週間</div>
              <p className="text-sm text-gray-600">勝負の勧誘期間</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-500 mb-1">5-10名</div>
              <p className="text-sm text-gray-600">平均的な新入部員数</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-500 mb-1">第一印象</div>
              <p className="text-sm text-gray-600">最も重要な要素</p>
            </div>
          </div>
        </section>

        {/* タブナビゲーション */}
        <nav className="mb-8">
          <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-lg">
            {[
              { id: "planning", label: "企画・準備", icon: FaCalendarCheck },
              { id: "performance", label: "新歓公演", icon: FaTheaterMasks },
              { id: "strategy", label: "勧誘戦略", icon: FaBullhorn },
              { id: "follow", label: "フォローアップ", icon: FaHandshake }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  activeSection === tab.id
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

        {/* 企画・準備 */}
        {activeSection === "planning" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">新歓の企画と準備</h2>
            
            {/* スケジュール */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaCalendarCheck className="mr-2 text-blue-500" />
                新歓スケジュール
              </h3>
              
              <div className="space-y-6">
                {recruitmentSchedule.map((phase, index) => (
                  <div key={index} className="bg-white border rounded-lg p-6">
                    <h4 className="font-bold text-lg mb-4 text-blue-600">{phase.phase}</h4>
                    <div className="space-y-3">
                      {phase.tasks.map((item, i) => (
                        <div key={i} className="flex items-start">
                          <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <strong className="block">{item.task}</strong>
                            <p className="text-sm text-gray-600">{item.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 準備チェックリスト */}
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-bold mb-4">準備チェックリスト</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">物品準備</h4>
                  <ul className="space-y-1 text-sm">
                    <li>□ ポスター（A2サイズ×10枚）</li>
                    <li>□ チラシ（A5サイズ×200枚）</li>
                    <li>□ 入部申込書</li>
                    <li>□ 活動紹介パンフレット</li>
                    <li>□ SNSアカウント準備</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">人員配置</h4>
                  <ul className="space-y-1 text-sm">
                    <li>□ 新歓責任者（1名）</li>
                    <li>□ 公演キャスト（5-8名）</li>
                    <li>□ 受付・案内係（2-3名）</li>
                    <li>□ SNS担当（1-2名）</li>
                    <li>□ 個別対応係（2-3名）</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 新歓公演 */}
        {activeSection === "performance" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">効果的な新歓公演</h2>
            
            {/* 公演タイプ */}
            <div className="space-y-6">
              {performanceTypes.map((type, index) => (
                <div key={index} className="bg-white border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-purple-600">{type.type}</h3>
                      <p className="text-gray-600 mt-1">{type.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">難易度</div>
                      <div className="text-lg">{type.difficulty}</div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-xs text-gray-500">上演時間</span>
                      <p className="font-semibold">{type.duration}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-xs text-gray-500">出演人数</span>
                      <p className="font-semibold">{type.cast}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-xs text-gray-500">準備期間</span>
                      <p className="font-semibold">2-3週間</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-green-600">メリット</h4>
                      <ul className="space-y-1 text-sm">
                        {type.pros.map((pro, i) => (
                          <li key={i}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-red-600">注意点</h4>
                      <ul className="space-y-1 text-sm">
                        {type.cons.map((con, i) => (
                          <li key={i}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded">
                    <strong className="text-sm">例：</strong>
                    <p className="text-sm text-gray-700">{type.example}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 公演のポイント */}
            <div className="mt-8 bg-purple-50 p-6 rounded-lg">
              <h3 className="font-bold mb-4 flex items-center">
                <FaLightbulb className="mr-2 text-yellow-500" />
                新歓公演成功のポイント
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm">
                  <li>• 開始5分で心を掴む演出</li>
                  <li>• 笑いと感動のバランス</li>
                  <li>• 部員全員が楽しんでいる雰囲気</li>
                  <li>• 短時間でインパクトを残す</li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li>• 終了後すぐに交流できる環境</li>
                  <li>• 「自分もやってみたい」と思わせる</li>
                  <li>• 技術よりも熱意を伝える</li>
                  <li>• アンケートで感想を集める</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* 勧誘戦略 */}
        {activeSection === "strategy" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">戦略的な勧誘活動</h2>
            
            {/* ターゲット別アプローチ */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">ターゲット別アプローチ</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {recruitmentTips.appeal.map((item, index) => (
                  <div key={index} className="bg-white border rounded-lg p-5">
                    <h4 className="font-bold mb-2 text-blue-600">{item.target}</h4>
                    <p className="text-sm font-semibold mb-3 text-gray-700">
                      「{item.message}」
                    </p>
                    <ul className="space-y-1 text-sm">
                      {item.approach.map((approach, i) => (
                        <li key={i}>• {approach}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* よくある不安への対応 */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">よくある不安への対応</h3>
              
              <div className="space-y-4">
                {recruitmentTips.common_concerns.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-red-100 text-red-600 rounded-full p-2 mr-4">
                        <span className="text-lg font-bold">Q</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{item.concern}</h4>
                        <p className="text-sm text-gray-700 mb-2">{item.response}</p>
                        <div className="bg-white p-3 rounded">
                          <strong className="text-sm">対策：</strong>
                          <span className="text-sm ml-2">{item.solution}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 勧誘ツール */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold mb-4">効果的な勧誘ツール</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded">
                  <h4 className="font-semibold mb-2">SNS活用</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Instagram: 稽古風景の写真</li>
                    <li>• Twitter: 日々の活動報告</li>
                    <li>• TikTok: 短い演技動画</li>
                    <li>• LINE: 公式アカウント</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded">
                  <h4 className="font-semibold mb-2">リアル勧誘</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 教室訪問（許可を取って）</li>
                    <li>• 昼休みミニ公演</li>
                    <li>• 部活動見学ツアー</li>
                    <li>• 個別相談ブース</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded">
                  <h4 className="font-semibold mb-2">配布物</h4>
                  <ul className="text-sm space-y-1">
                    <li>• カラフルなチラシ</li>
                    <li>• 活動写真入りパンフ</li>
                    <li>• QRコード付き名刺</li>
                    <li>• 公演DVDの貸出</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* フォローアップ */}
        {activeSection === "follow" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">入部後のフォローアップ</h2>
            
            {/* 定着率を上げる工夫 */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">新入部員の定着率を上げる</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-bold mb-3 text-green-600">最初の1週間</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>歓迎会で全員と顔合わせ</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>先輩とのペア制度導入</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>簡単な役割を与える</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>LINEグループに招待</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-bold mb-3 text-blue-600">最初の1ヶ月</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span>基礎練習で実力アップ実感</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span>小さな発表の機会を作る</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span>個人面談で不安を解消</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span>次回公演への参加意欲醸成</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 新入部員向けプログラム */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-8">
              <h3 className="font-bold mb-4">新入部員育成プログラム</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">1</span>
                    <h4 className="font-semibold">第1週：オリエンテーション</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-11">
                    部の歴史、年間スケジュール、基本ルールの説明。演劇の楽しさを体験。
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">2</span>
                    <h4 className="font-semibold">第2-3週：基礎トレーニング</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-11">
                    発声、ストレッチ、感情表現の基礎。少人数グループでの練習。
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">3</span>
                    <h4 className="font-semibold">第4週：ミニ発表会</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-11">
                    新入部員だけの短い発表会。達成感を味わい、自信をつける。
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">4</span>
                    <h4 className="font-semibold">第2ヶ月〜：本格始動</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-11">
                    次回公演への参加。役割分担を決めて、本格的な活動開始。
                  </p>
                </div>
              </div>
            </div>

            {/* やってはいけないこと */}
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-bold mb-4 text-red-700">
                ⚠️ 新入部員対応でやってはいけないこと
              </h3>
              <ul className="space-y-2 text-sm">
                <li>❌ いきなり難しい役を任せる</li>
                <li>❌ 基礎練習を省略して本番に参加させる</li>
                <li>❌ 先輩の内輪ネタで盛り上がる</li>
                <li>❌ 個人の成長速度を無視した指導</li>
                <li>❌ 部費や活動時間について後出しで伝える</li>
                <li>❌ 新入部員の意見を聞かない</li>
              </ul>
            </div>
          </section>
        )}

        {/* 成功事例 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaTrophy className="mr-3 text-yellow-500" />
            新歓成功事例
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {successStories.map((story, index) => (
              <div key={index} className="bg-white border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-3 text-blue-600">{story.title}</h3>
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm text-gray-500">状況：</strong>
                    <p className="text-sm">{story.situation}</p>
                  </div>
                  <div>
                    <strong className="text-sm text-gray-500">戦略：</strong>
                    <p className="text-sm">{story.strategy}</p>
                  </div>
                  <div>
                    <strong className="text-sm text-gray-500">結果：</strong>
                    <p className="text-sm text-green-600 font-semibold">{story.result}</p>
                  </div>
                  <div className="pt-3 border-t">
                    <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                      💡 {story.keyPoint}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* タイムライン */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">新歓期間のタイムライン</h2>
          
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-blue-300"></div>
              
              {[
                { date: "3月上旬", task: "新歓担当決定・企画開始", icon: "📝" },
                { date: "3月中旬", task: "作品選定・稽古開始", icon: "🎭" },
                { date: "3月下旬", task: "宣伝物作成・SNS準備", icon: "📱" },
                { date: "4月1週", task: "部活動紹介・ビラ配り", icon: "📢" },
                { date: "4月2週", task: "新歓公演（複数回）", icon: "🎪" },
                { date: "4月3週", task: "体験入部・ワークショップ", icon: "🤝" },
                { date: "4月4週", task: "入部手続き・歓迎会", icon: "🎉" },
                { date: "5月", task: "新入部員育成開始", icon: "🌱" }
              ].map((item, index) => (
                <div key={index} className="relative flex items-center mb-6 last:mb-0">
                  <div className="bg-white border-4 border-blue-500 rounded-full w-16 h-16 flex items-center justify-center text-2xl z-10">
                    {item.icon}
                  </div>
                  <div className="ml-6 bg-white p-4 rounded-lg shadow flex-1">
                    <div className="font-bold text-blue-600">{item.date}</div>
                    <div className="text-sm">{item.task}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* まとめ */}
        <section className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">新歓成功の秘訣</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-lg">
              <h3 className="font-semibold mb-2">🎯 明確な目標</h3>
              <p className="text-sm text-gray-600">
                「○名入部」という具体的な目標を設定し、全員で共有する
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg">
              <h3 className="font-semibold mb-2">💪 チーム一丸</h3>
              <p className="text-sm text-gray-600">
                部員全員が勧誘に関わり、それぞれの役割を果たす
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg">
              <h3 className="font-semibold mb-2">❤️ 情熱を伝える</h3>
              <p className="text-sm text-gray-600">
                演劇への愛と部活の楽しさを素直に伝える
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">新歓公演の作品を探そう</h2>
          <p className="mb-6 text-gray-700">
            短時間でインパクトのある作品を選んで、<br />
            新入生の心を掴む公演を成功させましょう。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/?minPlaytime=10&maxPlaytime=30" className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-semibold">
              30分以内の作品を探す
            </Link>
            <Link href="/guide/school/culture-festival" className="inline-block bg-white text-blue-500 border-2 border-blue-500 px-8 py-3 rounded-lg hover:bg-blue-50 font-semibold">
              文化祭ガイドを見る
            </Link>
          </div>
        </section>

        {/* 関連リンク */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">関連ガイド</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/guide/club-management" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">演劇部運営</h3>
              <p className="text-sm text-gray-600">年間計画と組織作り</p>
            </Link>
            <Link href="/guide/beginner/acting-basics" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">演技の基礎</h3>
              <p className="text-sm text-gray-600">新入部員の指導法</p>
            </Link>
            <Link href="/guide/time" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">上演時間別</h3>
              <p className="text-sm text-gray-600">短時間作品の選び方</p>
            </Link>
            <Link href="/special/seasonal" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">季節別特集</h3>
              <p className="text-sm text-gray-600">春の新歓特集</p>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}