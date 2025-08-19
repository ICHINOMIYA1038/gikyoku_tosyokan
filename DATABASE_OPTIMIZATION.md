# データベース接続最適化ガイド

## Vercel環境でのコネクション問題の解決

### 問題の原因
Vercelのサーバーレス環境では、各リクエストが独立したLambda関数で処理されるため、データベースコネクションの管理が重要です。

### 実装した解決策

#### 1. Prismaクライアントの最適化
```typescript
// 各APIルートで独立したPrismaインスタンスを作成
const prisma = new PrismaClient({
  log: ["error"],
});

// リクエスト終了時に必ずコネクションを閉じる
finally {
  await prisma.$disconnect();
}
```

#### 2. データベースURL設定
```
POSTGRES_PRISMA_URL="postgresql://...?pgbouncer=true&connection_limit=1&pool_timeout=20"
```

重要なパラメータ：
- `pgbouncer=true`: PgBouncerを使用してコネクションプーリング
- `connection_limit=1`: 各関数インスタンスのコネクション数を1に制限
- `pool_timeout=20`: コネクション取得のタイムアウト（秒）

#### 3. Vercel Postgresの設定
Vercelダッシュボードで以下を確認：
1. Storage > データベース > Settings
2. "Max connections"を適切な値に設定（推奨: 20-30）
3. "Connection pooling"を有効化

### パフォーマンス改善のチェックリスト

- [x] コネクションの明示的なクローズ
- [x] PgBouncerの有効化
- [x] コネクション数の制限
- [x] 不要なグローバル変数の削除
- [x] setIntervalの削除

### モニタリング
以下のメトリクスを監視：
- データベースのアクティブコネクション数
- API応答時間
- エラーログ（"too many connections"エラー）

### トラブルシューティング

#### 症状: 時々速いが、時々遅い
原因: コネクションプールの枯渇
解決: connection_limitを1に設定

#### 症状: "too many connections"エラー
原因: コネクションリーク
解決: finally句で必ず$disconnect()を呼ぶ

#### 症状: 初回リクエストが遅い
原因: コールドスタート
解決: Edge Functionsの使用を検討