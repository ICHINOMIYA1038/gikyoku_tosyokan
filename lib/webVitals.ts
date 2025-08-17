import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

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
  onCLS(reportWebVitals);
  onFCP(reportWebVitals);
  onINP(reportWebVitals);
  onLCP(reportWebVitals);
  onTTFB(reportWebVitals);
}