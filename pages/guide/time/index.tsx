import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { FaClock, FaTheaterMasks, FaExclamationTriangle, FaCheckCircle, FaLightbulb, FaChartBar } from "react-icons/fa";
import { useState } from "react";

interface TimeGuide {
  id: string;
  duration: string;
  realTime: string;
  title: string;
  description: string;
  bestFor: string[];
  challenges: string[];
  structure: {
    section: string;
    time: string;
    description: string;
  }[];
  genres: string[];
  tips: string[];
  searchLink: string;
  minTime: number;
  maxTime: number;
}

export default function TimeGuide() {
  const [selectedDuration, setSelectedDuration] = useState<string>("all");

  const timeGuides: TimeGuide[] = [
    {
      id: "very-short",
      duration: "10-20分",
      realTime: "実際の上演: 15-25分",
      title: "超短編作品",
      description: "コンパクトながら印象的な作品。発表会や授業での上演に最適。",
      bestFor: [
        "授業内での発表",
        "演劇ワークショップ",
        "複数団体が出演するイベント",
        "演劇初心者の第一歩",
        "昼休みや休憩時間の上演"
      ],
      challenges: [
        "短時間で観客を引き込む必要",
        "キャラクター説明の時間が限られる",
        "転換や場面展開が難しい",
        "深い感動を与えるのが困難"
      ],
      structure: [
        { section: "導入", time: "2-3分", description: "状況設定と人物紹介" },
        { section: "展開", time: "5-8分", description: "中心となる出来事" },
        { section: "転換", time: "3-5分", description: "状況の変化や葛藤" },
        { section: "結末", time: "2-4分", description: "オチや解決" }
      ],
      genres: ["コント", "ショートコメディ", "朗読劇", "モノローグ"],
      tips: [
        "開始30秒で観客の心を掴む",
        "登場人物は3人以下が理想",
        "ワンシチュエーションで構成",
        "印象的なラストシーンを用意",
        "テンポよく進行させる"
      ],
      searchLink: "/?minPlaytime=10&maxPlaytime=20",
      minTime: 10,
      maxTime: 20
    },
    {
      id: "short",
      duration: "30分",
      realTime: "実際の上演: 35-40分",
      title: "短編作品",
      description: "文化祭や学校行事の定番。起承転結がコンパクトにまとまった作品。",
      bestFor: [
        "文化祭のクラス発表",
        "部活動の新人公演",
        "地域のイベント",
        "コンクール予選",
        "複数演目の公演"
      ],
      challenges: [
        "限られた時間での感情表現",
        "複雑なストーリーは難しい",
        "舞台転換の時間が取れない",
        "キャスト全員の見せ場作り"
      ],
      structure: [
        { section: "序幕", time: "5分", description: "世界観と人物関係の提示" },
        { section: "展開部", time: "10分", description: "事件の発生と進行" },
        { section: "山場", time: "8分", description: "クライマックスと葛藤" },
        { section: "終幕", time: "7分", description: "解決と余韻" }
      ],
      genres: ["青春劇", "コメディ", "ファンタジー", "ミステリー"],
      tips: [
        "5分ごとに小さな山場を作る",
        "セットは最小限に",
        "音響・照明で場面転換",
        "アンサンブルシーンを効果的に",
        "ラスト3分で感動のピークを"
      ],
      searchLink: "/?minPlaytime=25&maxPlaytime=35",
      minTime: 25,
      maxTime: 35
    },
    {
      id: "medium",
      duration: "45-60分",
      realTime: "実際の上演: 50-70分",
      title: "中編作品",
      description: "しっかりとしたストーリー展開が可能。演劇部の定期公演に人気。",
      bestFor: [
        "演劇部の定期公演",
        "市民劇団の公演",
        "演劇コンクール本選",
        "単独公演",
        "地域の文化祭"
      ],
      challenges: [
        "観客の集中力の維持",
        "中だるみの防止",
        "複数の場面転換",
        "稽古時間の確保"
      ],
      structure: [
        { section: "第一幕", time: "20分", description: "設定と人物紹介、事件の予兆" },
        { section: "第二幕前半", time: "15分", description: "葛藤の深化と関係性の変化" },
        { section: "第二幕後半", time: "15分", description: "クライマックスへの助走" },
        { section: "第三幕", time: "10分", description: "解決と新たな始まり" }
      ],
      genres: ["社会派ドラマ", "本格コメディ", "サスペンス", "歴史劇"],
      tips: [
        "15分ごとに転換点を設ける",
        "サブプロットで深みを出す",
        "休憩なしで一気に見せる",
        "キャラクターの成長を描く",
        "伏線の回収を忘れずに"
      ],
      searchLink: "/?minPlaytime=45&maxPlaytime=60",
      minTime: 45,
      maxTime: 60
    },
    {
      id: "long",
      duration: "90分",
      realTime: "実際の上演: 100-110分（休憩含む）",
      title: "長編作品",
      description: "本格的な演劇作品。複雑な人間関係や深いテーマを扱える。",
      bestFor: [
        "劇団の本公演",
        "演劇祭のメイン演目",
        "卒業記念公演",
        "有料公演",
        "芸術鑑賞会"
      ],
      challenges: [
        "長時間の集中力維持",
        "休憩のタイミング",
        "大がかりな舞台装置",
        "長期間の稽古が必要",
        "体力的な負担"
      ],
      structure: [
        { section: "第一幕", time: "35分", description: "世界観の構築と複数の物語線" },
        { section: "休憩", time: "15分", description: "観客のリフレッシュ" },
        { section: "第二幕", time: "35分", description: "葛藤の激化と転換" },
        { section: "第三幕", time: "20分", description: "クライマックスと大団円" }
      ],
      genres: ["古典劇", "ミュージカル", "翻訳劇", "社会派作品"],
      tips: [
        "休憩前に大きな引きを作る",
        "複数のストーリーラインを並行",
        "場面転換は演出の見せ場に",
        "アンサンブルの充実",
        "カーテンコールまで計算"
      ],
      searchLink: "/?minPlaytime=80&maxPlaytime=100",
      minTime: 80,
      maxTime: 100
    },
    {
      id: "very-long",
      duration: "120分以上",
      realTime: "実際の上演: 130-150分（休憩含む）",
      title: "超長編作品",
      description: "壮大なスケールの作品。プロ劇団や特別公演向け。",
      bestFor: [
        "プロ劇団の公演",
        "創立記念特別公演",
        "国際演劇祭",
        "商業演劇",
        "野外劇"
      ],
      challenges: [
        "観客の体力的負担",
        "複数回の休憩が必要",
        "キャストの体力管理",
        "会場の使用時間制限",
        "制作費の増大"
      ],
      structure: [
        { section: "第一部", time: "45分", description: "第一の物語" },
        { section: "休憩1", time: "15分", description: "第一休憩" },
        { section: "第二部", time: "45分", description: "第二の物語" },
        { section: "休憩2", time: "10分", description: "第二休憩" },
        { section: "第三部", time: "30分", description: "終章" }
      ],
      genres: ["大河ドラマ", "叙事詩", "歴史大作", "ロックオペラ"],
      tips: [
        "各部を独立した作品として構成",
        "休憩中も観客を飽きさせない工夫",
        "ダブルキャストの検討",
        "観客サービスの充実",
        "パンフレットで理解を助ける"
      ],
      searchLink: "/?minPlaytime=120&maxPlaytime=180",
      minTime: 120,
      maxTime: 180
    }
  ];

  const filteredGuides = selectedDuration === "all" 
    ? timeGuides 
    : timeGuides.filter(guide => guide.id === selectedDuration);

  // 時間帯別の統計データ
  const statistics = {
    popularity: [
      { duration: "10-20分", percentage: 15, label: "学校・ワークショップ" },
      { duration: "30分", percentage: 35, label: "文化祭の定番" },
      { duration: "45-60分", percentage: 30, label: "演劇部公演" },
      { duration: "90分", percentage: 15, label: "本格公演" },
      { duration: "120分以上", percentage: 5, label: "特別公演" }
    ]
  };

  return (
    <Layout>
      <Seo
        pageTitle="上演時間別ガイド | 10分から2時間まで最適な作品選び"
        pageDescription="演劇の上演時間別に最適な脚本の選び方と構成を解説。10分の短編から2時間の大作まで、時間配分と演出のコツを詳しく紹介。"
        pagePath="/guide/time"
      />
      <StructuredData
        type="Article"
        title="上演時間別ガイド"
        description="演劇の上演時間に合わせた作品選びと構成"
        url="https://gikyokutosyokan.com/guide/time"
        datePublished="2024-01-01"
        dateModified="2024-01-01"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "ガイド", url: "https://gikyokutosyokan.com/guide" },
          { name: "上演時間別ガイド", url: "https://gikyokutosyokan.com/guide/time" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            上演時間別ガイド
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            持ち時間に合わせた最適な作品選びと時間配分
          </p>
          <div className="inline-flex items-center text-sm text-gray-500 gap-4">
            <span>更新日: 2024年1月1日</span>
            <span>読了時間: 約12分</span>
          </div>
        </header>

        {/* 時間別人気度グラフ */}
        <section className="mb-12 bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaChartBar className="mr-2 text-orange-500" />
            上演時間別の人気度
          </h2>
          <div className="space-y-3">
            {statistics.popularity.map((stat, index) => (
              <div key={index} className="flex items-center">
                <span className="w-24 text-sm font-medium">{stat.duration}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-full h-8 relative">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-red-400 h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${stat.percentage}%` }}
                    >
                      <span className="text-white text-xs font-bold">{stat.percentage}%</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-600">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* クイック選択 */}
        <section className="mb-12">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-center">上演時間から選ぶ</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <button
                onClick={() => setSelectedDuration("all")}
                className={`p-3 rounded-lg text-center transition-all ${
                  selectedDuration === "all" 
                    ? "bg-blue-500 text-white shadow-lg" 
                    : "bg-white hover:bg-gray-50 border"
                }`}
              >
                <FaClock className="mx-auto mb-1 text-xl" />
                <span className="text-sm font-medium">すべて</span>
              </button>
              {timeGuides.map((guide) => (
                <button
                  key={guide.id}
                  onClick={() => setSelectedDuration(guide.id)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    selectedDuration === guide.id 
                      ? "bg-blue-500 text-white shadow-lg" 
                      : "bg-white hover:bg-gray-50 border"
                  }`}
                >
                  <FaClock className="mx-auto mb-1 text-xl" />
                  <span className="text-sm font-medium">{guide.duration}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 時間別詳細ガイド */}
        <div className="space-y-12">
          {filteredGuides.map((guide, index) => (
            <section key={index} className="bg-white rounded-lg shadow-sm border p-8">
              <header className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">
                    {guide.title}
                  </h2>
                  <div className="text-right">
                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold block mb-1">
                      {guide.duration}
                    </span>
                    <span className="text-xs text-gray-500">{guide.realTime}</span>
                  </div>
                </div>
                <p className="text-gray-600">{guide.description}</p>
              </header>

              {/* 構成タイムライン */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <FaClock className="mr-2 text-blue-500" />
                  理想的な時間配分
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    {guide.structure.map((section, i) => (
                      <div key={i} className="flex items-start">
                        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                          {i + 1}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between items-start">
                            <strong className="text-gray-800">{section.section}</strong>
                            <span className="text-sm text-blue-600 font-medium">{section.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* おすすめシーン */}
                <div className="bg-green-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                    <FaCheckCircle className="mr-2" />
                    最適な上演機会
                  </h3>
                  <ul className="space-y-2">
                    {guide.bestFor.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 注意点 */}
                <div className="bg-yellow-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-3 flex items-center">
                    <FaExclamationTriangle className="mr-2" />
                    課題と対策
                  </h3>
                  <ul className="space-y-2">
                    {guide.challenges.map((challenge, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-yellow-600 mr-2">!</span>
                        <span className="text-sm text-gray-700">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 向いているジャンル */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <FaTheaterMasks className="mr-2 text-purple-500" />
                  向いているジャンル
                </h3>
                <div className="flex flex-wrap gap-2">
                  {guide.genres.map((genre, i) => (
                    <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* 成功のポイント */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <FaLightbulb className="mr-2 text-yellow-500" />
                  成功のポイント
                </h3>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <ol className="space-y-2">
                    {guide.tips.map((tip, i) => (
                      <li key={i} className="flex items-start">
                        <span className="bg-yellow-400 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs font-bold mr-2">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center pt-4 border-t">
                <Link 
                  href={guide.searchLink}
                  className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {guide.duration}の作品を探す →
                </Link>
              </div>
            </section>
          ))}
        </div>

        {/* 時間計算ツール */}
        <section className="mt-12 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">
            実際の上演時間を計算する
          </h2>
          
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold mb-4">上演時間の目安計算</h3>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">台本のページ数から計算</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    一般的に、A4サイズの台本1ページ = 約2-3分
                  </p>
                  <div className="bg-gray-50 p-3 rounded">
                    <ul className="text-sm space-y-1">
                      <li>• 10ページ → 20-30分</li>
                      <li>• 20ページ → 40-60分</li>
                      <li>• 30ページ → 60-90分</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">セリフ数から計算</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    セリフ1行（20-30文字）= 約3-5秒
                  </p>
                  <div className="bg-gray-50 p-3 rounded">
                    <ul className="text-sm space-y-1">
                      <li>• 200行 → 10-17分</li>
                      <li>• 400行 → 20-33分</li>
                      <li>• 600行 → 30-50分</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>💡 ヒント：</strong>
                  実際の上演時間は、演出（間の取り方、動き、音楽）により、
                  台本の想定時間より1.2-1.5倍になることが多いです。
                  余裕を持った時間設定を心がけましょう。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 時間管理のコツ */}
        <section className="mt-12 bg-purple-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">稽古での時間管理</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg">
              <h3 className="font-semibold mb-3">通し稽古での計測</h3>
              <ol className="text-sm space-y-2">
                <li>1. 初回は台本通りの時間を計測</li>
                <li>2. 演出を加えて再計測</li>
                <li>3. 本番想定（緊張による早口）で調整</li>
                <li>4. 観客の反応時間も考慮</li>
                <li>5. 最終的に5-10%の余裕を確保</li>
              </ol>
            </div>
            
            <div className="bg-white p-5 rounded-lg">
              <h3 className="font-semibold mb-3">時間オーバーの対処法</h3>
              <ul className="text-sm space-y-2">
                <li>• 冗長なセリフをカット</li>
                <li>• 場面転換を簡略化</li>
                <li>• テンポアップ（ただし限度あり）</li>
                <li>• サブプロットの削除</li>
                <li>• 音楽・効果音の短縮</li>
              </ul>
            </div>
          </div>
        </section>

        {/* よくある質問 */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">よくある質問</h2>
          
          <div className="space-y-4">
            <details className="bg-white p-4 rounded-lg border">
              <summary className="font-semibold cursor-pointer">
                持ち時間より短い作品を選んでも大丈夫？
              </summary>
              <p className="mt-3 text-sm text-gray-700">
                はい、むしろ推奨します。実際の上演では、演出や観客の反応により、
                予定より長くなることが多いです。持ち時間の80%程度の作品を選ぶと安心です。
              </p>
            </details>

            <details className="bg-white p-4 rounded-lg border">
              <summary className="font-semibold cursor-pointer">
                休憩を入れるべきタイミングは？
              </summary>
              <p className="mt-3 text-sm text-gray-700">
                60分を超える作品では、45-50分経過時点での休憩が理想的です。
                物語の区切りが良い場所で、次への期待を持たせる場面で休憩を入れましょう。
                休憩時間は10-15分が一般的です。
              </p>
            </details>

            <details className="bg-white p-4 rounded-lg border">
              <summary className="font-semibold cursor-pointer">
                時間制限が厳しい場合のカット方法は？
              </summary>
              <p className="mt-3 text-sm text-gray-700">
                まず、本筋に関係ないサブプロットをカットします。
                次に、説明的なセリフを動きで表現できないか検討します。
                それでも長い場合は、場面をまとめたり、登場人物を減らすことも検討しましょう。
              </p>
            </details>

            <details className="bg-white p-4 rounded-lg border">
              <summary className="font-semibold cursor-pointer">
                観客の集中力が続く時間は？
              </summary>
              <p className="mt-3 text-sm text-gray-700">
                一般的に、休憩なしで集中できるのは60-70分が限界と言われています。
                子供向けは30-40分、一般向けは60分、演劇ファンなら90分程度が目安です。
                対象に合わせて作品を選びましょう。
              </p>
            </details>
          </div>
        </section>

        {/* まとめとCTA */}
        <section className="mt-12 bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">時間を味方につけて成功へ</h2>
          <p className="mb-6 text-gray-700">
            上演時間は作品選びの重要な要素です。<br />
            会場の制約、観客層、キャストの体力を考慮して、最適な長さの作品を選びましょう。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-semibold">
              時間で作品を探す
            </Link>
            <Link href="/guide/cast-size" className="inline-block bg-white text-blue-500 border-2 border-blue-500 px-8 py-3 rounded-lg hover:bg-blue-50 font-semibold">
              人数別ガイドを見る
            </Link>
          </div>
        </section>

        {/* 関連リンク */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">関連ガイド</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/guide/beginner/how-to-choose-script" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">脚本の選び方</h3>
              <p className="text-sm text-gray-600">成功する作品選びの5つのポイント</p>
            </Link>
            <Link href="/guide/school/culture-festival" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">文化祭演劇ガイド</h3>
              <p className="text-sm text-gray-600">限られた時間での上演のコツ</p>
            </Link>
            <Link href="/glossary" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">演劇用語集</h3>
              <p className="text-sm text-gray-600">舞台用語を分かりやすく解説</p>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}