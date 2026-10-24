import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import Link from 'next/link';
import BoardHeader, { BoardEmpty, BOARD_ROW_TITLE } from '@/components/BoardHeader';
import { timeAgo } from '@/lib/date-format';
import { FEATURES } from '@/lib/feature-flags';
import ComingSoon from '@/components/ComingSoon';

const ROLES = ['役者', '演出', '脚本', '音響', '照明', '舞台監督', '制作', 'スタッフ全般'];
const PREFECTURES = ['東京都', '神奈川県', '大阪府', '京都府', '愛知県', '埼玉県', '千葉県', '福岡県', '北海道', '宮城県'];

export default function RecruitListPage() {
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
      {!FEATURES.recruit ? (
        <ComingSoon
          title="劇団員募集（準備中）"
          description="劇団員・スタッフの募集機能は現在準備中です。サービス開始までもうしばらくお待ちください。"
        />
      ) : (
      <div className="max-w-5xl mx-auto pb-12">
        <BoardHeader
          current="recruit"
          title="劇団員募集"
          description="役者・スタッフの募集と、仲間探し。応募するとメッセージでやり取りできます。"
          postHref="/recruit/new"
          postLabel="募集を投稿する"
        />

        <form onSubmit={handleSearch} role="search" className="mt-6 flex flex-wrap gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="キーワード"
            aria-label="キーワード"
            className="flex-1 min-w-[12rem] h-11 px-3 rounded border border-[#D9D5CF] text-base focus:outline-none focus:border-theater-primary-600"
          />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            aria-label="役割"
            className="h-11 px-3 rounded border border-[#D9D5CF] bg-white text-sm"
          >
            <option value="">役割（すべて）</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select
            value={selectedPrefecture}
            onChange={(e) => setSelectedPrefecture(e.target.value)}
            aria-label="地域"
            className="h-11 px-3 rounded border border-[#D9D5CF] bg-white text-sm"
          >
            <option value="">地域（すべて）</option>
            {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <button type="submit" className="h-11 px-5 rounded border border-gray-900 text-gray-900 text-sm font-bold hover:bg-[#F4F2EE]">
            絞り込む
          </button>
        </form>

        <div className="mt-6">
          {loading ? (
            <p className="py-12 text-center text-gray-500">読み込み中…</p>
          ) : recruitments.length === 0 ? (
            <BoardEmpty message="この条件の募集はありません。" postHref="/recruit/new" postLabel="募集を投稿する" />
          ) : (
            <ul className="border-t border-[#D9D5CF]">
              {recruitments.map((r: any) => {
                const days = r.expiresAt ? Math.ceil((new Date(r.expiresAt).getTime() - Date.now()) / 86400000) : null;
                const who = r.theaterGroupName || r.theaterGroup?.name || r.poster?.name || '個人';
                const place = r.venue || r.rehearsalLocation;
                const extras = [
                  ...(r.vibe || []),
                  r.experienceLevel === 'BEGINNER' ? '未経験歓迎' : r.experienceLevel === 'EXPERIENCED' ? '経験者優遇' : null,
                ].filter(Boolean);
                return (
                  <li key={r.id} className="border-b border-[#D9D5CF]">
                    <Link
                      href={`/recruit/${r.id}`}
                      className="group grid md:grid-cols-[minmax(0,1fr)_9rem] gap-x-4 py-4 px-2 hover:bg-[#F4F2EE] transition-colors"
                    >
                      <div className="min-w-0">
                        <h2 className={BOARD_ROW_TITLE}>
                          {r.title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-700 truncate">
                          {[who, r.genre, place].filter(Boolean).join('　/　')}
                        </p>
                        {r.rolesWanted?.length > 0 && (
                          <p className="mt-1 text-sm text-gray-900">
                            <span className="text-gray-500">募集　</span>
                            {r.rolesWanted.join('・')}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{r.description}</p>
                        {extras.length > 0 && <p className="mt-1 text-xs text-gray-500">{extras.join('・')}</p>}
                        <p className="md:hidden mt-2 text-xs text-gray-500">
                          {days !== null && days >= 0 && <span className={days <= 7 ? 'text-theater-primary-700 font-bold' : ''}>締切まであと{days}日・</span>}
                          {timeAgo(r.publishedAt)}
                          {r.applicationCount > 0 && `・応募${r.applicationCount}件`}
                        </p>
                      </div>
                      <div className="hidden md:block text-right text-xs text-gray-500 leading-relaxed">
                        {days !== null && days >= 0 && (
                          <p className={days <= 7 ? 'text-theater-primary-700 font-bold' : 'text-gray-700'}>締切まであと{days}日</p>
                        )}
                        <p>{timeAgo(r.publishedAt)}</p>
                        {r.applicationCount > 0 && <p>応募{r.applicationCount}件</p>}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      )}
    </Layout>
  );
}
