import { useState } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { FaTheaterMasks, FaCalendarAlt, FaMapMarkerAlt, FaYenSign, FaPhone, FaUser, FaInfoCircle } from 'react-icons/fa';
import Seo from '@/components/seo';

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    performanceDate: '',
    venue: '',
    ticketPrice: '',
    contactInfo: '',
    authorName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    } else if (formData.title.length > 100) {
      newErrors.title = 'タイトルは100文字以内で入力してください';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = '内容は必須です';
    } else if (formData.content.length > 2000) {
      newErrors.content = '内容は2000文字以内で入力してください';
    }
    
    if (formData.venue && formData.venue.length > 100) {
      newErrors.venue = '会場は100文字以内で入力してください';
    }
    
    if (formData.ticketPrice && formData.ticketPrice.length > 100) {
      newErrors.ticketPrice = 'チケット料金は100文字以内で入力してください';
    }
    
    if (formData.contactInfo && formData.contactInfo.length > 200) {
      newErrors.contactInfo = '連絡先は200文字以内で入力してください';
    }
    
    if (formData.authorName && formData.authorName.length > 50) {
      newErrors.authorName = '投稿者名は50文字以内で入力してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create announcement');
      }
      
      const data = await response.json();
      router.push(`/announcements/${data.id}`);
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('告知の投稿に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        pageTitle="新規告知投稿 | 公演告知掲示板"
        pageDescription="演劇・舞台の公演告知を投稿します。"
        pagePath="/announcements/new"
        pageType="website"
      />
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-theater-neutral-50 to-white">
          {/* ヘッダーセクション */}
          <div className="bg-gradient-to-r from-theater-primary-100 via-theater-secondary-50 to-theater-primary-100 py-8 px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-theater-neutral-900 flex items-center gap-3">
                <FaTheaterMasks className="text-theater-primary-500" />
                公演告知を投稿
              </h1>
              <p className="text-theater-neutral-700 mt-2">
                公演情報を入力して投稿してください
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 py-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
              {/* 注意事項 */}
              <div className="bg-theater-accent-yellow/10 border-l-4 border-theater-accent-yellow p-4 rounded">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="text-theater-accent-yellow mt-1 flex-shrink-0" />
                  <div className="text-sm text-theater-neutral-700">
                    <p className="font-bold mb-1">投稿時の注意事項</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>個人情報の取り扱いにご注意ください</li>
                      <li>誹謗中傷や不適切な内容は投稿しないでください</li>
                      <li>投稿後の編集はできません（削除のみ可能）</li>
                      <li>画像の投稿は現在サポートしていません</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* タイトル（必須） */}
              <div>
                <label htmlFor="title" className="block text-sm font-bold text-theater-neutral-900 mb-2">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="例: 劇団○○ 第10回公演「タイトル」"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-theater-primary-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={100}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  {formData.title.length}/100文字
                </p>
              </div>

              {/* 内容（必須） */}
              <div>
                <label htmlFor="content" className="block text-sm font-bold text-theater-neutral-900 mb-2">
                  内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="公演の詳細、あらすじ、見どころなどを記入してください"
                  rows={8}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-theater-primary-500 ${
                    errors.content ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={2000}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  {formData.content.length}/2000文字
                </p>
              </div>

              {/* 公演日時 */}
              <div>
                <label htmlFor="performanceDate" className="block text-sm font-bold text-theater-neutral-900 mb-2">
                  <FaCalendarAlt className="inline mr-1" />
                  公演日時
                </label>
                <input
                  type="datetime-local"
                  id="performanceDate"
                  name="performanceDate"
                  value={formData.performanceDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-theater-primary-500"
                />
              </div>

              {/* 会場 */}
              <div>
                <label htmlFor="venue" className="block text-sm font-bold text-theater-neutral-900 mb-2">
                  <FaMapMarkerAlt className="inline mr-1" />
                  会場
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="例: ○○劇場、△△ホール"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-theater-primary-500 ${
                    errors.venue ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={100}
                />
                {errors.venue && (
                  <p className="text-red-500 text-sm mt-1">{errors.venue}</p>
                )}
              </div>

              {/* チケット料金 */}
              <div>
                <label htmlFor="ticketPrice" className="block text-sm font-bold text-theater-neutral-900 mb-2">
                  <FaYenSign className="inline mr-1" />
                  チケット料金
                </label>
                <input
                  type="text"
                  id="ticketPrice"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  placeholder="例: 前売3000円、当日3500円"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-theater-primary-500 ${
                    errors.ticketPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={100}
                />
                {errors.ticketPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.ticketPrice}</p>
                )}
              </div>

              {/* 連絡先 */}
              <div>
                <label htmlFor="contactInfo" className="block text-sm font-bold text-theater-neutral-900 mb-2">
                  <FaPhone className="inline mr-1" />
                  連絡先・予約方法
                </label>
                <textarea
                  id="contactInfo"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  placeholder="メールアドレス、電話番号、予約サイトURLなど"
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-theater-primary-500 ${
                    errors.contactInfo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={200}
                />
                {errors.contactInfo && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactInfo}</p>
                )}
              </div>

              {/* 投稿者名 */}
              <div>
                <label htmlFor="authorName" className="block text-sm font-bold text-theater-neutral-900 mb-2">
                  <FaUser className="inline mr-1" />
                  投稿者名
                </label>
                <input
                  type="text"
                  id="authorName"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleChange}
                  placeholder="未入力の場合は「名無しさん」になります"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-theater-primary-500 ${
                    errors.authorName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={50}
                />
                {errors.authorName && (
                  <p className="text-red-500 text-sm mt-1">{errors.authorName}</p>
                )}
              </div>

              {/* 送信ボタン */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-theater-primary-500 hover:bg-theater-primary-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '投稿中...' : '投稿する'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/announcements')}
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