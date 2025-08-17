# 戯曲図書館 コンテンツSEO戦略

## 1. ターゲットキーワード分析

### 主要キーワード群
- **高検索ボリューム**
  - 「脚本 無料」（月間検索数: 約5,400）
  - 「演劇 台本」（月間検索数: 約2,900）
  - 「戯曲 おすすめ」（月間検索数: 約1,600）
  - 「上演時間 短い 脚本」（月間検索数: 約880）

### ロングテールキーワード
- 「高校 文化祭 演劇 脚本」
- 「少人数 演劇 台本」
- 「30分 戯曲」
- 「女性だけ 演劇 脚本」

## 2. コンテンツピラー戦略

### A. 教育コンテンツ（How-to）
**目的**: 「演劇 始め方」などの情報検索ニーズに対応

#### 実装案
```
/guide/
  ├── beginner/          # 初心者向けガイド
  │   ├── how-to-choose-script.tsx
  │   ├── reading-script.tsx
  │   └── performance-basics.tsx
  ├── advanced/          # 上級者向け
  │   ├── directing-tips.tsx
  │   └── adaptation-guide.tsx
  └── school/           # 学校向け
      ├── culture-festival.tsx
      └── drama-club.tsx
```

### B. 作品解説・批評コンテンツ
**目的**: 作品名検索での流入増加

#### 実装案
```
/reviews/
  ├── [id].tsx         # 個別作品レビューページ
  └── index.tsx        # レビュー一覧

/analysis/
  ├── themes/          # テーマ別分析
  │   ├── family.tsx
  │   ├── society.tsx
  │   └── youth.tsx
  └── comparison/      # 作品比較
```

### C. 作者特集ページ
**目的**: 作者名検索での権威性向上

#### 実装案
```
/features/
  ├── authors/
  │   ├── [id]/
  │   │   ├── biography.tsx
  │   │   ├── works.tsx
  │   │   └── interview.tsx
  └── monthly-pickup.tsx
```

## 3. ユーザー生成コンテンツ（UGC）

### レビュー・評価システム
- 上演体験談の投稿
- 難易度評価
- おすすめポイント

### 実装案
```typescript
// コメント拡張
interface Review {
  id: string;
  postId: number;
  userId: string;
  rating: number;          // 5段階評価
  difficulty: number;      // 上演難易度
  performanceTime: number; // 実際の上演時間
  cast: {
    male: number;
    female: number;
  };
  review: string;
  performedAt: string;     // 上演場所
  audience: string;        // 対象観客層
  tips: string;           // 上演のコツ
  photos?: string[];      // 上演写真
  createdAt: Date;
}
```

## 4. SEO効果の高いコンテンツタイプ

### A. 比較・ランキングページ
```
/ranking/
  ├── popular-weekly.tsx      # 週間人気
  ├── by-time/
  │   ├── under-30min.tsx    # 30分以内
  │   ├── 30-60min.tsx       # 30-60分
  │   └── over-60min.tsx     # 60分以上
  └── by-cast/
      ├── small-cast.tsx     # 少人数（1-5人）
      ├── medium-cast.tsx    # 中人数（6-10人）
      └── large-cast.tsx     # 大人数（11人以上）
```

### B. 季節・イベント特集
```
/special/
  ├── school-festival.tsx    # 文化祭特集
  ├── graduation.tsx        # 卒業公演
  ├── christmas.tsx         # クリスマス公演
  └── new-members.tsx       # 新入生歓迎
```

### C. 演劇用語集・辞典
```
/glossary/
  ├── terms/               # 用語解説
  ├── techniques/          # 演技技法
  └── history/            # 演劇史
```

## 5. 内部リンク戦略

### 関連コンテンツの自動表示
- 同じ作者の他作品
- 似た上演時間の作品
- 同じテーマの作品
- 同じ人数構成の作品

### パンくずリストの最適化
```
ホーム > カテゴリー > サブカテゴリー > 作品名
ホーム > 上演時間別 > 30分以内 > 作品名
ホーム > 人数別 > 少人数 > 作品名
```

## 6. コンテンツカレンダー

### 月次更新スケジュール
- **第1週**: 新作レビュー・解説
- **第2週**: 作者インタビュー/特集
- **第3週**: How-toガイド更新
- **第4週**: ランキング・まとめ記事

### 季節別コンテンツ
- **4月**: 新入生向けガイド
- **7月**: 夏休み公演特集
- **10月**: 文化祭特集
- **12月**: 年末公演・卒業公演

## 7. 成果測定KPI

### 主要指標
- オーガニック流入数
- 平均滞在時間
- 直帰率
- ページ/セッション
- コンバージョン率（作品詳細閲覧）

### 目標値（6ヶ月後）
- オーガニック流入: +200%
- 平均滞在時間: 3分以上
- 直帰率: 50%以下
- インデックス数: 1000ページ以上

## 8. 実装優先順位

### Phase 1（1-2ヶ月目）
1. How-toガイドの作成（10記事）
2. 人気作品レビューページ（20作品）
3. FAQ充実化

### Phase 2（3-4ヶ月目）
1. 作者特集ページ（5名）
2. ランキングページ実装
3. 季節特集（文化祭）

### Phase 3（5-6ヶ月目）
1. 用語集作成（100語）
2. UGC機能実装
3. 比較ページ作成

## 9. コンテンツ作成ガイドライン

### SEOライティング基準
- タイトル: 28-32文字
- メタディスクリプション: 120文字
- 見出し構造: h1→h2→h3の階層
- 本文: 2000文字以上
- 画像: alt属性必須
- 内部リンク: 3-5個/記事

### E-E-A-T対応
- **Experience**: 実際の上演体験談
- **Expertise**: 演劇専門家の監修
- **Authoritativeness**: 作者公認情報
- **Trustworthiness**: 出典明記、更新日表示