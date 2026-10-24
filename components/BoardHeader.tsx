import Link from "next/link";
import { useSession } from "next-auth/react";

export type BoardKey = "announcements" | "recruit" | "reports";

const BOARDS: { key: BoardKey; label: string; href: string }[] = [
  { key: "announcements", label: "上演告知", href: "/announcements" },
  { key: "recruit", label: "劇団員募集", href: "/recruit" },
  { key: "reports", label: "上演レポート", href: "/reports" },
];

type BoardHeaderProps = {
  current: BoardKey;
  title: string;
  description: string;
  postHref: string;
  postLabel: string;
};

// ログインしていない人は、ログインのあとに投稿のページへ戻す
export function usePostHref(postHref: string) {
  const { data: session } = useSession();
  return session ? postHref : `/auth/signin?callbackUrl=${encodeURIComponent(postHref)}`;
}

// 掲示板3つの共通の頭。掲示板どうしを行き来するタブと、見出し、投稿のボタン
export default function BoardHeader({ current, title, description, postHref, postLabel }: BoardHeaderProps) {
  const href = usePostHref(postHref);

  return (
    <header className="pt-6 md:pt-8">
      <nav aria-label="掲示板" className="flex gap-6 border-b border-[#D9D5CF] text-sm overflow-x-auto">
        {BOARDS.map((b) => (
          <Link
            key={b.key}
            href={b.href}
            aria-current={b.key === current ? "page" : undefined}
            className={`-mb-px py-2 whitespace-nowrap border-b-2 ${
              b.key === current
                ? "border-theater-primary-600 text-gray-900 font-bold"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {b.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[26px] md:text-[32px] font-serif font-bold text-gray-900 leading-tight">{title}</h1>
          <p className="mt-2 text-base text-gray-600">{description}</p>
        </div>
        <Link
          href={href}
          className="inline-flex items-center justify-center h-11 px-5 rounded bg-theater-primary-600 hover:bg-theater-primary-700 text-white font-bold text-sm transition-colors shrink-0"
        >
          {postLabel}
        </Link>
      </div>
    </header>
  );
}

type BoardEmptyProps = { message: string; postHref: string; postLabel: string };

// まだ書き込みがないとき。絵は置かず、一文と投稿のボタンだけ
export function BoardEmpty({ message, postHref, postLabel }: BoardEmptyProps) {
  const href = usePostHref(postHref);
  return (
    <div className="border-y border-[#D9D5CF] py-12 text-center">
      <p className="text-gray-700">{message}</p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center h-11 px-5 rounded border border-theater-primary-600 text-theater-primary-700 font-bold text-sm hover:bg-theater-primary-50 transition-colors"
      >
        {postLabel}
      </Link>
    </div>
  );
}

// 一覧の行の見出し。全体の h2 の余白と大きさ（globals.css）を打ち消し、文節での改行もやめる（短い行で崩れるため）
export const BOARD_ROW_TITLE =
  "!my-0 !pb-0 !text-[17px] !font-bold leading-snug !text-gray-900 group-hover:!text-theater-primary-700 line-clamp-2 [word-break:normal] [text-wrap:pretty]";
