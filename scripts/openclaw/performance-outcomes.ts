export type FetchObservation = {
  url: string;
  outcome: 'ok' | 'robots_denied' | 'robots_unavailable' | 'http_error' | 'unsupported_content' | 'empty' | 'timeout' | 'network_error';
  status?: number;
};
// A member's appearance in another company's show does not establish a company performance.
// Title length is not evidence. Ambiguous matches stay in the review queue.
export function classifyPerformanceContext(context: string): 'high' | 'medium' {
  if (/出演|客演|presents/i.test(context)) return 'medium';
  return /公演|上演|演目/.test(context) ? 'high' : 'medium';
}
export function summarizeFetches(rows: FetchObservation[]) {
  const count = (kind: FetchObservation['outcome']) => rows.filter(r => r.outcome === kind).length;
  return {
    fetched: count('ok'),
    errors: count('http_error') + count('timeout') + count('network_error'),
    robotsDenied: count('robots_denied'), robotsUnavailable: count('robots_unavailable'),
    unsupported: count('unsupported_content'), empty: count('empty'),
    httpStatuses: rows.filter(r => r.status).reduce<Record<string,number>>((a,r) => {a[String(r.status)]=(a[String(r.status)]||0)+1;return a;},{}),
  };
}
