// Cloudflare Workers の入口。OpenNext が作る .open-next/worker.js をそのまま使い、404 だけ手を入れる。
// getStaticProps / getServerSideProps が notFound を返すと、Workers ではサイトの 404 ページを組み立てられず、
// Next.js の既定の文字（"This page could not be found"）だけが返る。そのときは /404 を組み立て直して返す
// .open-next はビルドで作られるので、このファイルは tsconfig の対象から外している（wrangler が束ねる）
import handler from "./.open-next/worker.js";

export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";

const BARE_404 = "This page could not be found";

export default {
  async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
    const response: Response = await handler.fetch(request, env, ctx);
    if (response.status !== 404 || request.method !== "GET") return response;

    const url = new URL(request.url);
    if (url.pathname === "/404" || url.pathname.startsWith("/_next/") || url.pathname.startsWith("/api/")) return response;

    const body = await response.clone().text();
    if (body.trim() !== BARE_404) return response;

    const page: Response = await handler.fetch(new Request(new URL("/404", url), { headers: request.headers }), env, ctx);
    if (!(page.headers.get("content-type") || "").includes("text/html")) return response;
    const headers = new Headers(page.headers);
    headers.set("cache-control", "private, no-cache, no-store, max-age=0, must-revalidate");
    return new Response(page.body, { status: 404, headers });
  },
};
