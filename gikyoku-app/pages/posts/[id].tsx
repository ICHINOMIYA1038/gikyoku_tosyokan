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
import { faStar, faCommentDots, faTimes, faShareAlt, faBook, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

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
  const [showReadButtons, setShowReadButtons] = useState(false);
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

    // コメントを表示する場合、スクロールを一番上に戻す
    if (!showComments && commentsRef.current) {
      setTimeout(() => {
        commentsRef.current?.scrollTo(0, 0);
      }, 100);
    }

    // コメントを閉じる時にアニメーションを追加
    if (showComments) {
      // アニメーション用のクラスを追加して、アニメーション完了後に非表示にする
      if (commentsRef.current) {
        commentsRef.current.classList.add('animate-slideDown');
        setTimeout(() => {
          setShowComments(false);
        }, 300);
      }
    }
  };

  const toggleShareButtons = () => {
    setShowShareButtons(!showShareButtons);
  };

  const toggleReadButtons = () => {
    setShowReadButtons(!showReadButtons);
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

  // マウスとタッチの両方に対応したハンドラーを追加
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    // タブレット以上のサイズでは処理しない
    if (isTablet) return;

    // タッチイベントかマウスイベントかを判定
    let startY: number;
    let startX: number;

    if ('touches' in e) {
      // タッチイベントの場合
      const touch = e.touches[0];
      startY = touch.clientY;
      startX = touch.clientX;
    } else {
      // マウスイベントの場合
      startY = e.clientY;
      startX = e.clientX;

      // マウスイベントの場合は、マウスムーブとマウスアップのイベントを追加
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    }

    let isDragging = false;
    let initialHeight = 0;

    // コメント欄の初期高さを取得
    if (commentsRef.current) {
      initialHeight = commentsRef.current.clientHeight;
    }

    // マウスムーブハンドラー
    function handleDragMove(moveEvent: MouseEvent | TouchEvent) {
      if (!commentsRef.current) return;

      let moveY: number;
      let moveX: number;

      if ('touches' in moveEvent) {
        // タッチイベントの場合
        const moveTouch = moveEvent.touches[0];
        moveY = moveTouch.clientY;
        moveX = moveTouch.clientX;
      } else {
        // マウスイベントの場合
        moveY = (moveEvent as MouseEvent).clientY;
        moveX = (moveEvent as MouseEvent).clientX;
      }

      // 縦方向の移動が横方向より大きい場合のみ処理
      if (Math.abs(moveY - startY) > Math.abs(moveX - startX)) {
        // デフォルトのスクロール動作を防止
        moveEvent.preventDefault();

        isDragging = true;

        // 下にドラッグした場合のみ処理
        if (moveY > startY) {
          // ドラッグした距離を計算
          const dragDistance = moveY - startY;

          // コメント欄を下に移動
          commentsRef.current.style.transform = `translateY(${dragDistance}px)`;

          // 透明度も調整（ドラッグ距離に応じて徐々に透明に）
          const opacity = Math.max(1 - (dragDistance / 300), 0.5);
          commentsRef.current.style.opacity = opacity.toString();

          // ドラッグが一定距離を超えたら視覚的フィードバックを追加
          const swipeIndicator = commentsRef.current.querySelector('.swipe-indicator');
          if (dragDistance > 100) {
            swipeIndicator?.classList.add('ready-to-close');
            // カーソルも変更
            commentsRef.current.style.cursor = 'n-resize';
          } else {
            swipeIndicator?.classList.remove('ready-to-close');
            commentsRef.current.style.cursor = 'grab';
          }
        }
      }
    }

    // マウスアップ/タッチエンドハンドラー
    function handleDragEnd(endEvent: MouseEvent | TouchEvent) {
      if (!commentsRef.current) return;

      let endY: number;

      if ('changedTouches' in endEvent) {
        // タッチイベントの場合
        const endTouch = endEvent.changedTouches[0];
        endY = endTouch.clientY;
      } else {
        // マウスイベントの場合
        endY = (endEvent as MouseEvent).clientY;
      }

      if (isDragging) {
        const dragDistance = endY - startY;

        // ドラッグが一定距離を超えたらコメント欄を閉じる
        if (dragDistance > 100) {
          // アニメーションを追加して閉じる
          commentsRef.current.style.transform = 'translateY(100%)';
          commentsRef.current.style.opacity = '0';

          setTimeout(() => {
            setShowComments(false);
            // スタイルをリセット
            if (commentsRef.current) {
              commentsRef.current.style.transform = '';
              commentsRef.current.style.opacity = '';
              commentsRef.current.style.cursor = '';
            }
          }, 300);
        } else {
          // 閾値に達していない場合は元の状態に戻す
          commentsRef.current.style.transform = '';
          commentsRef.current.style.opacity = '';
          commentsRef.current.style.cursor = '';
        }
      }

      // イベントリスナーを削除
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove as any);
      document.removeEventListener('touchend', handleDragEnd as any);
    }

    // タッチイベントの場合
    if ('touches' in e) {
      document.addEventListener('touchmove', handleDragMove as any, { passive: false });
      document.addEventListener('touchend', handleDragEnd as any);
    }
  };

  // Amazonリンクと無料リンクの存在確認
  const hasAmazonLink = !!post.amazon_text_url;
  const hasFreeLink = !!post.link_to_plot;
  const hasReadLinks = hasAmazonLink || hasFreeLink;

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
          
          @keyframes slideDown {
            from { transform: translateY(0); }
            to { transform: translateY(100%); }
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
          
          .animate-slideDown {
            animation: slideDown 0.3s ease-out;
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
          
          .swipe-handle {
            width: 40px;
            height: 5px;
            background-color: #d1d5db;
            border-radius: 9999px;
            margin: 8px auto;
            cursor: grab;
          }
          
          .swipe-handle:active {
            cursor: grabbing;
            background-color: #9ca3af;
          }
          
          .swipe-indicator {
            color: #6b7280;
            font-size: 0.75rem;
            text-align: center;
            margin-top: 2px;
          }
          
          .ready-to-close {
            color: #ef4444;
            font-weight: bold;
          }
          
          .comment-drawer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 70vh;
            background-color: white;
            box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 40;
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
            overflow: hidden;
            transition: transform 0.3s ease, height 0.3s ease, opacity 0.3s ease;
          }
          
          .swipe-handle-area {
            cursor: grab;
            user-select: none;
          }
          
          .swipe-handle-area:active {
            cursor: grabbing;
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

              {/* 読むボタンエリア - 本文内 */}
              {(hasAmazonLink || hasFreeLink) && (
                <div className="my-6 flex flex-col sm:flex-row justify-center gap-4">
                  {/* Amazonで読むボタン */}
                  {hasAmazonLink && (
                    <a
                      href={post.amazon_text_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-amazon flex items-center justify-center px-6 py-3 rounded-lg shadow-md text-white font-bold text-lg"
                    >
                      <FontAwesomeIcon icon={faBook} className="mr-2" />
                      この戯曲を読む (Amazon)
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2 text-sm" />
                    </a>
                  )}

                  {/* 無料で読むボタン */}
                  {hasFreeLink && (
                    <a
                      href={post.link_to_plot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-free flex items-center justify-center px-6 py-3 rounded-lg shadow-md text-white font-bold text-lg"
                    >
                      <FontAwesomeIcon icon={faBook} className="mr-2" />
                      この戯曲を無料で読む
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2 text-sm" />
                    </a>
                  )}
                </div>
              )}

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
                <div className="sticky top-0 bg-white p-3 border-b border-gray-200 flex justify-between items-center z-10">
                  <p className="text-xl font-bold">コメント</p>
                  <button
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                    onClick={toggleComments}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <div className="p-4 pb-20">
                  {post.comments && (
                    <Comments comments={post.comments} postid={post.id} />
                  )}
                </div>
              </div>
            )}

            {/* 固定ボタンエリア */}
            <div className="fixed bottom-16 right-4 z-50 flex flex-col items-end space-y-3">
              {/* 読むボタンメニュー */}
              {hasReadLinks && showReadButtons && (
                <div className="bg-white p-3 rounded-lg shadow-lg flex flex-col space-y-2 mb-2 animate-fadeIn relative">
                  {/* スワイプインジケーター */}
                  <div className="absolute top-0 left-0 right-0 flex justify-center">
                    <div className="w-10 h-1 bg-gray-300 rounded-full my-1"></div>
                  </div>

                  {hasAmazonLink && (
                    <a
                      href={post.amazon_text_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-amazon flex items-center justify-center px-4 py-2 rounded-lg text-white font-bold"
                    >
                      <FontAwesomeIcon icon={faBook} className="mr-2" />
                      Amazonで読む
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2 text-xs" />
                    </a>
                  )}

                  {hasFreeLink && (
                    <a
                      href={post.link_to_plot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-free flex items-center justify-center px-4 py-2 rounded-lg text-white font-bold"
                    >
                      <FontAwesomeIcon icon={faBook} className="mr-2" />
                      無料で読む
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2 text-xs" />
                    </a>
                  )}
                </div>
              )}

              {/* SNSシェアボタン */}
              {showShareButtons && (
                <div className="bg-white p-3 rounded-lg shadow-lg flex space-x-3 mb-2 animate-fadeIn relative">
                  {/* スワイプインジケーター */}
                  <div className="absolute top-0 left-0 right-0 flex justify-center">
                    <div className="w-10 h-1 bg-gray-300 rounded-full my-1"></div>
                  </div>

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

              {/* 読むボタン */}
              {hasReadLinks && (
                <button
                  className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg flex items-center transition-colors duration-200"
                  onClick={toggleReadButtons}
                  aria-label="この戯曲を読む"
                >
                  <FontAwesomeIcon icon={faBook} size="lg" />
                  <span className="ml-2 bg-white text-purple-600 text-xs font-bold py-1 px-2 rounded-full">
                    {showReadButtons ? "閉じる" : "読む"}
                  </span>
                </button>
              )}

              {/* シェアボタン */}
              <button
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg flex items-center transition-colors duration-200"
                onClick={toggleShareButtons}
                aria-label="記事を共有"
              >
                <FontAwesomeIcon icon={faShareAlt} size="lg" />
                <span className="ml-2 bg-white text-green-600 text-xs font-bold py-1 px-2 rounded-full">
                  {showShareButtons ? "閉じる" : "共有"}
                </span>
              </button>

              {/* コメントボタン */}
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center transition-colors duration-200"
                onClick={toggleComments}
                aria-label="コメントを表示"
              >
                <FontAwesomeIcon icon={faCommentDots} size="lg" />
                <span className="ml-2 bg-white text-blue-600 text-xs font-bold py-1 px-2 rounded-full">
                  {showComments ? "閉じる" : "コメント"}
                </span>
              </button>
            </div>

            {/* コメントセクション - モバイル */}
            {showComments && !isTablet && (
              <div
                className="comment-drawer"
                ref={commentsRef}
                style={{ transform: 'translateY(0)' }}
              >
                {/* スワイプ/ドラッグハンドル */}
                <div
                  className="swipe-handle-area pt-2 pb-1"
                  onTouchStart={handleDragStart}
                  onMouseDown={handleDragStart}
                  style={{ cursor: 'grab' }}
                >
                  <div className="swipe-handle"></div>
                  <p className="swipe-indicator">下にドラッグして閉じる</p>
                </div>

                <div className="sticky top-0 bg-white p-3 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold">コメント</h2>
                  <button
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                    onClick={toggleComments}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>

                <div className="p-4 pb-20 overflow-y-auto" style={{ height: 'calc(100% - 100px)' }}>
                  {post.comments && (
                    <Comments comments={post.comments} postid={post.id} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout >
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
    // 投稿データの取得処理
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

    if (!post) {
      return {
        notFound: true, // Return a 404 page
      };
    }

    // クライアントのIPアドレスをHTTPヘッダーから取得
    const ipAddress =
      context.req.headers["x-real-ip"] ||
      context.req.headers["x-forwarded-for"] ||
      context.req.connection.remoteAddress;

    // アクセスログの記録処理を非同期で実行（await せずにバックグラウンドで処理）
    recordAccess(ipAddress, postId).catch(error => {
      console.error("Failed to record access:", error);
    });

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
  } catch (error) {
    console.error("Error fetching post:", error);
    return {
      notFound: true, // Return a 404 page
    };
  } finally {
    await prisma.$disconnect(); // リクエスト処理の最後で接続を切断
  }
}

// アクセスログを記録する関数
async function recordAccess(ipAddress: string, postId: number) {
  const prisma = new PrismaClient();
  try {
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
    }
  } catch (error) {
    console.error("Error recording access:", error);
  } finally {
    await prisma.$disconnect();
  }
}
