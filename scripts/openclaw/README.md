# OpenClaw 公演情報記事自動生成

CoRichから公演情報を取得し、戯曲図書館のブログ記事を自動生成するOpenClawタスク。

## ディレクトリ構成

```
scripts/openclaw/
├── README.md                 # このファイル
├── config.json              # OpenClawタスク設定
├── fetch-performances.ts    # CoRichスクレイピングスクリプト
└── prompts/
    └── article-generator.md # 記事生成用プロンプト
```

## セットアップ

### 1. OpenClawのインストール

```bash
# OpenClawをインストール（まだの場合）
curl -fsSL https://openclaw.ai/install.sh | bash

# APIキーを設定
openclaw config set api_key YOUR_ANTHROPIC_API_KEY
```

### 2. タスクの登録

```bash
cd /path/to/gikyoku_tosyokan
openclaw task register scripts/openclaw/config.json
```

### 3. 環境変数の設定

```bash
# Slack通知を使う場合
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
```

## 使用方法

### 手動実行

```bash
# 記事を生成（dry-run: ファイル保存しない）
openclaw task run weekly-performance-article --dry-run

# 記事を生成して保存
openclaw task run weekly-performance-article

# 生成前にプレビューを確認
openclaw task run weekly-performance-article --review
```

### 定期実行の確認

```bash
# スケジュールを確認
openclaw task list

# ログを確認
openclaw logs weekly-performance-article
```

## 処理フロー

```
1. [fetch-performances]
   └─ CoRichから公演一覧を取得
   └─ 各公演の詳細ページから情報抽出
   └─ 公式サイトURLがある公演のみ抽出

2. [generate-article]
   └─ プロンプトと公演データをAIに渡す
   └─ Markdown形式の記事を生成

3. [save-article]
   └─ blog/posts/YYYY-MM-DD-weekly-performances.md に保存

4. [notify]
   └─ Slackに完了通知を送信
```

## 注意事項

### CoRichについて

- スクレイピング頻度に注意（1秒間隔で取得）
- CoRichの利用規約を必ず確認
- サイト構造が変わった場合はセレクタの修正が必要

### 記事について

- **CoRichのURLは絶対に含めない**
- 公式サイトURLのみを情報ソースとして記載
- 公式サイトがない公演は自動的にスキップ

### レビューフロー（推奨）

1. `--review`オプションで実行
2. 生成された記事をプレビュー
3. 問題なければ承認して保存
4. 必要に応じて手動で修正

## トラブルシューティング

### 公演情報が取得できない

```bash
# スクリプト単体でテスト
npx ts-node scripts/openclaw/fetch-performances.ts
```

CoRichのHTML構造が変わっている可能性があります。`fetch-performances.ts`のセレクタを確認してください。

### 記事が生成されない

```bash
# ログを確認
openclaw logs weekly-performance-article --last 10

# dry-runでテスト
openclaw task run weekly-performance-article --dry-run --verbose
```

### 記事の品質が低い

`prompts/article-generator.md`のプロンプトを調整してください。

## カスタマイズ

### 取得する公演数を変更

`fetch-performances.ts`の以下の行を変更：

```typescript
return links.slice(0, 10); // 10件 → 任意の数に変更
```

### スケジュールを変更

`config.json`の`schedule`を変更（cron形式）：

```json
"schedule": "0 9 * * 1"  // 毎週月曜9時
"schedule": "0 9 * * *"  // 毎日9時
"schedule": "0 9 1 * *"  // 毎月1日9時
```

### 別のAIモデルを使用

`config.json`の`model`を変更：

```json
"model": "claude-3-5-sonnet"  // 推奨
"model": "gpt-4o"             // OpenAI使用時
```
