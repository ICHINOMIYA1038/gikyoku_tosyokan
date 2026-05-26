import type { NextApiRequest, NextApiResponse } from 'next';

const ALLOWED_ORIGINS = new Set([
  'https://tomoshibi.gikyokutosyokan.com',
  'http://localhost:5173', // tomoshibi 開発時 (Vite デフォルト)
  'http://localhost:5174',
]);

export const MAX_SCENES_PER_USER = 20;
export const MAX_FIXTURES = 100;
export const MAX_PERFORMERS = 30;
export const MAX_SETPIECES = 30;
export const MAX_NAME_LEN = 60;
export const MAX_DATA_BYTES = 256 * 1024; // 256KB

/**
 * tomoshibi (別オリジン SPA) からの fetch を受けるための CORS。
 * Cookie送信を許可するため Allow-Origin はワイルドカード不可。
 * @returns true ならプリフライト応答済みなのでハンドラ側は return すべし
 */
export function applyTomoshibiCors(req: NextApiRequest, res: NextApiResponse): boolean {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

export function validateSceneData(data: unknown): { ok: true } | { ok: false; error: string } {
  if (data == null || typeof data !== 'object') return { ok: false, error: 'data is required' };
  const d = data as Record<string, unknown>;
  const fixtures = Array.isArray(d.fixtures) ? d.fixtures : [];
  const performers = Array.isArray(d.performers) ? d.performers : [];
  const setPieces = Array.isArray(d.setPieces) ? d.setPieces : [];
  if (fixtures.length > MAX_FIXTURES) return { ok: false, error: `器具は${MAX_FIXTURES}個まで` };
  if (performers.length > MAX_PERFORMERS) return { ok: false, error: `役者は${MAX_PERFORMERS}人まで` };
  if (setPieces.length > MAX_SETPIECES) return { ok: false, error: `装置は${MAX_SETPIECES}個まで` };
  // ペイロード総量チェック (DoS対策)
  const bytes = Buffer.byteLength(JSON.stringify(data), 'utf8');
  if (bytes > MAX_DATA_BYTES) return { ok: false, error: 'シーンデータが大きすぎます' };
  return { ok: true };
}
