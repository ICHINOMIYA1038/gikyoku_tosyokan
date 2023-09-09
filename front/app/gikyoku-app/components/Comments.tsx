import React, { useState } from "react";
import Modal from "./Modal";
import CommentForm from "./Form/CommentForm";
import { PrismaClient } from "@prisma/client";

const Comments = ({ comments, postid }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [targetid, setTarget] = useState();
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
    try {
      const response = await fetch("/api/createComments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ author, content, isParent: false, targetid }),
      });

      if (response.ok) {
        // コメントの投稿が成功した場合の処理
        console.log("コメントが投稿されました");
        // ここでコメントの投稿成功後の処理を追加
      } else {
        // コメントの投稿が失敗した場合の処理
        console.error("コメントの投稿に失敗しました");
        // ここでエラー処理を行う
      }
    } catch (error) {
      console.error("エラーが発生しました", error);
      // ここでエラー処理を行う
    }

    closeModal();
  };

  const handleParentCommentSubmit = async ({ author, content }: any) => {
    try {
      const response = await fetch("/api/createComments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ author, content, isParent: true, targetid }),
      });

      if (response.ok) {
        // コメントの投稿が成功した場合の処理
        console.log("コメントが投稿されました");
        // ここでコメントの投稿成功後の処理を追加
      } else {
        // コメントの投稿が失敗した場合の処理
        console.error("コメントの投稿に失敗しました");
        // ここでエラー処理を行う
      }
    } catch (error) {
      console.error("エラーが発生しました", error);
      // ここでエラー処理を行う
    }

    closeModal();
  };
  return (
    <div>
      <h3>{comments.length}件のコメント</h3>
      {comments.map((comment: any) => (
        <div key={comment.id} className="mb-5">
          <div className="bg-white p-3 m-2 shadow-lg rounded-lg">
            <div className="">{comment.content}</div>
          </div>
          <div className="ml-5">
            {comment.children &&
              comment.children.map((elem: any) => (
                <div
                  key={elem.id}
                  className="bg-white p-3 m-2 shadow-lg rounded-lg"
                >
                  <div className="">{elem.content}</div>
                </div>
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
                <CommentForm onCommentSubmit={handleCommentSubmit} />
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
