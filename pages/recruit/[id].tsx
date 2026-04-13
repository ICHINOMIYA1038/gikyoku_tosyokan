import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import Link from 'next/link';
import { useState } from 'react';
import { FaTheaterMasks, FaMapMarkerAlt, FaClock, FaYenSign, FaUsers, FaCalendarAlt, FaArrowLeft, FaPaperPlane, FaSignInAlt } from 'react-icons/fa';

interface Props {
  recruitment: any;
  isOwner: boolean;
  hasApplied: boolean;
  isLoggedIn: boolean;
}

export default function RecruitDetailPage({ recruitment: r, isOwner, hasApplied, isLoggedIn }: Props) {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(hasApplied);
  const [result, setResult] = useState('');

  const handleApply = async () => {
    if (!applyMessage.trim()) return;
    setApplying(true);
    try {
      const res = await fetch(`/api/recruitments/${r.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: applyMessage }),
      });
      if (res.ok) {
        setApplied(true);
        setShowApplyForm(false);
        setResult('応募しました。メッセージで募集者とやりとりできます。');
      } else {
        const err = await res.json();
        setResult(err.error || '応募に失敗しました');
      }
    } catch {
      setResult('通信エラーが発生しました');
    }
    setApplying(false);
  };

  const poster = r.poster;
  const group = r.theaterGroup;
  const expLabels: Record<string, string> = { ANY: '問わない', BEGINNER: '未経験歓迎', EXPERIENCED: '経験者優遇' };

  return (
    <Layout>
      <Seo pageTitle={r.title} pageDescription={r.description?.substring(0, 120)} pagePath={`/recruit/${r.id}`} />
      <div className="min-h-screen bg-gradient-to-b from-theater-primary-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/recruit" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <FaArrowLeft /> 募集一覧に戻る
          </Link>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            {/* ステータスバッジ */}
            {r.status !== 'ACTIVE' && (
              <span className="inline-block px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full mb-3">
                {r.status === 'CLOSED' ? '募集終了' : '一時停止中'}
              </span>
            )}

            <h1 className="text-2xl font-bold text-gray-900 mb-3">{r.title}</h1>

            {/* 劇団・投稿者情報 */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              {poster?.avatarUrl || poster?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={poster.avatarUrl || poster.image} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-theater-primary-100 flex items-center justify-center">
                  <FaTheaterMasks className="text-theater-primary-500" />
                </div>
              )}
              <div>
                <Link href={`/users/${poster?.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                  {r.theaterGroupName || group?.name || poster?.displayName || poster?.name || '個人'}
                </Link>
                {group?.prefecture && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <FaMapMarkerAlt /> {group.prefecture}
                  </p>
                )}
              </div>
            </div>

            {/* 募集する役割 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {r.rolesWanted?.map((role: string) => (
                <span key={role} className="px-3 py-1 bg-theater-primary-50 text-theater-primary-700 text-sm rounded-full font-medium border border-theater-primary-200">
                  {role}
                </span>
              ))}
            </div>

            {/* 詳細情報 */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {r.experienceLevel && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUsers className="text-gray-400" /> {expLabels[r.experienceLevel] || r.experienceLevel}
                </div>
              )}
              {(r.startDate || r.endDate) && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendarAlt className="text-gray-400" />
                  {r.startDate && new Date(r.startDate).toLocaleDateString('ja-JP')}
                  {r.startDate && r.endDate && ' 〜 '}
                  {r.endDate && new Date(r.endDate).toLocaleDateString('ja-JP')}
                </div>
              )}
              {r.venue && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="text-gray-400" /> {r.venue}
                </div>
              )}
              {r.rehearsalFrequency && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaClock className="text-gray-400" /> {r.rehearsalFrequency}
                </div>
              )}
              {r.feeStructure && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaYenSign className="text-gray-400" /> {r.feeStructure}
                </div>
              )}
              {r.rehearsalLocation && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="text-gray-400" /> 稽古: {r.rehearsalLocation}
                </div>
              )}
            </div>

            {/* 画像 */}
            {r.images?.length > 0 && (
              <div className="flex gap-3 mb-6 overflow-x-auto">
                {r.images.map((img: string, i: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={img} alt="" className="w-48 h-32 object-cover rounded-lg border" />
                ))}
              </div>
            )}

            {/* 募集内容 */}
            <div className="prose prose-sm max-w-none">
              <h2 className="text-lg font-bold mb-2">募集内容</h2>
              <div className="whitespace-pre-wrap text-gray-700">{r.description}</div>
            </div>
          </div>

          {/* 応募ボタン/フォーム */}
          {!isOwner && r.status === 'ACTIVE' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {result && (
                <p className={`text-sm font-medium mb-4 ${result.includes('失敗') ? 'text-red-600' : 'text-green-600'}`}>{result}</p>
              )}

              {!isLoggedIn ? (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">応募するにはログインが必要です</p>
                  <Link href={`/auth/signin?callbackUrl=/recruit/${r.id}`} className="inline-flex items-center gap-2 px-6 py-3 bg-theater-primary-600 hover:bg-theater-primary-700 text-white rounded-lg font-medium">
                    <FaSignInAlt /> ログインして応募
                  </Link>
                </div>
              ) : applied ? (
                <p className="text-center text-sm text-green-600 font-medium">✓ 応募済みです</p>
              ) : showApplyForm ? (
                <div className="space-y-4">
                  <h3 className="font-bold">応募メッセージ</h3>
                  <textarea
                    value={applyMessage}
                    onChange={(e) => setApplyMessage(e.target.value)}
                    placeholder="自己紹介、経歴、意気込みなどを書いてください"
                    rows={6}
                    maxLength={2000}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200 resize-y"
                  />
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setShowApplyForm(false)} className="px-4 py-2 text-sm text-gray-500">キャンセル</button>
                    <button onClick={handleApply} disabled={applying || !applyMessage.trim()} className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium ${applying || !applyMessage.trim() ? 'bg-gray-200 text-gray-400' : 'bg-theater-primary-600 hover:bg-theater-primary-700 text-white'}`}>
                      <FaPaperPlane /> {applying ? '送信中...' : '応募する'}
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowApplyForm(true)} className="w-full py-3 bg-theater-primary-600 hover:bg-theater-primary-700 text-white rounded-lg font-medium text-lg transition-colors flex items-center justify-center gap-2">
                  <FaPaperPlane /> この募集に応募する
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const id = context.params?.id as string;
  const session = await getServerSession(context.req, context.res, authOptions);

  const recruitment = await prisma.recruitment.findUnique({
    where: { id },
    include: {
      poster: { select: { id: true, name: true, displayName: true, image: true, avatarUrl: true } },
      theaterGroup: { select: { id: true, name: true, slug: true, prefecture: true, groupType: true, website: true } },
      _count: { select: { applications: true } },
    },
  });

  if (!recruitment) return { notFound: true };

  let hasApplied = false;
  if (session) {
    const app = await prisma.application.findUnique({
      where: { recruitmentId_applicantId: { recruitmentId: id, applicantId: session.user.id } },
    });
    hasApplied = !!app;
  }

  return {
    props: {
      recruitment: JSON.parse(JSON.stringify(recruitment)),
      isOwner: session?.user?.id === recruitment.postedBy,
      hasApplied,
      isLoggedIn: !!session,
    },
  };
};
