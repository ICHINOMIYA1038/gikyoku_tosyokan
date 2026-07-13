import type { NextApiRequest, NextApiResponse } from 'next';

const ALLOWED_ORIGINS = new Set([
  'https://tomoshibi.gikyokutosyokan.com',
  'http://localhost:5173', // tomoshibi 開発時 (Vite デフォルト)
  'http://localhost:5174',
]);

/** 後方互換用の旧定数。新規コードは maxScenesForPlan() を使うこと。 */
export const MAX_SCENES_PER_USER = 3;
export const MAX_SCENES_FREE = 3;
export const MAX_SCENES_PRO = 500;

export type TomoshibiPlan = 'free' | 'pro';

export function maxScenesForPlan(plan: TomoshibiPlan | string | null | undefined): number {
  return plan === 'pro' ? MAX_SCENES_PRO : MAX_SCENES_FREE;
}

/**
 * ユーザーの Pro プラン有効判定。
 * Pro として扱うには plan='pro' かつ planExpiresAt が未来 であることを要求する。
 * expiresAt が null の場合は Pro としない (無期限 Pro 化を防止)。
 * Stripe API 側で current_period_end が取れない事態が発生した場合は、
 * 監視ログで検知して個別対応する方針 (代わりに無料化する方が安全)。
 */
export function isProActive(plan: string | null | undefined, expiresAt: Date | null | undefined): boolean {
  if (plan !== 'pro') return false;
  if (!expiresAt) return false;
  return expiresAt.getTime() > Date.now();
}

export const MAX_FIXTURES = 100;
export const MAX_PERFORMERS = 30;
export const MAX_SETPIECES = 30;
export const MAX_NAME_LEN = 60;
export const MAX_DATA_BYTES = 256 * 1024; // 256KB

/**
 * tomoshibi (別オリジン SPA) からの fetch を受けるための CORS。
 * Cookie送信を許可するため Allow-Origin はワイルドカード不可。
 *
 * 状態変更メソッド (POST/PUT/PATCH/DELETE) では **Origin ヘッダを必須化**し、
 * ALLOWED_ORIGINS に含まれないリクエストは 403 で拒否する (CSRF 対策)。
 * これによりブラウザの simple request でも allowlist 外からの状態変更を確実に防ぐ。
 *
 * @returns true ならレスポンス送信済みなのでハンドラ側は return すべし
 */
export function applyTomoshibiCors(req: NextApiRequest, res: NextApiResponse): boolean {
  const origin = req.headers.origin;
  const originAllowed = origin ? ALLOWED_ORIGINS.has(origin) : false;
  if (originAllowed && origin) {
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

  // 状態変更メソッドは Origin allowlist を強制。
  // GET/HEAD は認証チェックが別途あるので許容 (だが Cookie も Origin 制限を通じてしか送られない)。
  const isMutating = req.method && !['GET', 'HEAD'].includes(req.method);
  if (isMutating && !originAllowed) {
    res.status(403).json({ error: 'forbidden origin', code: 'CSRF_BLOCKED' });
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
