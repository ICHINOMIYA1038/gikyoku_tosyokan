import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
  var prismaInitTime: number | undefined;
}

// 初期化時刻を記録
const initStartTime = Date.now();

// Prismaクライアントの設定を最適化
const prismaClientSingleton = () => {
  console.log(`[Prisma] Creating new PrismaClient instance...`);
  const client = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ],
    datasources: {
      db: {
        url: process.env.POSTGRES_PRISMA_URL,
      },
    },
  });

  // クエリイベントをリッスン
  client.$on('query' as any, (e: any) => {
    console.log(`[Query] ${e.query} - Duration: ${e.duration}ms`);
  });

  const initTime = Date.now() - initStartTime;
  console.log(`[Prisma] Client created in ${initTime}ms`);
  
  return client;
};

// グローバルインスタンスを使用（コネクションプールの枯渇を防ぐ）
const isNewInstance = !global.prisma;
export const prisma = global.prisma || prismaClientSingleton();

if (isNewInstance) {
  global.prismaInitTime = Date.now();
  console.log(`[Prisma] Using NEW instance (Cold Start)`);
} else {
  const reuseTime = global.prismaInitTime ? Date.now() - global.prismaInitTime : 0;
  console.log(`[Prisma] Reusing existing instance (Warm - alive for ${reuseTime}ms)`);
}

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// 本番環境では自動的なdisconnectを行わない
// Vercelが自動的にプロセスを終了するため