import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getCloudflareContext } from "@opennextjs/cloudflare";

declare global {
  var prisma: PrismaClient | undefined;
}

const createClient = (connectionString: string) =>
  new PrismaClient({
    adapter: new PrismaPg({ connectionString, max: 1 }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

// Workers ではリクエストをまたいで I/O オブジェクト（DB 接続）を使い回せないため、
// リクエストごとの ctx をキーにクライアントを作る。接続プールは Hyperdrive が持つ。
const perRequestClients = new WeakMap<object, PrismaClient>();

const resolveClient = (): PrismaClient => {
  let cf: ReturnType<typeof getCloudflareContext> | undefined;
  try {
    cf = getCloudflareContext();
  } catch {
    // next build / next dev（Node.js）ではリクエストコンテキストが無い
  }

  if (cf) {
    const key = cf.ctx as object;
    const cached = perRequestClients.get(key);
    if (cached) return cached;
    const env = cf.env as { HYPERDRIVE?: { connectionString: string } };
    const client = createClient(
      env.HYPERDRIVE?.connectionString ?? process.env.POSTGRES_PRISMA_URL ?? ""
    );
    perRequestClients.set(key, client);
    return client;
  }

  if (!global.prisma) {
    global.prisma = createClient(process.env.POSTGRES_PRISMA_URL ?? "");
  }
  return global.prisma;
};

// 既存の `import { prisma } from "@/lib/prisma"` をそのまま使えるよう、
// プロパティアクセスのたびにリクエストに対応するクライアントへ委譲する。
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    // 共有クライアントのプールを閉じないよう、各所の $disconnect() は無視する。
    // Workers ではリクエスト終了時にソケットが閉じられる。
    if (prop === "$disconnect") return async () => {};
    const client = resolveClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
