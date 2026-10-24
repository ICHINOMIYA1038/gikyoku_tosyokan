import * as React from "react";
import { Post as PostType } from "@prisma/client";
import Link from "next/link";
import dynamic from "next/dynamic";
import Layout from "@/components/Layout";
import { PostHero, PostDetails, PostSidebar } from "@/components/PostDetailIntegrated";
import {
  FacebookShareButton,
  HatenaShareButton,
  LineShareButton,
  TwitterShareButton,
  FacebookIcon,
  HatenaIcon,
  LineIcon,
  TwitterIcon,
} from "react-share";
const Comments = dynamic(() => import("@/components/Comments"), { ssr: false, loading: () => <div className="text-xs text-gray-400">読み込み中…</div> });
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import OtherPosts from "@/components/Widget/OtherPosts";
import { useState, useCallback, useEffect } from "react";
import { FaStar, FaShareAlt, FaBook, FaExternalLinkAlt, FaHeart, FaBalanceScale, FaTrophy } from "react-icons/fa";
import ReactionBadge from "@/components/ReactionBadge";
import FavoriteButton from "@/components/FavoriteButton";
import CompareButton from "@/components/CompareButton";
import { prisma } from "@/lib/prisma";
import AdSlot from "@/components/Ad/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";
import AiDescription from "@/components/AiDescription";
import PostBlogMentions from "@/components/PostBlogMentions";
import Breadcrumb from "@/components/Breadcrumb";
import { getBlogPostsMentioningPost } from "@/lib/blog";
// import UserSynopsis from "@/components/UserSynopsis";

// メモ化されたコンポーネント
const MemoizedPostHero = React.memo(PostHero);
const MemoizedPostDetails = React.memo(PostDetails);
const MemoizedPostSidebar = React.memo(PostSidebar);
const MemoizedComments = React.memo(Comments);
const MemoizedOtherPosts = React.memo(OtherPosts);

// Datetimeを指定したフォーマットに変換する関数（JST固定）
function formatDatetime(datetime: any) {
  const date = new Date(datetime);
  const jst = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const year = jst.getFullYear();
  const month = jst.getMonth() + 1;
  const day = jst.getDate();
  const hours = jst.getHours();
  const minutes = jst.getMinutes();

  return `${year}/${month}/${day} ${hours}:${String(minutes).padStart(2, "0")}`;
}

// 全体の h2 の余白と大きさ（globals.css）を打ち消す
const SECTION_TITLE = "!my-0 !pb-0 !text-xl !font-bold !text-gray-900";
const CHIP = "inline-flex items-center h-9 px-3 rounded-full border border-[#D9D5CF] text-gray-800 hover:border-theater-primary-600 hover:text-theater-primary-700";
const GROUP_TYPE_LABELS: Record<string, string> = {
  STUDENT: "学生劇団", INTERCOLLEGE: "インカレ", ACADEMIC: "大学学科",
  AMATEUR: "社会人", PROFESSIONAL: "プロ", YOUTH: "ユース",
};
const VENUE_TYPE_LABELS: Record<string, string> = {
  small: "小劇場", medium: "中劇場", large: "大劇場",
  SMALL: "小劇場", MEDIUM: "中劇場", LARGE: "大劇場",
};

function PostPage({ post, blogMentions }: any) {
  const URL = `https://gikyokutosyokan.com/posts/${post.id}`;
  const QUOTE = `${post.author.name}作「${post.title}」をみんなにおすすめしよう`;
  const [star, setStar] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showShareButtons, setShowShareButtons] = useState(false);
  const [showReadButtons, setShowReadButtons] = useState(false);

  useEffect(() => {
    // 同一セッション内・同一日付では1回のみ記録（Function Invocations削減）
    try {
      const today = new Date().toISOString().split("T")[0];
      const key = `access:${post.id}:${today}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage不可なら通常通り送信
    }
    fetch("/api/record-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id }),
      keepalive: true,
    }).catch(() => {});
  }, [post.id]);

  const handleStarClick = useCallback((value: number) => {
    setStar(value);
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      setError("");
      setSuccess("");
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "POST",
        body: JSON.stringify({ star }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        setSuccess("評価ありがとうございます！");
      } else {
        setError("評価は1日1回までです。");
      }
    } catch (error) {
      setError("評価に失敗しました。");
    }
  }, [post.id, star]);


  const toggleShareButtons = () => {
    setShowShareButtons(!showShareButtons);
  };

  const toggleReadButtons = () => {
    setShowReadButtons(!showReadButtons);
  };

  // Amazonリンクと無料リンクの存在確認
  const hasAmazonLink = !!post.amazon_text_url;
  const hasFreeLink = !!post.link_to_plot;
  const hasKangekiLink = !!post.kangeki_url;
  const hasReadLinks = hasAmazonLink || hasFreeLink || hasKangekiLink;
  const commentCount = post.comments?.length || 0;

  // レビュー型コメントを構造化データ用に抽出
  const reviewComments = (post.comments || [])
    .filter((c: any) => c.commentType === "レビュー" && !c.deleted && c.content)
    .slice(0, 5)
    .map((c: any) => ({
      author: c.author || "名無しさん",
      content: c.content.substring(0, 200),
      date: c.date ? c.date.split(" ")[0]?.replace(/\//g, "-") : undefined,
    }));

  return (
    <>
      <Layout>
        <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .btn-amazon {
          background-color: #ff9900;
          transition: all 0.3s ease;
        }

        .btn-amazon:hover {
          background-color: #e68a00;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .btn-free {
          background-color: #34d399;
          transition: all 0.3s ease;
        }

        .btn-free:hover {
          background-color: #10b981;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        `}</style>

        <Seo
          pageTitle={(() => {
            // モバイルSERPは約30文字で切れる。重要語を前に詰める
            const specs: string[] = [];
            if (post.totalNumber > 0) specs.push(`${post.totalNumber}人`);
            if (post.playtime > 0) specs.push(`${post.playtime}分`);
            const spec = specs.length > 0 ? `（${specs.join('・')}）` : '';
            return `『${post.title}』${spec} ${post.author.name}`;
          })()}
          pageDescription={(() => {
            const head: string[] = [];
            if (post.totalNumber > 0) head.push(`${post.totalNumber}人`);
            if (post.playtime > 0) head.push(`上演時間${post.playtime}分`);
            const prefix = head.length > 0 ? `${head.join('・')}の戯曲。` : '';
            const body = post.synopsis
              ? post.synopsis
              : `${post.author.name}作『${post.title}』のあらすじ・キャスト・上演情報。感想やレビューも掲載。`;
            return prefix + body;
          })()}
          hreflang={[
            { lang: "ja", path: `/posts/${post.id}` },
            { lang: "x-default", path: `/posts/${post.id}` },
          ]}
          descriptionEn={`Japanese theater script "${post.title}" by ${post.author.name}. ${post.playtime > 0 ? `Duration: ${post.playtime} min. ` : ''}${post.totalNumber > 0 ? `Cast: ${post.totalNumber} people.` : ''}`}
          pageImg={
            post.image_url
              ? post.image_url
              : `https://gikyokutosyokan.com/api/og/${post.id}?title=${encodeURIComponent(post.title)}&author=${encodeURIComponent(post.author.name)}${post.playtime > 0 ? `&playtime=${post.playtime}` : ''}${post.totalNumber > 0 ? `&people=${post.totalNumber}` : ''}`
          }
          pageImgWidth={post.image_url ? undefined : 1200}
          pageImgHeight={post.image_url ? undefined : 630}
          pageImgType={post.image_url ? undefined : "image/png"}
          pagePath={`/posts/${post.id}`}
          pageType="article"
          pageKeywords={[
            post.author.name,
            ...(post.categories?.map((c: any) => c.name) || []),
            "上演時間" + post.playtime + "分",
            "人数" + post.totalNumber + "人"
          ]}
        />
        <StructuredData
          type="Play"
          playInfo={{
            title: post.title,
            author: {
              name: post.author.name,
              url: `https://gikyokutosyokan.com/authors/${post.author_id}`
            },
            description: post.synopsis || `${post.author.name}作の戯曲「${post.title}」`,
            url: `https://gikyokutosyokan.com/posts/${post.id}`,
            image: post.image_url,
            duration: post.playtime,
            castSize: {
              man: post.man,
              woman: post.woman,
              others: post.others,
              total: post.totalNumber
            },
            rating: post.averageRating && post._count?.ratings ? {
              ratingValue: post.averageRating,
              ratingCount: post._count.ratings
            } : undefined,
            reviews: reviewComments.length > 0 ? reviewComments : undefined,
            categories: post.categories?.map((cat: any) => cat.name)
          }}
        />
        <StructuredData
          type="BreadcrumbList"
          breadcrumbs={[
            { name: "ホーム", url: "https://gikyokutosyokan.com" },
            { name: "作品一覧", url: "https://gikyokutosyokan.com/posts" },
            { name: post.title, url: `https://gikyokutosyokan.com/posts/${post.id}` }
          ]}
        />
        <StructuredData
          type="FAQPage"
          faqItems={(() => {
            const items: { question: string; answer: string }[] = [];
            if (post.playtime > 0) {
              items.push({
                question: "この作品の上演時間は？",
                answer: `約${post.playtime}分です。`
              });
            }
            if (post.totalNumber > 0) {
              const castParts: string[] = [];
              if (post.man > 0) castParts.push(`男性${post.man}人`);
              if (post.woman > 0) castParts.push(`女性${post.woman}人`);
              if (post.others > 0) castParts.push(`その他${post.others}人`);
              items.push({
                question: "何人で上演できますか？",
                answer: castParts.length > 0
                  ? `${castParts.join('、')}の計${post.totalNumber}人で上演できます。`
                  : `${post.totalNumber}人で上演できます。`
              });
            }
            if (post.categories && post.categories.length > 0) {
              items.push({
                question: "この作品のカテゴリは？",
                answer: `${post.categories.map((c: any) => c.name).join('、')}に分類されています。`
              });
            }
            if (hasAmazonLink || hasFreeLink || hasKangekiLink) {
              const sources: string[] = [];
              if (hasAmazonLink) sources.push('Amazon');
              if (hasFreeLink) sources.push('無料公開ページ');
              if (hasKangekiLink) sources.push('観劇三昧');
              items.push({
                question: "台本はどこで入手できますか？",
                answer: `この作品の台本は${sources.join('、')}で入手できます。詳しくは作品ページ内のリンクをご確認ください。`
              });
            } else {
              items.push({
                question: "台本はどこで入手できますか？",
                answer: "台本の入手方法については、出版社や作者に直接お問い合わせください。"
              });
            }
            items.push({
              question: "著作権使用料はどのくらい？",
              answer: "著作権使用料は作品や上演規模により異なります。一般的には入場無料の公演で5,000円〜20,000円程度が目安です。"
            });
            return items;
          })()}
        />
        <div className="w-full">
          <div className="container mx-auto px-4 py-6 max-w-3xl">

            <Breadcrumb
              items={[
                { name: "ホーム", href: "/" },
                ...(post.categories && post.categories.length > 0
                  ? [{ name: post.categories[0].name, href: `/categories/${post.categories[0].id}` }]
                  : []),
                { name: post.author?.name, href: `/authors/${post.author_id}` },
                { name: post.title },
              ].filter((c) => c.name) as any}
            />

            {/* ヒーロー（常時表示） */}
            <MemoizedPostHero post={post} />

            {post.awards && post.awards.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {post.awards.map((award: any, idx: number) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-[11px] font-bold text-amber-700 rounded">
                    <FaTrophy className="text-amber-500 text-[9px]" />
                    {award.awardName} {award.awardType}（{award.awardYear}年）
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 mt-3 text-gray-400">
              <FavoriteButton postId={post.id} variant="floating" />
              <CompareButton postId={post.id} variant="floating" />
              <a href="#comments-section" className="text-sm text-gray-700 underline underline-offset-4 hover:text-theater-primary-700">
                {commentCount > 0 ? `みんなの声 ${commentCount}件` : "感想を書く"}
              </a>
              <button onClick={toggleShareButtons} className="text-xs hover:text-gray-600 transition-colors" aria-label="共有">
                <FaShareAlt />
              </button>
              {showShareButtons && (
                <div className="flex gap-1" role="group" aria-label="SNS共有">
                  <TwitterShareButton url={URL} title={QUOTE} aria-label="Twitterで共有"><TwitterIcon size={24} round /></TwitterShareButton>
                  <LineShareButton url={URL} title={QUOTE} aria-label="LINEで共有"><LineIcon size={24} round /></LineShareButton>
                  <FacebookShareButton url={URL} quote={QUOTE} aria-label="Facebookで共有"><FacebookIcon size={24} round /></FacebookShareButton>
                  <HatenaShareButton url={URL} title={QUOTE} windowWidth={660} windowHeight={460} aria-label="はてなブックマークに追加"><HatenaIcon size={24} round /></HatenaShareButton>
                </div>
              )}
            </div>

            {/* 本文。タブで隠さず、紹介・みんなの声・上演の記録・関連作品の順に並べる */}
            <div className="mt-8 [&>section]:py-8 [&>section]:border-t [&>section]:border-[#D9D5CF]">
              <section aria-label="作品の紹介" className="space-y-6 !pt-6">
                <MemoizedPostDetails post={post} />
                {post.aiDescription && <AiDescription description={post.aiDescription} />}
              </section>

              <section>
                <MemoizedComments key={post.id} comments={post.comments || []} postid={post.id} postTitle={post.title} inline={true} />
                <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                  <span className="text-gray-700">この作品を評価する</span>
                  <div className="flex items-center" role="group" aria-label="星の数">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button key={value} type="button" onClick={() => handleStarClick(value)} aria-label={`星${value}つ`} aria-pressed={value <= star} className="p-1">
                        <FaStar className={value <= star ? "text-yellow-500 text-lg" : "text-gray-300 text-lg hover:text-yellow-400"} />
                      </button>
                    ))}
                  </div>
                  <button className="h-9 px-3 rounded border border-gray-900 text-gray-900 text-xs font-bold hover:bg-[#F4F2EE] disabled:opacity-40" onClick={handleSubmit} disabled={star === 0}>
                    送る
                  </button>
                  {error && <span role="status" className="text-xs text-theater-primary-700">{error}</span>}
                  {success && <span role="status" className="text-xs text-[#1F7A4D]">{success}</span>}
                </div>
              </section>

              {(post.theaterGroups?.length > 0 || post.performedVenues?.length > 0) && (
                <section>
                  <h2 className={SECTION_TITLE}>上演の記録</h2>
                  {post.theaterGroups?.length > 0 && (
                    <>
                      <h3 className="!mt-5 !mb-2 !text-sm !font-bold !text-gray-700">上演した劇団（{post.theaterGroups.length}）</h3>
                      <ul className="border-t border-[#D9D5CF]">
                        {post.theaterGroups.map((ptg: any) => {
                          const group = ptg.theaterGroup;
                          return (
                            <li key={group.id} className="border-b border-[#D9D5CF]">
                              <Link href={`/theater-groups/${group.slug}`} className="group flex flex-wrap items-baseline gap-x-3 py-3 px-2 hover:bg-[#F4F2EE]">
                                <span className="flex-1 min-w-0 font-serif font-bold text-gray-900 group-hover:text-theater-primary-700">{group.name}</span>
                                <span className="text-sm text-gray-600">
                                  {[GROUP_TYPE_LABELS[group.groupType] || group.groupType, group.prefecture, ptg.performanceYear && `${ptg.performanceYear}年`].filter(Boolean).join("・")}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                  {post.performedVenues?.length > 0 && (
                    <>
                      <h3 className="!mt-6 !mb-2 !text-sm !font-bold !text-gray-700">上演された劇場（{post.performedVenues.length}）</h3>
                      <ul className="border-t border-[#D9D5CF]">
                        {post.performedVenues.map((pv: any) => (
                          <li key={pv.venueId} className="border-b border-[#D9D5CF]">
                            <Link href={`/venues/${pv.venueSlug}`} className="group block py-3 px-2 hover:bg-[#F4F2EE]">
                              <span className="flex flex-wrap items-baseline gap-x-3">
                                <span className="flex-1 min-w-0 font-bold text-gray-900 group-hover:text-theater-primary-700">{pv.venueName}</span>
                                <span className="text-sm text-gray-600">{[pv.prefecture, VENUE_TYPE_LABELS[pv.venueType] || pv.venueType].filter(Boolean).join("・")}</span>
                              </span>
                              {pv.performers?.length > 0 && (
                                <span className="block mt-0.5 text-sm text-gray-600">
                                  {pv.performers.map((p: any) => `${p.name}${p.year ? `（${p.year}年）` : ""}`).join("、")}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <p className="mt-4 text-sm text-gray-700">
                    この作品を上演する予定がありますか。
                    <Link href="/announcements/new" className="ml-1 text-theater-primary-700 underline underline-offset-4">上演告知に載せる</Link>
                  </p>
                </section>
              )}

              {blogMentions && blogMentions.length > 0 && (
                <section>
                  <h2 className={SECTION_TITLE}>この作品が出てくるブログ記事</h2>
                  <div className="mt-4">
                    <PostBlogMentions posts={blogMentions} />
                  </div>
                </section>
              )}

              <section>
                <MemoizedOtherPosts authorId={post.author_id} postId={post.id} authorName={post.author.name} />
                <div className="mt-8">
                  <h2 className="!my-0 !pb-0 !text-base !font-bold !text-gray-900">似た条件の作品を探す</h2>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    {post.categories?.map((c: any) => (
                      <Link key={c.id} href={`/categories/${c.id}`} className={CHIP}>{c.name}</Link>
                    ))}
                    {post.playtime > 0 && (
                      <Link href={`/?minPlaytime=${Math.max(0, post.playtime - 15)}&maxPlaytime=${post.playtime + 15}`} className={CHIP}>
                        {post.playtime}分前後
                      </Link>
                    )}
                    {post.totalNumber > 0 && (
                      <Link href={`/?minTotalCount=${Math.max(0, post.totalNumber - 2)}&maxTotalCount=${post.totalNumber + 2}`} className={CHIP}>
                        {post.totalNumber}人前後
                      </Link>
                    )}
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    劇団を探す：
                    <Link href="/university-theater" className="text-theater-primary-700 hover:underline">大学演劇</Link>
                    <span className="mx-1">・</span>
                    <Link href="/shogekijo" className="text-theater-primary-700 hover:underline">小劇場</Link>
                  </p>
                </div>
              </section>
            </div>

            <AdSlot slot={AD_SLOTS.POST_AFTER_CONTENT} format="horizontal" />
          </div>
          </div>
      </Layout>
    </>
  );
}

export default React.memo(PostPage);

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context: any) {
  const postId = parseInt(context.params.id);
  if (isNaN(postId)) {
    return { notFound: true };
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        content: true,
        synopsis: true,
        image_url: true,
        amazon_text_url: true,
        amazon_img_url: true,
        amazon_img_text_url: true,
        link_to_plot: true,
        website1: true,
        website2: true,
        website3: true,
        ISBN_13: true,
        buy_link: true,
        kangeki_url: true,
        aiDescription: true,
        author_id: true,
        man: true,
        woman: true,
        others: true,
        totalNumber: true,
        playtime: true,
        averageRating: true,
        author: {
          select: {
            id: true,
            name: true,
            group: true,
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
          }
        },
        comments: {
          where: {
            // リアクションはコメントとは別機能なので除外
            OR: [
              { commentType: { not: 'リアクション' } },
              { commentType: null },
            ],
          },
          select: {
            id: true,
            content: true,
            date: true,
            author: true,
            deleted: true,
            post_id: true,
            likes: true,
            commentType: true,
            userId: true,
            user: {
              select: {
                id: true,
                name: true,
                displayName: true,
                image: true,
                avatarUrl: true,
              }
            },
            children: {
              select: {
                id: true,
                content: true,
                date: true,
                author: true,
                deleted: true,
                parentCommentId: true,
                likes: true,
                userId: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  }
                },
              }
            }
          },
          orderBy: {
            date: 'desc'
          },
        },
        theaterGroups: {
          select: {
            sourceUrl: true,
            sourceType: true,
            performanceYear: true,
            venueId: true,
            venue: {
              select: {
                id: true,
                name: true,
                slug: true,
                venueType: true,
                prefecture: true,
              }
            },
            theaterGroup: {
              select: {
                id: true,
                name: true,
                slug: true,
                groupType: true,
                prefecture: true,
              }
            }
          }
        },
        venuePerformances: {
          select: {
            id: true,
            year: true,
            artistName: true,
            theaterGroupId: true,
            theaterGroup: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            },
            venue: {
              select: {
                id: true,
                name: true,
                slug: true,
                venueType: true,
                prefecture: true,
              }
            },
          }
        },
        awards: {
          select: {
            awardName: true,
            awardYear: true,
            awardType: true,
          },
          orderBy: { awardYear: 'asc' }
        },
        _count: {
          select: {
            ratings: true
          }
        }
      }
    });

    if (!post) {
      return { notFound: true };
    }

    // 上演劇場を集約（PostTheaterGroup + VenuePerformance から重複排除）
    const venueMap = new Map<number, {
      venueId: number;
      venueName: string;
      venueSlug: string;
      venueType: string;
      prefecture: string;
      performers: { name: string; year: number | null }[];
    }>();

    // PostTheaterGroup 経由の劇場
    for (const ptg of post.theaterGroups) {
      if (ptg.venue && ptg.venueId) {
        const v = ptg.venue;
        if (!venueMap.has(v.id)) {
          venueMap.set(v.id, {
            venueId: v.id,
            venueName: v.name,
            venueSlug: v.slug,
            venueType: v.venueType,
            prefecture: v.prefecture,
            performers: [],
          });
        }
        const entry = venueMap.get(v.id)!;
        entry.performers.push({
          name: ptg.theaterGroup.name,
          year: ptg.performanceYear,
        });
      }
    }

    // VenuePerformance 経由の劇場
    for (const vp of post.venuePerformances) {
      const v = vp.venue;
      if (!venueMap.has(v.id)) {
        venueMap.set(v.id, {
          venueId: v.id,
          venueName: v.name,
          venueSlug: v.slug,
          venueType: v.venueType,
          prefecture: v.prefecture,
          performers: [],
        });
      }
      const entry = venueMap.get(v.id)!;
      const performerName = vp.theaterGroup?.name || vp.artistName;
      if (performerName) {
        // 重複チェック
        const alreadyExists = entry.performers.some(
          (p) => p.name === performerName && p.year === vp.year
        );
        if (!alreadyExists) {
          entry.performers.push({ name: performerName, year: vp.year });
        }
      }
    }

    const performedVenues = Array.from(venueMap.values());

    // 日時フォーマット変換
    const formattedPost = {
      ...post,
      performedVenues,
      comments: post.comments.map((comment: any) => ({
        ...comment,
        name: comment.author,
        date: formatDatetime(comment.date),
        children: comment.children.map((child: any) => ({
          ...child,
          name: child.author,
          parent_id: child.parentCommentId,
          date: formatDatetime(child.date),
        })),
      })),
    };

    const blogMentions = await getBlogPostsMentioningPost(post.id, 'ja', 5);

    return {
      props: {
        post: formattedPost,
        blogMentions,
      },
      revalidate: 2592000,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return {
      notFound: true,
    };
  }
}
