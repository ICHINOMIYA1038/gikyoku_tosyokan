import * as React from "react";
import { Post as PostType } from "@prisma/client";
import Link from "next/link";
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
import Comments from "@/components/Comments";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import OtherPosts from "@/components/Widget/OtherPosts";
import { useState, useCallback, useEffect } from "react";
import { FaStar, FaCommentDots, FaShareAlt, FaBook, FaExternalLinkAlt, FaTheaterMasks, FaHeart, FaBalanceScale, FaTrophy } from "react-icons/fa";
import QuickReactions from "@/components/QuickReactions";
import ReactionBadge from "@/components/ReactionBadge";
import FavoriteButton from "@/components/FavoriteButton";
import CompareButton from "@/components/CompareButton";
import { prisma } from "@/lib/prisma";
import AdSlot from "@/components/Ad/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";
import AiDescription from "@/components/AiDescription";
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

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

function PostPage({ post }: any) {
  const URL = `https://gikyokutosyokan.com/posts/${post.id}`;
  const QUOTE = `${post.author.name}作「${post.title}」をみんなにおすすめしよう`;
  const [star, setStar] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showShareButtons, setShowShareButtons] = useState(false);
  const [showReadButtons, setShowReadButtons] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "community" | "related">("overview");

  useEffect(() => {
    fetch("/api/record-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id }),
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

  const scrollToComments = () => {
    const el = document.getElementById("comments-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
            const parts: string[] = [`『${post.title}』あらすじ`];
            if (post.playtime > 0) parts.push(`上演時間${post.playtime}分`);
            if (post.totalNumber > 0) parts.push(`${post.totalNumber}人`);
            const optimized = parts.join('・') + ' | 戯曲図書館';
            return optimized;
          })()}
          pageDescription={
            post.synopsis
              ? post.synopsis
              : "上演する脚本を探しの方に。上演時間や人数などから検索ができます。戯曲を探す、戯曲図書館。"
          }
          pageImg={
            post.image_url
              ? post.image_url
              : "https://gikyokutosyokan.com/logo.png"
          }
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
              <button onClick={toggleShareButtons} className="text-xs hover:text-gray-600 transition-colors" aria-label="共有">
                <FaShareAlt />
              </button>
              {showShareButtons && (
                <div className="flex gap-1">
                  <TwitterShareButton url={URL} title={QUOTE}><TwitterIcon size={24} round /></TwitterShareButton>
                  <LineShareButton url={URL} title={QUOTE}><LineIcon size={24} round /></LineShareButton>
                  <FacebookShareButton url={URL} quote={QUOTE}><FacebookIcon size={24} round /></FacebookShareButton>
                  <HatenaShareButton url={URL} title={QUOTE} windowWidth={660} windowHeight={460}><HatenaIcon size={24} round /></HatenaShareButton>
                </div>
              )}
            </div>

            {/* タブナビゲーション */}
            <nav className="flex gap-0 mt-6 border-b border-gray-200">
              {([
                { key: "overview" as const, label: "概要" },
                { key: "community" as const, label: `みんなの声${commentCount > 0 ? `(${commentCount})` : ""}` },
                { key: "related" as const, label: "関連情報" },
              ]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2.5 text-sm font-bold transition-colors relative
                    ${activeTab === tab.key
                      ? "text-theater-primary-600"
                      : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-theater-primary-500" />
                  )}
                </button>
              ))}
            </nav>

            {/* タブコンテンツ */}
            <div className="py-6">

              {/* ━━━ 概要タブ ━━━ */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <MemoizedPostDetails post={post} />

                  {!post.synopsis && post.aiDescription && (
                    <AiDescription description={post.aiDescription} />
                  )}

                  {/* ユーザー投稿概要（一旦OFF）
                  <UserSynopsis postId={post.id} />
                  */}

                  <AdSlot slot={AD_SLOTS.POST_AFTER_CONTENT} format="horizontal" />
                </div>
              )}

              {/* ━━━ みんなの声タブ ━━━ */}
              {activeTab === "community" && (
                <div className="space-y-6" id="comments-section">
                  <QuickReactions postId={post.id} />

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">評価する</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button key={value} type="button" onClick={() => handleStarClick(value)} className="hover:scale-110 transition-transform">
                          <FaStar className={value <= star ? "text-yellow-400 text-lg" : "text-gray-200 text-lg hover:text-yellow-300"} />
                        </button>
                      ))}
                    </div>
                    <button className="py-1 px-3 bg-gray-800 text-white font-bold text-xs rounded hover:bg-gray-700 transition-colors" onClick={handleSubmit}>送信</button>
                    {error && <span className="text-xs text-red-600">{error}</span>}
                    {success && <span className="text-xs text-green-600">{success}</span>}
                  </div>

                  <MemoizedComments key={post.id} comments={post.comments || []} postid={post.id} postTitle={post.title} inline={true} />
                </div>
              )}

              {/* ━━━ 関連情報タブ ━━━ */}
              {activeTab === "related" && (
                <div className="space-y-8">
                  {post.theaterGroups && post.theaterGroups.length > 0 && (
                    <div>
                      <h2 className="text-base font-bold text-gray-900 mb-3">この脚本を上演した劇団（{post.theaterGroups.length}）</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {post.theaterGroups.map((ptg: any) => {
                          const group = ptg.theaterGroup;
                          const typeLabels: Record<string, string> = {
                            STUDENT: '学生劇団', INTERCOLLEGE: 'インカレ', ACADEMIC: '大学学科',
                            AMATEUR: '社会人', PROFESSIONAL: 'プロ', YOUTH: 'ユース',
                          };
                          return (
                            <Link key={group.id} href={`/theater-groups/${group.slug}`}
                              className="flex items-center gap-2.5 p-2.5 rounded hover:bg-gray-50 transition-colors group">
                              <div className="w-8 h-8 bg-theater-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <FaTheaterMasks className="text-theater-primary-500 text-xs" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-sm text-gray-800 group-hover:text-theater-primary-600 truncate">{group.name}</p>
                                <p className="text-[11px] text-gray-400">
                                  {typeLabels[group.groupType] || group.groupType}
                                  {group.prefecture && ` · ${group.prefecture}`}
                                  {ptg.performanceYear && ` · ${ptg.performanceYear}年`}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div>
                    <h2 className="text-base font-bold text-gray-900 mb-3">関連作品</h2>
                    <MemoizedOtherPosts authorId={post.author_id} postId={post.id} authorName={post.author.name} />
                  </div>

                  <p className="text-sm text-gray-400">
                    劇団を探す:
                    <Link href="/university-theater" className="text-theater-primary-600 hover:underline ml-1">大学演劇</Link>
                    <span className="mx-1">·</span>
                    <Link href="/shogekijo" className="text-theater-primary-600 hover:underline">小劇場</Link>
                  </p>
                </div>
              )}
            </div>
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

    // 日時フォーマット変換
    const formattedPost = {
      ...post,
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

    return {
      props: {
        post: formattedPost,
      },
      revalidate: 86400,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return {
      notFound: true,
    };
  }
}
