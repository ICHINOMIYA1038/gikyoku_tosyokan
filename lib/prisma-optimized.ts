import { PrismaClient } from "@prisma/client";

// Vercel Edge環境に最適化されたPrismaクライアント設定
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.POSTGRES_PRISMA_URL,
      },
    },
    // コネクションプール設定の最適化
    // @ts-ignore
    __internal: {
      // エンジンのタイムアウト設定
      engine: {
        connectTimeout: 15000, // 15秒
        poolTimeout: 15000,    // 15秒
        maxConnections: 1,     // 接続数を最小に
      },
    },
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// シングルトンパターンで単一インスタンスを保証
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// 開発環境でのみグローバルに保持（ホットリロード対策）
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

// 本番環境でのクリーンアップ処理
if (process.env.NODE_ENV === "production") {
  // Vercelのタイムアウト前にコネクションをクリーンアップ
  const cleanup = async () => {
    await prisma.$disconnect();
  };

  // プロセス終了時のクリーンアップ
  process.on("beforeExit", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("SIGINT", cleanup);
}