export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

// Consent Mode v2 運用: 同意状態はgtagのconsent stateに持たせているため
// ここでは同意チェックせず常にconfigを送る。未同意時はCookieは書かれず
// Googleのモデル化データとしてのみ集計される。
export const pageview = (url) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// アフィリエイトリンクのクリックイベントを送信
export const trackAffiliateClick = (store, postTitle, postId) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag("event", "affiliate_click", {
    event_category: "affiliate",
    event_label: `${store} | ${postTitle}`,
    store_name: store,
    post_title: postTitle,
    post_id: postId,
  });
};
