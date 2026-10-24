import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Breadcrumb from '@/components/Breadcrumb';
import LinkifiedText from '@/components/LinkifiedText';
import { InfoTable, ShareLinks, DETAIL_SECTION_TITLE } from '@/components/BoardDetail';
import { formatJstDateTime } from '@/lib/date-format';

interface Props {
  recruitment: any;
  isOwner: boolean;
  hasApplied: boolean;
  hasInterest: boolean;
  isLoggedIn: boolean;
}

export default function RecruitDetailPage({ recruitment: r, isOwner, hasApplied, hasInterest: initialInterest, isLoggedIn }: Props) {
  const router = useRouter();
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [interested, setInterested] = useState(initialInterest);
  const [interestLoading, setInterestLoading] = useState(false);
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
        const data = await res.json();
        // 応募成功 → メッセージ画面に直接遷移
        router.push(`/messages/${data.conversationId}`);
        return;
      } else {
        const err = await res.json();
        setResult(err.error || '応募に失敗しました');
      }
    } catch {
      setResult('通信エラーが発生しました');
    }
    setApplying(false);
  };

  const handleInterest = async () => {
    if (!isLoggedIn) { router.push(`/auth/signin?callbackUrl=/recruit/${r.id}`); return; }
    setInterestLoading(true);
    try {
      const res = await fetch(`/api/recruitments/${r.id}/interest`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setInterested(data.interested);
      }
    } catch {}
    setInterestLoading(false);
  };

  const poster = r.poster;
  const group = r.theaterGroup;
  const expLabels: Record<string, string> = { ANY: '問わない', BEGINNER: '未経験歓迎', EXPERIENCED: '経験者優遇' };
  const who = r.theaterGroupName || group?.name || poster?.displayName || poster?.name || '個人';
  const canApply = !isOwner && r.status === 'ACTIVE' && !applied;

  return (
    <Layout>
      <Seo pageTitle={r.title} pageDescription={r.description?.substring(0, 120)} pagePath={`/recruit/${r.id}`} />
      <div className="max-w-5xl mx-auto pt-6 md:pt-8 pb-12">
        <Breadcrumb items={[{ name: 'ホーム', href: '/' }, { name: '劇団員募集', href: '/recruit' }, { name: r.title }]} />

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-10">
          <article className="min-w-0">
            <header>
              <p className="text-sm text-gray-600">
                劇団員募集
                {r.status !== 'ACTIVE' && (
                  <span className="ml-2 px-1.5 py-px border border-gray-500 rounded text-xs text-gray-700">
                    {r.status === 'CLOSED' ? '募集終了' : '一時停止中'}
                  </span>
                )}
              </p>
              <h1 className="mt-1 text-[24px] md:text-[32px] font-serif font-bold text-gray-900 leading-snug">{r.title}</h1>
              <div className="mt-3 flex items-center gap-3 text-sm">
                {(poster?.avatarUrl || poster?.image) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={poster.avatarUrl || poster.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                )}
                <div>
                  {group?.slug ? (
                    <Link href={`/theater-groups/${group.slug}`} className="font-bold text-gray-900 hover:underline">{who}</Link>
                  ) : (
                    <Link href={`/users/${poster?.id}`} className="font-bold text-gray-900 hover:underline">{who}</Link>
                  )}
                  <span className="ml-2 text-gray-600">{formatJstDateTime(r.publishedAt || r.createdAt, false)}に投稿</span>
                </div>
              </div>
              {canApply && (
                <a href="#apply" className="lg:hidden mt-4 inline-flex items-center justify-center w-full h-12 rounded bg-theater-primary-600 text-white font-bold">
                  応募する・興味ありを伝える
                </a>
              )}
            </header>

            <div className="mt-6">
              <InfoTable
                rows={[
                  { label: '募集する役割', value: r.rolesWanted?.length ? r.rolesWanted.join('・') : null },
                  { label: '経験', value: r.experienceLevel ? expLabels[r.experienceLevel] || r.experienceLevel : null },
                  { label: '期間', value: r.startDate || r.endDate ? [r.startDate && formatJstDateTime(r.startDate, false), r.endDate && formatJstDateTime(r.endDate, false)].filter(Boolean).join(' 〜 ') : null },
                  { label: '稽古', value: [r.rehearsalFrequency, r.rehearsalLocation].filter(Boolean).join('　/　') || null },
                  { label: '公演会場', value: r.venue },
                  { label: '費用', value: r.feeStructure },
                  { label: '地域', value: group?.prefecture },
                  { label: '締切', value: r.expiresAt ? formatJstDateTime(r.expiresAt, false) : null },
                ]}
              />
            </div>

            {r.images?.length > 0 && (
              <div className="mt-6 flex gap-3 overflow-x-auto">
                {r.images.map((img: string, i: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={img} alt="" className="h-36 w-auto max-w-none rounded object-cover" />
                ))}
              </div>
            )}

            <section className="mt-8">
              <h2 className={DETAIL_SECTION_TITLE}>募集内容</h2>
              <LinkifiedText text={r.description || ''} className="mt-3 text-base leading-[1.9] text-gray-900" />
            </section>

            <div className="mt-8 pt-6 border-t border-[#D9D5CF]">
              <ShareLinks url={`https://gikyokutosyokan.com/recruit/${r.id}`} text={`【劇団員募集】${r.title}`} />
            </div>
          </article>

          <aside id="apply" className="mt-10 lg:mt-0 scroll-mt-20">
            <div className="lg:sticky lg:top-24 border border-[#D9D5CF] rounded p-5">
              {isOwner ? (
                <>
                  <p className="text-sm text-gray-800">あなたの募集です。応募は{r._count?.applications ?? 0}件あります。</p>
                  <Link href="/messages" className="mt-3 inline-flex items-center justify-center w-full h-11 rounded border border-gray-900 text-sm font-bold text-gray-900 hover:bg-[#F4F2EE]">
                    メッセージを見る
                  </Link>
                </>
              ) : r.status !== 'ACTIVE' ? (
                <p className="text-sm text-gray-700">この募集は受け付けを終えています。</p>
              ) : !isLoggedIn ? (
                <>
                  <p className="text-sm text-gray-800">応募や「興味あり」を送るには、無料のログインが必要です。</p>
                  <Link href={`/auth/signin?callbackUrl=/recruit/${r.id}`} className="mt-3 inline-flex items-center justify-center w-full h-12 rounded bg-theater-primary-600 hover:bg-theater-primary-700 text-white font-bold">
                    ログインして応募する
                  </Link>
                </>
              ) : applied ? (
                <p className="text-sm font-bold text-[#1F7A4D]">応募済みです。続きはメッセージでやり取りできます。</p>
              ) : showApplyForm ? (
                <div>
                  <label htmlFor="apply-message" className="block text-sm font-bold text-gray-900">応募のメッセージ</label>
                  <textarea
                    id="apply-message"
                    value={applyMessage}
                    onChange={(e) => setApplyMessage(e.target.value)}
                    placeholder="自己紹介、これまでの経験、参加できる日など"
                    rows={7}
                    maxLength={2000}
                    className="mt-2 w-full p-3 rounded border border-[#D9D5CF] text-base resize-y focus:outline-none focus:border-theater-primary-600"
                  />
                  <p className="mt-1 text-xs text-gray-600">送ると、募集した人とのメッセージの画面に移ります。</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setShowApplyForm(false)} className="h-11 px-3 text-sm text-gray-700 underline underline-offset-4">やめる</button>
                    <button onClick={handleApply} disabled={applying || !applyMessage.trim()} className="flex-1 h-11 rounded bg-theater-primary-600 hover:bg-theater-primary-700 text-white text-sm font-bold disabled:bg-gray-300 disabled:text-gray-600">
                      {applying ? '送信中…' : '応募する'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button onClick={() => setShowApplyForm(true)} className="w-full h-12 rounded bg-theater-primary-600 hover:bg-theater-primary-700 text-white font-bold">
                    応募する
                  </button>
                  {interested ? (
                    <p className="text-sm text-gray-800 text-center">「興味あり」を送りました</p>
                  ) : (
                    <>
                      <button onClick={handleInterest} disabled={interestLoading} className="w-full h-11 rounded border border-theater-primary-600 text-theater-primary-700 text-sm font-bold hover:bg-theater-primary-50">
                        まずは「興味あり」を伝える
                      </button>
                      <p className="text-xs text-gray-600">応募の前に、募集した人へ通知だけ送れます。</p>
                    </>
                  )}
                </div>
              )}
              {result && <p role="status" className="mt-3 text-sm text-theater-primary-700">{result}</p>}
            </div>
          </aside>
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
  let hasInterest = false;
  if (session) {
    const [app, interest] = await Promise.all([
      prisma.application.findUnique({
        where: { recruitmentId_applicantId: { recruitmentId: id, applicantId: session.user.id } },
      }),
      prisma.interest.findUnique({
        where: { recruitmentId_userId: { recruitmentId: id, userId: session.user.id } },
      }),
    ]);
    hasApplied = !!app;
    hasInterest = !!interest;
  }

  return {
    props: {
      recruitment: JSON.parse(JSON.stringify(recruitment)),
      isOwner: session?.user?.id === recruitment.postedBy,
      hasApplied,
      hasInterest,
      isLoggedIn: !!session,
    },
  };
};
