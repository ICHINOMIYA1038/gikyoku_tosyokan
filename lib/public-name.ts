import { prisma } from "@/lib/prisma";

// 利用者の名前を他の人に見せるときは、本人が決めた表示名だけを使う。
// User.name は Google / Apple のアカウント名（本名のことが多い）なので、外には出さない
export const FALLBACK_PUBLIC_NAME = "ユーザー";

export function publicName(user: { displayName?: string | null } | null | undefined) {
  return user?.displayName?.trim() || FALLBACK_PUBLIC_NAME;
}

export async function publicNameOf(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { displayName: true } });
  return publicName(user);
}
