import BlogLayout from "@/components/BlogLayout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { FaUsers, FaClock, FaTheaterMasks, FaLightbulb } from "react-icons/fa";

export default function HowToChooseScript() {
  const breadcrumbs = [
    { name: 'ガイド', url: '/guide' },
    { name: '初心者向け', url: '/guide#beginner' },
    { name: '脚本の選び方' }
  ];

  return (
    <BlogLayout 
      breadcrumbs={breadcrumbs}
      category="guide"
      currentPath="/guide/beginner/how-to-choose-script"
    >
      <Seo
        pageTitle="演劇脚本の選び方完全ガイド | 上演成功のための5つのポイント"
        pageDescription="文化祭や演劇部の公演で失敗しない脚本選びのコツを解説。上演時間、人数、難易度など、具体的な選定基準を演劇経験者が詳しく説明します。"
        pagePath="/guide/beginner/how-to-choose-script"
        pageType="article"
      />
      <StructuredData
        type="Article"
        title="演劇脚本の選び方完全ガイド"
        description="上演成功のための脚本選定方法を詳しく解説"
        url="https://gikyokutosyokan.com/guide/beginner/how-to-choose-script"
        datePublished="2024-01-01"
        dateModified="2024-01-01"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "ガイド", url: "https://gikyokutosyokan.com/guide" },
          { name: "初心者向け", url: "https://gikyokutosyokan.com/guide/beginner" },
          { name: "脚本の選び方", url: "https://gikyokutosyokan.com/guide/beginner/how-to-choose-script" }
        ]}
      />
      
      <div>
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            演劇脚本の選び方完全ガイド
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            上演成功のための5つのポイント
          </p>
          <div className="flex items-center text-sm text-gray-500 gap-4">
            <span>更新日: 2024年1月1日</span>
            <span>読了時間: 約8分</span>
          </div>
        </header>

        <nav className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">目次</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li><a href="#step1" className="text-blue-600 hover:underline">上演条件を明確にする</a></li>
            <li><a href="#step2" className="text-blue-600 hover:underline">キャストの実力を把握する</a></li>
            <li><a href="#step3" className="text-blue-600 hover:underline">観客層を考慮する</a></li>
            <li><a href="#step4" className="text-blue-600 hover:underline">予算と制作期間を確認する</a></li>
            <li><a href="#step5" className="text-blue-600 hover:underline">脚本の試し読みをする</a></li>
          </ol>
        </nav>

        <section className="mb-12">
          <p className="text-lg leading-relaxed mb-6">
            演劇の成功は、適切な脚本選びから始まります。
            このガイドでは、文化祭や演劇部の公演、市民劇団の上演まで、
            あらゆる場面で活用できる脚本選びのポイントを解説します。
          </p>
        </section>

        <section id="step1" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaClock className="mr-2 text-blue-500" />
            1. 上演条件を明確にする
          </h2>
          
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-3">確認すべき条件</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <div>
                  <strong>上演時間</strong>: 
                  準備・撤収時間を含めた持ち時間から逆算
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <div>
                  <strong>会場の広さ</strong>: 
                  舞台のサイズ、客席数、音響・照明設備
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <div>
                  <strong>上演日程</strong>: 
                  練習期間、リハーサル回数
                </div>
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mb-3">時間別おすすめ作品</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Link href="/?minPlaytime=0&maxPlaytime=30" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h4 className="font-bold mb-2">30分以内</h4>
              <p className="text-sm text-gray-600">文化祭・短編公演向け</p>
            </Link>
            <Link href="/?minPlaytime=30&maxPlaytime=60" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h4 className="font-bold mb-2">30-60分</h4>
              <p className="text-sm text-gray-600">標準的な公演向け</p>
            </Link>
            <Link href="/?minPlaytime=60&maxPlaytime=120" className="block p-4 border rounded-lg hover:bg-gray-50">
              <h4 className="font-bold mb-2">60分以上</h4>
              <p className="text-sm text-gray-600">本格公演向け</p>
            </Link>
          </div>
        </section>

        <section id="step2" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaUsers className="mr-2 text-green-500" />
            2. キャストの実力を把握する
          </h2>
          
          <h3 className="text-xl font-semibold mb-3">人数構成のチェック</h3>
          <table className="w-full border mb-6">
            <thead className="bg-gray-50">
              <tr>
                <th className="border p-2 text-left">人数</th>
                <th className="border p-2 text-left">特徴</th>
                <th className="border p-2 text-left">おすすめ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">1-3人</td>
                <td className="border p-2">密度の高い演技が必要</td>
                <td className="border p-2">
                  <Link href="/?minTotalCount=1&maxTotalCount=3" className="text-blue-600 hover:underline">
                    少人数作品を探す
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="border p-2">4-8人</td>
                <td className="border p-2">バランスが取りやすい</td>
                <td className="border p-2">
                  <Link href="/?minTotalCount=4&maxTotalCount=8" className="text-blue-600 hover:underline">
                    中人数作品を探す
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="border p-2">9人以上</td>
                <td className="border p-2">演出の工夫が必要</td>
                <td className="border p-2">
                  <Link href="/?minTotalCount=9&maxTotalCount=20" className="text-blue-600 hover:underline">
                    大人数作品を探す
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">
              <FaLightbulb className="inline mr-2" />
              経験レベル別の選び方
            </h3>
            <ul className="space-y-3">
              <li>
                <strong>初心者中心</strong>: 
                日常会話が多く、感情表現がわかりやすい作品
              </li>
              <li>
                <strong>経験者混在</strong>: 
                主役と脇役の差がはっきりした作品
              </li>
              <li>
                <strong>上級者向け</strong>: 
                心理描写が深く、演技力が試される作品
              </li>
            </ul>
          </div>
        </section>

        <section id="step3" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaTheaterMasks className="mr-2 text-purple-500" />
            3. 観客層を考慮する
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="border p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">学生向け</h3>
              <ul className="space-y-2 text-sm">
                <li>• 共感しやすいテーマ</li>
                <li>• テンポの良い展開</li>
                <li>• 笑いの要素</li>
              </ul>
              <Link href="/categories/2" className="inline-block mt-4 text-blue-600 hover:underline">
                コメディ作品を見る →
              </Link>
            </div>
            
            <div className="border p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">一般向け</h3>
              <ul className="space-y-2 text-sm">
                <li>• 普遍的なテーマ</li>
                <li>• 世代を超えた共感</li>
                <li>• 感動的な要素</li>
              </ul>
              <Link href="/categories/1" className="inline-block mt-4 text-blue-600 hover:underline">
                ドラマ作品を見る →
              </Link>
            </div>
          </div>
        </section>

        <section id="step4" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            4. 予算と制作期間を確認する
          </h2>
          
          <h3 className="text-xl font-semibold mb-3">必要な準備期間の目安</h3>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <span className="font-bold mr-2">1ヶ月:</span>
              <span>20分以内の短編、経験者中心</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2ヶ月:</span>
              <span>30-45分の中編、標準的な難易度</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3ヶ月以上:</span>
              <span>60分以上の長編、初心者を含む</span>
            </li>
          </ul>
        </section>

        <section id="step5" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            5. 脚本の試し読みをする
          </h2>
          
          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-3">読み合わせのポイント</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>主要キャストで実際に読み合わせ</li>
              <li>セリフの言いやすさをチェック</li>
              <li>場面転換の実現可能性を確認</li>
              <li>必要な小道具・衣装をリストアップ</li>
              <li>全員が作品を理解し、共感できるか確認</li>
            </ol>
          </div>
        </section>

        <section className="bg-gray-100 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold mb-4">まとめ</h2>
          <p className="mb-4">
            適切な脚本選びは、上演の成功への第一歩です。
            条件を整理し、メンバーの実力を把握し、観客のことを考えて選びましょう。
          </p>
          <p className="mb-6">
            戯曲図書館では、これらの条件で簡単に作品を検索できます。
            ぜひ、あなたの公演にぴったりの作品を見つけてください。
          </p>
          <Link href="/" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
            作品を探す →
          </Link>
        </section>

        <section className="border-t pt-8">
          <h2 className="text-xl font-bold mb-4">関連記事</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/guide/beginner/reading-script" className="text-blue-600 hover:underline">
                → 脚本の読み方・分析方法（準備中）
              </Link>
            </li>
            <li>
              <Link href="/guide/beginner/acting-basics" className="text-blue-600 hover:underline">
                → 演技の基礎
              </Link>
            </li>
            <li>
              <Link href="/guide/school/culture-festival" className="text-blue-600 hover:underline">
                → 文化祭演劇を成功させるコツ
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </BlogLayout>
  );
}