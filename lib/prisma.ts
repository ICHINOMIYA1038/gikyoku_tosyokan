import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Supabase用の接続最適化設定
const prismaClientOptions: any = {
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL,
    },
  },
};

// Supabase接続の場合、接続プールを最適化
if (process.env.POSTGRES_PRISMA_URL?.includes('supabase')) {
  // 既存のパラメータを保持しつつ新しいパラメータを追加
  const baseUrl = process.env.POSTGRES_PRISMA_URL;
  const separator = baseUrl.includes('?') ? '&' : '?';
  
  // 既にパラメータが含まれていない場合のみ追加
  if (!baseUrl.includes('connection_limit') && !baseUrl.includes('pool_timeout')) {
    prismaClientOptions.datasources.db.url = 
      `${baseUrl}${separator}connection_limit=30&pool_timeout=20`;
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaClientOptions);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Prismaクライアントの接続を事前に確立
if (typeof window === "undefined") {
  // 接続の確立と維持
  prisma.$connect()
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((e) => {
      console.error("Failed to connect to database:", e);
    });
  
  // 定期的な接続確認（Supabaseのアイドルタイムアウト対策）
  if (process.env.NODE_ENV === "production") {
    setInterval(async () => {
      try {
        await prisma.$queryRaw`SELECT 1`;
      } catch (e) {
        console.error("Keep-alive query failed:", e);
      }
    }, 60000); // 1分ごとにキープアライブ
  }
}
