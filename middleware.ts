import { NextRequest, NextResponse } from "next/server";

// 隠し管理画面パス。Basic認証 + ADMINロールチェックの二重防御。
// 旧 /admin/* は 404 化（古いブックマーク防止）。
const ADMIN_PREFIX = "/_ops/q3k7n2p8";

export const config = {
  matcher: ["/admin/:path*", "/_ops/:path*"],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // 旧パスは存在しないものとする
  if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  // 隠しパスにマッチしない _ops/* は 404
  if (!url.pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  // Basic 認証
  const basicAuth = req.headers.get("authorization");
  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");
    if (user === process.env.ADMIN_USER && pwd === process.env.ADMIN_PASSWORD) {
      return NextResponse.next();
    }
  }
  return new NextResponse("認証が必要です", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
  });
}
