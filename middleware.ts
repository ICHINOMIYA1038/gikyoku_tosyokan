import { NextRequest, NextResponse } from "next/server";

// 隠し管理画面パス。Basic認証 + ADMINロールチェックの二重防御。
// 旧 /admin/* は 404 化（古いブックマーク防止）。
const ADMIN_PREFIX = "/_ops/q3k7n2p8";

// tomoshibiモバイルアプリがApp Tracking Transparency許諾状態を伝えるヘッダ。
// (App Store審査 Guideline 5.1.2(i) 対応。詳細は pages/_app.tsx 参照)
const ATT_STATUS_HEADER = "x-att-status";
const ATT_STATUS_COOKIE = "att-status";

export const config = {
  // api / _next 静的アセット / favicon 以外の全ページリクエストにマッチ。
  // (admin/_ops はこのパターンに含まれるため個別指定は不要)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

function handleAdminGate(req: NextRequest): NextResponse | null {
  const url = req.nextUrl;

  // 旧パスは存在しないものとする
  if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  if (!url.pathname.startsWith(ADMIN_PREFIX)) {
    return null;
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

export function middleware(req: NextRequest) {
  const adminResponse = handleAdminGate(req);
  if (adminResponse) return adminResponse;

  const res = NextResponse.next();

  const attStatus = req.headers.get(ATT_STATUS_HEADER);
  if (attStatus === "authorized" || attStatus === "denied") {
    res.cookies.set(ATT_STATUS_COOKIE, attStatus, {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      path: "/",
    });
  }

  return res;
}
