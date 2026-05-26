import { GetServerSideProps } from "next";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  Flag,
  Megaphone,
  UserPlus,
  Mail,
} from "lucide-react";
import { AdminLayout, ADMIN_BASE } from "@/components/AdminLayout";
import { requireAdminPage } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

type Counts = {
  userTotal: number;
  userToday: number;
  pendingReports: number;
  newComments24h: number;
  activeAnnouncements: number;
  activeRecruitments: number;
  optInUsers: number;
};

type Activity = {
  kind: "user" | "comment" | "report" | "announcement" | "recruitment";
  label: string;
  detail: string;
  at: string;
  href?: string;
};

type Props = { counts: Counts; activities: Activity[] };

export default function AdminDashboard({ counts, activities }: Props) {
  return (
    <AdminLayout title="ダッシュボード">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Users} color="text-sky-600" label="登録ユーザー" value={counts.userTotal} sub={`本日 +${counts.userToday}`} href={`${ADMIN_BASE}/users`} />
        <StatCard icon={Mail} color="text-emerald-600" label="案内メール受信OK" value={counts.optInUsers} href={`${ADMIN_BASE}/users?optIn=1`} />
        <StatCard icon={Flag} color="text-rose-600" label="未対応の通報" value={counts.pendingReports} href={`${ADMIN_BASE}/reports`} />
        <StatCard icon={MessageSquare} color="text-amber-600" label="24h以内の新規コメント" value={counts.newComments24h} href={`${ADMIN_BASE}/comments`} />
        <StatCard icon={Megaphone} color="text-purple-600" label="公開中の告知" value={counts.activeAnnouncements} href={`${ADMIN_BASE}/announcements`} />
        <StatCard icon={UserPlus} color="text-blue-600" label="公開中の募集" value={counts.activeRecruitments} href={`${ADMIN_BASE}/recruitments`} />
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold text-gray-700">最新アクティビティ</h2>
      {activities.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 py-10 text-center text-sm text-gray-500">
          まだアクティビティはありません。
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <ul className="divide-y divide-gray-100">
            {activities.map((a, i) => (
              <li key={i} className="flex items-start gap-3 px-4 py-3">
                <KindBadge kind={a.kind} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-900">{a.label}</p>
                  <p className="truncate text-xs text-gray-500">{a.detail}</p>
                </div>
                <p className="shrink-0 text-[11px] text-gray-400">
                  {new Date(a.at).toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
                {a.href && (
                  <Link href={a.href} className="text-xs text-rose-600 hover:underline">
                    開く →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminLayout>
  );
}

function StatCard({
  icon: Icon,
  color,
  label,
  value,
  sub,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  label: string;
  value: number;
  sub?: string;
  href?: string;
}) {
  const body = (
    <div className="rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300">
      <div className="mb-2 flex items-center gap-1.5">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      {sub && <p className="mt-1 text-[11px] text-gray-500">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

function KindBadge({ kind }: { kind: Activity["kind"] }) {
  const map = {
    user: { label: "登録", cls: "bg-sky-50 text-sky-700" },
    comment: { label: "コメント", cls: "bg-amber-50 text-amber-700" },
    report: { label: "通報", cls: "bg-rose-50 text-rose-700" },
    announcement: { label: "告知", cls: "bg-purple-50 text-purple-700" },
    recruitment: { label: "募集", cls: "bg-blue-50 text-blue-700" },
  };
  const { label, cls } = map[kind];
  return (
    <span className={`mt-0.5 inline-flex h-5 shrink-0 items-center rounded px-1.5 text-[10px] font-medium ${cls}`}>
      {label}
    </span>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const guard = await requireAdminPage(ctx);
  if ("redirect" in guard) return { redirect: guard.redirect };
  if ("notFound" in guard) return { notFound: true };

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [
    userTotal,
    userToday,
    pendingReports,
    newComments24h,
    activeAnnouncements,
    activeRecruitments,
    optInUsers,
    recentUsers,
    recentComments,
    recentReports,
    recentAnnouncements,
    recentRecruitments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.report.count({ where: { status: "PENDING" } }),
    prisma.parentComment.count({ where: { date: { gte: last24h }, deleted: false } }),
    prisma.announcement.count({ where: { deletedAt: null } }),
    prisma.recruitment.count({ where: { deletedAt: null, status: "ACTIVE" } }),
    prisma.user.count({ where: { emailOptIn: true, email: { not: null } } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, email: true, displayName: true, name: true, createdAt: true } }),
    prisma.parentComment.findMany({ orderBy: { date: "desc" }, take: 5, select: { id: true, content: true, author: true, date: true, post: { select: { id: true, title: true } } } }),
    prisma.report.findMany({ orderBy: { createdAt: "desc" }, take: 5, where: { status: "PENDING" }, select: { id: true, reason: true, targetType: true, targetId: true, createdAt: true } }),
    prisma.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 5, where: { deletedAt: null }, select: { id: true, title: true, authorName: true, createdAt: true } }),
    prisma.recruitment.findMany({ orderBy: { createdAt: "desc" }, take: 5, where: { deletedAt: null }, select: { id: true, title: true, theaterGroupName: true, createdAt: true } }),
  ]);

  const activities: Activity[] = [
    ...recentUsers.map((u): Activity => ({
      kind: "user",
      label: u.displayName || u.name || u.email || "(名無し)",
      detail: u.email || "メール未登録",
      at: u.createdAt.toISOString(),
      href: `${ADMIN_BASE}/users?q=${encodeURIComponent(u.email || "")}`,
    })),
    ...recentComments.map((c): Activity => ({
      kind: "comment",
      label: c.content.slice(0, 60),
      detail: `${c.author} → 「${c.post?.title ?? "?"}」`,
      at: c.date.toISOString(),
      href: `${ADMIN_BASE}/comments`,
    })),
    ...recentReports.map((r): Activity => ({
      kind: "report",
      label: r.reason,
      detail: `${r.targetType} ${r.targetId}`,
      at: r.createdAt.toISOString(),
      href: `${ADMIN_BASE}/reports`,
    })),
    ...recentAnnouncements.map((a): Activity => ({
      kind: "announcement",
      label: a.title,
      detail: a.authorName,
      at: a.createdAt.toISOString(),
      href: `${ADMIN_BASE}/announcements`,
    })),
    ...recentRecruitments.map((r): Activity => ({
      kind: "recruitment",
      label: r.title,
      detail: r.theaterGroupName || "—",
      at: r.createdAt.toISOString(),
      href: `${ADMIN_BASE}/recruitments`,
    })),
  ]
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 20);

  return {
    props: {
      counts: {
        userTotal,
        userToday,
        pendingReports,
        newComments24h,
        activeAnnouncements,
        activeRecruitments,
        optInUsers,
      },
      activities,
    },
  };
};
