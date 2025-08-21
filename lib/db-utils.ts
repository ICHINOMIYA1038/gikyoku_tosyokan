import { Prisma } from '@prisma/client';

// データベース接続のリトライラッパー
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // 接続プールのタイムアウトエラーの場合
      if (error.message?.includes('Timed out fetching a new connection')) {
        console.error(`[DB] Connection pool timeout (attempt ${i + 1}/${retries})`);
        if (i < retries - 1) {
          // 指数バックオフ
          const waitTime = delay * Math.pow(2, i);
          console.log(`[DB] Retrying in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
      
      // その他のエラーはそのまま投げる
      throw error;
    }
  }
  
  throw lastError;
}

// 接続プールの状態をモニタリング
export function monitorConnectionPool() {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  
  let activeConnections = 0;
  let totalQueries = 0;
  
  setInterval(() => {
    if (totalQueries > 0) {
      console.log(`[Pool Monitor] Active: ${activeConnections}, Total Queries: ${totalQueries}`);
    }
  }, 30000); // 30秒ごとにログ出力
  
  return {
    increment: () => {
      activeConnections++;
      totalQueries++;
    },
    decrement: () => {
      activeConnections--;
    }
  };
}