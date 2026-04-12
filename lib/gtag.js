export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  try {
    const consent = localStorage.getItem('cookie-consent');
    if (consent !== 'accepted') return;
  } catch {
    return;
  }
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};
