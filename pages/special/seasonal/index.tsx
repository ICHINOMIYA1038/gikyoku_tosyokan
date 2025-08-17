import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { FaGraduationCap, FaSun, FaLeaf, FaSnowflake, FaHeart, FaStar, FaTheaterMasks, FaCalendarAlt, FaLightbulb } from "react-icons/fa";
import { useState } from "react";

interface SeasonalTheme {
  id: string;
  season: string;
  icon: any;
  color: string;
  bgGradient: string;
  events: string[];
  themes: string[];
  recommendedGenres: string[];
  scriptIdeas: {
    title: string;
    description: string;
    duration: string;
    cast: string;
  }[];
  tips: string[];
  searchKeywords: string[];
}

export default function SeasonalSpecial() {
  const [selectedSeason, setSelectedSeason] = useState<string>("spring");

  const seasonalThemes: SeasonalTheme[] = [
    {
      id: "spring",
      season: "春（3-5月）",
      icon: FaGraduationCap,
      color: "pink",
      bgGradient: "from-pink-50 to-red-50",
      events: ["卒業式", "入学式", "新歓", "春公演", "GW公演"],
      themes: ["別れと出会い", "新しい始まり", "青春", "希望", "成長"],
      recommendedGenres: ["青春劇", "感動系", "友情もの", "学園もの"],
      scriptIdeas: [
        {
          title: "最後の文化祭",
          description: "卒業を控えた3年生が最後の思い出作りに奮闘する物語",
          duration: "60分",
          cast: "8-12人"
        },
        {
          title: "桜の下の約束",
          description: "10年後の再会を約束した友人たちの現在と過去を描く",
          duration: "45分",
          cast: "5-6人"
        },
        {
          title: "新入部員歓迎会",
          description: "個性豊かな新入部員たちが巻き起こすドタバタコメディ",
          duration: "30分",
          cast: "10-15人"
        }
      ],
      tips: [
        "卒業生への感謝を込めた作品選び",
        "新入生でも参加しやすい役割分担",
        "桜や春の花を効果的に使った演出",
        "制服や学生服を活用した衣装計画",
        "明るく希望に満ちたエンディング"
      ],
      searchKeywords: ["卒業", "青春", "友情", "新生活", "出会い"]
    },
    {
      id: "summer",
      season: "夏（6-8月）",
      icon: FaSun,
      color: "blue",
      bgGradient: "from-blue-50 to-cyan-50",
      events: ["夏祭り", "合宿", "夏休み公演", "野外劇", "お盆"],
      themes: ["冒険", "怪談", "祭り", "恋愛", "ひと夏の経験"],
      recommendedGenres: ["ホラー", "ファンタジー", "冒険活劇", "恋愛劇"],
      scriptIdeas: [
        {
          title: "真夏の夜の怪談",
          description: "学校に伝わる七不思議を題材にしたホラーコメディ",
          duration: "50分",
          cast: "6-8人"
        },
        {
          title: "夏祭りの夜に",
          description: "祭りの準備を通じて深まる地域の絆を描く",
          duration: "40分",
          cast: "15-20人"
        },
        {
          title: "タイムカプセル",
          description: "20年前に埋めたタイムカプセルを巡る感動ストーリー",
          duration: "60分",
          cast: "8-10人"
        }
      ],
      tips: [
        "暑さ対策を考慮した稽古計画",
        "野外公演の場合は天候対策必須",
        "浴衣や夏服など季節感のある衣装",
        "花火や祭囃子など夏の音響効果",
        "怪談や肝試しなど夏らしい演出"
      ],
      searchKeywords: ["夏祭り", "怪談", "冒険", "海", "花火"]
    },
    {
      id: "autumn",
      season: "秋（9-11月）",
      icon: FaLeaf,
      color: "orange",
      bgGradient: "from-orange-50 to-yellow-50",
      events: ["文化祭", "学園祭", "芸術祭", "地域祭", "ハロウィン"],
      themes: ["収穫", "芸術", "読書", "食欲", "スポーツ"],
      recommendedGenres: ["文芸作品", "古典", "ミステリー", "ファンタジー"],
      scriptIdeas: [
        {
          title: "文化祭前夜",
          description: "準備に追われる実行委員たちの24時間を描く群像劇",
          duration: "70分",
          cast: "12-15人"
        },
        {
          title: "図書館の魔女",
          description: "古い図書館に住む魔女と少女の心温まる交流",
          duration: "45分",
          cast: "4-5人"
        },
        {
          title: "演劇部の奇跡",
          description: "廃部寸前の演劇部が最後の公演に挑む青春劇",
          duration: "60分",
          cast: "8-10人"
        }
      ],
      tips: [
        "文化祭のタイムリミットを意識",
        "紅葉や秋の実りを舞台美術に",
        "芸術の秋にふさわしい作品選び",
        "ハロウィン要素を取り入れた演出",
        "観客動員を意識した宣伝活動"
      ],
      searchKeywords: ["文化祭", "芸術", "ハロウィン", "紅葉", "読書"]
    },
    {
      id: "winter",
      season: "冬（12-2月）",
      icon: FaSnowflake,
      color: "indigo",
      bgGradient: "from-indigo-50 to-purple-50",
      events: ["クリスマス", "忘年会", "新年", "バレンタイン", "卒業前"],
      themes: ["家族", "愛", "奇跡", "絆", "温もり"],
      recommendedGenres: ["ファミリー劇", "ラブストーリー", "ファンタジー", "感動系"],
      scriptIdeas: [
        {
          title: "聖夜の贈り物",
          description: "クリスマスイブに起きる小さな奇跡の物語",
          duration: "40分",
          cast: "6-8人"
        },
        {
          title: "雪の日の約束",
          description: "初雪の日に再会を約束した恋人たちの10年後",
          duration: "50分",
          cast: "4-5人"
        },
        {
          title: "卒業までの100日",
          description: "卒業までのカウントダウンを描く青春群像劇",
          duration: "80分",
          cast: "10-12人"
        }
      ],
      tips: [
        "防寒対策をした稽古環境",
        "クリスマスや正月の小道具活用",
        "雪や氷の演出効果",
        "温かみのある照明計画",
        "家族や恋人が観に来やすい作品"
      ],
      searchKeywords: ["クリスマス", "雪", "家族", "愛", "卒業"]
    }
  ];

  const selectedTheme = seasonalThemes.find(theme => theme.id === selectedSeason) || seasonalThemes[0];

  // 年間イベントカレンダー
  const eventCalendar = [
    { month: 1, events: ["新年公演", "成人式"] },
    { month: 2, events: ["バレンタイン公演", "卒業準備"] },
    { month: 3, events: ["卒業公演", "送別会"] },
    { month: 4, events: ["入学式", "新歓公演"] },
    { month: 5, events: ["GW公演", "春季大会"] },
    { month: 6, events: ["梅雨時公演", "前期締め"] },
    { month: 7, events: ["夏休み前公演", "合宿"] },
    { month: 8, events: ["夏祭り", "野外公演"] },
    { month: 9, events: ["文化祭準備", "秋季大会"] },
    { month: 10, events: ["文化祭", "ハロウィン"] },
    { month: 11, events: ["芸術祭", "地域公演"] },
    { month: 12, events: ["クリスマス公演", "忘年会"] }
  ];

  return (
    <Layout>
      <Seo
        pageTitle="季節別演劇特集 | イベントに合わせた作品選びガイド"
        pageDescription="春夏秋冬、季節のイベントに合わせた演劇作品の選び方を解説。卒業、文化祭、クリスマスなど、時期に応じた脚本選びと演出のアイデアを紹介。"
        pagePath="/special/seasonal"
      />
      <StructuredData
        type="Article"
        title="季節別演劇特集"
        description="季節のイベントに合わせた作品選び"
        url="https://gikyokutosyokan.com/special/seasonal"
        datePublished="2024-01-01"
        dateModified="2024-01-01"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "特集", url: "https://gikyokutosyokan.com/special" },
          { name: "季節別特集", url: "https://gikyokutosyokan.com/special/seasonal" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            季節別演劇特集
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            春夏秋冬、それぞれの季節にぴったりな作品選びと演出アイデア
          </p>
          <div className="inline-flex items-center text-sm text-gray-500 gap-4">
            <span>更新日: 2024年1月1日</span>
            <span>読了時間: 約18分</span>
          </div>
        </header>

        {/* 季節選択タブ */}
        <section className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {seasonalThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedSeason(theme.id)}
                className={`flex items-center px-6 py-3 rounded-lg transition-all ${
                  selectedSeason === theme.id
                    ? `bg-gradient-to-r ${theme.bgGradient} shadow-lg border-2 border-${theme.color}-400`
                    : "bg-white border hover:shadow-md"
                }`}
              >
                <theme.icon className={`mr-2 text-xl text-${theme.color}-500`} />
                <span className="font-medium">{theme.season}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 選択された季節の詳細 */}
        <section className={`mb-12 bg-gradient-to-r ${selectedTheme.bgGradient} p-8 rounded-lg`}>
          <div className="flex items-center mb-6">
            <selectedTheme.icon className={`text-4xl text-${selectedTheme.color}-500 mr-4`} />
            <div>
              <h2 className="text-2xl font-bold">{selectedTheme.season}の演劇</h2>
              <p className="text-gray-600">この季節ならではの作品と演出</p>
            </div>
          </div>

          {/* イベント一覧 */}
          <div className="mb-8">
            <h3 className="font-bold mb-4 flex items-center">
              <FaCalendarAlt className="mr-2" />
              主なイベント
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedTheme.events.map((event, index) => (
                <span key={index} className={`bg-white px-4 py-2 rounded-full text-sm border border-${selectedTheme.color}-300`}>
                  {event}
                </span>
              ))}
            </div>
          </div>

          {/* テーマ */}
          <div className="mb-8">
            <h3 className="font-bold mb-4 flex items-center">
              <FaStar className="mr-2" />
              人気のテーマ
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {selectedTheme.themes.map((theme, index) => (
                <div key={index} className="bg-white p-3 rounded-lg text-center">
                  <span className="text-sm font-medium">{theme}</span>
                </div>
              ))}
            </div>
          </div>

          {/* おすすめジャンル */}
          <div>
            <h3 className="font-bold mb-4 flex items-center">
              <FaTheaterMasks className="mr-2" />
              おすすめジャンル
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedTheme.recommendedGenres.map((genre, index) => (
                <Link 
                  key={index}
                  href={`/?genre=${genre}`}
                  className={`bg-${selectedTheme.color}-500 text-white px-4 py-2 rounded-lg hover:bg-${selectedTheme.color}-600 transition-colors`}
                >
                  {genre}を探す →
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 脚本アイデア */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {selectedTheme.season}におすすめの脚本アイデア
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {selectedTheme.scriptIdeas.map((idea, index) => (
              <div key={index} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg mb-3">{idea.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{idea.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">上演時間</span>
                    <span className="font-medium">{idea.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">出演人数</span>
                    <span className="font-medium">{idea.cast}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link 
                    href={`/?keywords=${selectedTheme.searchKeywords[0]}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    類似作品を探す →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 演出のコツ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaLightbulb className="mr-3 text-yellow-500" />
            {selectedTheme.season}の演出のコツ
          </h2>
          
          <div className="bg-yellow-50 p-6 rounded-lg">
            <ul className="space-y-3">
              {selectedTheme.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-yellow-400 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm mr-3">
                    {index + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 年間イベントカレンダー */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">年間イベントカレンダー</h2>
          
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {eventCalendar.map((month) => (
                <div key={month.month} className="border-r border-b p-4">
                  <h3 className="font-bold mb-2">{month.month}月</h3>
                  <ul className="space-y-1">
                    {month.events.map((event, index) => (
                      <li key={index} className="text-xs text-gray-600">
                        • {event}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm">
              <strong>💡 ヒント：</strong>
              イベントの2-3ヶ月前から準備を始めると、余裕を持って上演できます。
              季節感を大切にしながら、観客のニーズに合った作品を選びましょう。
            </p>
          </div>
        </section>

        {/* 季節別人気作品ランキング */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">季節別人気作品の傾向</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-pink-50 p-6 rounded-lg">
              <h3 className="font-bold mb-4 text-pink-700">
                <FaGraduationCap className="inline mr-2" />
                春（卒業シーズン）
              </h3>
              <ol className="space-y-2 text-sm">
                <li>1. 青春・友情もの（35%）</li>
                <li>2. 感動系ドラマ（28%）</li>
                <li>3. 学園コメディ（20%）</li>
                <li>4. ファンタジー（10%）</li>
                <li>5. その他（7%）</li>
              </ol>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold mb-4 text-blue-700">
                <FaSun className="inline mr-2" />
                夏（夏休みシーズン）
              </h3>
              <ol className="space-y-2 text-sm">
                <li>1. ホラー・怪談（30%）</li>
                <li>2. 冒険・ファンタジー（25%）</li>
                <li>3. 恋愛もの（20%）</li>
                <li>4. コメディ（15%）</li>
                <li>5. その他（10%）</li>
              </ol>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="font-bold mb-4 text-orange-700">
                <FaLeaf className="inline mr-2" />
                秋（文化祭シーズン）
              </h3>
              <ol className="space-y-2 text-sm">
                <li>1. コメディ（32%）</li>
                <li>2. 青春群像劇（25%）</li>
                <li>3. ミステリー（18%）</li>
                <li>4. 古典・文芸（15%）</li>
                <li>5. その他（10%）</li>
              </ol>
            </div>

            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="font-bold mb-4 text-indigo-700">
                <FaSnowflake className="inline mr-2" />
                冬（年末年始シーズン）
              </h3>
              <ol className="space-y-2 text-sm">
                <li>1. ファミリー向け（30%）</li>
                <li>2. ラブストーリー（25%）</li>
                <li>3. ファンタジー（20%）</li>
                <li>4. 感動系（15%）</li>
                <li>5. その他（10%）</li>
              </ol>
            </div>
          </div>
        </section>

        {/* 特別企画の提案 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">季節イベント×演劇の特別企画</h2>
          
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-start">
                <FaHeart className="text-2xl text-red-500 mr-4 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold mb-2">バレンタイン特別公演</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    2月14日前後に恋愛をテーマにした作品を上演。
                    カップル割引や、チョコレート付きチケットなどの特典も。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                      恋愛もの
                    </span>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                      30-45分
                    </span>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                      少人数
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-start">
                <FaGraduationCap className="text-2xl text-blue-500 mr-4 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold mb-2">卒業記念公演</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    3年生の集大成として、全員が輝ける大作に挑戦。
                    在校生から卒業生へのサプライズ演出も。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                      感動系
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                      60-90分
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                      大人数
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-start">
                <FaSun className="text-2xl text-yellow-500 mr-4 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold mb-2">夏の野外公演</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    公園や校庭を使った開放的な公演。
                    自然を活かした演出で、通常とは違う魅力を。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                      ファンタジー
                    </span>
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                      45-60分
                    </span>
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                      中人数
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-start">
                <FaSnowflake className="text-2xl text-indigo-500 mr-4 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold mb-2">クリスマス特別公演</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    家族で楽しめる心温まる作品を上演。
                    サンタクロースの登場や、プレゼント企画も。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs">
                      ファミリー向け
                    </span>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs">
                      40-50分
                    </span>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs">
                      全年齢
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 準備スケジュール */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">イベント公演の準備スケジュール</h2>
          
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-bold mb-1">3ヶ月前</h3>
                  <p className="text-sm text-gray-600">
                    作品選定、キャスティング、年間計画への組み込み
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-bold mb-1">2ヶ月前</h3>
                  <p className="text-sm text-gray-600">
                    本読み開始、舞台プラン決定、衣装・小道具準備開始
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-bold mb-1">1ヶ月前</h3>
                  <p className="text-sm text-gray-600">
                    立ち稽古、通し稽古、広報活動開始、チケット販売
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                  2W
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-bold mb-1">2週間前</h3>
                  <p className="text-sm text-gray-600">
                    ゲネプロ、最終調整、当日スケジュール確認
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <FaStar />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-bold mb-1">本番</h3>
                  <p className="text-sm text-gray-600">
                    リハーサル、本番、打ち上げ、反省会
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* まとめ */}
        <section className="mb-12 bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">季節を彩る演劇を</h2>
          
          <p className="mb-6 text-gray-700">
            季節のイベントは、演劇を通じて特別な思い出を作る絶好の機会です。
            その時期ならではのテーマや演出を取り入れることで、
            観客により深い感動を届けることができます。
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🎯 ポイント1</h3>
              <p className="text-sm text-gray-600">
                季節感を大切にした作品選びで、観客の共感を得る
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🎨 ポイント2</h3>
              <p className="text-sm text-gray-600">
                イベントの雰囲気に合わせた演出で特別感を演出
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">📅 ポイント3</h3>
              <p className="text-sm text-gray-600">
                早めの準備で、クオリティの高い公演を実現
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">季節にぴったりの作品を見つけよう</h2>
          <p className="mb-6 text-gray-700">
            戯曲図書館には、あらゆる季節・イベントに対応した作品が揃っています。
            条件を指定して、あなたの公演にぴったりの脚本を見つけてください。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-semibold">
              作品を探す
            </Link>
            <Link href="/guide" className="inline-block bg-white text-blue-500 border-2 border-blue-500 px-8 py-3 rounded-lg hover:bg-blue-50 font-semibold">
              他のガイドを見る
            </Link>
          </div>
        </section>

        {/* 関連リンク */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">関連ガイド</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/guide/school/culture-festival" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">文化祭演劇ガイド</h3>
              <p className="text-sm text-gray-600">秋の一大イベント攻略法</p>
            </Link>
            <Link href="/guide/time" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">上演時間別ガイド</h3>
              <p className="text-sm text-gray-600">イベントに合わせた時間設定</p>
            </Link>
            <Link href="/guide/cast-size" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">人数別ガイド</h3>
              <p className="text-sm text-gray-600">参加人数に応じた作品選び</p>
            </Link>
            <Link href="/guide/club-management" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">演劇部運営ガイド</h3>
              <p className="text-sm text-gray-600">年間スケジュールの立て方</p>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}