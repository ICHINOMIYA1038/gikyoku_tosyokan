import Layout from "@/components/Layout";
import ResponsiveSearchForm from "@/components/ResponsiveSearchForm";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { prisma } from "@/lib/prisma";
import NewsList from "@/components/NewsList";
import TopImage from "@/components/TopImage"
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import ContentSection from "@/components/ContentSection";
import SearchResults from "@/components/SearchResults";
import FAQ from "@/components/FAQ";
import Link from "next/link";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import RecentComments from "@/components/RecentComments";
import TrendingPosts from "@/components/TrendingPosts";
import AdSlot from "@/components/Ad/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";
import OptimizedImage from "@/components/OptimizedImage";

export default function Home({ news, authors, posts, categories, blogPosts, trendingPosts, announcements }: any) {
  const [data, setData] = useState<any>(null); // 取得したデータを格納
  const [page, setPage] = useState(1);
  const [sort_by, setSortIndex] = useState<number>(2);
  const [sortDirection, setSortDirection] = useState<number>(1);
  const searchFormRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const handleScrollToRegistrationForm = () => {
    if (searchFormRef.current) {
      searchFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // FAQデータ
  const faqItems = [
    {
      question: "戯曲図書館は無料で使えますか？",
      answer: "はい、戯曲図書館の検索機能は完全無料でご利用いただけます。作品の詳細情報、上演時間、必要な人数などすべての情報を無料で閲覧できます。ただし、実際の脚本については著作権の関係で、各出版社や作者のサイトでご購入いただく必要があります。"
    },
    {
      question: "文化祭に適した30分程度の脚本はありますか？",
      answer: "はい、多数ご用意しています。上演時間を「30分以内」で検索していただくと、文化祭に最適な短編作品が見つかります。人数や難易度でも絞り込めるので、クラスの状況に合わせて選べます。"
    },
    {
      question: "少人数（2-3人）でできる脚本を探しています",
      answer: "少人数向けの作品も豊富に掲載しています。検索フォームで「総人数」を2-3人に設定して検索してください。二人芝居や三人芝居など、少人数でも見応えのある作品が見つかります。"
    },
    {
      question: "脚本の著作権使用料はどのくらいかかりますか？",
      answer: "著作権使用料は作品や上演規模によって異なります。一般的には入場無料の学校公演で5,000円〜20,000円程度、有料公演の場合は売上の10%程度が目安です。詳細は各作品の出版社にお問い合わせください。"
    },
    {
      question: "初心者でも演じやすい脚本はどれですか？",
      answer: "日常会話が中心で、感情表現がわかりやすい現代劇がおすすめです。カテゴリーから「コメディ」や「青春」を選んでいただくと、初心者でも取り組みやすい作品が見つかります。"
    }
  ];

  return (
    <>
      <Layout>
        <Seo
          pageDescription={
            "戯曲図書館は、演劇の脚本を上演時間・人数・ジャンルで検索できる日本最大級の戯曲検索サービスです。文化祭・学園祭の台本探し、劇団の次回公演の脚本選びに。レビューや上演報告も共有できます。"
          }
          pageImg={"https://gikyokutosyokan.com/logo.png"}
          pagePath="/"
        />
        <StructuredData
          type="WebSite"
          title="戯曲図書館"
          description="戯曲図書館は、演劇の脚本を上演時間・人数・ジャンルで検索できる日本最大級の戯曲検索サービスです。レビューや上演報告も共有できます。"
          url="https://gikyokutosyokan.com"
        />
        <StructuredData type="Organization" />
        <StructuredData type="FAQPage" faqItems={faqItems} />
        {trendingPosts && trendingPosts.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "注目の戯曲",
                "itemListElement": trendingPosts.slice(0, 20).map((p: any, i: number) => ({
                  "@type": "ListItem",
                  "position": i + 1,
                  "url": `https://gikyokutosyokan.com/posts/${p.id}`,
                  "name": p.title,
                })),
              }),
            }}
          />
        )}
        <TopImage buttonClick={handleScrollToRegistrationForm} />

        {/* モバイル常時表示キーワード検索バー */}
        <div className="sm:hidden max-w-6xl mx-auto px-3 pt-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const q = String(fd.get("q") || "").trim();
              if (q) router.push(`/?keyword=${encodeURIComponent(q)}`);
              handleScrollToRegistrationForm();
            }}
            className="flex gap-2"
            role="search"
          >
            <input
              type="search"
              name="q"
              placeholder="タイトル・作者・キーワードで検索"
              className="flex-1 min-h-[44px] px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-300"
              aria-label="戯曲を検索"
            />
            <button
              type="submit"
              className="min-h-[44px] px-4 bg-theater-primary-500 text-white text-sm font-bold rounded-lg active:bg-theater-primary-600"
            >
              検索
            </button>
          </form>
        </div>

        <NewsList news={news} />

        {/* モバイル向けクイック導線（PCではsm:hidden） */}
        <div className="sm:hidden max-w-6xl mx-auto px-3 pt-3">
          <p className="text-xs font-bold text-gray-500 mb-2">目的から探す</p>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/lp/school-festival" className="flex items-center justify-center min-h-[52px] px-3 py-3 bg-theater-primary-500 text-white text-sm font-bold rounded-lg shadow-sm active:bg-theater-primary-600">
              文化祭の脚本
            </Link>
            <Link href="/lp/two-person-plays" className="flex items-center justify-center min-h-[52px] px-3 py-3 bg-white border border-theater-primary-300 text-theater-primary-700 text-sm font-bold rounded-lg shadow-sm active:bg-theater-primary-50">
              2人で上演
            </Link>
            <Link href="/search/short-plays" className="flex items-center justify-center min-h-[52px] px-3 py-3 bg-white border border-theater-primary-300 text-theater-primary-700 text-sm font-bold rounded-lg shadow-sm active:bg-theater-primary-50">
              短編（30分以内）
            </Link>
            <Link href="/lp/free-scripts" className="flex items-center justify-center min-h-[52px] px-3 py-3 bg-white border border-theater-primary-300 text-theater-primary-700 text-sm font-bold rounded-lg shadow-sm active:bg-theater-primary-50">
              無料で読める
            </Link>
          </div>
        </div>

        {/* エチュードメーカー プロモーションバナー (横長, com.gikyokutosyokan.etude) */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <a
            href="https://apps.apple.com/us/app/%E3%82%A8%E3%83%81%E3%83%A5%E3%83%BC%E3%83%89%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC/id6794500656"
            target="_blank"
            rel="noopener noreferrer"
            className="block cursor-pointer hover:opacity-90 transition-opacity"
            aria-label="エチュードメーカー - 即興演劇のお題をワンタップで生成するiOSアプリ"
          >
            <OptimizedImage
              src="https://gikyokutosyokan-public.s3.ap-northeast-1.amazonaws.com/assets/banners/etude-wide.png"
              alt="エチュードメーカー - 即興演劇のお題をワンタップで生成"
              width={970}
              height={250}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </a>
        </div>

        {/* TOMOSHIBI小屋 プロモーションバナー (横長) */}
        <div className="max-w-6xl mx-auto px-4 pb-6">
          <a
            href="https://tomoshibi.gikyokutosyokan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block cursor-pointer hover:opacity-90 transition-opacity"
            aria-label="TOMOSHIBI小屋 - ブラウザで動く舞台照明シミュレーター"
          >
            <div className="relative w-full overflow-hidden rounded-lg shadow-md border border-amber-900/30 bg-gradient-to-br from-[#1a1208] via-[#2a1a10] to-[#3a2a18] aspect-[970/250]">
              {/* 背景のスポット光 */}
              <div className="absolute inset-0 opacity-70 pointer-events-none">
                <div className="absolute top-0 left-[15%] w-48 h-full -rotate-12 bg-gradient-to-b from-amber-200/40 via-amber-300/20 to-transparent blur-md" />
                <div className="absolute top-0 left-[40%] w-32 h-full bg-gradient-to-b from-yellow-100/40 via-amber-200/20 to-transparent blur-sm" />
                <div className="absolute top-0 right-[20%] w-40 h-full rotate-12 bg-gradient-to-b from-orange-200/30 via-orange-300/15 to-transparent blur-md" />
              </div>
              <div className="relative h-full flex items-center justify-center text-center px-6">
                <div>
                  <div className="text-amber-300 text-3xl mb-1" aria-hidden>✦</div>
                  <div className="text-amber-50 font-serif text-3xl md:text-4xl tracking-wide">
                    TOMOSHIBI<span className="text-amber-200 text-xl md:text-2xl ml-2">小屋</span>
                  </div>
                  <div className="mt-2 text-amber-200/80 text-sm md:text-base tracking-wider">
                    舞台に灯をともす、ちいさな小屋
                  </div>
                  <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-amber-900/40 border border-amber-700/40 text-amber-100 text-xs md:text-sm">
                    ブラウザで舞台照明をデザイン・プレビュー・共有
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* 今週の人気作品 */}
        <TrendingPosts posts={trendingPosts} />

        {/* 広告: トレンド後 */}
        <div className="max-w-6xl mx-auto px-4">
          <AdSlot slot={AD_SLOTS.HOME_AFTER_TRENDING} format="horizontal" />
        </div>

        {/* 人気の検索 - クイックフィルタチップ */}
        <section className="max-w-6xl mx-auto px-4 py-4">
          <h2 className="text-sm font-bold text-gray-600 mb-3">🔥 人気の検索条件</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link href="/?maxPlaytime=30" className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-theater-primary-700 hover:bg-theater-primary-50 hover:border-theater-primary-300 transition-colors">
              30分以内の短編
            </Link>
            <Link href="/?minTotalCount=2&maxTotalCount=5" className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-theater-primary-700 hover:bg-theater-primary-50 hover:border-theater-primary-300 transition-colors">
              2〜5人の少人数
            </Link>
            <Link href="/?minTotalCount=2&maxTotalCount=2" className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-theater-primary-700 hover:bg-theater-primary-50 hover:border-theater-primary-300 transition-colors">
              二人芝居
            </Link>
            <Link href="/?minTotalCount=1&maxTotalCount=1" className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-theater-primary-700 hover:bg-theater-primary-50 hover:border-theater-primary-300 transition-colors">
              一人芝居
            </Link>
            <Link href="/?maxMaleCount=0" className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-theater-primary-700 hover:bg-theater-primary-50 hover:border-theater-primary-300 transition-colors">
              女性のみ
            </Link>
            <Link href="/categories/4" className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-theater-primary-700 hover:bg-theater-primary-50 hover:border-theater-primary-300 transition-colors">
              無料で読める
            </Link>
            <Link href="/categories/14" className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-theater-primary-700 hover:bg-theater-primary-50 hover:border-theater-primary-300 transition-colors">
              コメディ
            </Link>
            <Link href="/categories/11" className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-theater-primary-700 hover:bg-theater-primary-50 hover:border-theater-primary-300 transition-colors">
              ヒューマンドラマ
            </Link>
            <Link href="/categories/1" className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-theater-primary-700 hover:bg-theater-primary-50 hover:border-theater-primary-300 transition-colors">
              岸田國士戯曲賞
            </Link>
          </div>
        </section>

        <div
          className="lg:flex relative box-border"
          id="registration-form"
          ref={searchFormRef}
        >
          <div className="mx-3 my-3 md:m-5 lg:w-1/2 lg:sticky lg:top-24">
            <ResponsiveSearchForm
              setData={setData}
              page={page}
              setPage={setPage}
              sort_by={sort_by}
              sortDirection={sortDirection}
              onSearch={handleScrollToRegistrationForm}
            />
          </div>
          <div className="lg:w-2/3 flex flex-col gap-3 mx-3 my-3 md:m-5">
            <SearchResults
              data={data}
              sort_by={sort_by}
              setSortIndex={setSortIndex}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              setPage={setPage}
            />
          </div>
        </div>
        
        {/* みんなの声（最新コメント） */}
        <RecentComments />

        {/* 広告: コンテンツ中間 */}
        <div className="max-w-6xl mx-auto px-4">
          <AdSlot slot={AD_SLOTS.HOME_MID_CONTENT} format="horizontal" />
        </div>

        {/* 最新の記事 */}
        <LatestBlogPosts posts={blogPosts} />

        {/* 最新の上演告知 */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
              {"\uD83D\uDCE2"} 最新の上演告知
            </h2>
            {announcements && announcements.length > 0 ? (
              <>
                <div className="grid md:grid-cols-3 gap-5">
                  {announcements.map((a: any) => (
                    <Link key={a.id} href={`/announcements/${a.id}`} className="block group">
                      <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-theater-primary-600 transition-colors line-clamp-2">
                          {a.title}
                        </h3>
                        {a.theaterGroupName && (
                          <p className="text-sm text-theater-primary-700 mb-1">{a.theaterGroupName}</p>
                        )}
                        {a.performanceDate && (
                          <p className="text-sm text-gray-600 mb-1">{"\uD83D\uDCC5"} {a.performanceDate}</p>
                        )}
                        {a.venue && (
                          <p className="text-sm text-gray-600">{"\uD83D\uDCCD"} {a.venue}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Link href="/announcements" className="inline-block bg-theater-primary-500 text-white px-6 py-3 rounded-lg hover:bg-theater-primary-600 transition-colors font-bold">
                    もっと見る →
                  </Link>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 mb-4">公演情報を投稿しませんか？</p>
                <Link href="/announcements/new" className="inline-block bg-theater-primary-500 text-white px-6 py-3 rounded-lg hover:bg-theater-primary-600 transition-colors font-bold">
                  告知を投稿する →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ガイドセクション */}
        <section className="bg-gray-50 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
              演劇を始める方へのガイド
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              <Link href="/guide/beginner/how-to-choose-script" className="block">
                <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold mb-3">脚本の選び方</h3>
                  <p className="text-gray-600 mb-3">
                    上演時間、人数、難易度から最適な脚本を選ぶポイントを解説
                  </p>
                  <span className="text-blue-600 hover:underline">詳しく見る →</span>
                </div>
              </Link>
              
              <Link href="/guide/school/culture-festival" className="block">
                <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold mb-3">文化祭演劇ガイド</h3>
                  <p className="text-gray-600 mb-3">
                    限られた時間と予算で成功させるための実践的アドバイス
                  </p>
                  <span className="text-blue-600 hover:underline">詳しく見る →</span>
                </div>
              </Link>
              
              <Link href="/guide/beginner/acting-basics" className="block">
                <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold mb-3">演技の基礎</h3>
                  <p className="text-gray-600 mb-3">
                    初心者でもできる演技力向上のトレーニング方法
                  </p>
                  <span className="text-blue-600 hover:underline">詳しく見る →</span>
                </div>
              </Link>
            </div>
            
            <div className="text-center mt-6">
              <Link href="/guide" className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700">
                すべてのガイドを見る →
              </Link>
            </div>
          </div>
        </section>

        {/* 劇団データベースセクション */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
              劇団データベース
            </h2>
            <p className="text-gray-600 text-center mb-6 text-sm">
              全国の劇団・演劇団体の情報を検索できます
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/university-theater" className="block group">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">🎓</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-theater-primary-700 transition-colors">大学演劇データベース</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    全国の大学学生劇団・演劇サークルを地図から検索。大学別・地域別に探せます。
                  </p>
                  <span className="text-sm text-theater-primary-600 font-medium">詳しく見る →</span>
                </div>
              </Link>
              <Link href="/shogekijo" className="block group">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-5 rounded-xl border border-orange-100 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">🎭</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-700 transition-colors">小劇場データベース</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    プロ劇団・アマチュア劇団・ユース劇団など、全国の小劇場・演劇団体を検索できます。
                  </p>
                  <span className="text-sm text-orange-600 font-medium">詳しく見る →</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* 戯曲賞・劇場データベースセクション */}
        <section className="bg-gray-50 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
              もっと演劇を知る
            </h2>
            <p className="text-gray-600 text-center mb-6 text-sm">
              戯曲賞の受賞作品や全国の劇場情報を調べられます
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/awards" className="block group">
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-5 rounded-xl border border-yellow-100 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">{"\uD83C\uDFC6"}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-yellow-700 transition-colors">戯曲賞データベース</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    岸田國士戯曲賞、鶴屋南北戯曲賞など主要な戯曲賞の受賞作品・最終候補作を一覧で検索できます。
                  </p>
                  <span className="text-sm text-yellow-700 font-medium">受賞作品を見る {"\u2192"}</span>
                </div>
              </Link>
              <Link href="/venues" className="block group">
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-5 rounded-xl border border-teal-100 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">{"\uD83C\uDFED"}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-700 transition-colors">劇場データベース</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    全国の劇場・ホールの座席数、アクセス、設備情報を検索。公演会場選びに役立ちます。
                  </p>
                  <span className="text-sm text-teal-700 font-medium">劇場を探す {"\u2192"}</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <ContentSection posts={posts} authors={authors} categories={categories} />
        
        {/* FAQセクション */}
        <FAQ items={faqItems} />
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  let formattedNews = [];
  let authors = [];
  let posts = [];
  let categories = [];
  let blogPosts: any[] = [];
  let trendingPosts: any[] = [];
  let announcements: any[] = [];

  try {
    // 並列でデータを取得（最適化）
    const [newsData, authorsData, postsData, categoriesData, blogData, trendingData, announcementsData] = await Promise.all([
      // ニュースは最新10件のみ
      prisma.news.findMany({
        take: 10,
        orderBy: { date: 'desc' },
        select: {
          id: true,
          date: true,
          url: true,
          category: true,
          title: true,
        },
      }),
      // 作者は必要最小限のフィールドのみ、最大50件
      prisma.author.findMany({
        take: 50,
        select: {
          id: true,
          name: true,
          group: true,
        },
        orderBy: { name: 'asc' },
      }),
      // 人気の投稿を20件のみ取得
      prisma.post.findMany({
        take: 20,
        select: {
          id: true,
          title: true,
          image_url: true,
          averageRating: true,
          playtime: true,
          totalNumber: true,
          man: true,
          woman: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: [
          { averageRating: 'desc' },
          { id: 'desc' },
        ],
      }),
      // カテゴリは基本情報のみ
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          image_url: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
      // ブログ記事（最新3件）
      prisma.blogPost.findMany({
        where: { published: true, language: "ja" },
        take: 3,
        orderBy: { publishedAt: 'desc' },
        select: {
          slug: true,
          title: true,
          description: true,
          publishedAt: true,
          tags: true,
        },
      }),
      // 注目作品（直近7日間のアクセス数ベース上位5作品）
      prisma.$queryRaw`
        SELECT a."postId", COUNT(*) as access_count
        FROM "Access" a
        WHERE a."date" >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY a."postId"
        ORDER BY access_count DESC
        LIMIT 5
      ` as Promise<Array<{ postId: number; access_count: bigint }>>,
      // 最新の上演告知3件
      prisma.announcement.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          performanceDate: true,
          venue: true,
          theaterGroupName: true,
        },
      }),
    ]);

    // 日付データの変換
    formattedNews = newsData.map((item) => ({
      ...item,
      date: item.date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

    authors = authorsData;
    posts = postsData;
    categories = categoriesData;

    // ブログ記事の日付フォーマット
    blogPosts = blogData.map((bp) => ({
      ...bp,
      publishedAt: bp.publishedAt.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

    // 上演告知の日付フォーマット
    announcements = announcementsData.map((a) => ({
      ...a,
      performanceDate: a.performanceDate
        ? a.performanceDate.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : null,
    }));

    // 注目作品の詳細取得
    const trendingRaw = trendingData as Array<{ postId: number; access_count: bigint }>;
    const trendingIds = trendingRaw.map((t) => t.postId);
    if (trendingIds.length > 0) {
      const accessCountMap = Object.fromEntries(
        trendingRaw.map((t) => [t.postId, Number(t.access_count)])
      );
      const trendingPostsData = await prisma.post.findMany({
        where: { id: { in: trendingIds } },
        select: {
          id: true,
          title: true,
          image_url: true,
          playtime: true,
          totalNumber: true,
          man: true,
          woman: true,
          averageRating: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      // 元の順序（アクセス数順）を維持し、アクセス数を付与
      trendingPosts = trendingIds
        .map((id) => {
          const post = trendingPostsData.find((p) => p.id === id);
          if (!post) return null;
          return { ...post, accessCount: accessCountMap[id] || 0 };
        })
        .filter(Boolean);
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    return {
      props: {
        news: [],
        authors: [],
        posts: [],
        categories: [],
        blogPosts: [],
        trendingPosts: [],
        announcements: [],
      },
      revalidate: 604800,
    };
  }

  return {
    props: {
      news: formattedNews,
      authors,
      posts,
      categories,
      blogPosts,
      trendingPosts,
      announcements,
    },
    revalidate: 604800,
  };
}
