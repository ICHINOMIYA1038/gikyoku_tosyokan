import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { useState } from "react";
import { FaSearch, FaBook, FaTheaterMasks, FaLightbulb, FaUsers } from "react-icons/fa";

interface Term {
  term: string;
  reading: string;
  category: string;
  description: string;
  example?: string;
  related?: string[];
}

export default function GlossaryIndex() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const terms: Term[] = [
    // あ行
    {
      term: "上手（かみて）",
      reading: "かみて",
      category: "舞台用語",
      description: "客席から見て舞台の右側。演者から見ると左側になる。",
      example: "「上手から登場する」",
      related: ["下手"]
    },
    {
      term: "下手（しもて）",
      reading: "しもて",
      category: "舞台用語",
      description: "客席から見て舞台の左側。演者から見ると右側になる。",
      example: "「下手に退場する」",
      related: ["上手"]
    },
    {
      term: "板付き（いたつき）",
      reading: "いたつき",
      category: "演出用語",
      description: "幕が開いた時、すでに役者が舞台上にいる状態。または場面転換後に役者がすでに位置についている状態。",
      example: "「第二幕は主人公の板付きで始まる」"
    },
    {
      term: "アドリブ",
      reading: "あどりぶ",
      category: "演技用語",
      description: "台本にない即興のセリフや演技。ラテン語の「ad libitum（自由に）」が語源。",
      example: "「セリフを忘れたらアドリブで繋ぐ」"
    },
    {
      term: "暗転（あんてん）",
      reading: "あんてん",
      category: "照明用語",
      description: "照明を消して舞台を暗くすること。場面転換の際によく使われる。",
      example: "「暗転中に小道具を配置する」",
      related: ["明転"]
    },
    {
      term: "明転（めいてん）",
      reading: "めいてん",
      category: "照明用語",
      description: "照明をつけたまま場面転換を行うこと。観客に転換の様子を見せる演出。",
      example: "「明転で椅子を並べ替える」",
      related: ["暗転"]
    },
    
    // か行
    {
      term: "きっかけ",
      reading: "きっかけ",
      category: "演出用語",
      description: "音響・照明の変化や、役者の登退場のタイミングを示す合図。キュー（Cue）とも言う。",
      example: "「雷の音がきっかけで照明が変わる」"
    },
    {
      term: "ゲネプロ",
      reading: "げねぷろ",
      category: "稽古用語",
      description: "本番前の最終リハーサル。ドイツ語の「Generalprobe」が語源。本番と同じ条件で行う。",
      example: "「明日はゲネプロなので衣装を持参」"
    },
    {
      term: "殺陣（たて）",
      reading: "たて",
      category: "演技用語",
      description: "舞台上での格闘シーンや刀を使った立ち回りの振付。",
      example: "「殺陣師に振付を教わる」"
    },
    {
      term: "香盤表（こうばんひょう）",
      reading: "こうばんひょう",
      category: "制作用語",
      description: "出演者の出番や衣装替えのタイミングを記した表。スケジュール管理に使用。",
      example: "「香盤表を見て次の出番を確認する」"
    },
    
    // さ行
    {
      term: "地明かり（じあかり）",
      reading: "じあかり",
      category: "照明用語",
      description: "舞台全体を均等に照らす基本的な照明。ベースライトとも呼ばれる。",
      example: "「地明かりを少し暗くして雰囲気を出す」"
    },
    {
      term: "せり",
      reading: "せり",
      category: "舞台用語",
      description: "舞台の床の一部が上下に可動する装置。役者や大道具の登場・退場に使用。",
      example: "「主人公がせりから登場する」"
    },
    {
      term: "袖（そで）",
      reading: "そで",
      category: "舞台用語",
      description: "舞台の両脇にある、客席から見えない待機スペース。",
      example: "「袖で次の出番を待つ」",
      related: ["上手袖", "下手袖"]
    },
    
    // た行
    {
      term: "立ち稽古（たちげいこ）",
      reading: "たちげいこ",
      category: "稽古用語",
      description: "実際に動きをつけながら行う稽古。読み合わせの次の段階。",
      example: "「今日から立ち稽古が始まる」",
      related: ["読み合わせ", "通し稽古"]
    },
    {
      term: "ダメ出し",
      reading: "だめだし",
      category: "稽古用語",
      description: "演出家が稽古後に行う改善点の指摘。建設的な批評。",
      example: "「通し稽古の後、30分のダメ出しがあった」"
    },
    {
      term: "段取り",
      reading: "だんどり",
      category: "演出用語",
      description: "舞台上での動きの順序や位置関係。ブロッキングとも言う。",
      example: "「段取りを確認してから通し稽古に入る」"
    },
    {
      term: "通し稽古（とおしげいこ）",
      reading: "とおしげいこ",
      category: "稽古用語",
      description: "作品を最初から最後まで止めずに行う稽古。",
      example: "「本番一週間前から通し稽古を始める」",
      related: ["立ち稽古", "ゲネプロ"]
    },
    {
      term: "ト書き（とがき）",
      reading: "とがき",
      category: "脚本用語",
      description: "脚本中のセリフ以外の部分。動作や情景の説明。「と」で始まることが多いことから。",
      example: "「ト書きに『涙を流しながら』とある」"
    },
    
    // な行
    {
      term: "抜き稽古（ぬきげいこ）",
      reading: "ぬきげいこ",
      category: "稽古用語",
      description: "特定のシーンだけを取り出して集中的に練習する稽古。",
      example: "「クライマックスシーンの抜き稽古を行う」"
    },
    {
      term: "のみ込む",
      reading: "のみこむ",
      category: "演技用語",
      description: "セリフを完全に覚えて、自然に言えるようになること。",
      example: "「長いセリフをようやくのみ込んだ」"
    },
    
    // は行
    {
      term: "バミリ",
      reading: "ばみり",
      category: "舞台用語",
      description: "舞台上の立ち位置や道具の位置を示すために貼るテープのマーク。",
      example: "「バミリを目印に立ち位置を決める」"
    },
    {
      term: "場当たり（ばあたり）",
      reading: "ばあたり",
      category: "稽古用語",
      description: "本番の会場で行う位置確認や技術的な確認。テクニカルリハーサル。",
      example: "「本番前日に場当たりを行う」"
    },
    {
      term: "はける",
      reading: "はける",
      category: "演出用語",
      description: "舞台から退場すること。",
      example: "「上手にはける」",
      related: ["出る"]
    },
    {
      term: "ピンスポット",
      reading: "ぴんすぽっと",
      category: "照明用語",
      description: "特定の人物や場所だけを照らす狭い範囲のスポットライト。",
      example: "「主人公にピンスポットを当てる」"
    },
    {
      term: "ブロッキング",
      reading: "ぶろっきんぐ",
      category: "演出用語",
      description: "舞台上での役者の動きや位置を決めること。段取りとも言う。",
      example: "「演出家がブロッキングを指示する」"
    },
    
    // ま行
    {
      term: "間（ま）",
      reading: "ま",
      category: "演技用語",
      description: "セリフとセリフの間の沈黙や、動作の間の静止。タイミングの取り方。",
      example: "「間を大切にして感情を表現する」"
    },
    {
      term: "見切れる",
      reading: "みきれる",
      category: "舞台用語",
      description: "舞台裏や袖にいる役者・スタッフが客席から見えてしまうこと。",
      example: "「袖で待機中に見切れないよう注意する」"
    },
    {
      term: "見立て",
      reading: "みたて",
      category: "演出用語",
      description: "あるものを別のものに見立てて表現すること。想像力を使った演出技法。",
      example: "「椅子を馬に見立てて演技する」"
    },
    
    // や行
    {
      term: "読み合わせ",
      reading: "よみあわせ",
      category: "稽古用語",
      description: "キャスト全員で脚本を読む最初の稽古。本読みとも言う。",
      example: "「初日は読み合わせから始める」",
      related: ["立ち稽古"]
    },
    
    // ら行
    {
      term: "ランスルー",
      reading: "らんするー",
      category: "稽古用語",
      description: "通し稽古の一種。技術的な確認を主目的として行う。",
      example: "「音響・照明込みでランスルーを行う」"
    },
    
    // わ行
    {
      term: "わらう",
      reading: "わらう",
      category: "舞台用語",
      description: "舞台上から物を片付けること。「物をわらう」と使う。",
      example: "「このシーンで椅子をわらってください」"
    }
  ];

  // カテゴリー一覧
  const categories = ["all", "舞台用語", "演技用語", "演出用語", "照明用語", "稽古用語", "脚本用語", "制作用語"];

  // フィルタリング
  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.includes(searchTerm) || 
                          term.reading.includes(searchTerm) || 
                          term.description.includes(searchTerm);
    const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // あいうえお順にグループ化
  const groupedTerms: { [key: string]: Term[] } = {};
  const kanaOrder = ["あ", "か", "さ", "た", "な", "は", "ま", "や", "ら", "わ"];
  
  filteredTerms.forEach(term => {
    const firstChar = term.reading[0];
    let group = "その他";
    
    for (const kana of kanaOrder) {
      if (firstChar >= kana && firstChar < getNextKana(kana)) {
        group = kana + "行";
        break;
      }
    }
    
    if (!groupedTerms[group]) {
      groupedTerms[group] = [];
    }
    groupedTerms[group].push(term);
  });

  function getNextKana(kana: string): string {
    const index = kanaOrder.indexOf(kana);
    return index < kanaOrder.length - 1 ? kanaOrder[index + 1] : "ん";
  }

  return (
    <Layout>
      <Seo
        pageTitle="演劇用語集 | 舞台・演技・演出用語を完全解説"
        pageDescription="演劇初心者から経験者まで役立つ演劇用語集。上手下手、ゲネプロ、バミリなど、舞台で使われる専門用語を分かりやすく解説。"
        pagePath="/glossary"
      />
      <StructuredData
        type="WebSite"
        title="演劇用語集"
        description="演劇・舞台用語の総合辞典"
        url="https://gikyokutosyokan.com/glossary"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "用語集", url: "https://gikyokutosyokan.com/glossary" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            演劇用語集
          </h1>
          <p className="text-lg text-gray-600">
            舞台で使われる専門用語を分かりやすく解説
          </p>
        </header>

        {/* 検索・フィルター */}
        <section className="bg-gray-50 p-6 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">用語を検索</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="用語・読み方・説明文から検索"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="md:w-64">
              <label className="block text-sm font-medium mb-2">カテゴリー</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "すべて" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            {filteredTerms.length}件の用語が見つかりました
          </div>
        </section>

        {/* 用語一覧 */}
        <div className="grid md:grid-cols-2 gap-8">
          {kanaOrder.map(kana => {
            const group = kana + "行";
            if (!groupedTerms[group] || groupedTerms[group].length === 0) return null;
            
            return (
              <section key={group} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-gray-300">
                  {group}
                </h2>
                <div className="space-y-6">
                  {groupedTerms[group].map((term, index) => (
                    <article key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <header className="mb-3">
                        <h3 className="text-xl font-bold inline-block">
                          {term.term}
                        </h3>
                        {term.reading !== term.term && (
                          <span className="ml-2 text-sm text-gray-500">
                            （{term.reading}）
                          </span>
                        )}
                        <span className="ml-3 inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                          {term.category}
                        </span>
                      </header>
                      
                      <p className="text-gray-700 mb-3">
                        {term.description}
                      </p>
                      
                      {term.example && (
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <strong className="text-gray-600">例：</strong>
                          <span className="text-gray-800">{term.example}</span>
                        </div>
                      )}
                      
                      {term.related && term.related.length > 0 && (
                        <div className="mt-3 text-sm">
                          <strong className="text-gray-600">関連：</strong>
                          {term.related.map((rel, i) => (
                            <span key={i}>
                              {i > 0 && "、"}
                              <button
                                onClick={() => setSearchTerm(rel)}
                                className="text-blue-600 hover:underline"
                              >
                                {rel}
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* 追加情報 */}
        <section className="mt-12 bg-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">用語集の使い方</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <FaBook className="text-3xl text-blue-500 mb-2" />
              <h3 className="font-semibold mb-2">初心者の方へ</h3>
              <p className="text-sm text-gray-700">
                まずは「舞台用語」カテゴリーから基本的な用語を覚えましょう。
                上手・下手など、頻繁に使われる用語から始めるのがおすすめです。
              </p>
            </div>
            
            <div>
              <FaTheaterMasks className="text-3xl text-purple-500 mb-2" />
              <h3 className="font-semibold mb-2">稽古で使える</h3>
              <p className="text-sm text-gray-700">
                「稽古用語」カテゴリーには、練習で必要な用語がまとまっています。
                読み合わせから本番まで、段階ごとの用語を確認できます。
              </p>
            </div>
            
            <div>
              <FaLightbulb className="text-3xl text-yellow-500 mb-2" />
              <h3 className="font-semibold mb-2">実践的な例文</h3>
              <p className="text-sm text-gray-700">
                各用語には実際の使用例を掲載。
                どんな場面で使われるか具体的にイメージできます。
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">次のステップ</h2>
          <p className="mb-6 text-gray-700">
            用語を覚えたら、実際に演劇に挑戦してみましょう
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/guide" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
              演劇ガイドを読む
            </Link>
            <Link href="/" className="inline-block bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600">
              作品を探す
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}