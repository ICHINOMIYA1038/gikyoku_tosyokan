import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';

/**
 * Web Vitalsの計測とレポート
 */
export function reportWebVitals(metric: any) {
  // Google Analyticsに送信
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      metric_delta: metric.delta,
      non_interaction: true,
    });
  }

  // コンソールログ（開発環境のみ）
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }
}

/**
 * Web Vitalsの初期化
 */
export function initWebVitals() {
  getCLS(reportWebVitals);
  getFCP(reportWebVitals);
  getFID(reportWebVitals);
  getLCP(reportWebVitals);
  getTTFB(reportWebVitals);
}