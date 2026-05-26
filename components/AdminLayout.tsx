/**
 * 管理画面 (/_ops/q3k7n2p8/*) 共通レイアウト。
 * - サイドナビ
 * - Layout (公開サイト) は使わず、独立した最小レイアウト
 */
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Flag,
  Megaphone,
  UserPlus,
  Mail,
  ExternalLink,
} from "lucide-react";

const SLUG = "q3k7n2p8";
const BASE = `/_ops/${SLUG}`;

const NAV = [
  { href: `${BASE}`, label: "ダッシュボード", icon: LayoutDashboard, exact: true },
  { href: `${BASE}/users`, label: "ユーザー", icon: Users },
  { href: `${BASE}/comments`, label: "コメント", icon: MessageSquare },
  { href: `${BASE}/reports`, label: "通報", icon: Flag },
  { href: `${BASE}/announcements`, label: "上演告知", icon: Megaphone },
  { href: `${BASE}/recruitments`, label: "募集", icon: UserPlus },
  { href: `${BASE}/broadcasts`, label: "案内メール", icon: Mail },
];

export function AdminLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{title} | 戯曲図書館 管理</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href={BASE} className="text-sm font-semibold text-gray-900">
              戯曲図書館 <span className="text-rose-600">管理</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
              target="_blank"
            >
              公開サイトを見る <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </header>

        <div className="container mx-auto max-w-6xl px-4 py-6 md:flex md:gap-6">
          <nav className="mb-4 md:mb-0 md:w-52 md:shrink-0">
            <ul className="overflow-hidden rounded-lg border border-gray-200 bg-white md:sticky md:top-6">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = item.exact
                  ? router.pathname === item.href || router.pathname === item.href + "/index"
                  : router.pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2.5 text-sm transition-colors ${
                        active
                          ? "bg-rose-50 font-medium text-rose-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <main className="flex-1 min-w-0">
            <h1 className="mb-4 text-xl font-bold text-gray-900">{title}</h1>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

/** ADMIN ロールチェック共通 (getServerSideProps の中で使う) */
export const ADMIN_SLUG = SLUG;
export const ADMIN_BASE = BASE;
