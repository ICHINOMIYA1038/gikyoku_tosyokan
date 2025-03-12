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
import { faStar, faCommentDots, faTimes, faShareAlt } from "@fortawesome/free-solid-svg-icons";

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
  const [showShareButtons, setShowShareButtons] = useState(false);
  const commentsRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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

  const toggleShareButtons = () => {
    setShowShareButtons(!showShareButtons);
  };

  // ウィンドウサイズを監視して、デスクトップかモバイルかを判定
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024); // 1024px以上をデスクトップとみなす
      setIsTablet(window.innerWidth >= 768); // 768px以上をタブレットとみなす
    };

    // 初期チェック
    checkScreenSize();

    // リサイズイベントのリスナーを追加
    window.addEventListener('resize', checkScreenSize);

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const handleSwipe = (e: React.TouchEvent) => {
    // モバイルの場合のみスワイプ処理を有効にする
    if (isTablet) return;

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
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }
          
          .animate-slideUp {
            animation: slideUp 0.3s ease-out;
          }
          
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
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
        />
        <div className="container mx-auto px-4">
          <div className={`relative mx-auto ${showComments && isTablet ? 'md:grid md:grid-cols-2 md:gap-6 md:max-w-4xl' : 'max-w-xl'}`}>
            {/* 記事コンテンツ */}
            <div className={`${showComments && isTablet ? 'md:col-span-1' : ''}`}>
              <PostDetail post={post} />

              {/* 評価セクション */}
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

              {/* 関連記事 */}
              <div className="flex justify-center max-w-md mx-auto">
                <OtherPosts
                  authorId={post.author_id}
                  postId={post.id}
                  authorName={post.author.name}
                />
              </div>
            </div>

            {/* コメントセクション - タブレット以上 */}
            {showComments && isTablet && (
              <div className="md:col-span-1 bg-white rounded-lg shadow-lg overflow-y-auto md:h-screen md:sticky md:top-0 animate-slideIn">
                <div className="sticky top-0 bg-white p-2 border-b border-gray-200 flex justify-between items-center z-10">
                  <h2 className="text-xl font-bold">コメント</h2>
                  <button
                    className="text-gray-500 hover:text-gray-700 p-2"
                    onClick={toggleComments}
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

            {/* 固定ボタンエリア */}
            <div className="fixed bottom-16 right-4 z-50 flex flex-col items-end space-y-3">
              {/* SNSシェアボタン */}
              {showShareButtons && (
                <div className="bg-white p-3 rounded-lg shadow-lg flex space-x-3 mb-2 animate-fadeIn">
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

              {/* シェアボタン */}
              <button
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg flex items-center transition-colors duration-200"
                onClick={toggleShareButtons}
                aria-label="記事を共有"
              >
                <FontAwesomeIcon icon={faShareAlt} size="lg" />
                <span className="ml-2 bg-white text-green-600 text-xs font-bold py-1 px-2 rounded-full">共有</span>
              </button>

              {/* コメントボタン */}
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center transition-colors duration-200"
                onClick={toggleComments}
                aria-label="コメントを表示"
              >
                <FontAwesomeIcon icon={faCommentDots} size="lg" />
                <span className="ml-2 bg-white text-blue-600 text-xs font-bold py-1 px-2 rounded-full">コメント</span>
              </button>
            </div>

            {/* コメントセクション - モバイル */}
            {showComments && !isTablet && (
              <div
                className="fixed bottom-0 left-0 right-0 h-1/2 bg-white shadow-lg overflow-y-auto z-40 animate-slideUp"
                ref={commentsRef}
                onTouchStart={handleSwipe}
              >
                <div className="sticky top-0 bg-white p-2 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold">コメント</h2>
                  <button
                    className="text-gray-500 hover:text-gray-700 p-2"
                    onClick={toggleComments}
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
