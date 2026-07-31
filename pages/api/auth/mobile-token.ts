import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { createMobileHandoffToken } from "@/lib/mobileHandoffToken";

// tomoshibiモバイルアプリのオンボーディング画面(pages/auth/welcome.tsx)から、
// tomoshibi://auth-callback に載せる引き継ぎトークンを発行してもらうためのAPI。
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = await createMobileHandoffToken(session.user.id);
  res.status(200).json({ token });
}
