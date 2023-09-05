import { useState } from "react";
import MessageModal from "../Modal/MessageModalProps";

const PostForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    authorId: 1,
    man: 0,
    woman: 0,
    others: 0,
    totalNumber: 0,
    playtime: 100,
    synopsis: "",
    image_url: "",
    categories: [], // カテゴリーを選択するための配列
    amazon_text_url: "",
    amazon_img_url: "",
    amazon_img_text_url: "",
    link_to_plot: "",
    buy_link: "",
    ISBN_13: "",
  });

  const [sending, setSending] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const categoryOptions = [
    { id: 1, name: "Category 1" },
    { id: 2, name: "Category 2" },
    { id: 3, name: "Category 3" },
    // 他のカテゴリーを追加
  ];

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
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      setFormData({
        ...formData, // 既存のフォームデータを保持
        title: "",
        content: "",
        authorId: 1,
        man: -1,
        woman: -1,
        others: -1,
        totalNumber: -1,
        playtime: 100,
        synopsis: "",
        image_url: "",
        categories: [], // カテゴリーを選択するための配列
        amazon_text_url: "",
        amazon_img_url: "",
        amazon_img_text_url: "",
        link_to_plot: "",
        buy_link: "",
        ISBN_13: "",
      });

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

  // 各入力フィールドの変更を処理するハンドラー関数を追加することができます
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryIds = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value)
    );
    setFormData({
      ...formData,
      categories: selectedCategoryIds,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Title</h3>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <h3>Man</h3>
      <input
        type="number"
        placeholder="Man"
        value={formData.man}
        onChange={(e) =>
          setFormData({ ...formData, man: parseInt(e.target.value) })
        }
      />

      <h3>Woman</h3>
      <input
        type="number"
        placeholder="Woman"
        value={formData.woman}
        onChange={(e) =>
          setFormData({ ...formData, woman: parseInt(e.target.value) })
        }
      />

      <h3>Others</h3>
      <input
        type="number"
        placeholder="Others"
        value={formData.others}
        onChange={(e) =>
          setFormData({ ...formData, others: parseInt(e.target.value) })
        }
      />

      <h3>Total Number</h3>
      <input
        type="number"
        placeholder="Total Number"
        value={formData.totalNumber}
        onChange={(e) =>
          setFormData({ ...formData, totalNumber: parseInt(e.target.value) })
        }
      />

      <h3>Playtime</h3>
      <input
        type="number"
        placeholder="Playtime"
        value={formData.playtime}
        onChange={(e) =>
          setFormData({ ...formData, playtime: parseInt(e.target.value) })
        }
      />

      <h3>Synopsis</h3>
      <textarea
        placeholder="Synopsis"
        value={formData.synopsis}
        onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
      />

      <h3>Image URL</h3>
      <input
        type="text"
        placeholder="Image URL"
        value={formData.image_url}
        onChange={(e) =>
          setFormData({ ...formData, image_url: e.target.value })
        }
      />

      <h3>Amazon Text URL</h3>
      <input
        type="text"
        placeholder="Amazon Text URL"
        value={formData.amazon_text_url}
        onChange={(e) =>
          setFormData({ ...formData, amazon_text_url: e.target.value })
        }
      />

      <h3>Amazon Image URL</h3>
      <input
        type="text"
        placeholder="Amazon Image URL"
        value={formData.amazon_img_url}
        onChange={(e) =>
          setFormData({ ...formData, amazon_img_url: e.target.value })
        }
      />

      <h3>Amazon Image Text URL</h3>
      <input
        type="text"
        placeholder="Amazon Image Text URL"
        value={formData.amazon_img_text_url}
        onChange={(e) =>
          setFormData({ ...formData, amazon_img_text_url: e.target.value })
        }
      />

      <h3>Link to Plot</h3>
      <input
        type="text"
        placeholder="Link to Plot"
        value={formData.link_to_plot}
        onChange={(e) =>
          setFormData({ ...formData, link_to_plot: e.target.value })
        }
      />

      <h3>Buy Link</h3>
      <input
        type="text"
        placeholder="Buy Link"
        value={formData.buy_link}
        onChange={(e) => setFormData({ ...formData, buy_link: e.target.value })}
      />

      <h3>ISBN-13</h3>
      <input
        type="text"
        placeholder="ISBN-13"
        value={formData.ISBN_13}
        onChange={(e) => setFormData({ ...formData, ISBN_13: e.target.value })}
      />

      <h3>Categories</h3>
      <select
        multiple // 複数のカテゴリーを選択できるようにする
        value={formData.categories}
        onChange={handleCategoryChange}
      >
        {categoryOptions.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

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
