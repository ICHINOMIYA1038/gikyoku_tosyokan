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
