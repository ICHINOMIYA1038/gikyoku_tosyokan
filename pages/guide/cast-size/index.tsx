import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { FaUsers, FaTheaterMasks, FaLightbulb, FaChartLine, FaExclamationTriangle, FaStar } from "react-icons/fa";
import { useState } from "react";

interface CastSizeGuide {
  size: string;
  range: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  recommendedFor: string[];
  popularGenres: string[];
  tips: string[];
  searchLink: string;
  minCount: number;
  maxCount: number;
}

export default function CastSizeGuide() {
  const [selectedSize, setSelectedSize] = useState<string>("all");

  const castSizeGuides: CastSizeGuide[] = [
    {
      size: "solo",
      range: "1人",
      title: "一人芝居（モノドラマ）",
      description: "演者一人で物語を紡ぐ、究極の表現形式。観客との濃密な関係を築けます。",
      pros: [
        "演者の実力が最大限に発揮できる",
        "稽古の日程調整が容易",
        "制作費を抑えられる",
        "演出の自由度が高い",
        "観客との親密な空間を作れる"
      ],
      cons: [
        "演者への負担が大きい",
        "セリフ量が膨大",
        "観客を引き込む技術が必要",
        "舞台上での変化が作りにくい",
        "代役が立てられない"
      ],
      recommendedFor: [
        "実力のある演者がいる団体",
        "小劇場での公演",
        "実験的な作品に挑戦したい",
        "コロナ禍での上演"
      ],
      popularGenres: [
        "独白劇",
        "朗読劇",
        "伝記もの",
        "心理劇"
      ],
      tips: [
        "衣装や小道具で複数の役を演じ分ける",
        "音響・照明で場面転換を表現",
        "観客を「もう一人の登場人物」として巻き込む",
        "15-30分の短編から始めるのがおすすめ"
      ],
      searchLink: "/?minTotalCount=1&maxTotalCount=1",
      minCount: 1,
      maxCount: 1
    },
    {
      size: "duo",
      range: "2人",
      title: "二人芝居",
      description: "対話の醍醐味を存分に楽しめる形式。関係性の変化を丁寧に描けます。",
      pros: [
        "密度の高い対話が可能",
        "キャラクターの関係性を深く描ける",
        "稽古で細部まで作り込める",
        "観客が感情移入しやすい",
        "バディものや恋愛劇に最適"
      ],
      cons: [
        "二人の演技力の差が目立つ",
        "場面転換が単調になりがち",
        "どちらかが欠けると上演不可",
        "群像劇は表現しにくい"
      ],
      recommendedFor: [
        "演技力のある二人組",
        "カップルや親友同士",
        "濃密な人間関係を描きたい",
        "小規模な発表会"
      ],
      popularGenres: [
        "恋愛劇",
        "友情もの",
        "対立劇",
        "ミステリー"
      ],
      tips: [
        "立ち位置や距離感で関係性を表現",
        "沈黙や間を効果的に使う",
        "それぞれのキャラクターに明確な目的を",
        "30-45分程度の作品が演じやすい"
      ],
      searchLink: "/?minTotalCount=2&maxTotalCount=2",
      minCount: 2,
      maxCount: 2
    },
    {
      size: "small",
      range: "3-5人",
      title: "少人数劇",
      description: "最もバランスの取れた人数。複雑な人間関係も表現できます。",
      pros: [
        "多様な人間関係を描ける",
        "全員に見せ場を作れる",
        "稽古の調整がしやすい",
        "作品の選択肢が豊富",
        "アンサンブルの魅力を発揮"
      ],
      cons: [
        "全員のレベルを合わせる必要",
        "役の重要度に差が出やすい",
        "舞台上の配置に工夫が必要"
      ],
      recommendedFor: [
        "初めての本格公演",
        "学校の部活動",
        "市民劇団の定期公演",
        "友人同士のグループ"
      ],
      popularGenres: [
        "コメディ",
        "青春群像劇",
        "サスペンス",
        "ファンタジー"
      ],
      tips: [
        "三角形の構図を意識した立ち位置",
        "それぞれの役に個性的な特徴を",
        "アンサンブルシーンを効果的に",
        "45-60分の作品がちょうど良い"
      ],
      searchLink: "/?minTotalCount=3&maxTotalCount=5",
      minCount: 3,
      maxCount: 5
    },
    {
      size: "medium",
      range: "6-10人",
      title: "中人数劇",
      description: "群像劇に最適な人数。文化祭や発表会の定番サイズです。",
      pros: [
        "群像劇が描ける",
        "複数のストーリーラインが可能",
        "役の大小で経験差をカバー",
        "観客に活気を感じさせる",
        "ダブルキャストも組みやすい"
      ],
      cons: [
        "稽古の日程調整が難しい",
        "全員の出番のバランスが課題",
        "衣装や小道具の費用増",
        "演出の統一感を保つのが大変"
      ],
      recommendedFor: [
        "文化祭のクラス劇",
        "演劇部の新人公演",
        "地域の演劇祭",
        "学年やクラス単位の発表"
      ],
      popularGenres: [
        "学園もの",
        "時代劇",
        "ミュージカル",
        "社会派ドラマ"
      ],
      tips: [
        "グループ分けして場面を作る",
        "コーラス的な演出を取り入れる",
        "主役と脇役のメリハリをつける",
        "60-90分の作品で全員に見せ場を"
      ],
      searchLink: "/?minTotalCount=6&maxTotalCount=10",
      minCount: 6,
      maxCount: 10
    },
    {
      size: "large",
      range: "11-20人",
      title: "大人数劇",
      description: "迫力ある群衆シーンが魅力。学校行事での上演に人気です。",
      pros: [
        "壮大なスケール感",
        "群衆シーンの迫力",
        "初心者も参加しやすい",
        "一体感が生まれやすい",
        "観客へのインパクト大"
      ],
      cons: [
        "演出・統率が非常に難しい",
        "稽古場所の確保が大変",
        "個人の演技指導が行き届かない",
        "衣装代がかさむ",
        "全員の出番調整が複雑"
      ],
      recommendedFor: [
        "全校生徒参加の行事",
        "大規模な文化祭",
        "市民参加型の公演",
        "記念公演"
      ],
      popularGenres: [
        "歴史劇",
        "革命もの",
        "ミュージカル",
        "戦争もの"
      ],
      tips: [
        "少人数のグループに分けて稽古",
        "アンサンブルの動きを統一",
        "音響を効果的に使って迫力を出す",
        "90-120分で構成し、幕間休憩を入れる"
      ],
      searchLink: "/?minTotalCount=11&maxTotalCount=20",
      minCount: 11,
      maxCount: 20
    },
    {
      size: "extra-large",
      range: "21人以上",
      title: "超大人数劇",
      description: "クラス全員参加など、特別な機会のための大規模作品。",
      pros: [
        "全員参加の達成感",
        "圧倒的な迫力",
        "多様な才能を活かせる",
        "裏方も含めて全員で作る",
        "思い出に残る体験"
      ],
      cons: [
        "演出の難易度が極めて高い",
        "稽古の効率が悪い",
        "舞台が手狭になる",
        "セリフの聞き取りが困難",
        "統一感を出すのが至難"
      ],
      recommendedFor: [
        "卒業記念公演",
        "創立記念行事",
        "全員参加が必須の場合",
        "野外劇"
      ],
      popularGenres: [
        "パレード形式",
        "オムニバス",
        "レビュー",
        "祭りもの"
      ],
      tips: [
        "場面ごとに担当を分ける",
        "群舞や合唱を効果的に使う",
        "マイクの使用を検討",
        "演出助手を複数置く",
        "オムニバス形式で全員に見せ場を"
      ],
      searchLink: "/?minTotalCount=21&maxTotalCount=50",
      minCount: 21,
      maxCount: 50
    }
  ];

  const filteredGuides = selectedSize === "all" 
    ? castSizeGuides 
    : castSizeGuides.filter(guide => guide.size === selectedSize);

  // 人数選択のためのクイックアクセス
  const quickAccess = [
    { label: "一人芝居", size: "solo", icon: "👤" },
    { label: "二人芝居", size: "duo", icon: "👥" },
    { label: "少人数", size: "small", icon: "👨‍👩‍👦" },
    { label: "中人数", size: "medium", icon: "👨‍👩‍👧‍👦" },
    { label: "大人数", size: "large", icon: "👨‍👨‍👧‍👧" },
    { label: "超大人数", size: "extra-large", icon: "🎭" }
  ];

  return (
    <Layout>
      <Seo
        pageTitle="人数別おすすめ脚本ガイド | 1人から大人数まで完全網羅"
        pageDescription="演劇の人数別に最適な脚本の選び方を解説。一人芝居から大人数劇まで、それぞれの特徴、メリット・デメリット、おすすめジャンルを詳しく紹介。"
        pagePath="/guide/cast-size"
      />
      <StructuredData
        type="Article"
        title="人数別おすすめ脚本ガイド"
        description="演劇の人数別に最適な脚本選びを解説"
        url="https://gikyokutosyokan.com/guide/cast-size"
        datePublished="2024-01-01"
        dateModified="2024-01-01"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "ガイド", url: "https://gikyokutosyokan.com/guide" },
          { name: "人数別ガイド", url: "https://gikyokutosyokan.com/guide/cast-size" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            人数別おすすめ脚本ガイド
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            上演人数に合わせた最適な作品選びをサポート
          </p>
          <div className="inline-flex items-center text-sm text-gray-500 gap-4">
            <span>更新日: 2024年1月1日</span>
            <span>読了時間: 約15分</span>
          </div>
        </header>

        {/* クイックアクセス */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-center">人数から選ぶ</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <button
                onClick={() => setSelectedSize("all")}
                className={`p-3 rounded-lg text-center transition-all ${
                  selectedSize === "all" 
                    ? "bg-blue-500 text-white shadow-lg" 
                    : "bg-white hover:bg-gray-50 border"
                }`}
              >
                <span className="text-2xl mb-1 block">📚</span>
                <span className="text-sm font-medium">すべて</span>
              </button>
              {quickAccess.map((item) => (
                <button
                  key={item.size}
                  onClick={() => setSelectedSize(item.size)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    selectedSize === item.size 
                      ? "bg-blue-500 text-white shadow-lg" 
                      : "bg-white hover:bg-gray-50 border"
                  }`}
                >
                  <span className="text-2xl mb-1 block">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 人数別詳細ガイド */}
        <div className="space-y-12">
          {filteredGuides.map((guide, index) => (
            <section key={index} className="bg-white rounded-lg shadow-sm border p-8">
              <header className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold flex items-center">
                    <FaUsers className="mr-3 text-blue-500" />
                    {guide.title}
                  </h2>
                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold">
                    {guide.range}
                  </span>
                </div>
                <p className="text-gray-600">{guide.description}</p>
              </header>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* メリット */}
                <div className="bg-green-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                    <FaStar className="mr-2" />
                    メリット
                  </h3>
                  <ul className="space-y-2">
                    {guide.pros.map((pro, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-sm text-gray-700">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* デメリット */}
                <div className="bg-red-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-3 flex items-center">
                    <FaExclamationTriangle className="mr-2" />
                    注意点
                  </h3>
                  <ul className="space-y-2">
                    {guide.cons.map((con, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-red-600 mr-2">!</span>
                        <span className="text-sm text-gray-700">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* おすすめシーン */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <FaTheaterMasks className="mr-2 text-purple-500" />
                  こんな時におすすめ
                </h3>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <ul className="grid md:grid-cols-2 gap-2">
                    {guide.recommendedFor.map((scene, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <span className="text-purple-600 mr-2">◆</span>
                        {scene}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 人気ジャンル */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">人気のジャンル</h3>
                <div className="flex flex-wrap gap-2">
                  {guide.popularGenres.map((genre, i) => (
                    <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* 成功のコツ */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <FaLightbulb className="mr-2 text-yellow-500" />
                  成功のコツ
                </h3>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    {guide.tips.map((tip, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-yellow-600 mr-2 font-bold">{i + 1}.</span>
                        <span className="text-sm text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center pt-4 border-t">
                <Link 
                  href={guide.searchLink}
                  className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {guide.range}の作品を探す →
                </Link>
              </div>
            </section>
          ))}
        </div>

        {/* 人数決定のフローチャート */}
        <section className="mt-12 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            最適な人数を見つけるフローチャート
          </h2>
          
          <div className="bg-white p-6 rounded-lg">
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold mb-2">Q1: メンバーは何人集まりそう？</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p>→ 1-2人 → <strong>一人芝居・二人芝居</strong>がおすすめ</p>
                  <p>→ 3-5人 → 続いてQ2へ</p>
                  <p>→ 6人以上 → 続いてQ3へ</p>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold mb-2">Q2: 全員が主役級？</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p>→ はい → <strong>少人数劇（3-5人）</strong>で全員に見せ場を</p>
                  <p>→ いいえ → <strong>中人数劇（6-10人）</strong>も検討</p>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold mb-2">Q3: 稽古時間は十分？</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p>→ 3ヶ月以上 → <strong>大人数劇（11-20人）</strong>に挑戦</p>
                  <p>→ 1-2ヶ月 → <strong>中人数劇（6-10人）</strong>が現実的</p>
                  <p>→ 1ヶ月未満 → <strong>少人数劇</strong>で確実に仕上げる</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 実例紹介 */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">成功事例から学ぶ</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-3 text-blue-600">
                事例1: 文化祭での8人劇
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                高校の文化祭で「夏の夜の夢」を現代風にアレンジ。
                8人という人数を活かし、4組のカップルの恋愛模様を描いた。
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>成功のポイント：</strong>
                全員に恋愛シーンがあり、観客も感情移入しやすかった。
                ダブルキャストで16人が参加でき、クラスの一体感も生まれた。
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-3 text-green-600">
                事例2: 市民劇団の3人劇
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                市民劇団が「ゴドーを待ちながら」を3人で上演。
                少人数ならではの緊密な稽古で、深い作品理解を実現。
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>成功のポイント：</strong>
                3人全員がベテランで、複雑な哲学的対話も見事に表現。
                小劇場の親密な空間が作品にマッチした。
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-3 text-purple-600">
                事例3: 卒業記念の25人劇
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                中学校の卒業記念公演で、オリジナルミュージカルを上演。
                クラス全員が参加し、歌・ダンス・演技で個性を発揮。
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>成功のポイント：</strong>
                得意分野で役割分担し、全員が輝ける構成に。
                3ヶ月の準備期間で、プロの演出家も招聘した。
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-3 text-red-600">
                事例4: 一人芝居の挑戦
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                演劇部の部長が引退公演で一人芝居に挑戦。
                30分の作品で、一人の女性の人生を演じ切った。
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>成功のポイント：</strong>
                音響・照明を効果的に使い、場面転換を表現。
                観客を巻き込む演出で、一体感のある空間を創出。
              </div>
            </div>
          </div>
        </section>

        {/* よくある質問 */}
        <section className="mt-12 bg-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">よくある質問</h2>
          
          <div className="space-y-4">
            <details className="bg-white p-4 rounded-lg">
              <summary className="font-semibold cursor-pointer">
                人数が足りない場合はどうすればいい？
              </summary>
              <p className="mt-3 text-sm text-gray-700">
                一人二役や、人形を使った演出、映像の活用など、工夫次第で人数不足は補えます。
                また、ナレーションで場面を説明したり、観客を巻き込む演出も効果的です。
              </p>
            </details>

            <details className="bg-white p-4 rounded-lg">
              <summary className="font-semibold cursor-pointer">
                人数が多すぎる場合の対処法は？
              </summary>
              <p className="mt-3 text-sm text-gray-700">
                ダブルキャスト・トリプルキャストにする、裏方スタッフとして参加してもらう、
                群衆シーンを増やす、オムニバス形式にするなどの方法があります。
              </p>
            </details>

            <details className="bg-white p-4 rounded-lg">
              <summary className="font-semibold cursor-pointer">
                男女比が偏っている場合は？
              </summary>
              <p className="mt-3 text-sm text-gray-700">
                性別を変更しても問題ない作品を選ぶ、異性役に挑戦する、
                性別不問の作品を探すなどの対応が可能です。最近は性別にとらわれない作品も増えています。
              </p>
            </details>

            <details className="bg-white p-4 rounded-lg">
              <summary className="font-semibold cursor-pointer">
                初心者が多い場合の人数は？
              </summary>
              <p className="mt-3 text-sm text-gray-700">
                5-8人程度がおすすめです。少なすぎると個人の負担が大きく、
                多すぎると統率が取れません。経験者が2-3人いれば、10人程度まで可能です。
              </p>
            </details>
          </div>
        </section>

        {/* まとめとCTA */}
        <section className="mt-12 bg-gradient-to-r from-purple-100 to-blue-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">最適な人数で最高の舞台を</h2>
          <p className="mb-6 text-gray-700">
            人数に合わせた作品選びが、成功への第一歩です。<br />
            メンバーの実力と稽古期間を考慮して、無理のない選択をしましょう。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-semibold">
              作品を探す
            </Link>
            <Link href="/guide/beginner/how-to-choose-script" className="inline-block bg-white text-blue-500 border-2 border-blue-500 px-8 py-3 rounded-lg hover:bg-blue-50 font-semibold">
              脚本の選び方を見る
            </Link>
          </div>
        </section>

        {/* 関連リンク */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">関連ガイド</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/guide/time" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">上演時間別ガイド</h3>
              <p className="text-sm text-gray-600">30分から2時間まで、時間に合わせた作品選び</p>
            </Link>
            <Link href="/guide/school/culture-festival" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">文化祭演劇ガイド</h3>
              <p className="text-sm text-gray-600">限られた条件で成功させるコツ</p>
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