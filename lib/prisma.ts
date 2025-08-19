import { PrismaClient } from "@prisma/client";

// Vercelのサーバーレス環境用の最適化設定
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.POSTGRES_PRISMA_URL,
      },
    },
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// 開発環境でのみグローバルに保持
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Vercelのサーバーレス環境では接続を自動的に閉じる
if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
  // リクエスト終了時にコネクションを閉じる
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}