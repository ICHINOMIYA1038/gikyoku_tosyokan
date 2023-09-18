// components/AuthorForm.tsx
import { useState } from "react";
import MessageModal from "../Modal/MessageModalProps";

const AuthorForm: React.FC = () => {
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);

  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const closeModal = () => {
    setErrorModal(false);
    setSuccessModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true); // 送信が開始されたことを示す
    try {
      const response = await fetch("/api/createCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });
      const data = await response.json();
      setName("");

      setSuccessMessage("投稿に成功しました。");
      setErrorMessage("");
      setErrorModal(false);
      setSuccessModal(true);
    } catch (error) {
      setErrorMessage("不明なエラーが発生しました。管理者に連絡してください。");
      setSuccessMessage("");
      setErrorModal(true);
      setSuccessModal(false);
    } finally {
      setSending(false); // 送信が完了または失敗したことを示す
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>名前</h3>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" disabled={sending}>
        {" "}
        {sending ? "送信中..." : "Submit"}{" "}
      </button>
      {errorModal && (
        <MessageModal
          type="error"
          message={errorMessage}
          onClose={closeModal}
        />
      )}
      <div className="relative h-96">
        {successModal && (
          <MessageModal
            type="success"
            message={successMessage}
            onClose={closeModal}
          />
        )}
      </div>
    </form>
  );
};

export default AuthorForm;
