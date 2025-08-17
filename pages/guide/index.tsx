import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { FaSchool, FaTheaterMasks, FaUserGraduate, FaBook, FaClock, FaUsers } from "react-icons/fa";

export default function GuideIndex() {
  const guides = {
    beginner: {
      title: "初心者向けガイド",
      icon: <FaUserGraduate className="text-4xl text-green-500" />,
      description: "演劇を始めたばかりの方へ",
      items: [
        {
          title: "脚本の選び方",
          description: "上演条件に合った脚本選びのポイント",
          href: "/guide/beginner/how-to-choose-script",
          available: true
        },
        {
          title: "演技の基礎",
          description: "発声・発音から感情表現まで",
          href: "/guide/beginner/acting-basics",
          available: true
        },
        {
          title: "脚本の読み方",
          description: "ト書きの理解と台詞の分析方法",
          href: "/guide/beginner/reading-script",
          available: false
        }
      ]
    },
    school: {
      title: "学校演劇ガイド",
      icon: <FaSchool className="text-4xl text-blue-500" />,
      description: "文化祭・部活動での上演に",
      items: [
        {
          title: "文化祭演劇ガイド",
          description: "限られた時間と予算で成功させるコツ",
          href: "/guide/school/culture-festival",
          available: true
        },
        {
          title: "演劇部運営ガイド",
          description: "年間スケジュールと部員管理",
          href: "/guide/school/drama-club",
          available: false
        },
        {
          title: "新入生勧誘公演",
          description: "新入部員を増やす公演の作り方",
          href: "/guide/school/recruitment",
          available: false
        }
      ]
    },
    advanced: {
      title: "上級者向けガイド",
      icon: <FaTheaterMasks className="text-4xl text-purple-500" />,
      description: "より深い演劇表現を目指す方へ",
      items: [
        {
          title: "演出の技法",
          description: "空間演出と演技指導のポイント",
          href: "/guide/advanced/directing",
          available: false
        },
        {
          title: "脚本の翻案・潤色",
          description: "原作を現代風にアレンジする方法",
          href: "/guide/advanced/adaptation",
          available: false
        },
        {
          title: "舞台美術・照明",
          description: "効果的な視覚演出の作り方",
          href: "/guide/advanced/stage-design",
          available: false
        }
      ]
    }
  };

  return (
    <Layout>
      <Seo
        pageTitle="演劇ガイド一覧 | 初心者から上級者まで"
        pageDescription="演劇の始め方から文化祭での上演、演技の基礎まで。戯曲図書館が提供する実践的な演劇ガイド集。"
        pagePath="/guide"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "ガイド", url: "https://gikyokutosyokan.com/guide" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            演劇ガイド
          </h1>
          <p className="text-lg text-gray-600">
            初心者から上級者まで、演劇に関する実践的なガイドをご用意しています
          </p>
        </header>

        {/* クイックアクセス */}
        <section className="bg-blue-50 p-6 rounded-lg mb-12">
          <h2 className="text-xl font-bold mb-4">人気のガイド</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/guide/beginner/how-to-choose-script" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-2">
                <FaBook className="text-blue-500 mr-2" />
                <span className="font-semibold">脚本の選び方</span>
              </div>
              <p className="text-sm text-gray-600">初めての脚本選びで失敗しないために</p>
            </Link>
            
            <Link href="/guide/school/culture-festival" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-2">
                <FaClock className="text-green-500 mr-2" />
                <span className="font-semibold">文化祭演劇ガイド</span>
              </div>
              <p className="text-sm text-gray-600">限られた時間で最高の舞台を</p>
            </Link>
            
            <Link href="/guide/beginner/acting-basics" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-2">
                <FaUsers className="text-purple-500 mr-2" />
                <span className="font-semibold">演技の基礎</span>
              </div>
              <p className="text-sm text-gray-600">発声から感情表現まで</p>
            </Link>
          </div>
        </section>

        {/* カテゴリー別ガイド */}
        <div className="space-y-12">
          {Object.entries(guides).map(([key, category]) => (
            <section key={key} className="border-t pt-8 first:border-0 first:pt-0">
              <div className="flex items-start mb-6">
                <div className="mr-4">{category.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{category.title}</h2>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {category.items.map((item, index) => (
                  <div key={index}>
                    {item.available ? (
                      <Link href={item.href} className="block h-full">
                        <div className="border rounded-lg p-6 h-full hover:shadow-lg transition-shadow hover:border-blue-300">
                          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                          <span className="text-blue-600 text-sm hover:underline">
                            詳しく見る →
                          </span>
                        </div>
                      </Link>
                    ) : (
                      <div className="border rounded-lg p-6 h-full bg-gray-50 opacity-60">
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        <span className="text-gray-400 text-sm">準備中</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <section className="bg-gray-100 p-8 rounded-lg mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">作品をお探しですか？</h2>
          <p className="mb-6">
            ガイドを参考に、あなたの条件に合った作品を探してみましょう
          </p>
          <Link href="/" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
            作品を検索する
          </Link>
        </section>
      </div>
    </Layout>
  );
}