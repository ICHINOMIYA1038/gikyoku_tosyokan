import { NextApiRequest, NextApiResponse } from "next";

// APIレスポンスタイムを測定するミドルウェア
export function withTiming(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const start = Date.now();
    
    // レスポンスの元のend関数を保存
    const originalEnd = res.end;
    
    // end関数をオーバーライド
    res.end = function(...args: any[]) {
      const duration = Date.now() - start;
      res.setHeader('X-Response-Time', `${duration}ms`);
      console.log(`[${req.method}] ${req.url} - ${duration}ms`);
      
      // 元のend関数を呼び出す
      return originalEnd.apply(res, args);
    } as any;
    
    try {
      await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
}

// Vercelのコールドスタートを軽減するウォームアップ
export function keepWarm() {
  if (process.env.NODE_ENV === 'production') {
    // Dummy operation to keep function warm
    setInterval(() => {
      // No-op to prevent function from going cold
    }, 240000); // 4 minutes
  }
}