import TwitterIntroduction from "@/components/Ad/TwitterIntroduction";
import Layout from "@/components/Layout";
import MessageModal from "@/components/Modal/MessageModalProps";
import getOgpData from "@/components/util/getOgpData";
import { PrismaClient } from "@prisma/client";
import { useState } from "react";
const prisma = new PrismaClient();

export default function Home({ post, categories, authors }: any) {
  const [formData, setFormData] = useState<any>({
    title: post.title,
    content: post.content,
    authorId: post.author.id,
    man: post.man,
    woman: post.woman,
    others: post.others,
    totalNumber: post.totalNumber,
    playtime: post.playtime,
    synopsis: post.synopsis,
    image_url: post.image_url,
    categories: post.categories, // カテゴリーを選択するための配列
    amazon_text_url: post.amazon_text_url,
    amazon_img_url: post.amazon_img_url,
    amazon_img_text_url: post.amazon_img_text_url,
    link_to_plot: post.link_to_plot,
    buy_link: post.buy_link,
    ISBN_13: post.ISBN_13,
  });

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
      const response = await fetch("/api/updateposts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

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

  const [selectedCategories, setSelectedCategories] = useState<any>(
    post.categories
  );

  const handleCategorySelect = (categoryId: any) => {
    if (!selectedCategories.includes(categoryId)) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      handleCategoryRemove(categoryId);
    }
    setFormData({
      ...formData, // 既存のフォームデータを保持
      categories: selectedCategories, // カテゴリーを選択するための配列
    });
  };

  const handleCategoryRemove = (categoryId: any) => {
    setSelectedCategories(
      selectedCategories.filter((id: any) => id !== categoryId)
    );
    setFormData({
      ...formData, // 既存のフォームデータを保持
      categories: selectedCategories, // カテゴリーを選択するための配列
    });
  };

  return (
    <Layout>
      <>
        <form
          onSubmit={handleSubmit}
          className="bg-blue-200 shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-2xl"
        >
          <h2>脚本データ</h2>
          <div>
            <label htmlFor="selectAuthor">既存の著者を選択：</label>
            <select
              id="selectAuthor"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  authorId: parseInt(e.target.value),
                })
              }
            >
              <option value="">選択してください</option>
              {authors.map((author: any) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
          <h3>
            Title<span className="text-red-500">*</span>
          </h3>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="border rounded w-full py-2 px-3 mb-4 inline-block"
          />
          <h3>Man</h3>
          <input
            type="number"
            placeholder="Man"
            value={formData.man}
            onChange={(e) =>
              setFormData({ ...formData, man: parseInt(e.target.value) })
            }
            className="border rounded w-full py-2 px-3 mb-4"
          />
          <h3>Woman</h3>
          <input
            type="number"
            placeholder="Woman"
            value={formData.woman}
            onChange={(e) =>
              setFormData({ ...formData, woman: parseInt(e.target.value) })
            }
            className="border rounded w-full py-2 px-3 mb-4"
          />
          <h3>Others</h3>
          <input
            type="number"
            placeholder="Others"
            value={formData.others}
            onChange={(e) =>
              setFormData({ ...formData, others: parseInt(e.target.value) })
            }
            className="border rounded w-full py-2 px-3 mb-4"
          />
          <h3>Total Number</h3>
          <input
            type="number"
            placeholder="Total Number"
            value={formData.totalNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                totalNumber: parseInt(e.target.value),
              })
            }
            className="border rounded w-full py-2 px-3 mb-4"
          />
          <h3>Playtime</h3>
          <input
            type="number"
            placeholder="Playtime"
            value={formData.playtime}
            onChange={(e) =>
              setFormData({ ...formData, playtime: parseInt(e.target.value) })
            }
            className="border rounded w-full py-2 px-3 mb-4"
          />
          <h3>Synopsis</h3>
          <textarea
            placeholder="Synopsis"
            value={formData.synopsis}
            onChange={(e) =>
              setFormData({ ...formData, synopsis: e.target.value })
            }
            className="border rounded w-full py-2 px-3 mb-4"
          />
          <h3>content</h3>
          <textarea
            placeholder="content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="border rounded w-full py-2 px-3 mb-4"
          />
          <div>
            <div>
              <div>
                <h3>選択したカテゴリ:</h3>
                <div className="max-w-md flex flex-wrap">
                  {selectedCategories.map((categoryId: any) => (
                    <Chip
                      key={categoryId}
                      label={
                        categories.find(
                          (category: any) => category.id === categoryId
                        )?.name || ""
                      }
                      onRemove={() => handleCategoryRemove(categoryId)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h3>カテゴリを選択してください:</h3>
                <ul className="space-y-1">
                  {categories.map((category: { id: any; name: any }) => (
                    <div
                      className="inline-block"
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <SelectChip key={category.id} label={category.name} />
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <h3>Image URL</h3>
          <input
            type="text"
            placeholder="Image URL"
            value={formData.image_url}
            onChange={(e) =>
              setFormData({ ...formData, image_url: e.target.value })
            }
            className="border rounded w-full py-2 px-3 mb-4"
          />
          <h3>Amazon Text URL</h3>
          <input
            type="text"
            placeholder="Amazon Text URL"
            value={formData.amazon_text_url}
            onChange={(e) =>
              setFormData({ ...formData, amazon_text_url: e.target.value })
            }
            className="border rounded w-full py-2 px-3 mb-4"
          />
          <h3>Amazon Image URL</h3>
          <input
            type="text"
            placeholder="Amazon Image URL"
            value={formData.amazon_img_url}
            onChange={(e) =>
              setFormData({ ...formData, amazon_img_url: e.target.value })
            }
            className="border rounded w-full py-2 px-3 mb-4"
          />
          <h3>Amazon Image Text URL</h3>
          <input
            type="text"
            placeholder="Amazon Image Text URL"
            value={formData.amazon_img_text_url}
            onChange={(e) =>
              setFormData({
                ...formData,
                amazon_img_text_url: e.target.value,
              })
            }
            className="border rounded w-full py-2 px-3 mb-4"
          />
          <h3>Link to Plot</h3>
          <input
            type="text"
            placeholder="Link to Plot"
            value={formData.link_to_plot}
            onChange={(e) =>
              setFormData({ ...formData, link_to_plot: e.target.value })
            }
            className="border rounded w-full py-2 px-3 mb-4"
          />
          <h3>Buy Link</h3>
          <input
            type="text"
            placeholder="Buy Link"
            value={formData.buy_link}
            onChange={(e) =>
              setFormData({ ...formData, buy_link: e.target.value })
            }
            className="border rounded w-full py-2 px-3 mb-4"
          />
          <h3>ISBN-13</h3>
          <input
            type="text"
            placeholder="ISBN-13"
            value={formData.ISBN_13}
            onChange={(e) =>
              setFormData({ ...formData, ISBN_13: e.target.value })
            }
            className="border rounded w-full py-2 px-3 mb-4"
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
          <TwitterIntroduction post={post} />
        </form>
      </>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  console.log(getOgpData(["https://gekidankatakago.com"]));
  const postId = parseInt(context.params.id);
  if (isNaN(postId)) {
    return {
      notFound: true, // Return a 404 page for non-numeric IDs
    };
  }
  const authors = await prisma.author.findMany({});
  const categories = await prisma.category.findMany({});
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      categories: true,
    },
  });

  return {
    props: {
      post,
      categories,
      authors,
    },
  };
}

const SelectChip: React.FC<any> = ({ label }) => {
  const [isSelected, setSelected] = useState(false);
  return (
    <div
      className="inline-block cursor-pointer"
      onClick={() => {
        setSelected(!isSelected);
      }}
    >
      <span
        className={`text-white p-2 m-1 rounded flex items-center ${
          isSelected ? "bg-blue-500" : "bg-gray-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

const Chip: React.FC<ChipProps> = ({ label, onRemove }) => (
  <span className="bg-blue-500 text-white p-2 m-1 rounded flex items-center">
    {label}
    <button onClick={onRemove} className="ml-2">
      ×
    </button>
  </span>
);
interface Category {
  id: number;
  name: string;
}

interface ChipProps {
  label: string;
  onRemove: () => void;
}
