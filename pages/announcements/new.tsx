import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaTheaterMasks, FaCalendarAlt, FaMapMarkerAlt, FaYenSign, FaPhone, FaUser, FaInfoCircle, FaBook, FaUsers, FaSignInAlt } from 'react-icons/fa';
import Seo from '@/components/seo';

type PostSuggestion = {
  id: number;
  title: string;
  author: { name: string };
};

export default function NewAnnouncementPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    performanceDate: '',
    venue: '',
    ticketPrice: '',
    contactInfo: '',
    authorName: '',
    theaterGroupName: '',
    scriptTitle: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 作品サジェスト
  const [postQuery, setPostQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<PostSuggestion | null>(null);
  const [suggestions, setSuggestions] = useState<PostSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestRef = useRef<HTMLDivElement>(null);

  // サジェスト外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 作品検索（デバウンス付き）
  useEffect(() => {
    if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);

    if (postQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    suggestTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/posts/suggest?q=${encodeURIComponent(postQuery)}`);
        if (res.ok) {
          const data: PostSuggestion[] = await res.json();
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        }
      } catch {
        // サジェストの失敗は無視
      }
    }, 300);

    return () => {
      if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);
    };
  }, [postQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePostSelect = (post: PostSuggestion) => {
    setSelectedPost(post);
    setPostQuery(post.title);
    setFormData(prev => ({ ...prev, scriptTitle: post.title }));
    setShowSuggestions(false);
  };

  const handlePostClear = () => {
    setSelectedPost(null);
    setPostQuery('');
    setFormData(prev => ({ ...prev, scriptTitle: '' }));
    setSuggestions([]);
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

    if (formData.theaterGroupName && formData.theaterGroupName.length > 100) {
      newErrors.theaterGroupName = '劇団・団体名は100文字以内で入力してください';
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
      const body: Record<string, any> = { ...formData };
      if (selectedPost) {
        body.postId = selectedPost.id;
      }

      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
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
          <div className="bg-gradient-to-r from-theater-primary-100 via-theater-primary-50 to-theater-primary-100 py-8 px-4">
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
            {/* 未ログイン時: ログイン誘導 */}
            {status !== 'loading' && !session && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="w-16 h-16 bg-theater-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSignInAlt className="text-2xl text-theater-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">ログインが必要です</h2>
                <p className="text-sm text-gray-600 mb-6">
                  公演告知を投稿するにはログインが必要です。<br />
                  ログインすると、投稿した告知の管理や編集ができます。
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/auth/signin?callbackUrl=/announcements/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-theater-primary-600 hover:bg-theater-primary-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <FaSignInAlt />
                    ログインして投稿
                  </Link>
                  <Link
                    href="/auth/signup?callbackUrl=/announcements/new"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  >
                    新規登録（無料）
                  </Link>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Googleアカウントで簡単に登録できます
                </p>
              </div>
            )}

            {/* ログイン済み: 投稿フォーム */}
            {session && (
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

              {/* 上演作品 */}
              <div ref={suggestRef}>
                <label htmlFor="scriptTitle" className="block text-sm font-bold text-theater-neutral-900 mb-2">
                  <FaBook className="inline mr-1" />
                  上演作品
                </label>
                {selectedPost ? (
                  <div className="flex items-center gap-2 px-4 py-2 border border-theater-primary-300 rounded-lg bg-theater-primary-50">
                    <span className="flex-1">
                      {selectedPost.title}
                      <span className="text-gray-500 text-sm ml-2">({selectedPost.author.name})</span>
                    </span>
                    <button
                      type="button"
                      onClick={handlePostClear}
                      className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                    >
                      解除
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      id="scriptTitle"
                      value={postQuery}
                      onChange={(e) => {
                        setPostQuery(e.target.value);
                        setFormData(prev => ({ ...prev, scriptTitle: e.target.value }));
                      }}
                      placeholder="作品名を入力して検索（2文字以上で候補表示）"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-theater-primary-500"
                    />
                    {showSuggestions && (
                      <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((post) => (
                          <li key={post.id}>
                            <button
                              type="button"
                              onClick={() => handlePostSelect(post)}
                              className="w-full text-left px-4 py-2 hover:bg-theater-primary-50 transition-colors"
                            >
                              <span className="font-medium">{post.title}</span>
                              <span className="text-gray-500 text-sm ml-2">({post.author.name})</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  戯曲図書館に登録されている作品を紐づけできます。未登録の場合はそのまま作品名を入力してください。
                </p>
              </div>

              {/* 劇団・団体名 */}
              <div>
                <label htmlFor="theaterGroupName" className="block text-sm font-bold text-theater-neutral-900 mb-2">
                  <FaUsers className="inline mr-1" />
                  劇団・団体名
                </label>
                <input
                  type="text"
                  id="theaterGroupName"
                  name="theaterGroupName"
                  value={formData.theaterGroupName}
                  onChange={handleChange}
                  placeholder="例: 劇団○○、△△シアターカンパニー"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-theater-primary-500 ${
                    errors.theaterGroupName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={100}
                />
                {errors.theaterGroupName && (
                  <p className="text-red-500 text-sm mt-1">{errors.theaterGroupName}</p>
                )}
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

              {/* 投稿者情報（ログインユーザー） */}
              <div>
                <label className="block text-sm font-bold text-theater-neutral-900 mb-2">
                  <FaUser className="inline mr-1" />
                  投稿者
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-theater-primary-50 border border-theater-primary-200 rounded-lg">
                  {session.user.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                    <p className="text-xs text-gray-500">ログイン中のアカウントで投稿されます</p>
                  </div>
                </div>
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
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
