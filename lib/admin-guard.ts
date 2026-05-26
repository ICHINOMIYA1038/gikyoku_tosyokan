/**
 * 管理画面 (/_ops/q3k7n2p8/*) 用の共通ガード。
 * Basic 認証は middleware で済んでいるため、ここでは ADMIN ロールチェックのみ。
 */
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse, Redirect } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export type AdminGuard =
  | { ok: true; me: { id: string; role: string; displayName: string | null; name: string | null; email: string | null } }
  | { redirect: Redirect }
  | { notFound: true };

export async function requireAdminPage(ctx: GetServerSidePropsContext): Promise<AdminGuard> {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: `/auth/signin?callbackUrl=${encodeURIComponent(ctx.resolvedUrl)}`,
        permanent: false,
      },
    };
  }
  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, displayName: true, name: true, email: true },
  });
  if (!me || me.role !== "ADMIN") {
    return { notFound: true };
  }
  return { ok: true, me };
}

export async function requireAdminApi(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ error: "認証が必要です" });
    return null;
  }
  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  });
  if (!me || me.role !== "ADMIN") {
    res.status(404).end();
    return null;
  }
  return me;
}
