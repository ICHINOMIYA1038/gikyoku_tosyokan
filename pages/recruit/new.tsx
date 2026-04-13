import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import ImageUploader from '@/components/ImageUploader';
import VenueSelector from '@/components/VenueSelector';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaTheaterMasks, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

const ROLES = ['役者', '演出', '脚本', '音響', '照明', '舞台監督', '制作', 'スタッフ全般'];

export default function NewRecruitPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    theaterGroupName: '',
    rolesWanted: [] as string[],
    experienceLevel: 'ANY',
    genderRequirement: '',
    feeStructure: '',
    rehearsalFrequency: '',
    rehearsalLocation: '',
    venue: '',
    startDate: '',
    endDate: '',
    images: [] as string[],
  });

  const toggleRole = (role: string) => {
    setForm((prev) => ({
      ...prev,
      rolesWanted: prev.rolesWanted.includes(role)
        ? prev.rolesWanted.filter((r) => r !== role)
        : [...prev.rolesWanted, role],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError('タイトルと募集内容は必須です');
      return;
    }
    if (form.rolesWanted.length === 0) {
      setError('募集する役割を1つ以上選択してください');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/recruitments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/recruit/${data.id}`);
      } else {
        const err = await res.json();
        setError(err.error || '投稿に失敗しました');
      }
    } catch {
      setError('通信エラーが発生しました');
    }
    setSaving(false);
  };

  return (
    <Layout>
      <Seo pageTitle="劇団員募集を投稿" pageDescription="劇団員・スタッフの募集を投稿します" pagePath="/recruit/new" />
      <div className="min-h-screen bg-gradient-to-b from-theater-primary-50 to-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/recruit" className="text-gray-500 hover:text-gray-700"><FaArrowLeft /></Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaTheaterMasks className="text-theater-primary-500" />
              劇団員募集を投稿
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            {/* タイトル */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">募集タイトル <span className="text-red-500">*</span></label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="例: 2026年夏公演 キャスト募集" maxLength={100} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200" />
            </div>

            {/* 劇団名 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">劇団・団体名</label>
              <input type="text" value={form.theaterGroupName} onChange={(e) => setForm({ ...form, theaterGroupName: e.target.value })} placeholder="例: 劇団△△（個人の場合は空欄可）" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200" />
            </div>

            {/* 募集する役割 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">募集する役割 <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                {ROLES.map((role) => (
                  <button key={role} type="button" onClick={() => toggleRole(role)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${form.rolesWanted.includes(role) ? 'bg-theater-primary-600 text-white border-theater-primary-600' : 'bg-white text-gray-600 border-gray-300 hover:border-theater-primary-400'}`}>
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* 経験 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">経験レベル</label>
              <select value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200">
                <option value="ANY">問わない</option>
                <option value="BEGINNER">未経験歓迎</option>
                <option value="EXPERIENCED">経験者優遇</option>
              </select>
            </div>

            {/* 期間 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">活動開始日</label>
                <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">活動終了日</label>
                <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200" />
              </div>
            </div>

            {/* 稽古 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">稽古頻度</label>
                <input type="text" value={form.rehearsalFrequency} onChange={(e) => setForm({ ...form, rehearsalFrequency: e.target.value })} placeholder="例: 週2回（平日夜）" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">稽古場所</label>
                <input type="text" value={form.rehearsalLocation} onChange={(e) => setForm({ ...form, rehearsalLocation: e.target.value })} placeholder="例: 都内近郊" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200" />
              </div>
            </div>

            {/* 公演会場 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">公演会場</label>
              <VenueSelector value={form.venue} onChange={(v) => setForm({ ...form, venue: v })} />
            </div>

            {/* 費用 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">費用・ギャラ</label>
              <input type="text" value={form.feeStructure} onChange={(e) => setForm({ ...form, feeStructure: e.target.value })} placeholder="例: チケットノルマなし / 団費月3,000円 / ギャラあり" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200" />
            </div>

            {/* 募集内容 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">募集内容 <span className="text-red-500">*</span></label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="作品について、劇団の雰囲気、求める人物像、オーディション情報など" rows={8} maxLength={5000} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200 resize-y" />
              <p className="text-xs text-gray-400 text-right mt-1">{form.description.length}/5000</p>
            </div>

            {/* 画像 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">画像（任意）</label>
              <ImageUploader images={form.images} onChange={(imgs) => setForm({ ...form, images: imgs })} maxImages={5} label="画像を追加" />
            </div>

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

            {/* ボタン */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <Link href="/recruit" className="text-sm text-gray-500 hover:text-gray-700">キャンセル</Link>
              <button type="submit" disabled={saving} className={`px-8 py-3 rounded-lg text-sm font-medium transition-colors ${saving ? 'bg-gray-200 text-gray-400' : 'bg-theater-primary-600 hover:bg-theater-primary-700 text-white'}`}>
                {saving ? '投稿中...' : '募集を投稿する'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: '/auth/signin?callbackUrl=/recruit/new', permanent: false } };
  }
  return { props: {} };
};
