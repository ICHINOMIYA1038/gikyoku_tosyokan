/**
 * S3バケット作成スクリプト
 *
 * 使い方:
 *   set -a && source .env.local && set +a && npx tsx scripts/setup-s3.ts
 */

import {
  S3Client,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  PutPublicAccessBlockCommand,
  PutBucketCorsCommand,
} from '@aws-sdk/client-s3';

const REGION = 'ap-northeast-1';
const PUBLIC_BUCKET = 'gikyokutosyokan-public';
const PRIVATE_BUCKET = 'gikyokutosyokan-private';

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

async function createBucket(bucket: string) {
  try {
    await s3.send(new CreateBucketCommand({
      Bucket: bucket,
      CreateBucketConfiguration: { LocationConstraint: REGION },
    }));
    console.log(`✅ バケット作成: ${bucket}`);
  } catch (e: any) {
    if (e.Code === 'BucketAlreadyOwnedByYou' || e.name === 'BucketAlreadyOwnedByYou') {
      console.log(`⚠️ バケット既存: ${bucket}`);
    } else {
      throw e;
    }
  }
}

async function setupPublicBucket() {
  console.log(`\n📦 Public バケット設定: ${PUBLIC_BUCKET}`);

  await createBucket(PUBLIC_BUCKET);

  // パブリックアクセスブロックを解除（公開バケットのため）
  await s3.send(new PutPublicAccessBlockCommand({
    Bucket: PUBLIC_BUCKET,
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: false,
      IgnorePublicAcls: false,
      BlockPublicPolicy: false,
      RestrictPublicBuckets: false,
    },
  }));
  console.log('  パブリックアクセスブロック解除');

  // バケットポリシー: 読み取りを全公開
  const policy = {
    Version: '2012-10-17',
    Statement: [{
      Sid: 'PublicReadGetObject',
      Effect: 'Allow',
      Principal: '*',
      Action: 's3:GetObject',
      Resource: `arn:aws:s3:::${PUBLIC_BUCKET}/*`,
    }],
  };

  await s3.send(new PutBucketPolicyCommand({
    Bucket: PUBLIC_BUCKET,
    Policy: JSON.stringify(policy),
  }));
  console.log('  バケットポリシー設定（公開読み取り）');

  // CORS設定（ブラウザからの直接アップロード用）
  await s3.send(new PutBucketCorsCommand({
    Bucket: PUBLIC_BUCKET,
    CORSConfiguration: {
      CORSRules: [{
        AllowedHeaders: ['*'],
        AllowedMethods: ['GET', 'PUT', 'POST'],
        AllowedOrigins: [
          'http://localhost:3000',
          'https://gikyokutosyokan.com',
          'https://*.vercel.app',
        ],
        ExposeHeaders: ['ETag'],
        MaxAgeSeconds: 3600,
      }],
    },
  }));
  console.log('  CORS設定完了');
}

async function setupPrivateBucket() {
  console.log(`\n🔒 Private バケット設定: ${PRIVATE_BUCKET}`);

  await createBucket(PRIVATE_BUCKET);

  // パブリックアクセスを完全ブロック
  await s3.send(new PutPublicAccessBlockCommand({
    Bucket: PRIVATE_BUCKET,
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      IgnorePublicAcls: true,
      BlockPublicPolicy: true,
      RestrictPublicBuckets: true,
    },
  }));
  console.log('  パブリックアクセス完全ブロック');
}

async function main() {
  console.log('=== S3バケット セットアップ ===');
  console.log(`リージョン: ${REGION}`);

  await setupPublicBucket();
  await setupPrivateBucket();

  console.log('\n=== 完了 ===');
  console.log(`\n.env.local に以下を追加してください:`);
  console.log(`AWS_S3_BUCKET=${PUBLIC_BUCKET}`);
  console.log(`AWS_S3_PRIVATE_BUCKET=${PRIVATE_BUCKET}`);
  console.log(`AWS_REGION=${REGION}`);
  console.log(`\nPublic URL: https://${PUBLIC_BUCKET}.s3.${REGION}.amazonaws.com/`);
}

main().catch((e) => {
  console.error('❌ エラー:', e);
  process.exit(1);
});
