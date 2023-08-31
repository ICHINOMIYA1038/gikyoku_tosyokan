import { useState } from "react";
import MessageModal from "../Modal/MessageModalProps";

const PostForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState(1);
  const [man, setMan] = useState(0);
  const [woman, setWoman] = useState(0);
  const [others, setOthers] = useState(0);
  const [totalNumber, setTotalNumber] = useState(0);
  const [playtime, setPlaytime] = useState(100);
  const [synopsis, setSynopsis] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [website1, setWebsite1] = useState("");
  const [website2, setWebsite2] = useState("");
  const [website3, setWebsite3] = useState("");
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
    setSending(true);

    try {
      const response = await fetch("/api/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          authorId,
          man,
          woman,
          others,
          totalNumber,
          playtime,
          synopsis,
          image_url,
          website1,
          website2,
          website3,
        }),
      });
      const data = await response.json();

      setTitle("");
      setContent("");
      setAuthorId(0);

      setSuccessMessage("Post created successfully.");
      setErrorMessage("");
      setErrorModal(false);
      setSuccessModal(true);
    } catch (error) {
      setErrorMessage(
        "An unknown error occurred. Please contact the administrator."
      );
      setSuccessMessage("");
      setErrorModal(true);
      setSuccessModal(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Title</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <h3>Content</h3>
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <h3>Author ID</h3>
      <input
        type="text"
        placeholder="Author ID"
        value={authorId}
        onChange={(e) => setAuthorId(parseInt(e.target.value))}
      />

      <h3>Man</h3>
      <input
        type="text"
        placeholder="Man"
        value={man}
        onChange={(e) => setMan(parseInt(e.target.value))}
      />

      <h3>Woman</h3>
      <input
        type="text"
        placeholder="Woman"
        value={woman}
        onChange={(e) => setWoman(parseInt(e.target.value))}
      />

      <h3>Others</h3>
      <input
        type="text"
        placeholder="Others"
        value={others}
        onChange={(e) => setOthers(parseInt(e.target.value))}
      />

      <h3>Total Number</h3>
      <input
        type="text"
        placeholder="Total Number"
        value={totalNumber}
        onChange={(e) => setTotalNumber(parseInt(e.target.value))}
      />

      <h3>Playtime</h3>
      <input
        type="text"
        placeholder="Playtime"
        value={playtime}
        onChange={(e) => setPlaytime(parseInt(e.target.value))}
      />

      <h3>Synopsis</h3>
      <textarea
        placeholder="Synopsis"
        value={synopsis}
        onChange={(e) => setSynopsis(e.target.value)}
      />

      <h3>Image URL</h3>
      <input
        type="text"
        placeholder="Image URL"
        value={image_url}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <h3>Website 1</h3>
      <input
        type="text"
        placeholder="Website 1"
        value={website1}
        onChange={(e) => setWebsite1(e.target.value)}
      />

      <h3>Website 2</h3>
      <input
        type="text"
        placeholder="Website 2"
        value={website2}
        onChange={(e) => setWebsite2(e.target.value)}
      />

      <h3>Website 3</h3>
      <input
        type="text"
        placeholder="Website 3"
        value={website3}
        onChange={(e) => setWebsite3(e.target.value)}
      />

      <button type="submit" disabled={sending}>
        {sending ? "Sending..." : "Submit"}
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

export default PostForm;
