import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { FaCalendarAlt, FaYenSign, FaUserFriends, FaClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function CultureFestivalGuide() {
  const schedule = [
    { week: "8週間前", task: "脚本決定・キャスト決め", detail: "メンバーの都合確認、脚本の入手" },
    { week: "7週間前", task: "読み合わせ・役決定", detail: "全員で脚本を読み、配役を決定" },
    { week: "6週間前", task: "ブロッキング", detail: "動きを決める、舞台図面作成" },
    { week: "5週間前", task: "立ち稽古開始", detail: "実際に動きながらの練習" },
    { week: "4週間前", task: "通し稽古開始", detail: "最初から最後まで通して練習" },
    { week: "3週間前", task: "衣装・小道具準備", detail: "必要なものをリストアップし準備" },
    { week: "2週間前", task: "技術リハーサル", detail: "音響・照明の確認" },
    { week: "1週間前", task: "ゲネプロ", detail: "本番同様の通し稽古" },
    { week: "本番", task: "最終確認・本番", detail: "楽しんで演じる！" }
  ];

  return (
    <Layout>
      <Seo
        pageTitle="文化祭演劇を成功させる完全ガイド | 準備から本番まで"
        pageDescription="文化祭での演劇を成功させるための8週間スケジュール、予算管理、練習方法を詳しく解説。初めてでも安心の実践ガイド。"
        pagePath="/guide/school/culture-festival"
        pageType="article"
      />
      <StructuredData
        type="Article"
        title="文化祭演劇を成功させる完全ガイド"
        description="準備から本番までの実践的アドバイス"
        url="https://gikyokutosyokan.com/guide/school/culture-festival"
        datePublished="2024-01-01"
        dateModified="2024-01-01"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "ガイド", url: "https://gikyokutosyokan.com/guide" },
          { name: "学校演劇", url: "https://gikyokutosyokan.com/guide/school" },
          { name: "文化祭演劇", url: "https://gikyokutosyokan.com/guide/school/culture-festival" }
        ]}
      />
      
      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            文化祭演劇を成功させる完全ガイド
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            限られた時間と予算で最高のパフォーマンスを
          </p>
          <div className="flex items-center text-sm text-gray-500 gap-4">
            <span>更新日: 2024年1月1日</span>
            <span>読了時間: 約10分</span>
          </div>
        </header>

        {/* 導入 */}
        <section className="mb-12">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-3">このガイドで解決できること</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span>限られた練習時間での効率的な稽古方法</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span>予算内での衣装・小道具の準備方法</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span>クラス全員が参加できる演出の工夫</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span>本番での緊張を和らげる方法</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 8週間スケジュール */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-500" />
            8週間完全スケジュール
          </h2>
          
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">時期</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">やること</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold hidden md:table-cell">詳細</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {schedule.map((item, index) => (
                  <tr key={index} className={item.week === "本番" ? "bg-yellow-50" : ""}>
                    <td className="px-4 py-3 text-sm font-medium">{item.week}</td>
                    <td className="px-4 py-3 text-sm">{item.task}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{item.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm">
              <FaExclamationTriangle className="inline text-yellow-600 mr-2" />
              <strong>重要:</strong> このスケジュールは目安です。メンバーの経験や作品の難易度に応じて調整してください。
            </p>
          </div>
        </section>

        {/* 脚本選びのポイント */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            文化祭に最適な脚本の条件
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold mb-3 flex items-center">
                <FaClock className="mr-2 text-green-600" />
                上演時間
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• 持ち時間から準備・撤収時間を引く</li>
                <li>• 20-30分がベスト（観客の集中力維持）</li>
                <li>• 転換が多い作品は避ける</li>
              </ul>
              <Link href="/?minPlaytime=20&maxPlaytime=30" className="inline-block mt-3 text-blue-600 hover:underline text-sm">
                20-30分の作品を探す →
              </Link>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-bold mb-3 flex items-center">
                <FaUserFriends className="mr-2 text-purple-600" />
                人数構成
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• クラスの1/3程度が理想</li>
                <li>• 裏方も含めて全員に役割を</li>
                <li>• ダブルキャストも検討</li>
              </ul>
              <Link href="/?minTotalCount=8&maxTotalCount=15" className="inline-block mt-3 text-blue-600 hover:underline text-sm">
                8-15人の作品を探す →
              </Link>
            </div>
          </div>
        </section>

        {/* 予算管理 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaYenSign className="mr-2 text-green-500" />
            予算管理のコツ
          </h2>
          
          <div className="border rounded-lg p-6">
            <h3 className="font-bold mb-4">一般的な予算配分（総額3万円の場合）</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <span>脚本使用料</span>
                <span className="font-semibold">5,000円</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span>衣装（レンタル・購入）</span>
                <span className="font-semibold">10,000円</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span>小道具・大道具材料</span>
                <span className="font-semibold">8,000円</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span>音響・照明（レンタル）</span>
                <span className="font-semibold">5,000円</span>
              </div>
              <div className="flex justify-between items-center">
                <span>予備費</span>
                <span className="font-semibold">2,000円</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded">
              <h4 className="font-semibold mb-2">節約のアイデア</h4>
              <ul className="text-sm space-y-1">
                <li>• 衣装は私服を活用、100均でアレンジ</li>
                <li>• 大道具は段ボールで制作</li>
                <li>• 音響は学校の設備を最大限活用</li>
                <li>• 先輩から小道具を借りる</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 練習方法 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            効率的な練習方法
          </h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="font-bold mb-2">序盤（1-3週目）: 基礎固め</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• 毎日15分の発声練習から開始</li>
                <li>• セリフは録音して通学中に聞く</li>
                <li>• 役の性格分析をノートにまとめる</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="font-bold mb-2">中盤（4-6週目）: 形を作る</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• シーンごとに区切って練習</li>
                <li>• 動きながらセリフを言う練習</li>
                <li>• ビデオ撮影して客観的にチェック</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="font-bold mb-2">終盤（7-8週目）: 仕上げ</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• 本番と同じ時間帯に通し稽古</li>
                <li>• 他クラスと見せ合い会</li>
                <li>• トラブル対応のシミュレーション</li>
              </ul>
            </div>
          </div>
        </section>

        {/* よくあるトラブルと対策 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            よくあるトラブルと対策
          </h2>
          
          <div className="space-y-4">
            <details className="border rounded-lg">
              <summary className="p-4 font-semibold cursor-pointer hover:bg-gray-50">
                メンバーが練習に来ない
              </summary>
              <div className="p-4 pt-0 text-sm">
                <ul className="space-y-2">
                  <li>• 練習スケジュールをLINEグループで共有</li>
                  <li>• 欠席者用の動画を撮影して共有</li>
                  <li>• 代役（アンダースタディ）を決めておく</li>
                  <li>• 短時間集中練習（1回45分以内）にする</li>
                </ul>
              </div>
            </details>

            <details className="border rounded-lg">
              <summary className="p-4 font-semibold cursor-pointer hover:bg-gray-50">
                セリフが覚えられない
              </summary>
              <div className="p-4 pt-0 text-sm">
                <ul className="space-y-2">
                  <li>• キーワードだけ覚えてアドリブOKにする</li>
                  <li>• 相手のセリフの最後を覚える（頭出し）</li>
                  <li>• 動きと一緒に覚える（身体記憶）</li>
                  <li>• カンペを舞台上に隠しておく</li>
                </ul>
              </div>
            </details>

            <details className="border rounded-lg">
              <summary className="p-4 font-semibold cursor-pointer hover:bg-gray-50">
                本番で緊張してしまう
              </summary>
              <div className="p-4 pt-0 text-sm">
                <ul className="space-y-2">
                  <li>• 開演前に全員で円陣を組む</li>
                  <li>• 深呼吸とストレッチを行う</li>
                  <li>• 失敗してもフォローし合う約束をする</li>
                  <li>• 観客を「味方」だと思い込む</li>
                </ul>
              </div>
            </details>
          </div>
        </section>

        {/* 成功の秘訣 */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">
              文化祭演劇・成功の5箇条
            </h2>
            
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">1</span>
                <div>
                  <strong>完璧を求めない</strong>
                  <p className="text-sm text-gray-600 mt-1">プロの舞台ではありません。楽しむことが最優先です。</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">2</span>
                <div>
                  <strong>全員に役割を与える</strong>
                  <p className="text-sm text-gray-600 mt-1">キャストだけでなく、音響・照明・受付まで全員参加で。</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">3</span>
                <div>
                  <strong>観客を意識する</strong>
                  <p className="text-sm text-gray-600 mt-1">内輪ネタは控えめに。誰でも楽しめる演出を。</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">4</span>
                <div>
                  <strong>記録を残す</strong>
                  <p className="text-sm text-gray-600 mt-1">写真・動画は一生の思い出。必ず撮影担当を決めましょう。</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">5</span>
                <div>
                  <strong>終わったら打ち上げ</strong>
                  <p className="text-sm text-gray-600 mt-1">成功も失敗も、みんなで分かち合えば最高の思い出に。</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* おすすめ作品 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            文化祭におすすめの作品
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-bold mb-3">初心者向け（20-30分）</h3>
              <p className="text-sm text-gray-600 mb-4">
                日常会話が中心で、演技初心者でも取り組みやすい作品
              </p>
              <Link href="/?minPlaytime=20&maxPlaytime=30&categories=2" className="text-blue-600 hover:underline">
                コメディ作品を見る →
              </Link>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-bold mb-3">感動系（30-40分）</h3>
              <p className="text-sm text-gray-600 mb-4">
                観客の心に残る、メッセージ性のある作品
              </p>
              <Link href="/?minPlaytime=30&maxPlaytime=40&categories=1" className="text-blue-600 hover:underline">
                ドラマ作品を見る →
              </Link>
            </div>
          </div>
        </section>

        {/* まとめ */}
        <section className="bg-gray-100 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold mb-4">まとめ</h2>
          <p className="mb-4">
            文化祭演劇は、クラスの絆を深める最高の機会です。
            限られた時間と予算の中でも、工夫次第で素晴らしい舞台が作れます。
          </p>
          <p className="mb-6">
            このガイドを参考に、メンバー全員で協力して、
            観客も演者も楽しめる舞台を作り上げてください。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-center">
              作品を探す
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
              <Link href="/guide/beginner/acting-basics" className="text-blue-600 hover:underline">
                → 演技の基礎
              </Link>
            </li>
            <li>
              <Link href="/guide/school/drama-club" className="text-blue-600 hover:underline">
                → 演劇部運営ガイド（準備中）
              </Link>
            </li>
          </ul>
        </section>
      </article>
    </Layout>
  );
}