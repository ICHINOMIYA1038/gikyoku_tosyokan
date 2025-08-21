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
  
  // Supabase用の接続URLを修正
  let databaseUrl = process.env.POSTGRES_PRISMA_URL || '';
  
  // 接続プールサイズとタイムアウトを調整
  if (!databaseUrl.includes('connection_limit')) {
    const separator = databaseUrl.includes('?') ? '&' : '?';
    databaseUrl = `${databaseUrl}${separator}connection_limit=30&pool_timeout=60`;
  }
  
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? [
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
        ]
      : ['error'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  // 開発環境でのみクエリイベントをリッスン
  if (process.env.NODE_ENV === 'development') {
    client.$on('query' as any, (e: any) => {
      console.log(`[Query] ${e.query} - Duration: ${e.duration}ms`);
    });
  }

  const initTime = Date.now() - initStartTime;
  console.log(`[Prisma] Client created in ${initTime}ms`);
  
  return client;
};

// グローバルインスタンスを使用（コネクションプールの枯渇を防ぐ）
const isNewInstance = !global.prisma;

if (isNewInstance) {
  console.log(`[Prisma] Creating NEW instance (Cold Start)`);
  global.prisma = prismaClientSingleton();
  global.prismaInitTime = Date.now();
}

export const prisma = global.prisma;

// ログ出力
if (!isNewInstance && global.prismaInitTime) {
  const reuseTime = Date.now() - global.prismaInitTime;
  console.log(`[Prisma] Reusing existing instance (Warm - alive for ${reuseTime}ms)`);
}

// 本番環境では自動的なdisconnectを行わない
// Vercelが自動的にプロセスを終了するため