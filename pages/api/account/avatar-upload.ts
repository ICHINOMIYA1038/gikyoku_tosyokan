import type { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { requireAuth } from '@/lib/auth';

const S3_BUCKET = process.env.AWS_S3_BUCKET || '';
const S3_REGION = process.env.AWS_REGION || 'ap-northeast-1';

/**
 * アバター画像アップロード用の S3 presigned URL を発行する
 *
 * フロー:
 * 1. クライアントが POST /api/account/avatar-upload を呼ぶ
 * 2. サーバーが presigned URL を発行して返す
 * 3. クライアントが presigned URL に直接 PUT で画像をアップロード
 * 4. アップロード完了後、PATCH /api/account/profile で avatarUrl を更新
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await requireAuth(req, res);
  if (!session) return;

  if (!S3_BUCKET) {
    return res.status(500).json({ error: 'S3が設定されていません' });
  }

  const { contentType } = req.body;

  // 画像形式のみ許可
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!contentType || !allowedTypes.includes(contentType)) {
    return res.status(400).json({ error: 'JPEG, PNG, WebP, GIF のみアップロード可能です' });
  }

  const ext = contentType.split('/')[1].replace('jpeg', 'jpg');
  const timestamp = Date.now();
  const key = `avatars/${session.user.id}-${timestamp}.${ext}`;
  const avatarUrl = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;

  try {
    const s3 = new S3Client({
      region: S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_AWS_ACCESS_KEY || process.env.AWS_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    });
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return res.status(200).json({ uploadUrl, avatarUrl });
  } catch (error) {
    console.error('[avatar-upload] S3 error:', error);
    return res.status(500).json({ error: 'アップロードURLの生成に失敗しました' });
  }
}
