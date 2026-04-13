/**
 * AWSコスト通知設定スクリプト
 *
 * 使い方:
 *   set -a && source .env.local && set +a && npx tsx scripts/setup-aws-billing-alerts.ts
 *
 * 作成されるアラート:
 *   - $1 超過で通知
 *   - $5 超過で通知
 *   - $10, $20, $30... $100 まで $10 ごとに通知
 */

import { BudgetsClient, CreateBudgetCommand } from '@aws-sdk/client-budgets';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';

const REGION = 'us-east-1'; // Budgets APIはus-east-1固定
const EMAIL = 'ichiryo108@gmail.com';

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
};

async function getAccountId(): Promise<string> {
  const sts = new STSClient({ region: REGION, credentials });
  const res = await sts.send(new GetCallerIdentityCommand({}));
  return res.Account!;
}

async function createBudget(
  client: BudgetsClient,
  accountId: string,
  name: string,
  limitAmount: number,
  thresholds: number[]
) {
  const notifications = thresholds.map((threshold) => ({
    Notification: {
      NotificationType: 'ACTUAL' as const,
      ComparisonOperator: 'GREATER_THAN' as const,
      Threshold: threshold,
      ThresholdType: 'PERCENTAGE' as const,
    },
    Subscribers: [
      {
        SubscriptionType: 'EMAIL' as const,
        Address: EMAIL,
      },
    ],
  }));

  try {
    await client.send(new CreateBudgetCommand({
      AccountId: accountId,
      Budget: {
        BudgetName: name,
        BudgetType: 'COST',
        TimeUnit: 'MONTHLY',
        BudgetLimit: {
          Amount: String(limitAmount),
          Unit: 'USD',
        },
      },
      NotificationsWithSubscribers: notifications,
    }));
    console.log(`  ✅ ${name}: $${limitAmount} (通知: ${thresholds.map(t => `${t}%`).join(', ')})`);
  } catch (e: any) {
    if (e.name === 'DuplicateRecordException') {
      console.log(`  ⚠️ ${name}: 既に存在（スキップ）`);
    } else {
      throw e;
    }
  }
}

async function main() {
  console.log('=== AWSコスト通知 セットアップ ===');
  console.log(`通知先: ${EMAIL}\n`);

  const accountId = await getAccountId();
  console.log(`AWSアカウントID: ${accountId}`);

  const budgets = new BudgetsClient({ region: REGION, credentials });

  // $1 超過で通知
  await createBudget(budgets, accountId, 'gikyoku-alert-1usd', 1, [100]);

  // $5 超過で通知
  await createBudget(budgets, accountId, 'gikyoku-alert-5usd', 5, [100]);

  // $10ごとに通知（$10〜$100）
  for (let amount = 10; amount <= 100; amount += 10) {
    await createBudget(budgets, accountId, `gikyoku-alert-${amount}usd`, amount, [100]);
  }

  console.log('\n=== 完了 ===');
  console.log(`合計12個のアラートを設定しました。`);
  console.log(`${EMAIL} に確認メールが届きます。`);
  console.log(`AWS Budgets ダッシュボード: https://us-east-1.console.aws.amazon.com/billing/home#/budgets`);
}

main().catch((e) => {
  console.error('❌ エラー:', e.message || e);
  if (e.message?.includes('not authorized')) {
    console.error('\n権限が不足しています。IAMユーザーに以下のポリシーを追加してください:');
    console.error('  - budgets:CreateBudget');
    console.error('  - budgets:ModifyBudget');
    console.error('  - sts:GetCallerIdentity');
  }
  process.exit(1);
});
