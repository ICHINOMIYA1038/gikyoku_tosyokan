import type { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'crypto';

const S3_BUCKET = process.env.AWS_S3_BUCKET || '';
const S3_REGION = process.env.AWS_REGION || 'ap-northeast-1';

/**
 * 汎用画像アップロード用 S3 presigned URL 発行API
 * folder: avatars, announcements, recruitments
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

  const { contentType, folder = 'uploads' } = req.body;

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!contentType || !allowedTypes.includes(contentType)) {
    return res.status(400).json({ error: 'JPEG, PNG, WebP のみアップロード可能です' });
  }

  const allowedFolders = ['avatars', 'announcements', 'recruitments', 'uploads'];
  if (!allowedFolders.includes(folder)) {
    return res.status(400).json({ error: '不正なフォルダです' });
  }

  const ext = contentType.split('/')[1].replace('jpeg', 'jpg');
  const filename = `${randomUUID()}.${ext}`;
  const key = `${folder}/${filename}`;
  const imageUrl = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;

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
      CacheControl: 'public, max-age=31536000',
    });
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return res.status(200).json({ uploadUrl, imageUrl });
  } catch (error) {
    console.error('[upload-image] S3 error:', error);
    return res.status(500).json({ error: 'アップロードURLの生成に失敗しました' });
  }
}
