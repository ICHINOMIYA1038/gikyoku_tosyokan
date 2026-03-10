import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import { useRouter } from "next/router";
import { FaCamera, FaTheaterMasks, FaMapMarkerAlt, FaCalendarAlt, FaTimes, FaInfoCircle, FaUsers, FaBook, FaStar } from "react-icons/fa";
import Image from "next/image";

export default function NewReportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    venue: "",
    performanceDate: "",
    authorName: "",
    theaterGroupName: "",
    scriptTitle: "",
    rating: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("画像は5MB以下にしてください");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("JPG、PNG、WebP形式の画像を選択してください");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setImagePreview(base64);
      setImageFile(base64);
      setImageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setImageName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "タイトルは必須です";
    else if (formData.title.length > 100) newErrors.title = "100文字以内で入力してください";
    if (!formData.content.trim()) newErrors.content = "内容は必須です";
    else if (formData.content.length > 2000) newErrors.content = "2000文字以内で入力してください";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      // Upload image first if exists
      let imageUrl = null;
      if (imageFile && imageName) {
        const uploadRes = await fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageFile, filename: imageName }),
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        }
      }

      // Create announcement (reuse existing system)
      const body: Record<string, any> = {
        title: formData.title,
        content: formData.content + (imageUrl ? `\n\n[写真: ${imageUrl}]` : ""),
        venue: formData.venue,
        performanceDate: formData.performanceDate || undefined,
        authorName: formData.authorName || "名無しさん",
        theaterGroupName: formData.theaterGroupName,
        scriptTitle: formData.scriptTitle,
      };

      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      router.push(`/announcements/${data.id}`);
    } catch (error) {
      console.error(error);
      alert("投稿に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        pageTitle="上演レポート投稿｜公演の感想を共有"
        pageDescription="上演した感想や写真を投稿して、次に演じる人の参考になる情報を共有しましょう。"
        pagePath="/reports/new"
        pageType="website"
      />
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
          <div className="bg-gradient-to-r from-green-100 via-emerald-50 to-green-100 py-8 px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FaCamera className="text-green-600" />
                上演レポートを書く
              </h1>
              <p className="text-gray-600 mt-2 text-sm">
                上演した感想や写真を共有して、次に演じる人の参考に
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 py-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              {/* 注意事項 */}
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <p className="font-bold mb-1">投稿について</p>
                    <ul className="list-disc list-inside space-y-0.5 text-xs">
                      <li>写真は1枚まで（5MB以下、JPG/PNG/WebP）</li>
                      <li>出演者の肖像権にご注意ください（許可を得た写真のみ）</li>
                      <li>投稿後の編集はできません（削除のみ可能）</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* タイトル */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="例: 文化祭で「夏の夜の夢」を上演しました！"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  maxLength={100}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              {/* 写真アップロード */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  <FaCamera className="inline mr-1" />
                  写真（任意）
                </label>
                {imagePreview ? (
                  <div className="relative inline-block">
                    <Image
                      src={imagePreview}
                      alt="プレビュー"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-center"
                  >
                    <FaCamera className="text-gray-400 text-2xl mx-auto mb-2" />
                    <p className="text-sm text-gray-500">クリックして写真を選択</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP（5MB以下）</p>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              {/* 上演作品 */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  <FaBook className="inline mr-1" />
                  上演した作品名
                </label>
                <input
                  type="text"
                  name="scriptTitle"
                  value={formData.scriptTitle}
                  onChange={handleChange}
                  placeholder="例: 夏の夜の夢"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* 内容 */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  レポート内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="上演してみた感想、工夫した点、大変だったこと、観客の反応などを自由にお書きください"
                  rows={8}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 ${
                    errors.content ? "border-red-500" : "border-gray-300"
                  }`}
                  maxLength={2000}
                />
                {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                <p className="text-gray-400 text-xs mt-1">{formData.content.length}/2000文字</p>
              </div>

              {/* 劇団名 */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  <FaUsers className="inline mr-1" />
                  劇団・団体名（任意）
                </label>
                <input
                  type="text"
                  name="theaterGroupName"
                  value={formData.theaterGroupName}
                  onChange={handleChange}
                  placeholder="例: ○○高校演劇部"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  maxLength={100}
                />
              </div>

              {/* 会場・日時 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    <FaMapMarkerAlt className="inline mr-1" />
                    会場（任意）
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    placeholder="例: 学校体育館"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    <FaCalendarAlt className="inline mr-1" />
                    上演日（任意）
                  </label>
                  <input
                    type="date"
                    name="performanceDate"
                    value={formData.performanceDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>

              {/* 投稿者名 */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  投稿者名（任意）
                </label>
                <input
                  type="text"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleChange}
                  placeholder="未入力の場合は「名無しさん」"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  maxLength={50}
                />
              </div>

              {/* 送信 */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "投稿中..." : "レポートを投稿する"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/reports")}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
}
