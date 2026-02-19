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
import { useState, useCallback } from "react";
import { FaStar, FaCommentDots, FaShareAlt, FaBook, FaExternalLinkAlt, FaTheaterMasks, FaHeart, FaBalanceScale, FaTrophy } from "react-icons/fa";
import FavoriteButton from "@/components/FavoriteButton";
import CompareButton from "@/components/CompareButton";
import { prisma } from "@/lib/prisma";

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
          pageTitle={`${post.author.name}『${post.title}』`}
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
        <div className="w-full">
          <div className="container mx-auto px-4 pt-8 pb-12">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* メインカラム */}
              <main className="flex-1 min-w-0">
                {/* 1. ヒーロー */}
                <MemoizedPostHero post={post} />

                {/* 受賞歴バッジ */}
                {post.awards && post.awards.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {post.awards.map((award: any, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-sm font-medium text-amber-800"
                      >
                        <FaTrophy className="text-amber-500 text-xs" />
                        {award.awardName} {award.awardType}（{award.awardYear}年）
                      </span>
                    ))}
                  </div>
                )}

                {/* 2. 読むボタンエリア */}
                {(hasAmazonLink || hasFreeLink) && (
                  <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                  {hasAmazonLink && (
                    <a
                      href={post.amazon_text_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-6 py-3 rounded-lg shadow-md text-white font-bold text-lg w-full sm:w-auto bg-gray-900 hover:bg-gray-800 transition-all hover:-translate-y-0.5"
                    >
                      <FaBook className="mr-2" />
                      この戯曲を読む (Amazon)
                      <FaExternalLinkAlt className="ml-2 text-sm" />
                    </a>
                  )}

                  {hasFreeLink && (
                    <a
                      href={post.link_to_plot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-6 py-3 rounded-lg shadow-md font-bold text-lg w-full sm:w-auto bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-50 transition-all hover:-translate-y-0.5"
                    >
                      <FaBook className="mr-2" />
                      この戯曲を無料で読む
                      <FaExternalLinkAlt className="ml-2 text-sm" />
                    </a>
                  )}

                  {hasKangekiLink && (
                    <a
                      href={post.kangeki_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-6 py-3 rounded-lg shadow-md font-bold text-lg w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white transition-all hover:-translate-y-0.5"
                    >
                      <FaTheaterMasks className="mr-2" />
                      観劇三昧で観る
                      <FaExternalLinkAlt className="ml-2 text-sm" />
                    </a>
                  )}
                  </div>
                )}

                {/* 3. 評価セクション */}
                <div className="mt-6">
                  <div className="bg-white rounded-xl shadow-sm px-4 py-4 md:px-6 md:py-4 border border-gray-100">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                      <span className="text-sm font-bold text-gray-700 whitespace-nowrap">この作品を評価</span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleStarClick(value)}
                            className="p-0.5 hover:scale-110 transition-transform"
                          >
                            <FaStar
                              className={
                                value <= star
                                  ? "text-yellow-500 text-2xl md:text-3xl cursor-pointer"
                                  : "text-gray-300 text-2xl md:text-3xl cursor-pointer hover:text-yellow-300"
                              }
                            />
                          </button>
                        ))}
                      </div>
                      <button
                        className="py-2 px-6 rounded-lg bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-all shadow-sm whitespace-nowrap"
                        onClick={handleSubmit}
                      >
                        送信
                      </button>
                    </div>
                    {(error || success) && (
                      <div className="mt-3 text-center text-sm">
                        {error && <span className="text-red-600">{error}</span>}
                        {success && <span className="text-green-600">{success}</span>}
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. コメントセクション */}
                <div className="mt-6">
                  <div className="bg-pink-50/60 rounded-xl shadow-sm p-4 md:p-6 border border-pink-100">
                    {post.comments && (
                      <MemoizedComments key={post.id} comments={post.comments} postid={post.id} inline={true} />
                    )}
                  </div>
                </div>

                {/* 5. 作品詳細（作品情報、あらすじ、詳細説明、作者について） */}
                <div className="mt-6">
                  <MemoizedPostDetails post={post} />
                </div>

                {/* 6. この脚本を上演した劇団 */}
                {post.theaterGroups && post.theaterGroups.length > 0 && (
                  <div className="mt-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
                      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center text-gray-800 font-serif flex items-center justify-center gap-2">
                        <FaTheaterMasks className="text-pink-500" />
                        この脚本を上演した劇団
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {post.theaterGroups.map((ptg: any) => {
                          const group = ptg.theaterGroup;
                          const typeLabels: Record<string, string> = {
                            STUDENT: '学生劇団', INTERCOLLEGE: 'インカレ', ACADEMIC: '大学学科',
                            AMATEUR: '社会人', PROFESSIONAL: 'プロ', YOUTH: 'ユース',
                          };
                          return (
                            <Link
                              key={group.id}
                              href={`/theater-groups/${group.slug}`}
                              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-pink-200 hover:bg-pink-50/50 transition-all group"
                            >
                              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <FaTheaterMasks className="text-pink-500" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-sm text-gray-800 group-hover:text-pink-700 truncate">
                                  {group.name}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span>{typeLabels[group.groupType] || group.groupType}</span>
                                  {group.prefecture && <span>{group.prefecture}</span>}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. 関連作品 */}
                <div className="mt-6">
                  <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 lg:p-10 border border-gray-100">
                    <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-gray-800 font-serif">
                      関連作品
                    </h2>
                    <MemoizedOtherPosts
                      authorId={post.author_id}
                      postId={post.id}
                      authorName={post.author.name}
                    />
                  </div>
                </div>

                {/* 7. 劇団データベースへの誘導 */}
                <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <FaTheaterMasks className="text-gray-500" />
                    <h3 className="font-bold text-sm text-gray-700">劇団を探す</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    この脚本を上演する劇団をお探しですか？全国の劇団情報を検索できます。
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/university-theater"
                      className="text-xs text-pink-600 hover:text-pink-800 font-medium transition-colors"
                    >
                      大学演劇データベース →
                    </Link>
                    <Link
                      href="/shogekijo"
                      className="text-xs text-orange-600 hover:text-orange-800 font-medium transition-colors"
                    >
                      小劇場データベース →
                    </Link>
                  </div>
                </div>
              </main>

              {/* サイドバー */}
              <MemoizedPostSidebar post={post} />
            </div>
          </div>

            {/* 固定ボタンエリア */}
            <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end space-y-3">
              {/* 読むボタンメニュー */}
              {hasReadLinks && showReadButtons && (
                <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-200 flex flex-col space-y-2 mb-2 animate-fadeIn relative w-48">
                  {hasAmazonLink && (
                    <a
                      href={post.amazon_text_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-3 rounded-lg text-gray-800 hover:bg-gray-50 font-bold text-sm transition-colors border border-gray-200"
                    >
                      <FaBook className="mr-3 text-gray-400" />
                      Amazonで読む
                    </a>
                  )}

                  {hasFreeLink && (
                    <a
                      href={post.link_to_plot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-3 rounded-lg text-gray-800 hover:bg-gray-50 font-bold text-sm transition-colors border border-gray-200"
                    >
                      <FaBook className="mr-3 text-gray-400" />
                      無料で読む
                    </a>
                  )}

                  {hasKangekiLink && (
                    <a
                      href={post.kangeki_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-3 rounded-lg text-gray-800 hover:bg-gray-50 font-bold text-sm transition-colors border border-gray-200"
                    >
                      <FaTheaterMasks className="mr-3 text-red-400" />
                      観劇三昧で観る
                    </a>
                  )}
                </div>
              )}

              {/* SNSシェアボタン */}
              {showShareButtons && (
                <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-100 flex space-x-3 mb-2 animate-fadeIn relative">
                  <FacebookShareButton url={URL} quote={QUOTE}>
                    <FacebookIcon size={40} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={URL} title={QUOTE}>
                    <TwitterIcon size={40} round />
                  </TwitterShareButton>
                  <LineShareButton url={URL} title={QUOTE}>
                    <LineIcon size={40} round />
                  </LineShareButton>
                  <HatenaShareButton
                    url={URL}
                    title={QUOTE}
                    windowWidth={660}
                    windowHeight={460}
                  >
                    <HatenaIcon size={40} round />
                  </HatenaShareButton>
                </div>
              )}

              {/* フローティングアクションボタン群 */}
              <div className="flex flex-col gap-3">
                {/* お気に入りボタン */}
                <FavoriteButton postId={post.id} variant="floating" />

                {/* 比較ボタン */}
                <CompareButton postId={post.id} variant="floating" />

                {/* 読むボタン */}
                {hasReadLinks && (
                  <button
                    className="bg-gray-900 hover:bg-gray-800 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                    onClick={toggleReadButtons}
                    aria-label="この戯曲を読む"
                  >
                    {showReadButtons ? <FaExternalLinkAlt className="text-xl" /> : <FaBook className="text-xl" />}
                  </button>
                )}

                {/* シェアボタン */}
                <button
                  className="bg-gray-800 hover:bg-gray-900 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                  onClick={toggleShareButtons}
                  aria-label="記事を共有"
                >
                  <FaShareAlt className="text-lg" />
                </button>

                {/* コメントボタン（スクロール先へ） */}
                <button
                  className="bg-pink-600 hover:bg-pink-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 relative"
                  onClick={scrollToComments}
                  aria-label="コメントへ移動"
                >
                  <FaCommentDots className="text-lg" />
                  {commentCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                      {commentCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
      </Layout>
    </>
  );
}

export default React.memo(PostPage);

export async function getServerSideProps(context: any) {
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
          select: {
            id: true,
            content: true,
            date: true,
            author: true,
            deleted: true,
            post_id: true,
            likes: true,
            commentType: true,
            children: {
              select: {
                id: true,
                content: true,
                date: true,
                author: true,
                deleted: true,
                parentCommentId: true,
                likes: true,
              }
            }
          },
          orderBy: {
            date: 'desc'
          },
        },
        theaterGroups: {
          select: {
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

    // アクセスログを非同期で記録
    const ipAddress =
      context.req.headers["x-real-ip"] ||
      context.req.headers["x-forwarded-for"] ||
      context.req.connection.remoteAddress;

    recordAccessOptimized(ipAddress, postId).catch(console.error);

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
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return {
      notFound: true,
    };
  }
}

// 最適化されたアクセスログ記録関数
async function recordAccessOptimized(ipAddress: string, postId: number) {
  try {
    const currentDate = new Date();
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    const existingAccess = await prisma.access.findFirst({
      where: {
        ipAddress: ipAddress,
        postId: postId,
        date: date,
      },
    });

    if (!existingAccess) {
      await prisma.access.create({
        data: {
          ipAddress,
          postId,
          date,
        },
      });
    }
  } catch (error) {
    console.error("Failed to record access:", error);
  }
}
