import React, { useState } from "react";
import Modal from "./Modal";
import CommentForm from "./Form/CommentForm";
import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";

const Comments = ({ comments, postid }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [targetid, setTarget] = useState();
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [commentResult, setCommentResult] = useState(""); // 送信結果メッセージ
  const router = useRouter();
  const prisma = new PrismaClient();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openParentModal = () => {
    setIsParentModalOpen(true);
  };

  const closeParentModal = () => {
    setIsParentModalOpen(false);
  };

  const handleCommentSubmit = async ({ author, content }: any) => {
    setIsSendingComment(true); // 送信中
    setCommentResult(""); // メッセージをクリア
    try {
      const response = await fetch("/api/createComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ author, content, isParent: false, targetid }),
      });

      if (response.ok) {
        // コメントの投稿が成功した場合の処理
        console.log("コメントが投稿されました");
        setCommentResult("コメントが投稿されました"); // 成功メッセージを設定
        // ここでコメントの投稿成功後の処理を追加
      } else {
        // コメントの投稿が失敗した場合の処理
        console.error("コメントの投稿に失敗しました");
        setCommentResult("コメントの投稿に失敗しました"); // 失敗メッセージを設定
        // ここでエラー処理を行う
      }
    } catch (error) {
      console.error("エラーが発生しました", error);
      setCommentResult("エラーが発生しました"); // エラーメッセージを設定
      // ここでエラー処理を行う
    }
    setIsSendingComment(false); // 送信完了
    setTimeout(() => {
      router.reload();
      closeModal();
    }, 500); // 500ミリ秒（0.5秒）後にcloseModalを呼び出す
  };

  const handleParentCommentSubmit = async ({ author, content }: any) => {
    setIsSendingComment(true); // 送信中
    setCommentResult(""); // メッセージをクリア
    try {
      const response = await fetch("/api/createComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author,
          content,
          isParent: true,
          targetid: postid,
        }),
      });

      if (response.ok) {
        // コメントの投稿が成功した場合の処理
        console.log("コメントが投稿されました");
        setCommentResult("コメントが投稿されました"); // 成功メッセージを設定
        // ここでコメントの投稿成功後の処理を追加
      } else {
        // コメントの投稿が失敗した場合の処理
        console.error("コメントの投稿に失敗しました");
        setCommentResult("コメントの投稿に失敗しました"); // 失敗メッセージを設定
        // ここでエラー処理を行う
      }
    } catch (error) {
      console.error("エラーが発生しました", error);
      setCommentResult("エラーが発生しました"); // エラーメッセージを設定
      // ここでエラー処理を行う
    }
    setIsSendingComment(false); // 送信完了
    setTimeout(() => {
      router.reload();
      closeModal();
    }, 500); // 500ミリ秒（0.5秒）後にcloseModalを呼び出す
  };

  return (
    <div>
      <h3 className="mt-5 font-bold text-xl">{comments.length}件のコメント</h3>
      {comments.map((comment: any) => (
        <div key={comment.id} className="mb-5">
          <div className="bg-white p-3 m-2 shadow-lg rounded-lg">
            {!comment.deleted ? (
              <div className="md:flex justify-between">
                <div className="md:w-3/4">{comment.content}</div>
                <div className="md:w-1/4 text-sm">
                  <div>{comment.author}</div>
                  <div>{comment.date}</div>
                </div>
              </div>
            ) : (
              <div>このコメントは削除されました。</div>
            )}
          </div>
          <div className="ml-5">
            {comment.children &&
              comment.children.map((elem: any) => (
                <>
                  {!comment.deleted && (
                    <div
                      key={elem.id}
                      className="bg-white p-3 m-2 shadow-lg rounded-lg"
                    >
                      <div className="md:flex justify-between">
                        <div className="md:w-3/4">{elem.content}</div>
                        <div className="md:w-1/4 text-sm mt-2">
                          <div>{elem.author}</div>
                          <div>{elem.date}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ))}
            <div className="flex justify-end">
              <div
                className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => {
                  setTarget(comment.id);
                  openModal();
                }}
              >
                返信をする
              </div>
            </div>
            {targetid === comment.id && (
              <Modal isOpen={isModalOpen} onClose={closeModal}>
                <CommentForm
                  onCommentSubmit={handleCommentSubmit}
                  isSendingComment={isSendingComment}
                  commentResult={commentResult}
                />
              </Modal>
            )}
          </div>
        </div>
      ))}
      <div
        className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={() => {
          setTarget(postid);
          openParentModal();
        }}
      >
        コメントをする
      </div>
      <Modal isOpen={isParentModalOpen} onClose={closeParentModal}>
        <CommentForm onCommentSubmit={handleParentCommentSubmit} />
      </Modal>
    </div>
  );
};

export default Comments;
