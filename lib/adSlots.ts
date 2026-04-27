/**
 * AdSense 手動広告ユニットのスロットID一覧
 *
 * AdSense管理画面で広告ユニットを作成済み (2026-04-27)
 * 広告ユニット名とスロットIDの対応は docs/ADSENSE-MANUAL-ADS.md を参照
 */
export const AD_SLOTS = {
  // 記事詳細ページ
  POST_AFTER_CONTENT: "3447918891",    // gikyoku-post-after-content (横長)
  POST_SIDEBAR: "7275483264",          // gikyoku-post-sidebar (スクエア)

  // トップページ
  HOME_AFTER_TRENDING: "3375541360",   // gikyoku-home-after-trending (横長)
  HOME_MID_CONTENT: "6457000274",      // gikyoku-home-mid-content (横長)

  // ブログ記事
  BLOG_AFTER_TOC: "7250687673",        // gikyoku-blog-after-toc (横長)
  BLOG_SIDEBAR: "2062459692",          // gikyoku-blog-sidebar (スクエア)

  // 著者ページ
  AUTHOR_AFTER_PROFILE: "3817874970",  // gikyoku-author-after-profile (横長)
} as const;
