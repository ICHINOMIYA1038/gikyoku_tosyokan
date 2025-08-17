import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { FaMicrophone, FaHeart, FaRunning, FaEye, FaHandPaper, FaBrain } from "react-icons/fa";
import { useState } from "react";

export default function ActingBasics() {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const exercises = [
    {
      title: "腹式呼吸",
      time: "5分",
      description: "仰向けになり、お腹に手を当てて呼吸。お腹が膨らむ・へこむを意識",
      difficulty: "初級"
    },
    {
      title: "母音発声",
      time: "5分",
      description: "「あえいおう」を大きく口を開けて発声。各音10秒キープ",
      difficulty: "初級"
    },
    {
      title: "早口言葉",
      time: "10分",
      description: "「生麦生米生卵」などを徐々にスピードアップ",
      difficulty: "中級"
    },
    {
      title: "感情朗読",
      time: "15分",
      description: "同じセリフを喜怒哀楽で読み分ける",
      difficulty: "上級"
    }
  ];

  return (
    <Layout>
      <Seo
        pageTitle="演技の基礎完全ガイド | 発声から感情表現まで"
        pageDescription="演劇初心者のための演技基礎トレーニング。発声練習、身体表現、感情表現まで、プロも実践する基礎練習法を詳しく解説。"
        pagePath="/guide/beginner/acting-basics"
        pageType="article"
      />
      <StructuredData
        type="Article"
        title="演技の基礎完全ガイド"
        description="発声から感情表現までの基礎トレーニング"
        url="https://gikyokutosyokan.com/guide/beginner/acting-basics"
        datePublished="2024-01-01"
        dateModified="2024-01-01"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "ガイド", url: "https://gikyokutosyokan.com/guide" },
          { name: "初心者向け", url: "https://gikyokutosyokan.com/guide/beginner" },
          { name: "演技の基礎", url: "https://gikyokutosyokan.com/guide/beginner/acting-basics" }
        ]}
      />
      
      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            演技の基礎完全ガイド
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            初心者でもできる！プロも実践する基礎トレーニング
          </p>
          <div className="flex items-center text-sm text-gray-500 gap-4">
            <span>更新日: 2024年1月1日</span>
            <span>読了時間: 約12分</span>
          </div>
        </header>

        {/* 導入 */}
        <section className="mb-12">
          <div className="bg-purple-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-3">演技力向上の3つの柱</h2>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white p-4 rounded">
                <FaMicrophone className="text-2xl text-purple-500 mb-2" />
                <h3 className="font-semibold mb-1">声</h3>
                <p className="text-sm text-gray-600">発声・発音・抑揚</p>
              </div>
              <div className="bg-white p-4 rounded">
                <FaRunning className="text-2xl text-blue-500 mb-2" />
                <h3 className="font-semibold mb-1">身体</h3>
                <p className="text-sm text-gray-600">姿勢・動き・表情</p>
              </div>
              <div className="bg-white p-4 rounded">
                <FaHeart className="text-2xl text-red-500 mb-2" />
                <h3 className="font-semibold mb-1">感情</h3>
                <p className="text-sm text-gray-600">共感・想像・表現</p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 1: 声の基礎 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaMicrophone className="mr-2 text-purple-500" />
            Step 1: 声の基礎トレーニング
          </h2>

          <div className="space-y-8">
            {/* 腹式呼吸 */}
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-semibold mb-3">1-1. 腹式呼吸をマスターする</h3>
              <p className="text-gray-700 mb-4">
                舞台で声を届けるには、腹式呼吸が必須です。
                正しい呼吸法を身につけることで、長いセリフも楽に話せるようになります。
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">基本練習方法</h4>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mr-2 text-xs">1</span>
                    <div>
                      <strong>仰向けになる</strong>
                      <p className="text-gray-600">床に寝転がり、お腹に本を乗せる</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mr-2 text-xs">2</span>
                    <div>
                      <strong>鼻から吸う（4秒）</strong>
                      <p className="text-gray-600">本が上に上がるのを確認</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mr-2 text-xs">3</span>
                    <div>
                      <strong>口から吐く（8秒）</strong>
                      <p className="text-gray-600">ゆっくりと本が下がるのを確認</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mr-2 text-xs">4</span>
                    <div>
                      <strong>立った状態でも練習</strong>
                      <p className="text-gray-600">同じ感覚で呼吸できるまで繰り返す</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>

            {/* 発声練習 */}
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-semibold mb-3">1-2. 発声練習</h3>
              <p className="text-gray-700 mb-4">
                明瞭な発音は、観客に内容を伝える基本です。
                毎日10分の練習で、劇的に改善されます。
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">母音の練習</h4>
                  <ul className="text-sm space-y-2">
                    <li>• 「あ」：大きく口を開ける</li>
                    <li>• 「い」：口角を横に引く</li>
                    <li>• 「う」：唇を前に突き出す</li>
                    <li>• 「え」：舌を下の歯につける</li>
                    <li>• 「お」：唇を丸くする</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">滑舌トレーニング</h4>
                  <ul className="text-sm space-y-2">
                    <li>• 外郎売り（ういろううり）</li>
                    <li>• 早口言葉集</li>
                    <li>• ナ行・ラ行の区別</li>
                    <li>• パ行・バ行の破裂音</li>
                    <li>• サ行の摩擦音</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: 身体表現 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaRunning className="mr-2 text-blue-500" />
            Step 2: 身体表現の基礎
          </h2>

          <div className="space-y-8">
            {/* 姿勢 */}
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-semibold mb-3">2-1. 基本姿勢</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-3">ニュートラルポジション</h4>
                <p className="text-sm text-gray-700 mb-3">
                  すべての動きの基本となる姿勢です。この姿勢から、どんな役にも変身できます。
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <FaHandPaper className="text-blue-500 mt-1 mr-2" />
                    <span><strong>足</strong>：肩幅に開き、つま先は正面</span>
                  </li>
                  <li className="flex items-start">
                    <FaHandPaper className="text-blue-500 mt-1 mr-2" />
                    <span><strong>膝</strong>：軽く緩める（ロックしない）</span>
                  </li>
                  <li className="flex items-start">
                    <FaHandPaper className="text-blue-500 mt-1 mr-2" />
                    <span><strong>背筋</strong>：頭頂部を糸で引っ張られるイメージ</span>
                  </li>
                  <li className="flex items-start">
                    <FaHandPaper className="text-blue-500 mt-1 mr-2" />
                    <span><strong>肩</strong>：力を抜いて自然に下ろす</span>
                  </li>
                  <li className="flex items-start">
                    <FaHandPaper className="text-blue-500 mt-1 mr-2" />
                    <span><strong>視線</strong>：まっすぐ前を見る</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 身体の使い方 */}
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-semibold mb-3">2-2. キャラクターの身体性</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">年齢による違い</h4>
                  <ul className="text-sm space-y-1">
                    <li><strong>子供</strong>：重心高く、動き大きい</li>
                    <li><strong>若者</strong>：軽快、直線的</li>
                    <li><strong>中年</strong>：安定、ゆったり</li>
                    <li><strong>老人</strong>：重心低く、ゆっくり</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">性格による違い</h4>
                  <ul className="text-sm space-y-1">
                    <li><strong>明るい</strong>：上向き、開放的</li>
                    <li><strong>暗い</strong>：下向き、閉鎖的</li>
                    <li><strong>自信家</strong>：胸張る、大股</li>
                    <li><strong>臆病</strong>：縮こまる、小股</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 3: 感情表現 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaHeart className="mr-2 text-red-500" />
            Step 3: 感情表現の技術
          </h2>

          <div className="space-y-8">
            {/* 感情の理解 */}
            <div className="border-l-4 border-red-500 pl-6">
              <h3 className="text-xl font-semibold mb-3">3-1. 感情を理解する</h3>
              
              <div className="bg-pink-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-3">感情のレイヤー</h4>
                <p className="text-sm text-gray-700 mb-3">
                  人の感情は単純ではありません。複数の感情が同時に存在することを理解しましょう。
                </p>
                
                <div className="bg-white p-3 rounded mb-3">
                  <p className="font-semibold text-sm mb-2">例：「怒り」の場合</p>
                  <ul className="text-sm space-y-1">
                    <li>• 表面：怒り（声を荒げる）</li>
                    <li>• 中層：悲しみ（期待を裏切られた）</li>
                    <li>• 深層：愛情（本当は大切に思っている）</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 感情の表現方法 */}
            <div className="border-l-4 border-red-500 pl-6">
              <h3 className="text-xl font-semibold mb-3">3-2. 感情表現の練習法</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">感情記憶法</h4>
                  <ol className="text-sm space-y-2">
                    <li>1. 自分の過去の経験を思い出す</li>
                    <li>2. その時の身体感覚を再現する</li>
                    <li>3. 役の状況に置き換える</li>
                    <li>4. セリフに感情を乗せる</li>
                  </ol>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">身体から入る方法</h4>
                  <ol className="text-sm space-y-2">
                    <li>1. 感情に合った身体の形を作る</li>
                    <li>2. 呼吸を変える（浅い/深い）</li>
                    <li>3. 筋肉の緊張を調整する</li>
                    <li>4. 自然に感情が湧いてくる</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 毎日の練習メニュー */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaBrain className="mr-2 text-green-500" />
            毎日の練習メニュー
          </h2>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">15分でできる基礎練習</h3>
            
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={index} className="bg-white p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{exercise.title}</h4>
                    <div className="flex gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {exercise.time}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        exercise.difficulty === "初級" ? "bg-green-100 text-green-700" :
                        exercise.difficulty === "中級" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {exercise.difficulty}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{exercise.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded">
              <p className="text-sm">
                <strong>💡 ポイント：</strong>
                毎日継続することが大切です。最初は5分からでもOK。徐々に時間を延ばしていきましょう。
              </p>
            </div>
          </div>
        </section>

        {/* 実践編 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            実践編：シーン別演技のコツ
          </h2>
          
          <div className="space-y-4">
            <details className="border rounded-lg">
              <summary className="p-4 font-semibold cursor-pointer hover:bg-gray-50">
                独白（モノローグ）のコツ
              </summary>
              <div className="p-4 pt-0">
                <ul className="space-y-2 text-sm">
                  <li>• 観客を「もう一人の自分」と思う</li>
                  <li>• 目線は斜め上の一点に固定</li>
                  <li>• 感情の変化を3段階で作る</li>
                  <li>• 最後は観客に向かって開く</li>
                </ul>
              </div>
            </details>

            <details className="border rounded-lg">
              <summary className="p-4 font-semibold cursor-pointer hover:bg-gray-50">
                対話シーンのコツ
              </summary>
              <div className="p-4 pt-0">
                <ul className="space-y-2 text-sm">
                  <li>• 相手の目を見て話す（舞台上でも）</li>
                  <li>• 相手のセリフをちゃんと聞く</li>
                  <li>• リアクションを大切にする</li>
                  <li>• 間（ま）を恐れない</li>
                </ul>
              </div>
            </details>

            <details className="border rounded-lg">
              <summary className="p-4 font-semibold cursor-pointer hover:bg-gray-50">
                感情爆発シーンのコツ
              </summary>
              <div className="p-4 pt-0">
                <ul className="space-y-2 text-sm">
                  <li>• 事前に小さな予兆を作る</li>
                  <li>• 身体全体を使って表現</li>
                  <li>• 声だけでなく呼吸も変える</li>
                  <li>• 爆発後の「静」も大切に</li>
                </ul>
              </div>
            </details>

            <details className="border rounded-lg">
              <summary className="p-4 font-semibold cursor-pointer hover:bg-gray-50">
                コメディシーンのコツ
              </summary>
              <div className="p-4 pt-0">
                <ul className="space-y-2 text-sm">
                  <li>• タイミングが命（早すぎず遅すぎず）</li>
                  <li>• 自分は真面目に演じる</li>
                  <li>• オーバーリアクションは計算して</li>
                  <li>• 観客の反応を待つ余裕を持つ</li>
                </ul>
              </div>
            </details>
          </div>
        </section>

        {/* よくある悩みQ&A */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            よくある悩みQ&A
          </h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-gray-400 pl-6">
              <h3 className="font-semibold mb-2">Q. 緊張して声が震えてしまいます</h3>
              <p className="text-sm text-gray-700">
                A. 緊張は誰でもします。深呼吸をして、「緊張している自分」を受け入れましょう。
                声の震えは、腹式呼吸でお腹から声を出すことで改善されます。
                また、「震えてもいい」と思うことで、逆に震えなくなることもあります。
              </p>
            </div>

            <div className="border-l-4 border-gray-400 pl-6">
              <h3 className="font-semibold mb-2">Q. 感情が入らず、棒読みになってしまいます</h3>
              <p className="text-sm text-gray-700">
                A. まず、セリフの意味を理解しているか確認しましょう。
                「なぜこのセリフを言うのか」「相手に何を伝えたいのか」を考えます。
                次に、自分の経験と照らし合わせて、似た感情を思い出してみてください。
              </p>
            </div>

            <div className="border-l-4 border-gray-400 pl-6">
              <h3 className="font-semibold mb-2">Q. 動きがぎこちなくなってしまいます</h3>
              <p className="text-sm text-gray-700">
                A. 最初は動きとセリフを別々に練習しましょう。
                動きだけを音楽に合わせて練習し、身体に覚えさせます。
                その後、セリフを加えていくと自然になります。
              </p>
            </div>

            <div className="border-l-4 border-gray-400 pl-6">
              <h3 className="font-semibold mb-2">Q. 他の人と比べて下手だと感じます</h3>
              <p className="text-sm text-gray-700">
                A. 演技に「正解」はありません。あなたにしかできない表現があります。
                他人と比べるのではなく、昨日の自分と比べましょう。
                毎日少しずつ成長していけば、必ず上達します。
              </p>
            </div>
          </div>
        </section>

        {/* まとめ */}
        <section className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold mb-4">演技上達の極意</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">1. 基礎を大切にする</h3>
              <p className="text-sm text-gray-700">
                発声・身体・感情の基礎練習を毎日続けることが、確実な上達への道です。
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">2. 観察力を養う</h3>
              <p className="text-sm text-gray-700">
                日常生活で人々の表情、しぐさ、話し方を観察し、演技の引き出しを増やしましょう。
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">3. 恥を捨てる</h3>
              <p className="text-sm text-gray-700">
                失敗を恐れず、思い切って表現することが成長につながります。
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">4. 楽しむ心を忘れない</h3>
              <p className="text-sm text-gray-700">
                演技は楽しいもの。楽しんでいる姿は、観客にも伝わります。
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-100 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold mb-4">次のステップへ</h2>
          <p className="mb-6">
            基礎を学んだら、実際に作品に挑戦してみましょう。
            初心者でも演じやすい作品を集めました。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/?categories=2" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-center">
              初心者向け作品を探す
            </Link>
            <Link href="/guide" className="inline-block bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 text-center">
              他のガイドを見る
            </Link>
          </div>
        </section>

        {/* 関連記事 */}
        <section className="border-t pt-8">
          <h2 className="text-xl font-bold mb-4">関連ガイド</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/guide/beginner/how-to-choose-script" className="text-blue-600 hover:underline">
                → 脚本の選び方完全ガイド
              </Link>
            </li>
            <li>
              <Link href="/guide/school/culture-festival" className="text-blue-600 hover:underline">
                → 文化祭演劇ガイド
              </Link>
            </li>
            <li>
              <Link href="/guide/beginner/reading-script" className="text-blue-600 hover:underline">
                → 脚本の読み方・分析方法（準備中）
              </Link>
            </li>
          </ul>
        </section>
      </article>
    </Layout>
  );
}