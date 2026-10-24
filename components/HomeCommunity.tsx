import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { performanceDateParts, timeAgo } from "@/lib/date-format";

type RecentComment = {
  id: number;
  content: string;
  author: string;
  date: string;
  commentType: string | null;
  postId: number;
  postTitle: string;
  postAuthor: string;
};

const getJson = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
};

const QUERY_OPTIONS = { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false } as const;

// 全体の h2/h3 の余白と大きさ（globals.css）を打ち消す
const H2 = "!my-0 !pb-0 !text-[22px] md:!text-[26px] !font-bold !text-gray-900";
const H3 = "!my-0 !text-base !font-bold !text-gray-900";

function ColumnHead({ title, href, more }: { title: string; href: string; more: string }) {
  return (
    <div className="flex items-baseline justify-between border-b-2 border-gray-900 pb-2">
      <h3 className={H3}>{title}</h3>
      <Link href={href} className="text-sm text-theater-primary-700 hover:underline">
        {more}
      </Link>
    </div>
  );
}

function Placeholder({ rows }: { rows: number }) {
  return (
    <ul aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="py-4 border-b border-[#D9D5CF]">
          <div className="h-4 w-1/2 bg-[#F4F2EE] rounded" />
          <div className="mt-2 h-3 w-full bg-[#F4F2EE] rounded" />
        </li>
      ))}
    </ul>
  );
}

// トップの「みんなの書き込み」。作品への新しい声と、掲示板の新着を並べ、書き込む入口を置く
export default function HomeCommunity() {
  const comments = useQuery<RecentComment[]>({ queryKey: ["recentComments"], queryFn: () => getJson("/api/recent-comments"), ...QUERY_OPTIONS });
  const announcements = useQuery<any>({ queryKey: ["homeAnnouncements"], queryFn: () => getJson("/api/announcements?limit=4"), ...QUERY_OPTIONS });
  const recruits = useQuery<any>({ queryKey: ["homeRecruits"], queryFn: () => getJson("/api/recruitments?limit=3"), ...QUERY_OPTIONS });

  return (
    <section aria-labelledby="home-community" className="max-w-6xl mx-auto px-4 pt-10 pb-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="home-community" className={H2}>みんなの書き込み</h2>
          <p className="mt-1 text-sm text-gray-700">作品を読んだ人・上演した人の声と、公演や仲間探しのお知らせ。</p>
        </div>
        <div className="flex gap-2">
          <Link href="/announcements/new" className="inline-flex items-center h-10 px-4 rounded bg-theater-primary-600 hover:bg-theater-primary-700 text-white text-sm font-bold">
            公演を告知する
          </Link>
          <Link href="/recruit/new" className="inline-flex items-center h-10 px-4 rounded border border-theater-primary-600 text-theater-primary-700 text-sm font-bold hover:bg-theater-primary-50">
            仲間を募集する
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <ColumnHead title="作品への声" href="/ranking" more="作品を探して書く" />
          {comments.isLoading ? (
            <Placeholder rows={4} />
          ) : comments.data && comments.data.length > 0 ? (
            <ul>
              {comments.data.map((c) => (
                <li key={c.id} className="border-b border-[#D9D5CF]">
                  <Link href={`/posts/${c.postId}#comments-section`} className="group block py-4 px-1 hover:bg-[#F4F2EE]">
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-serif font-bold text-[17px] text-gray-900 group-hover:text-theater-primary-700">{c.postTitle}</span>
                      <span className="text-sm text-gray-600">{c.postAuthor}</span>
                    </span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-gray-800 line-clamp-2">{c.content}</span>
                    <span className="mt-1 block text-xs text-gray-500">
                      {c.author}・{c.date}
                      {c.commentType && <span className="ml-2 px-1.5 py-px border border-[#D9D5CF] rounded text-gray-700">{c.commentType}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-sm text-gray-700 border-b border-[#D9D5CF]">まだ書き込みはありません。作品のページから感想を書けます。</p>
          )}
          <p className="mt-3 text-sm text-gray-600">感想や上演の記録は、それぞれの作品のページの「みんなの声」から書けます。</p>
        </div>

        <div className="min-w-0 space-y-10">
          <div>
            <ColumnHead title="上演告知" href="/announcements" more="すべて見る" />
            {announcements.isLoading ? (
              <Placeholder rows={3} />
            ) : announcements.data?.announcements?.length > 0 ? (
              <ul>
                {announcements.data.announcements.map((a: any) => {
                  const d = a.performanceDate ? performanceDateParts(a.performanceDate) : null;
                  return (
                    <li key={a.id} className="border-b border-[#D9D5CF]">
                      <Link href={`/announcements/${a.id}`} className="group grid grid-cols-[4.25rem_minmax(0,1fr)] gap-x-3 py-3 px-1 hover:bg-[#F4F2EE]">
                        <span className="text-sm tabular-nums leading-tight">
                          {d ? (
                            <>
                              <span className="block font-bold text-gray-900">{d.monthDay}</span>
                              <span className="block text-gray-600">（{d.weekday}）</span>
                            </>
                          ) : (
                            <span className="text-gray-500">日程未定</span>
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-theater-primary-700">{a.title}</span>
                          <span className="block mt-0.5 text-xs text-gray-600 truncate">{[a.venue, a.theaterGroupName].filter(Boolean).join("　/　")}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="py-6 text-sm text-gray-700 border-b border-[#D9D5CF]">まだ告知はありません。</p>
            )}
          </div>

          <div>
            <ColumnHead title="劇団員募集" href="/recruit" more="すべて見る" />
            {recruits.isLoading ? (
              <Placeholder rows={2} />
            ) : recruits.data?.recruitments?.length > 0 ? (
              <ul>
                {recruits.data.recruitments.map((r: any) => (
                  <li key={r.id} className="border-b border-[#D9D5CF]">
                    <Link href={`/recruit/${r.id}`} className="group block py-3 px-1 hover:bg-[#F4F2EE]">
                      <span className="block font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-theater-primary-700">{r.title}</span>
                      <span className="block mt-0.5 text-xs text-gray-600 truncate">
                        {[r.theaterGroupName || r.theaterGroup?.name, r.rolesWanted?.length ? `募集：${r.rolesWanted.join("・")}` : null, r.publishedAt && timeAgo(r.publishedAt)].filter(Boolean).join("　/　")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-sm text-gray-700 border-b border-[#D9D5CF]">いま募集はありません。</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
