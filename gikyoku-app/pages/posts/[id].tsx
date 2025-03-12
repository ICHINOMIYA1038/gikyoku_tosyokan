import * as React from "react";
import { PrismaClient, Post as PostType } from "@prisma/client";
import Layout from "@/components/Layout";
import PostDetail from "@/components/PostDetail";
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
import OtherPosts from "@/components/Widget/OtherPosts";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCommentDots, faTimes } from "@fortawesome/free-solid-svg-icons";

const prisma = new PrismaClient();

// Datetimeを指定したフォーマットに変換する関数
function formatDatetime(datetime: any) {
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

function PostPage({ post }: any) {
  const URL = `https://gikyokutosyokan.com/posts/${post.id}`;
  const QUOTE = `${post.author.name}作「${post.title}」をみんなにおすすめしよう`;
  const [star, setStar] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showComments, setShowComments] = useState(false);
  const commentsRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  const handleStarChange = (event: any) => {
    setStar(event.target.value);
  };

  const handleStarClick = (value: React.SetStateAction<number>) => {
    // クリックした星の値を設定
    setStar(value);
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setSuccess("");
      // 評価を投稿
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
        // エラーハンドリング
        setError("評価は1日1回までです。");
        console.error("Error submitting rating");
      }
    } catch (error) {
      setError("評価に失敗しました。");
      console.error("Error submitting rating:", error);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  // ウィンドウサイズを監視して、デスクトップかモバイルかを判定
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024); // 1024px以上をデスクトップとみなす
    };

    // 初期チェック
    checkIfDesktop();

    // リサイズイベントのリスナーを追加
    window.addEventListener('resize', checkIfDesktop);

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', checkIfDesktop);
    };
  }, []);

  const handleSwipe = (e: React.TouchEvent) => {
    // モバイルの場合のみスワイプ処理を有効にする
    if (isDesktop) return;

    const touch = e.touches[0];
    const startY = touch.clientY;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const moveTouch = moveEvent.touches[0];
      const moveY = moveTouch.clientY;

      if (startY < moveY) {
        setShowComments(false);
        document.removeEventListener("touchmove", handleTouchMove);
      }
    };

    document.addEventListener("touchmove", handleTouchMove);
  };

  return (
    <>
      <Layout>
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
        />
        <div className="container mx-auto px-4">
          <div className={`relative mx-auto max-w-xl ${isDesktop && showComments ? 'lg:max-w-3xl lg:grid lg:grid-cols-2 lg:gap-8' : ''}`}>
            {/* 記事コンテンツ */}
            <div className={`${isDesktop && showComments ? 'lg:col-span-1' : ''}`}>
              <div className="md:flex gap-1 flex-col md:fixed md:mr-20 max-w-md mx-auto">
                <FacebookShareButton url={URL} quote={QUOTE}>
                  <FacebookIcon size={48} round />
                </FacebookShareButton>
                <TwitterShareButton url={URL} title={QUOTE}>
                  <TwitterIcon size={48} round />
                </TwitterShareButton>
                <LineShareButton url={URL} title={QUOTE}>
                  <LineIcon size={48} round />
                </LineShareButton>
                <HatenaShareButton
                  url={URL}
                  title={QUOTE}
                  windowWidth={660}
                  windowHeight={460}
                >
                  <HatenaIcon size={48} round />
                </HatenaShareButton>
              </div>
              <div className="px-2 md:p-0">
                <PostDetail post={post} />
              </div>
              <div className="px-4 py-4 items-center max-w-md mx-auto flex bg-white shadow-lg my-4 rounded-lg">
                <div>
                  <label className="text-sm font-bold">
                    あなたの声を聞かせてください!
                  </label>
                  <div className="flex items-center mt-2 justify-center">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <span key={value}>
                        <FontAwesomeIcon
                          icon={faStar}
                          className={
                            value <= star
                              ? "text-yellow-500 text-xl"
                              : "text-gray-300 text-xl"
                          }
                          onClick={() => handleStarClick(value)}
                        />
                      </span>
                    ))}
                    <button
                      className="ml-2 py-1 px-3 rounded-md bg-blue-500 text-white text-sm"
                      onClick={handleSubmit}
                    >
                      評価を送信
                    </button>
                  </div>
                  <div className="mt-2">
                    {error && <p className="text-red-600">{error}</p>}
                    {success && <p className="text-green-600">{success}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-center max-w-md mx-auto">
                <OtherPosts
                  authorId={post.author_id}
                  postId={post.id}
                  authorName={post.author.name}
                />
              </div>
            </div>

            {/* コメントセクション - デスクトップ */}
            {isDesktop && showComments && (
              <div className="lg:col-span-1 bg-white rounded-lg shadow-lg overflow-y-auto max-h-screen sticky top-0">
                <div className="sticky top-0 bg-white p-2 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold">コメント</h2>
                  <button
                    className="text-gray-500 hover:text-gray-700 p-2"
                    onClick={toggleComments}
                    aria-label="コメントを閉じる"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <div className="p-4">
                  {post.comments && (
                    <Comments comments={post.comments} postid={post.id} />
                  )}
                </div>
              </div>
            )}

            {/* コメントボタン - モバイルでのみ右下に固定表示 */}
            {!isDesktop && (
              <div className="fixed bottom-4 right-4 z-50">
                <button
                  className="bg-blue-500 text-white p-3 rounded-full shadow-lg"
                  onClick={toggleComments}
                >
                  <FontAwesomeIcon icon={faCommentDots} size="lg" />
                </button>
              </div>
            )}

            {/* デスクトップでは常に表示するコメントボタン */}
            {isDesktop && !showComments && (
              <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50">
                <button
                  className="bg-blue-500 text-white p-3 rounded-lg shadow-lg flex items-center"
                  onClick={toggleComments}
                >
                  <FontAwesomeIcon icon={faCommentDots} size="lg" />
                  <span className="ml-2">コメントを表示</span>
                </button>
              </div>
            )}

            {/* コメントセクション - モバイル */}
            {!isDesktop && showComments && (
              <div
                className="fixed bottom-0 left-0 right-0 h-1/2 bg-white shadow-lg overflow-y-auto z-40"
                ref={commentsRef}
                onTouchStart={handleSwipe}
              >
                <div className="p-4">
                  {post.comments && (
                    <Comments comments={post.comments} postid={post.id} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
export default PostPage;

export async function getServerSideProps(context: any) {
  const postId = parseInt(context.params.id);
  if (isNaN(postId)) {
    return {
      notFound: true, // Return a 404 page for non-numeric IDs
    };
  }
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        comments: {
          include: {
            children: true,
          },
        },
        author: true,
        categories: true,
        ratings: { select: { id: true } },
      },
    });

    // クライアントのIPアドレスをHTTPヘッダーから取得
    const ipAddress =
      context.req.headers["x-real-ip"] ||
      context.req.headers["x-forwarded-for"] ||
      context.req.connection.remoteAddress;

    const currentDate = new Date();

    // 年月日の部分を取得
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // 月は0から始まるため+1
    const day = currentDate.getDate();

    // PostgreSQLのDate型に変換
    const date = new Date(year, month - 1, day); // 月は0から始まるため-1

    const existingAccess = await prisma.access.findFirst({
      where: {
        ipAddress: ipAddress,
        postId: postId,
        date: date,
      },
    });

    if (!existingAccess) {
      // 既存のレコードが見つからない場合、新しいレコードを作成
      await prisma.access.create({
        data: {
          ipAddress,
          postId,
          date,
        },
      });
    } else {
      // 既存のレコードが存在する場合、適切なエラー処理を行います。
      // 例えば、一意制約違反エラーをハンドルして通知するか、別のアクションを実行するなどの処理が考えられます。
    }

    if (!post) {
      return {
        notFound: true, // Return a 404 page
      };
    }

    // postオブジェクト内のcommentsとchildrenのDatetimeカラムをフォーマット変換
    const formattedPost = {
      ...post,
      comments: post.comments.map((comment: any) => ({
        ...comment,
        children: comment.children.map((child: any) => ({
          ...child,
          date: formatDatetime(child.date),
        })),
        date: formatDatetime(comment.date),
      })),
    };

    return {
      props: {
        post: formattedPost,
      },
    };
  } catch {
    return {
      notFound: true, // Return a 404 page
    };
  } finally {
    await prisma.$disconnect(); // リクエスト処理の最後で接続を切断
  }
}
