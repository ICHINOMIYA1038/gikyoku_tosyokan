import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaTheaterMasks, FaPlus, FaMapMarkerAlt, FaUsers, FaClock, FaSearch } from 'react-icons/fa';

const ROLES = ['役者', '演出', '脚本', '音響', '照明', '舞台監督', '制作', 'スタッフ全般'];
const PREFECTURES = ['東京都', '神奈川県', '大阪府', '京都府', '愛知県', '埼玉県', '千葉県', '福岡県', '北海道', '宮城県'];

export default function RecruitListPage() {
  const { data: session } = useSession();
  const [recruitments, setRecruitments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPrefecture, setSelectedPrefecture] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedRole) params.set('role', selectedRole);
    if (selectedPrefecture) params.set('prefecture', selectedPrefecture);

    const res = await fetch(`/api/recruitments?${params}`);
    if (res.ok) {
      const data = await res.json();
      setRecruitments(data.recruitments || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [selectedRole, selectedPrefecture]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <Layout>
      <Seo
        pageTitle="劇団員募集"
        pageDescription="演劇の仲間を探そう。劇団員・スタッフの募集情報を検索・投稿できます。"
        pagePath="/recruit"
      />
      <div className="min-h-screen bg-gradient-to-b from-theater-primary-50 to-white">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-theater-primary-100 via-theater-primary-50 to-theater-primary-100 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FaTheaterMasks className="text-theater-primary-500" />
                  劇団員募集
                </h1>
                <p className="text-gray-600 mt-1">演劇の仲間を見つけよう</p>
              </div>
              {session && (
                <Link
                  href="/recruit/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-theater-primary-600 hover:bg-theater-primary-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                  <FaPlus />
                  募集を投稿
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* 検索・フィルタ */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <form onSubmit={handleSearch} className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px] relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="キーワードで検索..."
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200"
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200"
              >
                <option value="">役割を選択</option>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <select
                value={selectedPrefecture}
                onChange={(e) => setSelectedPrefecture(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200"
              >
                <option value="">地域を選択</option>
                {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <button type="submit" className="px-5 py-2.5 bg-theater-primary-600 hover:bg-theater-primary-700 text-white rounded-lg text-sm font-medium">
                検索
              </button>
            </form>
          </div>

          {/* 一覧 */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-theater-primary-500"></div>
            </div>
          ) : recruitments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FaTheaterMasks className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">現在、募集はありません</p>
              {session ? (
                <Link href="/recruit/new" className="inline-flex items-center gap-2 px-6 py-3 bg-theater-primary-600 hover:bg-theater-primary-700 text-white rounded-lg font-medium">
                  <FaPlus /> 最初の募集を投稿する
                </Link>
              ) : (
                <Link href="/auth/signup" className="text-theater-primary-600 hover:underline font-medium">
                  ログインして募集を投稿
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {recruitments.map((r: any) => (
                <Link key={r.id} href={`/recruit/${r.id}`} className="block">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:border-theater-primary-300 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h2 className="text-lg font-bold text-gray-900">{r.title}</h2>
                          {r.expiresAt && (() => {
                            const days = Math.ceil((new Date(r.expiresAt).getTime() - Date.now()) / (1000*60*60*24));
                            if (days <= 7) return <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] rounded-full font-bold">あと{days}日</span>;
                            if (days <= 30) return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded-full font-medium">あと{days}日</span>;
                            return null;
                          })()}
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                          <FaTheaterMasks className="text-xs text-gray-400" />
                          {r.theaterGroupName || r.theaterGroup?.name || r.poster?.name || '個人'}
                          {r.genre && <span className="text-xs text-gray-400 ml-1">· {r.genre}</span>}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{r.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {r.rolesWanted?.map((role: string) => (
                            <span key={role} className="px-2 py-0.5 bg-theater-primary-50 text-theater-primary-700 text-xs rounded-full font-medium">
                              {role}
                            </span>
                          ))}
                          {r.vibe?.map((v: string) => (
                            <span key={v} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                              {v}
                            </span>
                          ))}
                          {r.experienceLevel && r.experienceLevel !== 'ANY' && (
                            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                              {r.experienceLevel === 'BEGINNER' ? '未経験歓迎' : '経験者優遇'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-400 flex-shrink-0">
                        <p>{new Date(r.publishedAt).toLocaleDateString('ja-JP')}</p>
                        {r.applicationCount > 0 && (
                          <p className="mt-1 text-theater-primary-600 font-medium">
                            <FaUsers className="inline mr-1" />
                            {r.applicationCount}件応募
                          </p>
                        )}
                      </div>
                    </div>
                    {(r.venue || r.rehearsalLocation) && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                        <FaMapMarkerAlt className="text-gray-400" />
                        {r.venue || r.rehearsalLocation}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
