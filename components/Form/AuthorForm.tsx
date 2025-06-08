// components/AuthorForm.tsx
import { useState } from "react";
import MessageModal from "../Modal/MessageModalProps";

const AuthorForm: React.FC = () => {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [group, setGroup] = useState("");
  const [profile, setProfile] = useState("");
  const [masterpiece, setMasterpiece] = useState("");
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
      const response = await fetch("/api/createAuthor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          website,
          group,
          profile,
          masterpiece,
        }),
      });
      const data = await response.json();
      setName("");
      setWebsite("");
      setGroup("");
      setProfile("");
      setMasterpiece("");

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
      <h3>ウェブサイト</h3>
      <input
        type="text"
        placeholder="Website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <h3>所属団体</h3>
      <input
        type="text"
        placeholder="Group"
        value={group}
        onChange={(e) => setGroup(e.target.value)}
      />
      <h3>プロフィール</h3>
      <textarea
        placeholder="Profile"
        value={profile}
        onChange={(e) => setProfile(e.target.value)}
      />
      <h3>代表作</h3>
      <input
        type="text"
        placeholder="Masterpiece"
        value={masterpiece}
        onChange={(e) => setMasterpiece(e.target.value)}
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
