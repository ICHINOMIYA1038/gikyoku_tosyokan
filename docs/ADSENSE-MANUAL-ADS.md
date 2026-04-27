# AdSense 手動広告 運用ガイド

## 概要

2026-04-27に自動広告から手動広告に切り替え。
自動広告はGoogleが勝手に挿入位置を決めるためサイトが見づらくなっていた。
手動広告では配置場所をコードで管理し、UXと収益のバランスを取る。

## アーキテクチャ

```
_app.tsx                  ... adsbygoogle.js を1回だけ読み込み
  └─ 各ページ
       └─ <AdSlot>        ... 広告枠コンポーネント (components/Ad/AdSlot.tsx)
            └─ <DisplayAd> ... AdSense ins要素を描画 (components/Ad/google/displayAd.tsx)

lib/adSlots.ts            ... スロットID一元管理
```

## 広告配置マップ

| スロット定数 | ページ | 配置場所 | フォーマット |
|---|---|---|---|
| `POST_AFTER_CONTENT` | 記事詳細 `/posts/[id]` | 評価セクション後、劇団一覧の前 | horizontal (728x90) |
| `POST_SIDEBAR` | 記事詳細 `/posts/[id]` | サイドバー統計情報の下 (xl以上) | rectangle (300x250) |
| `HOME_AFTER_TRENDING` | トップ `/` | トレンド作品の後 | horizontal |
| `HOME_MID_CONTENT` | トップ `/` | 最新コメントと最新記事の間 | horizontal |
| `BLOG_AFTER_TOC` | ブログ `/blog/ja/[slug]`, `/blog/en/[slug]` | 目次の後、本文の前 | horizontal |
| `BLOG_SIDEBAR` | ブログ `/blog/ja/[slug]`, `/blog/en/[slug]` | サイドバー上部 | rectangle |
| `AUTHOR_AFTER_PROFILE` | 著者 `/authors/[id]` | プロフィール後、作品一覧の前 | horizontal |

## スロットIDの設定手順

1. AdSense管理画面にログイン
2. **広告 > 広告ユニットごと > ディスプレイ広告** を選択
3. 各スロットに対応する広告ユニットを作成（命名例: `gikyoku-post-after-content`）
4. 生成されたコードから `data-ad-slot` の数値をコピー
5. `lib/adSlots.ts` の該当スロットにペースト
6. デプロイ

```typescript
// lib/adSlots.ts — 例
export const AD_SLOTS = {
  POST_AFTER_CONTENT: "1234567890",  // ← AdSenseで生成された実際のID
  ...
} as const;
```

## AdSense管理画面で必要な設定

### 自動広告をOFFにする
1. AdSense > 広告 > サイトごと > gikyokutosyokan.com
2. 「自動広告」をオフに切り替え
3. 保存

### 推奨する広告ユニット設定
- **レスポンシブ広告ユニット** を選択（デバイスに合わせて自動調整）
- horizontal枠: 「横長バナー」タイプ
- rectangle枠: 「レクタングル」タイプ

## 広告枠の追加・変更方法

### 新しい広告枠を追加する場合

1. `lib/adSlots.ts` に新しいスロット定数を追加
2. AdSense管理画面で対応する広告ユニットを作成
3. 対象ページに `<AdSlot>` を挿入

```tsx
import AdSlot from "@/components/Ad/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";

// 使用例
<AdSlot slot={AD_SLOTS.NEW_SLOT_NAME} format="horizontal" />
```

### フォーマット一覧

| format | 想定サイズ | 用途 |
|---|---|---|
| `horizontal` | 幅100% x 高さ90px | ページ横幅いっぱいのバナー |
| `rectangle` | 300x250px | サイドバー、コンテンツ間 |
| `vertical` | 300x600px | サイドバー（大きめ） |
| `auto` | 自動 | Googleに任せる（デフォルト） |

## 運用ルール

- **1ページあたり最大3枠** を目安にする（多すぎるとUX低下・AdSenseポリシー違反リスク）
- コンテンツの途中（文章を分断する位置）には置かない
- セクションの切れ目（見出し間、コンポーネント間）に配置する
- モバイルでは広告がファーストビューを占有しないよう注意
- 空の広告枠はCSSで自動非表示される（`.ad-container:empty` in globals.css）

## パブリッシャーID

```
ca-pub-8691137965825158
```

`components/Ad/google/displayAd.tsx` の `AD_CLIENT` 定数で管理。
