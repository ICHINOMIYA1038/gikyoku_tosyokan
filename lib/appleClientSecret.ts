import { createSign } from 'node:crypto';

// Sign In with Apple の client_secret はJWTで、Apple仕様上最長6ヶ月しか有効にできない。
// 手動ローテーションを避けるため、秘密鍵 (失効しない) だけを環境変数に置き、
// プロセス起動のたびにその場で新しいJWTを署名する。Vercelのサーバーレス関数は
// デプロイや非アクティブでインスタンスが頻繁に入れ替わるため、
// 単一インスタンスがこの署名の最大有効期間(6ヶ月)を超えて起動し続けることは実質ない。
const MAX_LIFETIME_SECONDS = 15777000; // Appleが許容する最長 (約6ヶ月)

let cached: string | null = null;

function base64url(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function getAppleClientSecret(): string {
  if (cached) return cached;

  const teamId = process.env.APPLE_TEAM_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const clientId = process.env.APPLE_CLIENT_ID;
  // Vercelのダッシュボードに直接貼り付けた場合は改行がそのまま入るが、
  // CLI/JSON経由で `\n` エスケープのまま渡された場合に備えて変換する。
  const privateKey = process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!teamId || !keyId || !clientId || !privateKey) {
    // Apple Sign Inを使わない開発環境等では未設定でも起動できるよう、空文字を返すに留める。
    return '';
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'ES256', kid: keyId };
  const payload = {
    iss: teamId,
    iat: now,
    exp: now + MAX_LIFETIME_SECONDS,
    aud: 'https://appleid.apple.com',
    sub: clientId,
  };

  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signature = createSign('sha256')
    .update(signingInput)
    .sign({ key: privateKey, dsaEncoding: 'ieee-p1363' });

  cached = `${signingInput}.${base64url(signature)}`;
  return cached;
}
