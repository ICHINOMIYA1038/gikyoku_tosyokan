import Layout from "@/components/Layout";
import Link from "next/link";
import Seo from "@/components/seo";
import { useState } from "react";
import { FaTheaterMasks, FaClock, FaUsers, FaDownload, FaFilter } from "react-icons/fa";

// 作品データに詳細情報を追加
const shortStoriesData = [
  {
    id: "kotsutsubo",
    title: "骨壺",
    imgSrc: "/img/card_kotsutsubo.jpg",
    pdfSrc: "/pdf/hone.pdf",
    description: "「靴があっただけましやろ。」\n「靴やん」\n「和也の靴やで」\n「和也の靴やけど、和也は靴ちゃう…」",
    duration: "15分",
    characters: { male: 2, female: 1, total: 3 },
    genre: "シリアス",
    difficulty: "中級",
    keywords: ["家族", "死", "記憶", "喪失感"]
  },
  {
    id: "senaka",
    title: "背中に花が笑ってる",
    imgSrc: "/img/card_senaka.jpg",
    pdfSrc: "/pdf/senakani.pdf",
    description: "「子供は親の背中を見て育つんだから」\n「見せられないですよ、僕の背中なんて」",
    duration: "20分",
    characters: { male: 1, female: 2, total: 3 },
    genre: "ヒューマンドラマ",
    difficulty: "初級",
    keywords: ["親子", "成長", "責任", "家族愛"]
  },
  {
    id: "gomibako",
    title: "ゴミ箱と大人",
    imgSrc: "/img/card_gomibako.jpg",
    pdfSrc: "/pdf/gomi.pdf",
    description: '「ビール飲めたら大人かなって」\n「なんやそれ。誰が言うたんやそれ\nあんた、"もう"はたちやねんから、大人やん」\n「さっきは"まだ"はたちって言ってた」',
    duration: "25分",
    characters: { male: 2, female: 2, total: 4 },
    genre: "コメディ",
    difficulty: "初級",
    keywords: ["成人", "青春", "成長", "友情"]
  },
  {
    id: "hatsukoi",
    title: "初恋",
    imgSrc: "/img/card_hatsukoi.jpg",
    pdfSrc: "/pdf/hatsukoi.pdf",
    description: "「自殺しようとしてるんです、このビルの屋上で」\n「誰なの」\n「誰って、わかんないですけど」",
    duration: "30分",
    characters: { male: 1, female: 1, total: 2 },
    genre: "ロマンス・サスペンス",
    difficulty: "中級",
    keywords: ["恋愛", "救い", "運命", "出会い"]
  },
  {
    id: "august",
    title: "8月の空の下",
    imgSrc: "/img/card_8.jpg",
    pdfSrc: "/pdf/8.pdf",
    description: "「あなた、今日何の日か知ってる？」\n「燃えるゴミの日ですよね」\n「燃えるゴミじゃなくて燃やすゴミなの。それが問題なの。」",
    duration: "20分",
    characters: { male: 2, female: 2, total: 4 },
    genre: "社会派",
    difficulty: "上級",
    keywords: ["戦争", "平和", "記憶", "8月"]
  },
  {
    id: "sumika",
    title: "すみか",
    imgSrc: "/img/card_sumika.jpg",
    pdfSrc: "/pdf/sumika.pdf",
    description: "「あんなの家族じゃないよ」\n「家族じゃん、ちゃんと血の繋がってる」\n「その家族に逃げられたくせに」",
    duration: "25分",
    characters: { male: 2, female: 1, total: 3 },
    genre: "ヒューマンドラマ",
    difficulty: "中級",
    keywords: ["家族", "居場所", "絆", "孤独"]
  }
];

const mediumStoriesData = [
  {
    id: "tsuki",
    title: "月の卒業式",
    imgSrc: "/img/tsuki.jpg",
    pdfSrc: "/pdf/tsukino.pdf",
    description: "「月がきれいですね」\n「うん」\n「月がきれいですね」\n「私、死にたい」",
    duration: "45分",
    characters: { male: 3, female: 3, total: 6 },
    genre: "青春・ファンタジー",
    difficulty: "中級",
    keywords: ["卒業", "青春", "別れ", "夢"]
  },
  {
    id: "oudanhodou",
    title: "横断歩道",
    imgSrc: "/img/card_oudanhodou.jpg",
    pdfSrc: "/pdf/oudanhodou.pdf",
    description: "「1次元は横に伸びる直線」\n「2次元はそれがさらに広がった平面」\n「3次元は高さが加わった空間」\n「3次元ってなんか生きてる感じがする」",
    duration: "50分",
    characters: { male: 2, female: 2, total: 4 },
    genre: "SF・哲学",
    difficulty: "上級",
    keywords: ["次元", "存在", "哲学", "現実"]
  }
];

const longStoriesData = [
  {
    id: "ningyou",
    title: "人形の舞",
    imgSrc: "/img/ningyou.jpg",
    pdfSrc: "/pdf/ningyou.pdf",
    description: "「これだけそっくりだと無理ないね。ひとりでに踊りだしたりして」\n「そこまでいったらもう本物の人間じゃないですか」\n「なに？人間なら踊るの？」\n「人間だから踊るわけじゃないけど、踊るのは人間です。」",
    duration: "90分",
    characters: { male: 4, female: 4, total: 8 },
    genre: "ミステリー・ファンタジー",
    difficulty: "上級",
    keywords: ["人形", "舞踊", "人間性", "芸術"]
  }
];

// 全作品を統合
const allStories = [...shortStoriesData, ...mediumStoriesData, ...longStoriesData];

export default function PlotPageOptimized() {
  const [selectedGenre, setSelectedGenre] = useState("すべて");
  const [selectedDuration, setSelectedDuration] = useState("すべて");
  
  // ジャンル一覧を取得
  const genres = ["すべて", ...Array.from(new Set(allStories.map(story => story.genre)))];
  const durations = ["すべて", "〜30分", "30〜60分", "60分〜"];

  // フィルタリング処理
  const filteredStories = allStories.filter(story => {
    const genreMatch = selectedGenre === "すべて" || story.genre === selectedGenre;
    const durationMatch = selectedDuration === "すべて" || 
      (selectedDuration === "〜30分" && parseInt(story.duration) <= 30) ||
      (selectedDuration === "30〜60分" && parseInt(story.duration) > 30 && parseInt(story.duration) <= 60) ||
      (selectedDuration === "60分〜" && parseInt(story.duration) > 60);
    return genreMatch && durationMatch;
  });

  // 構造化データ生成
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "戯曲図書館オリジナル無料脚本集",
    "description": "上演料無料！文化祭・学園祭に最適な演劇脚本を無料ダウンロード。15分〜90分まで、少人数から大人数まで対応。",
    "url": "https://gikyokutosyokan.com/diary/plot",
    "provider": {
      "@type": "Organization",
      "name": "戯曲図書館",
      "url": "https://gikyokutosyokan.com"
    },
    "hasPart": allStories.map(story => ({
      "@type": "CreativeWork",
      "name": story.title,
      "description": story.description.substring(0, 100),
      "genre": story.genre,
      "timeRequired": `PT${story.duration.replace('分', 'M')}`,
    }))
  };

  return (
    <Layout>
      <Seo
        pageTitle="無料演劇脚本ダウンロード｜文化祭・学園祭向け台本【上演料無料】- 戯曲図書館"
        pageDescription="【完全無料】文化祭・学園祭で使える演劇脚本を無料ダウンロード。上演料不要、申請不要。15分の短編から90分の長編まで。少人数（2人）から大人数まで対応。コメディ、シリアス、青春など多彩なジャンル。"
        pagePath="/diary/plot"
        pageImg="https://gikyokutosyokan.com/img/og-plot.jpg"
        pageImgWidth={1200}
        pageImgHeight={630}
      />
      
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* ヒーローセクション */}
        <section className="bg-gradient-to-r from-theater-primary-50 to-theater-primary-100 rounded-lg p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-theater-neutral-900">
            無料演劇脚本ダウンロード
          </h1>
          <p className="text-lg mb-6 text-theater-neutral-700">
            文化祭・学園祭・演劇部の練習に！上演料無料の脚本を今すぐダウンロード
          </p>
          
          {/* 特徴バッジ */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="inline-flex items-center px-3 py-1 bg-theater-secondary-100 text-theater-secondary-700 rounded-full text-sm font-medium">
              <FaDownload className="mr-1" /> 即ダウンロード可能
            </span>
            <span className="inline-flex items-center px-3 py-1 bg-theater-accent-yellow/20 text-theater-neutral-800 rounded-full text-sm font-medium">
              <FaTheaterMasks className="mr-1" /> 上演料完全無料
            </span>
            <span className="inline-flex items-center px-3 py-1 bg-theater-accent-blue/20 text-theater-neutral-800 rounded-full text-sm font-medium">
              <FaUsers className="mr-1" /> 2人〜8人対応
            </span>
            <span className="inline-flex items-center px-3 py-1 bg-theater-accent-purple/20 text-theater-neutral-800 rounded-full text-sm font-medium">
              <FaClock className="mr-1" /> 15分〜90分
            </span>
          </div>

          {/* 使用条件 */}
          <div className="bg-white rounded-lg p-4 border-l-4 border-theater-secondary-500">
            <h2 className="font-bold text-lg mb-2">✅ 使用条件</h2>
            <ul className="space-y-1 text-sm text-theater-neutral-700">
              <li>✓ 上演許可申請不要</li>
              <li>✓ 上演料無料</li>
              <li>✓ 文化祭・学園祭・部活動・ワークショップで自由に使用可</li>
              <li>✓ 台本の改変可（クレジット表記をお願いします）</li>
            </ul>
          </div>
        </section>

        {/* フィルター */}
        <section className="mb-8 p-4 bg-theater-neutral-50 rounded-lg">
          <div className="flex items-center mb-4">
            <FaFilter className="mr-2 text-theater-primary-500" />
            <h2 className="text-xl font-bold">作品を絞り込む</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">ジャンル</label>
              <select 
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full p-2 border border-theater-neutral-300 rounded-lg focus:border-theater-primary-400"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">上演時間</label>
              <select 
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full p-2 border border-theater-neutral-300 rounded-lg focus:border-theater-primary-400"
              >
                {durations.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* 作品一覧 */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            作品一覧（{filteredStories.length}作品）
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <article 
                key={story.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <Link href={story.pdfSrc} target="_blank">
                  <div className="relative">
                    <img
                      src={story.imgSrc}
                      alt={`${story.title}の表紙画像`}
                      className="w-full h-48 object-cover rounded-t-lg"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 bg-theater-primary-500 text-white px-2 py-1 rounded text-sm">
                      {story.genre}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                    
                    {/* メタ情報 */}
                    <div className="flex flex-wrap gap-2 mb-3 text-sm">
                      <span className="flex items-center text-theater-neutral-600">
                        <FaClock className="mr-1" /> {story.duration}
                      </span>
                      <span className="flex items-center text-theater-neutral-600">
                        <FaUsers className="mr-1" /> {story.characters.total}人
                      </span>
                    </div>
                    
                    <p className="text-theater-neutral-700 text-sm mb-3 line-clamp-3">
                      {story.description}
                    </p>
                    
                    {/* キーワードタグ */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {story.keywords.map(keyword => (
                        <span 
                          key={keyword}
                          className="text-xs px-2 py-1 bg-theater-neutral-100 text-theater-neutral-600 rounded"
                        >
                          #{keyword}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-right">
                      <span className="text-theater-secondary-600 font-bold">
                        今すぐ読む →
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ セクション */}
        <section className="mt-12 bg-theater-neutral-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">よくある質問</h2>
          
          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4">
              <summary className="font-bold cursor-pointer">本当に無料で使えますか？</summary>
              <p className="mt-2 text-theater-neutral-700">
                はい、完全無料です。上演料も使用料も一切かかりません。文化祭、学園祭、部活動、ワークショップなど、非営利目的であれば自由にお使いいただけます。
              </p>
            </details>
            
            <details className="bg-white rounded-lg p-4">
              <summary className="font-bold cursor-pointer">台本の改変は可能ですか？</summary>
              <p className="mt-2 text-theater-neutral-700">
                はい、可能です。上演時間や人数に合わせて自由に改変していただいて構いません。可能であれば「原作：戯曲図書館」とクレジット表記をお願いします。
              </p>
            </details>
            
            <details className="bg-white rounded-lg p-4">
              <summary className="font-bold cursor-pointer">商用利用は可能ですか？</summary>
              <p className="mt-2 text-theater-neutral-700">
                有料公演での使用をご希望の場合は、別途ご相談ください。お問い合わせフォームよりご連絡いただければ、個別に対応させていただきます。
              </p>
            </details>
          </div>
        </section>

        {/* CTA セクション */}
        <section className="mt-12 bg-gradient-to-r from-theater-secondary-500 to-theater-secondary-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">もっと多くの脚本をお探しですか？</h2>
          <p className="mb-6">
            戯曲図書館では、有料脚本も含めて1000作品以上の脚本情報を検索できます
          </p>
          <Link 
            href="/" 
            className="inline-block bg-white text-theater-secondary-600 font-bold px-6 py-3 rounded-lg hover:bg-theater-neutral-100 transition"
          >
            脚本を検索する
          </Link>
        </section>
      </div>
    </Layout>
  );
}