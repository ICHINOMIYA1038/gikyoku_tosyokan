import type { NextApiResponse } from 'next';

/**
 * APIレスポンスにキャッシュヘッダーを設定
 */
export function setCacheHeaders(res: NextApiResponse, maxAge: number = 60) {
  res.setHeader(
    'Cache-Control',
    `s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`
  );
}

/**
 * エラーレスポンスを返す
 */
export function sendError(
  res: NextApiResponse,
  status: number,
  message: string
) {
  console.error(`API Error [${status}]: ${message}`);
  res.status(status).json({ error: message });
}

/**
 * 成功レスポンスを返す（キャッシュ付き）
 */
export function sendSuccess(
  res: NextApiResponse,
  data: any,
  cacheMaxAge?: number
) {
  if (cacheMaxAge) {
    setCacheHeaders(res, cacheMaxAge);
  }
  res.status(200).json(data);
}