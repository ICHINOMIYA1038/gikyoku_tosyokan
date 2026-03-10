import * as React from "react";
import { useState, useMemo } from "react";
import { PrismaClient, Author as AuthorType } from "@prisma/client";
import Layout from "@/components/Layout";
import PostCardSmall from "@/components/PostCardSmall";
import Seo from "@/components/seo";
import CustomMarkdown from "@/components/CustomMarkdown";
import Link from "next/link";
import { FaTheaterMasks, FaBook, FaTag, FaClock, FaUsers, FaFilter, FaSearch, FaChevronRight } from "react-icons/fa";
const prisma = new PrismaClient();

// カテゴリごとのSEO最適化コンテンツ
const categoryDescriptions: { [key: string]: { intro: string; keywords: string[]; relatedSearches: string[] } } = {
  "コメディ": {
    intro: "【厳選】文化祭・学園祭で盛り上がるコメディ脚本を多数掲載。初心者でも演じやすく、観客を笑顔にできる台本が見つかります。上演時間・人数で絞り込み検索も可能。",
    keywords: ["お笑い", "喜劇", "ユーモア", "爆笑", "文化祭コメディ"],
    relatedSearches: ["短編コメディ", "少人数コメディ", "学園コメディ", "30分コメディ"]
  },
  "シリアス": {
    intro: "【厳選】泣ける演劇台本をお探しの方へ。感動的なストーリーで観客の心を動かすシリアス脚本を厳選。高校演劇や小劇場の公演で実績のある作品を掲載中。",
    keywords: ["感動", "ドラマ", "泣ける", "社会派", "ヒューマンドラマ"],
    relatedSearches: ["泣ける脚本", "感動系", "社会問題", "戦争と平和"]
  },
  "青春": {
    intro: "【厳選】高校演劇・文化祭にぴったりの青春脚本を掲載。学生生活・恋愛・友情をテーマに、同世代が共感できる台本を上演時間・人数別に検索できます。",
    keywords: ["学園", "恋愛", "友情", "部活", "高校演劇"],
    relatedSearches: ["高校生向け", "恋愛もの", "部活動", "卒業"]
  },
  "ファンタジー": {
    intro: "【厳選】舞台映えするファンタジー脚本を掲載。魔法・冒険・異世界を舞台にした演劇台本で、演出の工夫が楽しめる作品を厳選しました。",
    keywords: ["魔法", "冒険", "異世界", "童話", "メルヘン"],
    relatedSearches: ["ファンタジー演劇", "童話劇", "冒険活劇", "魔法もの"]
  },
  "ミステリー": {
    intro: "【厳選】観客を最後まで引き込むミステリー脚本を掲載。謎解き・サスペンス系の演劇台本で、緊張感のある舞台を作りたい方に最適。",
    keywords: ["推理", "サスペンス", "謎解き", "探偵", "事件"],
    relatedSearches: ["推理劇", "サスペンス演劇", "探偵もの", "密室劇"]
  }
};

function CategoryPage({ category }: any) {
  const postCount = category.posts?.length || 0;
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [filterByTime, setFilterByTime] = useState("all");
  const [filterByPeople, setFilterByPeople] = useState("all");

  // カテゴリー別の説明文を取得
  const categoryInfo = categoryDescriptions[category.name] || {
    intro: `${category.name}ジャンルの演劇脚本・台本を厳選掲載。文化祭・学園祭・高校演劇に最適な作品を上演時間・人数で検索できます。`,
    keywords: [],
    relatedSearches: []
  };

  // 作品のフィルタリングとソート
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = category.posts || [];

    // 検索フィルター
    if (searchQuery) {
      filtered = filtered.filter((post: any) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 上演時間フィルター
    if (filterByTime !== "all") {
      filtered = filtered.filter((post: any) => {
        if (filterByTime === "short" && post.playtime <= 30) return true;
        if (filterByTime === "medium" && post.playtime > 30 && post.playtime <= 60) return true;
        if (filterByTime === "long" && post.playtime > 60) return true;
        return false;
      });
    }

    // 人数フィルター
    if (filterByPeople !== "all") {
      filtered = filtered.filter((post: any) => {
        if (filterByPeople === "small" && post.totalNumber <= 5) return true;
        if (filterByPeople === "medium" && post.totalNumber > 5 && post.totalNumber <= 10) return true;
        if (filterByPeople === "large" && post.totalNumber > 10) return true;
        return false;
      });
    }

    // ソート
    filtered.sort((a: any, b: any) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "playtime") return a.playtime - b.playtime;
      if (sortBy === "people") return a.totalNumber - b.totalNumber;
      return 0;
    });

    return filtered;
  }, [category.posts, searchQuery, sortBy, filterByTime, filterByPeople]);

  // 統計情報の計算
  const stats = useMemo(() => {
    const posts = category.posts || [];
    const playtimes = posts.map((p: any) => p.playtime).filter((t: number) => t > 0);
    const people = posts.map((p: any) => p.totalNumber).filter((n: number) => n > 0);
    
    return {
      avgPlaytime: playtimes.length > 0 ? Math.round(playtimes.reduce((a: number, b: number) => a + b, 0) / playtimes.length) : 0,
      minPeople: people.length > 0 ? Math.min(...people) : 0,
      maxPeople: people.length > 0 ? Math.max(...people) : 0,
      shortPlays: posts.filter((p: any) => p.playtime > 0 && p.playtime <= 30).length,
      mediumPlays: posts.filter((p: any) => p.playtime > 30 && p.playtime <= 60).length,
      longPlays: posts.filter((p: any) => p.playtime > 60).length
    };
  }, [category.posts]);

  // 構造化データ
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name}の演劇脚本集`,
    "description": categoryInfo.intro,
    "url": `https://gikyokutosyokan.com/categories/${category.id}`,
    "numberOfItems": postCount,
    "hasPart": category.posts?.map((post: any) => ({
      "@type": "CreativeWork",
      "name": post.title,
      "author": {
        "@type": "Person",
        "name": post.author.name
      },
      "timeRequired": `PT${post.playtime}M`
    }))
  };

  // パンくずリスト構造化データ
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "ホーム",
        "item": "https://gikyokutosyokan.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "カテゴリー",
        "item": "https://gikyokutosyokan.com/categories"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": category.name,
        "item": `https://gikyokutosyokan.com/categories/${category.id}`
      }
    ]
  };

  return (
    <>
      <Seo
        pageTitle={`${category.name}の演劇脚本おすすめ${postCount}選｜無料台本あり`}
        pageDescription={`${category.name}の演劇台本${postCount}作品を厳選掲載。上演時間${stats.avgPlaytime}分平均、${stats.minPeople}〜${stats.maxPeople}人対応。文化祭・学園祭・高校演劇に最適な脚本を人数・時間で検索。無料台本もあり。`}
        pagePath={`/categories/${category.id}`}
        pageImg={category.image_url || "https://gikyokutosyokan.com/logo.png"}
      />
      
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      
      <Layout ishead="true">
        <div className="min-h-screen bg-gradient-to-b from-theater-neutral-50 to-white">
          {/* パンくずリスト */}
          <nav className="bg-white border-b">
            <div className="max-w-6xl mx-auto px-4 py-2">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link href="/" className="text-theater-primary-600 hover:text-theater-primary-700">
                    ホーム
                  </Link>
                </li>
                <FaChevronRight className="text-theater-neutral-400 text-xs" />
                <li>
                  <Link href="/categories" className="text-theater-primary-600 hover:text-theater-primary-700">
                    カテゴリー
                  </Link>
                </li>
                <FaChevronRight className="text-theater-neutral-400 text-xs" />
                <li className="text-theater-neutral-700 font-medium">{category.name}</li>
              </ol>
            </div>
          </nav>

          {/* ヒーローセクション */}
          <div className="bg-gradient-to-r from-theater-primary-100 to-theater-primary-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <FaTag className="text-3xl text-theater-primary-500" />
                <h1 className="text-3xl md:text-4xl font-bold text-theater-neutral-900">
                  {category.name}の演劇脚本
                </h1>
              </div>
              
              <p className="text-lg text-theater-neutral-700 mb-6 max-w-3xl">
                {categoryInfo.intro}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-3 text-center">
                  <FaBook className="text-2xl text-theater-primary-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-theater-neutral-900">{postCount}</div>
                  <div className="text-sm text-theater-neutral-600">作品数</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <FaClock className="text-2xl text-theater-secondary-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-theater-neutral-900">{stats.avgPlaytime}分</div>
                  <div className="text-sm text-theater-neutral-600">平均上演時間</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <FaUsers className="text-2xl text-theater-accent-blue mx-auto mb-1" />
                  <div className="text-2xl font-bold text-theater-neutral-900">{stats.minPeople}-{stats.maxPeople}人</div>
                  <div className="text-sm text-theater-neutral-600">必要人数</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <FaTheaterMasks className="text-2xl text-theater-accent-purple mx-auto mb-1" />
                  <div className="text-2xl font-bold text-theater-neutral-900">{category.name}</div>
                  <div className="text-sm text-theater-neutral-600">ジャンル</div>
                </div>
              </div>

              {/* キーワードタグ */}
              {categoryInfo.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categoryInfo.keywords.map((keyword: string) => (
                    <span key={keyword} className="px-3 py-1 bg-white/80 rounded-full text-sm text-theater-neutral-700">
                      #{keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* カテゴリー説明 */}
            {(category.image_url || category.contentMarkdown) && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                {category.image_url && (
                  <div className="mb-6">
                    <img 
                      src={category.image_url} 
                      alt={`${category.name}演劇のイメージ`} 
                      className="w-full h-64 object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>
                )}
                
                {category.contentMarkdown && (
                  <div className="prose prose-lg max-w-none">
                    <CustomMarkdown content={category.contentMarkdown} />
                  </div>
                )}
              </div>
            )}

            {/* 検索・フィルター */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaFilter className="text-theater-primary-500" />
                作品を絞り込む
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">キーワード検索</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="作品名・作者名"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-2 pl-8 border rounded-lg focus:border-theater-primary-400"
                    />
                    <FaSearch className="absolute left-2 top-3 text-theater-neutral-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">並び順</label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:border-theater-primary-400"
                  >
                    <option value="title">タイトル順</option>
                    <option value="playtime">上演時間順</option>
                    <option value="people">人数順</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">上演時間</label>
                  <select 
                    value={filterByTime}
                    onChange={(e) => setFilterByTime(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:border-theater-primary-400"
                  >
                    <option value="all">すべて</option>
                    <option value="short">〜30分 ({stats.shortPlays}作品)</option>
                    <option value="medium">30〜60分 ({stats.mediumPlays}作品)</option>
                    <option value="long">60分〜 ({stats.longPlays}作品)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">必要人数</label>
                  <select 
                    value={filterByPeople}
                    onChange={(e) => setFilterByPeople(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:border-theater-primary-400"
                  >
                    <option value="all">すべて</option>
                    <option value="small">少人数（〜5人）</option>
                    <option value="medium">中人数（6〜10人）</option>
                    <option value="large">大人数（11人〜）</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 作品一覧セクション */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-theater-neutral-900">
                  {searchQuery || filterByTime !== "all" || filterByPeople !== "all" 
                    ? `検索結果（${filteredAndSortedPosts.length}作品）`
                    : `${category.name}作品一覧`
                  }
                </h2>
                <span className="text-sm text-theater-neutral-600">
                  全{postCount}作品中{filteredAndSortedPosts.length}作品表示
                </span>
              </div>

              {filteredAndSortedPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
                  {filteredAndSortedPosts.map((post: any) => (
                    <PostCardSmall post={post} key={post.id} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaTheaterMasks className="text-6xl text-theater-neutral-300 mx-auto mb-4" />
                  <p className="text-theater-neutral-600 mb-4">
                    {searchQuery 
                      ? `「${searchQuery}」に一致する作品が見つかりませんでした`
                      : "条件に一致する作品が見つかりませんでした"
                    }
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterByTime("all");
                      setFilterByPeople("all");
                    }}
                    className="text-theater-primary-600 hover:text-theater-primary-700 underline"
                  >
                    フィルターをリセット
                  </button>
                </div>
              )}
            </div>

            {/* 関連検索キーワード */}
            {categoryInfo.relatedSearches.length > 0 && (
              <div className="bg-theater-neutral-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold mb-4 text-theater-neutral-900">
                  🔍 関連する検索キーワード
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categoryInfo.relatedSearches.map((search: string) => (
                    <Link
                      key={search}
                      href={`/?q=${encodeURIComponent(search)}`}
                      className="px-4 py-2 bg-white hover:bg-theater-primary-50 rounded-lg text-theater-primary-600 hover:text-theater-primary-700 transition-colors"
                    >
                      {search}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* SEO用コンテンツ */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-theater-secondary-50 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-theater-neutral-900">
                  📚 {category.name}作品の特徴
                </h3>
                <div className="space-y-2 text-theater-neutral-700 text-sm">
                  <p>• 上演時間：{stats.shortPlays > 0 && `短編（30分以内）${stats.shortPlays}作品`}</p>
                  <p>• 　　　　　{stats.mediumPlays > 0 && `中編（30-60分）${stats.mediumPlays}作品`}</p>
                  <p>• 　　　　　{stats.longPlays > 0 && `長編（60分以上）${stats.longPlays}作品`}</p>
                  <p>• 必要人数：{stats.minPeople}人から{stats.maxPeople}人まで幅広く対応</p>
                  <p>• 平均上演時間：約{stats.avgPlaytime}分</p>
                </div>
              </div>
              
              <div className="bg-theater-primary-50 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-theater-neutral-900">
                  💡 {category.name}を上演する際のポイント
                </h3>
                <div className="space-y-2 text-theater-neutral-700 text-sm">
                  <p>• 観客層に合わせた作品選びが重要です</p>
                  <p>• 練習期間と上演時間のバランスを考慮しましょう</p>
                  <p>• キャストの人数と実力に合った脚本を選びましょう</p>
                  <p>• 舞台装置や衣装の準備も計画的に</p>
                </div>
              </div>
            </div>

            {/* FAQ セクション */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-6 text-theater-neutral-900">
                よくある質問 - {category.name}作品について
              </h3>
              
              <div className="space-y-4">
                <details className="border-b pb-4">
                  <summary className="font-bold cursor-pointer text-theater-neutral-800 hover:text-theater-primary-600">
                    {category.name}作品は初心者でも演じられますか？
                  </summary>
                  <p className="mt-3 text-theater-neutral-700">
                    作品によって難易度は異なりますが、多くの作品で初心者向けのものをご用意しています。
                    各作品の詳細ページで、必要な演技レベルや上演のポイントをご確認ください。
                  </p>
                </details>
                
                <details className="border-b pb-4">
                  <summary className="font-bold cursor-pointer text-theater-neutral-800 hover:text-theater-primary-600">
                    上演料はかかりますか？
                  </summary>
                  <p className="mt-3 text-theater-neutral-700">
                    作品により異なります。無料で上演できる作品もありますが、多くの作品では著作権料が必要です。
                    詳細は各作品ページまたは出版社にお問い合わせください。
                  </p>
                </details>
                
                <details className="border-b pb-4">
                  <summary className="font-bold cursor-pointer text-theater-neutral-800 hover:text-theater-primary-600">
                    台本はどこで入手できますか？
                  </summary>
                  <p className="mt-3 text-theater-neutral-700">
                    各作品の詳細ページに、台本の入手方法を記載しています。
                    Amazon、出版社サイト、無料ダウンロードなど、作品によって入手方法が異なります。
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default CategoryPage;

export async function getStaticPaths() {
  const categories = await prisma.category.findMany({
    select: { id: true },
  });
  return {
    paths: categories.map((c: { id: number }) => ({ params: { id: String(c.id) } })),
    fallback: false,
  };
}

export async function getStaticProps(context: any) {
  const categoryid = parseInt(context.params.id);
  if (isNaN(categoryid)) {
    return {
      notFound: true,
    };
  }
  
  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryid },
      select: {
        id: true,
        name: true,
        image_url: true,
        contentMarkdown: true,
        posts: {
          select: {
            id: true,
            title: true,
            synopsis: true,
            image_url: true,
            man: true,
            woman: true,
            totalNumber: true,
            playtime: true,
            averageRating: true,
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
        },
      },
    });

    if (!category) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        category,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}