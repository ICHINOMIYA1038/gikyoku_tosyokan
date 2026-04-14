import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import ImageUploader from '@/components/ImageUploader';
import VenueSelector from '@/components/VenueSelector';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  FaTheaterMasks, FaArrowLeft, FaArrowRight, FaUsers, FaUserTie,
  FaGraduationCap, FaBriefcase, FaStar, FaHandshake, FaChalkboardTeacher,
  FaFire, FaLeaf, FaSeedling, FaCoffee, FaPaintBrush, FaMusic,
  FaBullhorn, FaMapMarkerAlt, FaMicrophone, FaBook,
} from 'react-icons/fa';

// ---- 定数 ----

const RECRUITMENT_TYPES = [
  { value: 'member', label: '劇団メンバー', desc: '常設の劇団に入団する仲間を募集', icon: FaUsers },
  { value: 'cast', label: '公演キャスト', desc: '特定の公演に出演するキャストを募集', icon: FaTheaterMasks },
  { value: 'staff', label: 'スタッフ', desc: '音響・照明・制作などの裏方を募集', icon: FaBriefcase },
];

const GROUP_TYPES = [
  { value: '学生劇団', label: '学生劇団', icon: FaGraduationCap },
  { value: '社会人劇団', label: '社会人劇団', icon: FaBriefcase },
  { value: 'プロ劇団', label: 'プロ劇団', icon: FaStar },
  { value: 'ユニット', label: 'ユニット', icon: FaHandshake },
  { value: 'ワークショップ', label: 'ワークショップ', icon: FaChalkboardTeacher },
];

const GENRES = [
  { value: 'ストレートプレイ', icon: FaTheaterMasks },
  { value: 'ミュージカル', icon: FaMusic },
  { value: 'コメディ', icon: FaBullhorn },
  { value: '朗読劇', icon: FaBook },
  { value: '声劇', icon: FaMicrophone },
  { value: '即興（インプロ）', icon: FaPaintBrush },
  { value: '時代劇', icon: FaTheaterMasks },
  { value: 'ダンス・身体表現', icon: FaUsers },
  { value: '児童劇', icon: FaSeedling },
  { value: '不条理劇', icon: FaPaintBrush },
  { value: '社会派', icon: FaBullhorn },
  { value: 'ファンタジー', icon: FaStar },
  { value: 'ホラー・サスペンス', icon: FaFire },
  { value: '人形劇', icon: FaHandshake },
  { value: 'その他', icon: FaTheaterMasks },
];

const VIBES = [
  { value: 'カジュアル', label: 'カジュアル', desc: '楽しく演劇を楽しむ', icon: FaCoffee },
  { value: '本格派', label: '本格派', desc: 'ストイックに作品を追求', icon: FaFire },
  { value: 'アットホーム', label: 'アットホーム', desc: '仲間と居心地よく', icon: FaUsers },
  { value: 'ゆるめ', label: 'ゆるめ', desc: '自分のペースで参加', icon: FaLeaf },
  { value: '実験的', label: '実験的', desc: '新しい表現に挑戦', icon: FaPaintBrush },
  { value: 'エンタメ重視', label: 'エンタメ重視', desc: 'お客さんを楽しませる', icon: FaBullhorn },
  { value: '少人数', label: '少人数', desc: '密な関係で作品を作る', icon: FaHandshake },
  { value: '大所帯', label: '大所帯', desc: '大人数でワイワイ活動', icon: FaUsers },
];

const ROLES = ['役者', '演出', '脚本', '音響', '照明', '舞台監督', '制作', '映像', '衣装', 'スタッフ全般'];

const FEE_OPTIONS = ['参加費なし', 'チケットノルマあり', '団費あり', 'ギャラあり', '要相談'];

const REGIONS: { name: string; prefs: string[] }[] = [
  { name: '関東', prefs: ['東京都', '神奈川県', '埼玉県', '千葉県', '茨城県', '栃木県', '群馬県'] },
  { name: '関西', prefs: ['大阪府', '京都府', '兵庫県', '奈良県', '滋賀県', '和歌山県'] },
  { name: '東海', prefs: ['愛知県', '静岡県', '岐阜県', '三重県'] },
  { name: '北海道・東北', prefs: ['北海道', '宮城県', '青森県', '岩手県', '秋田県', '山形県', '福島県'] },
  { name: '甲信越・北陸', prefs: ['新潟県', '長野県', '山梨県', '富山県', '石川県', '福井県'] },
  { name: '中国・四国', prefs: ['広島県', '岡山県', '山口県', '鳥取県', '島根県', '香川県', '愛媛県', '徳島県', '高知県'] },
  { name: '九州・沖縄', prefs: ['福岡県', '熊本県', '鹿児島県', '大分県', '宮崎県', '佐賀県', '長崎県', '沖縄県'] },
];

// ---- コンポーネント ----

function ChipSelect({ options, selected, onToggle, multi = false }: {
  options: { value: string; label?: string; desc?: string; icon?: any }[];
  selected: string | string[];
  onToggle: (value: string) => void;
  multi?: boolean;
}) {
  const isSelected = (v: string) => multi ? (selected as string[]).includes(v) : selected === v;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = isSelected(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-center transition-all min-h-[44px] ${
              active
                ? 'border-theater-primary-500 bg-theater-primary-50'
                : 'border-gray-200 bg-white hover:border-gray-300 active:bg-gray-50'
            }`}
          >
            {Icon && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                active ? 'bg-theater-primary-100 text-theater-primary-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <Icon className="text-sm" />
              </div>
            )}
            <p className={`text-xs font-medium leading-tight ${active ? 'text-theater-primary-700' : 'text-gray-600'}`}>
              {opt.label || opt.value}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export default function NewRecruitPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [activeRegion, setActiveRegion] = useState('関東');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    recruitmentType: '',
    theaterGroupName: '',
    groupType: '',
    genre: '',
    vibe: [] as string[],
    rolesWanted: [] as string[],
    experienceLevel: 'ANY',
    feeStructure: '',
    prefecture: '',
    rehearsalFrequency: '',
    rehearsalLocation: '',
    venue: '',
    startDate: '',
    endDate: '',
    images: [] as string[],
  });

  const toggleArrayField = (field: 'rolesWanted' | 'vibe', value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const canProceedStep1 = form.recruitmentType && form.rolesWanted.length > 0 && form.prefecture;
  const canProceedStep2 = form.title.trim() && form.description.trim();

  const handleSubmit = async () => {
    if (!canProceedStep2) {
      setError('タイトルと募集内容は必須です');
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
      <div className="min-h-screen bg-gradient-to-b from-theater-primary-50/50 to-white">
        <div className="max-w-2xl mx-auto px-4 py-8">

          {/* ヘッダー */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/recruit" className="text-gray-400 hover:text-gray-600"><FaArrowLeft /></Link>
            <h1 className="text-xl font-bold">募集を投稿</h1>
          </div>

          {/* ステップインジケーター */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s ? 'bg-theater-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>{s}</div>
                <span className={`text-sm hidden sm:inline ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
                  {s === 1 ? '基本情報' : '詳細・内容'}
                </span>
                {s < 2 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-theater-primary-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: 基本情報 */}
          {step === 1 && (
            <div className="space-y-8">
              {/* 募集の種類 */}
              <section>
                <h2 className="text-base font-bold text-gray-900 mb-3">募集の種類</h2>
                <ChipSelect
                  options={RECRUITMENT_TYPES}
                  selected={form.recruitmentType}
                  onToggle={(v) => setForm({ ...form, recruitmentType: v })}
                />
              </section>

              {/* 募集する役割 */}
              <section>
                <h2 className="text-base font-bold text-gray-900 mb-3">
                  募集する役割 <span className="text-xs text-gray-400 font-normal ml-1">複数選択可</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleArrayField('rolesWanted', role)}
                      className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all min-h-[44px] ${
                        form.rolesWanted.includes(role)
                          ? 'border-theater-primary-500 bg-theater-primary-600 text-white'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 active:bg-gray-50'
                      }`}
                    >{role}</button>
                  ))}
                </div>
              </section>

              {/* 活動地域 */}
              <section>
                <h2 className="text-base font-bold text-gray-900 mb-3">
                  <FaMapMarkerAlt className="inline mr-1 text-gray-400" />活動地域
                </h2>
                {form.prefecture && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1.5 bg-theater-primary-600 text-white text-sm rounded-full font-medium">
                      {form.prefecture}
                    </span>
                    <button type="button" onClick={() => setForm({ ...form, prefecture: '' })} className="text-xs text-gray-400 hover:text-gray-600">変更</button>
                  </div>
                )}
                {!form.prefecture && (
                  <div>
                    {/* リージョンタブ */}
                    <div className="flex gap-1 overflow-x-auto pb-2 mb-3 -mx-1 px-1 scrollbar-hide">
                      {REGIONS.map((region) => (
                        <button
                          key={region.name}
                          type="button"
                          onClick={() => setActiveRegion(region.name)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                            activeRegion === region.name
                              ? 'bg-theater-primary-600 text-white'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >{region.name}</button>
                      ))}
                    </div>
                    {/* 選択中リージョンの都道府県 */}
                    <div className="flex flex-wrap gap-1.5">
                      {REGIONS.find((r) => r.name === activeRegion)?.prefs.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setForm({ ...form, prefecture: p })}
                          className="px-3.5 py-2 text-sm border border-gray-200 rounded-full bg-white text-gray-600 hover:border-theater-primary-400 hover:text-theater-primary-600 active:bg-theater-primary-50 transition-colors min-h-[40px]"
                        >{p.replace(/[都府県]$/, '')}</button>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* ジャンル */}
              <section>
                <h2 className="text-base font-bold text-gray-900 mb-3">ジャンル</h2>
                <div className="flex flex-wrap gap-1.5">
                  {GENRES.map((g) => {
                    const Icon = g.icon;
                    const active = form.genre === g.value;
                    return (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => setForm({ ...form, genre: active ? '' : g.value })}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium border transition-all min-h-[44px] ${
                          active
                            ? 'border-theater-primary-500 bg-theater-primary-600 text-white'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 active:bg-gray-50'
                        }`}
                      >
                        <Icon className="text-xs" /> {g.value}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 雰囲気 */}
              <section>
                <h2 className="text-base font-bold text-gray-900 mb-3">
                  雰囲気・カルチャー <span className="text-xs text-gray-400 font-normal ml-1">複数選択可</span>
                </h2>
                <ChipSelect
                  options={VIBES}
                  selected={form.vibe}
                  onToggle={(v) => toggleArrayField('vibe', v)}
                  multi
                />
              </section>

              {/* 次へ */}
              <div className="pt-4">
                <button
                  onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={!canProceedStep1}
                  className={`w-full py-3.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                    canProceedStep1
                      ? 'bg-theater-primary-600 hover:bg-theater-primary-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  次へ <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: 詳細・内容 */}
          {step === 2 && (
            <div className="space-y-6">
              <button onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                <FaArrowLeft className="text-xs" /> 基本情報に戻る
              </button>

              {/* タイトル */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">募集タイトル <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="例: 2026年夏公演「作品名」キャスト募集"
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200"
                />
              </div>

              {/* 劇団名 + 団体タイプ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">劇団・団体名</label>
                  <input
                    type="text"
                    value={form.theaterGroupName}
                    onChange={(e) => setForm({ ...form, theaterGroupName: e.target.value })}
                    placeholder="個人の場合は空欄可"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">団体タイプ</label>
                  <select
                    value={form.groupType}
                    onChange={(e) => setForm({ ...form, groupType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-theater-primary-200"
                  >
                    <option value="">選択してください</option>
                    {GROUP_TYPES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                </div>
              </div>

              {/* 経験 + 費用 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">経験レベル</label>
                  <select
                    value={form.experienceLevel}
                    onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-theater-primary-200"
                  >
                    <option value="ANY">問わない</option>
                    <option value="BEGINNER">未経験歓迎</option>
                    <option value="EXPERIENCED">経験者優遇</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">費用・ギャラ</label>
                  <select
                    value={form.feeStructure}
                    onChange={(e) => setForm({ ...form, feeStructure: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-theater-primary-200"
                  >
                    <option value="">選択してください</option>
                    {FEE_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              {/* 稽古情報 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">稽古頻度</label>
                  <input
                    type="text"
                    value={form.rehearsalFrequency}
                    onChange={(e) => setForm({ ...form, rehearsalFrequency: e.target.value })}
                    placeholder="例: 週2回（平日夜）"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">公演会場</label>
                  <VenueSelector value={form.venue} onChange={(v) => setForm({ ...form, venue: v })} />
                </div>
              </div>

              {/* 期間 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">開始日</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">終了日</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200" />
                </div>
              </div>

              {/* 募集内容 */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">募集内容 <span className="text-red-500">*</span></label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder={"作品について、劇団の雰囲気、求める人物像などを自由にお書きください。\n\n例:\n・作品の内容や見どころ\n・劇団の活動歴や雰囲気\n・こんな人に来てほしい\n・オーディションの有無"}
                  rows={10}
                  maxLength={5000}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200 resize-y"
                />
                <p className="text-xs text-gray-400 text-right mt-1">{form.description.length}/5000</p>
              </div>

              {/* 画像 */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">画像（任意）</label>
                <ImageUploader images={form.images} onChange={(imgs) => setForm({ ...form, images: imgs })} maxImages={5} />
              </div>

              {error && <p className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-lg">{error}</p>}

              {/* 投稿ボタン */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700">戻る</button>
                <button
                  onClick={handleSubmit}
                  disabled={saving || !canProceedStep2}
                  className={`px-8 py-3.5 rounded-lg text-sm font-bold transition-colors ${
                    saving || !canProceedStep2 ? 'bg-gray-200 text-gray-400' : 'bg-theater-primary-600 hover:bg-theater-primary-700 text-white shadow-sm'
                  }`}
                >
                  {saving ? '投稿中...' : '募集を投稿する'}
                </button>
              </div>
            </div>
          )}
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
