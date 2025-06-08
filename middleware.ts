import { NextRequest, NextResponse } from "next/server";
import { env } from "process";

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    console.log("User:", process.env.ADMIN_USER); // デバッグ用ログ
    console.log("Password:", process.env.ADMIN_PASSWORD); // デバッグ用ログ

    if (user === process.env.ADMIN_USER && pwd === process.env.ADMIN_PASSWORD) {
      return NextResponse.next();
    }
  }
  url.pathname = "/api/auth";

  return NextResponse.rewrite(url);
}
