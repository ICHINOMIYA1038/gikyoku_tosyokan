/**
 * 管理者専用のユーザー一覧。
 * - ADMIN ロールのみ表示 (それ以外は 404)
 * - 個人情報を含むため、表示する情報は最小限に絞る
 * - 検索・絞り込みで負荷を抑制
 */
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

type UserRow = {
  id: string;
  email: string | null;
  displayName: string | null;
  name: string | null;
  role: string;
  emailOptIn: boolean;
  groupName: string | null;
  createdAt: string;
};

type Props = {
  total: number;
  adminCount: number;
  optInCount: number;
  users: UserRow[];
  filter: { q: string; optIn: string; role: string };
};

export default function AdminUsers({ total, adminCount, optInCount, users, filter }: Props) {
  return (
    <Layout>
      <Seo pageTitle="ユーザー一覧 (管理)" pageDescription="管理者専用" pagePath="/admin/users" />
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">ユーザー一覧</h1>
        <p className="mb-6 text-sm text-gray-500">
          全 <strong>{total}</strong> 名 / 管理者 <strong>{adminCount}</strong> 名 / 案内メール許可 <strong>{optInCount}</strong> 名
        </p>

        <form className="mb-4 flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-white p-3">
          <input
            name="q"
            defaultValue={filter.q}
            placeholder="メール / 表示名で検索"
            className="flex-1 min-w-[180px] rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
          <select
            name="role"
            defaultValue={filter.role}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm bg-white"
          >
            <option value="">権限：すべて</option>
            <option value="ADMIN">ADMIN のみ</option>
            <option value="USER">USER のみ</option>
          </select>
          <select
            name="optIn"
            defaultValue={filter.optIn}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm bg-white"
          >
            <option value="">案内メール：すべて</option>
            <option value="1">受信OKのみ</option>
            <option value="0">受信NGのみ</option>
          </select>
          <button
            type="submit"
            className="rounded-md bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            絞り込む
          </button>
          <Link href="/admin/users" className="rounded-md border border-gray-300 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
            リセット
          </Link>
        </form>

        {users.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500">
            該当するユーザーがいません。
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">登録日</th>
                  <th className="px-3 py-2 text-left">表示名</th>
                  <th className="px-3 py-2 text-left">メール</th>
                  <th className="px-3 py-2 text-left">所属</th>
                  <th className="px-3 py-2 text-center">権限</th>
                  <th className="px-3 py-2 text-center">案内メール</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                      {new Date(u.createdAt).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900">
                      {u.displayName || u.name || "—"}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-700">{u.email || "—"}</td>
                    <td className="px-3 py-2 text-xs text-gray-700">{u.groupName || "—"}</td>
                    <td className="px-3 py-2 text-center">
                      {u.role === "ADMIN" ? (
                        <span className="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-700 ring-1 ring-rose-200">
                          ADMIN
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">USER</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {u.emailOptIn ? (
                        <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-200">
                          受信OK
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-[11px] text-gray-400">
          ※ 個人情報を含むため、外部へ転送・公開しないでください。
        </p>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return { redirect: { destination: "/auth/signin?callbackUrl=/admin/users", permanent: false } };
  }
  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!me || me.role !== "ADMIN") {
    return { notFound: true };
  }

  const q = typeof ctx.query.q === "string" ? ctx.query.q.trim() : "";
  const optIn = typeof ctx.query.optIn === "string" ? ctx.query.optIn : "";
  const role = typeof ctx.query.role === "string" ? ctx.query.role : "";

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { email: { contains: q, mode: "insensitive" } },
      { displayName: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
    ];
  }
  if (role === "ADMIN" || role === "USER") {
    where.role = role;
  }
  if (optIn === "1") where.emailOptIn = true;
  if (optIn === "0") where.emailOptIn = false;

  const [total, adminCount, optInCount, users] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { emailOptIn: true, email: { not: null } } }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 300, // 件数上限。必要ならページングを別途
      select: {
        id: true,
        email: true,
        displayName: true,
        name: true,
        role: true,
        emailOptIn: true,
        groupName: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    props: {
      total,
      adminCount,
      optInCount,
      filter: { q, optIn, role },
      users: users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      })),
    },
  };
};
