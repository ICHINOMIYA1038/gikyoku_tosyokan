#!/usr/bin/env node
/**
 * 戯曲図書館 SEO日次レポート
 * GA4 + Search Console からデータ収集 → フォーマット → stdout出力
 *
 * Usage: node scripts/seo-daily-report.js [--date=YYYY-MM-DD]
 *
 * 環境変数は /Users/macmini/blog/.env.local から読み込み
 * GA4 Property: properties/406288193
 * Search Console: sc-domain:gikyokutosyokan.com
 */

require("dotenv").config({ path: "/Users/macmini/blog/.env.local" });
const { google } = require("googleapis");

// --- Config ---
const GA4_PROPERTY = "properties/406288193";
const SC_SITE_URL = "sc-domain:gikyokutosyokan.com";
const SC_SITE_ORIGIN = "https://gikyokutosyokan.com";

// --- Logging (all progress goes to stderr, report to stdout) ---
function log(msg) {
  process.stderr.write(msg + "\n");
}

// --- Auth ---
function getAuth() {
  const clientEmail = process.env.GA4_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!clientEmail || !privateKey) {
    throw new Error(
      "GA4_SERVICE_ACCOUNT_EMAIL / GA4_PRIVATE_KEY が未設定です (.env.local を確認)"
    );
  }
  return new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: [
      "https://www.googleapis.com/auth/analytics.readonly",
      "https://www.googleapis.com/auth/webmasters.readonly",
    ],
  });
}

// --- Date helpers ---
function fmt(d) {
  return d.toISOString().split("T")[0];
}

function getTargetDate() {
  const dateArg = process.argv
    .find((a) => a.startsWith("--date="))
    ?.split("=")[1];
  if (dateArg) return new Date(dateArg + "T12:00:00Z"); // noon UTC to avoid TZ issues
  // JST today
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000);
}

function getDateRanges(baseDate) {
  const now = baseDate;
  const yesterday = new Date(now.getTime() - 86400000);
  const dayBeforeYesterday = new Date(now.getTime() - 2 * 86400000);

  // SC data has ~3 day lag
  const scEnd = new Date(now.getTime() - 3 * 86400000);
  const scStart = new Date(scEnd.getTime() - 28 * 86400000);

  // GA4 month
  const ga4MonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Weeks
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const prevWeekStart = new Date(now.getTime() - 14 * 86400000);
  const prevWeekEnd = new Date(now.getTime() - 8 * 86400000);

  // Prev month
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  return {
    sc: { start: fmt(scStart), end: fmt(scEnd) },
    ga4Month: { start: fmt(ga4MonthStart), end: fmt(now) },
    yesterday: { start: fmt(yesterday), end: fmt(yesterday) },
    dayBeforeYesterday: {
      start: fmt(dayBeforeYesterday),
      end: fmt(dayBeforeYesterday),
    },
    thisWeek: { start: fmt(weekAgo), end: fmt(yesterday) },
    prevWeek: { start: fmt(prevWeekStart), end: fmt(prevWeekEnd) },
    prevMonth: { start: fmt(prevMonthStart), end: fmt(prevMonthEnd) },
  };
}

// --- GA4 helper: run a single report ---
async function ga4Report(ad, dateRange, opts = {}) {
  const { dimensions, metrics, orderBys, limit } = opts;
  const requestBody = {
    dateRanges: [{ startDate: dateRange.start, endDate: dateRange.end }],
    metrics: metrics || [
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "averageSessionDuration" },
      { name: "bounceRate" },
    ],
  };
  if (dimensions) requestBody.dimensions = dimensions;
  if (orderBys) requestBody.orderBys = orderBys;
  if (limit) requestBody.limit = limit;

  const res = await ad.properties.runReport({
    property: GA4_PROPERTY,
    requestBody,
  });
  return res.data.rows || [];
}

function parseMetrics(row) {
  const mv = row?.metricValues || [];
  return {
    users: Number(mv[0]?.value || 0),
    sessions: Number(mv[1]?.value || 0),
    pv: Number(mv[2]?.value || 0),
    avgDuration: Number(mv[3]?.value || 0),
    bounceRate: Number(mv[4]?.value || 0),
  };
}

// --- Collect GA4 ---
async function collectGA4(auth, ranges) {
  const ad = google.analyticsdata({ version: "v1beta", auth });

  log("  [GA4] 月間サマリー...");
  const summaryRows = await ga4Report(ad, ranges.ga4Month);
  const summary = parseMetrics(summaryRows[0]);

  log("  [GA4] 昨日...");
  const yesterdayRows = await ga4Report(ad, ranges.yesterday);
  const yesterday = parseMetrics(yesterdayRows[0]);
  yesterday.date = ranges.yesterday.start;

  log("  [GA4] 一昨日...");
  const dbyRows = await ga4Report(ad, ranges.dayBeforeYesterday);
  const dayBeforeYesterday = parseMetrics(dbyRows[0]);

  log("  [GA4] 今週...");
  const twRows = await ga4Report(ad, ranges.thisWeek);
  const thisWeek = parseMetrics(twRows[0]);

  log("  [GA4] 前週...");
  const pwRows = await ga4Report(ad, ranges.prevWeek);
  const prevWeek = parseMetrics(pwRows[0]);

  log("  [GA4] 前月...");
  const pmRows = await ga4Report(ad, ranges.prevMonth);
  const prevMonth = parseMetrics(pmRows[0]);

  log("  [GA4] ページ別 TOP10...");
  const pageRows = await ga4Report(ad, ranges.ga4Month, {
    dimensions: [{ name: "pagePath" }],
    metrics: [
      { name: "screenPageViews" },
      { name: "activeUsers" },
      { name: "bounceRate" },
    ],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 10,
  });
  const topPages = pageRows.map((r) => ({
    path: r.dimensionValues[0].value,
    pv: Number(r.metricValues[0].value),
    users: Number(r.metricValues[1].value),
    bounceRate: Number(r.metricValues[2].value),
  }));

  log("  [GA4] 流入元...");
  const srcRows = await ga4Report(ad, ranges.ga4Month, {
    dimensions: [{ name: "sessionSource" }],
    metrics: [{ name: "sessions" }, { name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 10,
  });
  const sources = srcRows.map((r) => ({
    source: r.dimensionValues[0].value,
    sessions: Number(r.metricValues[0].value),
    users: Number(r.metricValues[1].value),
  }));

  log("  [GA4] デバイス別...");
  const devRows = await ga4Report(ad, ranges.ga4Month, {
    dimensions: [{ name: "deviceCategory" }],
    metrics: [
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
    ],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  });
  const devices = devRows.map((r) => ({
    device: r.dimensionValues[0].value,
    users: Number(r.metricValues[0].value),
    sessions: Number(r.metricValues[1].value),
    pv: Number(r.metricValues[2].value),
  }));

  return {
    summary,
    yesterday,
    dayBeforeYesterday,
    thisWeek,
    prevWeek,
    prevMonth,
    topPages,
    sources,
    devices,
  };
}

// --- Collect Search Console ---
async function collectGSC(auth, dateRange) {
  const sc = google.searchconsole({ version: "v1", auth });
  const common = {
    siteUrl: SC_SITE_URL,
    requestBody: {
      startDate: dateRange.start,
      endDate: dateRange.end,
      dataState: "final",
    },
  };

  log("  [GSC] トータル...");
  const totalRes = await sc.searchanalytics.query({
    ...common,
    requestBody: { ...common.requestBody },
  });
  const t = totalRes.data.rows?.[0] || {
    clicks: 0,
    impressions: 0,
    ctr: 0,
    position: 0,
  };
  const totals = {
    clicks: t.clicks,
    impressions: t.impressions,
    ctr: t.ctr,
    position: t.position,
  };

  log("  [GSC] クエリ TOP20...");
  const queriesRes = await sc.searchanalytics.query({
    ...common,
    requestBody: {
      ...common.requestBody,
      dimensions: ["query"],
      rowLimit: 20,
    },
  });
  const queries = (queriesRes.data.rows || []).map((r) => ({
    query: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));

  log("  [GSC] ページ TOP15...");
  const pagesRes = await sc.searchanalytics.query({
    ...common,
    requestBody: {
      ...common.requestBody,
      dimensions: ["page"],
      rowLimit: 15,
    },
  });
  const pages = (pagesRes.data.rows || []).map((r) => ({
    page: r.keys[0].replace(SC_SITE_ORIGIN, ""),
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));

  log("  [GSC] デバイス別...");
  const devRes = await sc.searchanalytics.query({
    ...common,
    requestBody: { ...common.requestBody, dimensions: ["device"] },
  });
  const devices = (devRes.data.rows || []).map((r) => ({
    device: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));

  return { dateRange, totals, queries, pages, devices };
}

// --- CTR improvement opportunities ---
function findCTROpportunities(gscPages) {
  // High impressions but low CTR = opportunity
  return gscPages
    .filter((p) => p.impressions >= 50 && p.ctr < 0.03)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 5)
    .map((p) => {
      // If CTR improved to 5%, how many extra clicks?
      const potentialClicks = Math.round(p.impressions * 0.05 - p.clicks);
      return { ...p, potentialClicks: Math.max(0, potentialClicks) };
    });
}

// --- Format report ---
function formatReport(today, ga4, gsc) {
  const lines = [];

  // Helpers
  function num(n) {
    return (n || 0).toLocaleString();
  }
  function pct(n) {
    return ((n || 0) * 100).toFixed(1);
  }
  function dur(seconds) {
    const m = Math.floor((seconds || 0) / 60);
    const s = Math.round((seconds || 0) % 60);
    return `${m}分${String(s).padStart(2, "0")}秒`;
  }
  function changeStr(current, previous) {
    if (!previous || previous === 0) return "";
    const change = ((current - previous) / previous) * 100;
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}%`;
  }

  // Header
  lines.push(
    `📊 戯曲図書館 SEO日次レポート (${today})`
  );
  lines.push("");

  // --- Yesterday's access ---
  const y = ga4.yesterday;
  const dby = ga4.dayBeforeYesterday;
  const hasDby = dby.users > 0 || dby.pv > 0;

  lines.push(`▸ 昨日のアクセス (${y.date || "N/A"})`);
  if (hasDby) {
    lines.push(
      `  👥 UU: ${num(y.users)} (前日比: ${changeStr(y.users, dby.users)})`
    );
    lines.push(
      `  📄 PV: ${num(y.pv)} (前日比: ${changeStr(y.pv, dby.pv)})`
    );
  } else {
    lines.push(`  👥 UU: ${num(y.users)}    📄 PV: ${num(y.pv)}`);
  }
  lines.push(
    `  📊 セッション: ${num(y.sessions)}    ⏱ 滞在: ${dur(y.avgDuration)}`
  );

  // --- Weekly comparison ---
  const tw = ga4.thisWeek;
  const pw = ga4.prevWeek;
  const weekUUChange = pw.users > 0
    ? ((tw.users - pw.users) / pw.users) * 100
    : 0;
  const weekPVChange = pw.pv > 0
    ? ((tw.pv - pw.pv) / pw.pv) * 100
    : 0;

  lines.push("");
  lines.push(`▸ 週間比較`);
  lines.push(
    `  📈 UU: ${num(pw.users)} → ${num(tw.users)} (${weekUUChange >= 0 ? "+" : ""}${weekUUChange.toFixed(1)}%)`
  );
  lines.push(
    `  📈 PV: ${num(pw.pv)} → ${num(tw.pv)} (${weekPVChange >= 0 ? "+" : ""}${weekPVChange.toFixed(1)}%)`
  );

  // --- Monthly progress ---
  const sm = ga4.summary;
  const pm = ga4.prevMonth;
  if (pm.pv > 0) {
    const monthProgress = ((sm.pv / pm.pv) * 100).toFixed(0);
    lines.push("");
    lines.push(`▸ 月間進捗 (今月/先月)`);
    lines.push(
      `  👥 UU: ${num(sm.users)} / ${num(pm.users)} (${pm.users > 0 ? ((sm.users / pm.users) * 100).toFixed(0) : "---"}%)`
    );
    lines.push(
      `  📄 PV: ${num(sm.pv)} / ${num(pm.pv)} (${monthProgress}%)`
    );
  }

  // --- Search Console ---
  lines.push("");
  lines.push(`▸ Search Console (28日間)`);
  lines.push(
    `  🔍 クリック: ${num(gsc.totals.clicks)} / 表示: ${num(gsc.totals.impressions)} / CTR: ${pct(gsc.totals.ctr)}% / 順位: ${(gsc.totals.position || 0).toFixed(1)}`
  );

  // --- Top queries ---
  if (gsc.queries.length > 0) {
    lines.push("");
    lines.push(`▸ 検索クエリ Top 10`);
    for (const q of gsc.queries.slice(0, 10)) {
      lines.push(
        `  ${gsc.queries.indexOf(q) + 1}. ${q.query} - ${q.clicks}クリック (${num(q.impressions)}表示, CTR ${pct(q.ctr)}%)`
      );
    }
  }

  // --- Top pages (GA4) ---
  if (ga4.topPages.length > 0) {
    lines.push("");
    lines.push(`▸ 人気ページ Top 10`);
    for (let i = 0; i < Math.min(10, ga4.topPages.length); i++) {
      const p = ga4.topPages[i];
      const shortPath =
        p.path.length > 50 ? p.path.substring(0, 47) + "..." : p.path;
      lines.push(`  ${i + 1}. ${shortPath} (${num(p.pv)}PV)`);
    }
  }

  // --- Traffic sources ---
  if (ga4.sources.length > 0) {
    lines.push("");
    lines.push(`▸ 流入元`);
    for (const s of ga4.sources.slice(0, 5)) {
      lines.push(`  • ${s.source}: ${num(s.sessions)}セッション`);
    }
  }

  // --- Devices ---
  if (ga4.devices.length > 0) {
    lines.push("");
    lines.push(`▸ デバイス`);
    const totalSessions = ga4.devices.reduce((a, d) => a + d.sessions, 0);
    for (const d of ga4.devices) {
      const share =
        totalSessions > 0
          ? ((d.sessions / totalSessions) * 100).toFixed(1)
          : "0";
      const icon =
        d.device === "mobile"
          ? "📱"
          : d.device === "desktop"
            ? "🖥️"
            : "📟";
      lines.push(`  ${icon} ${d.device}: ${share}% (${num(d.sessions)}ss)`);
    }
  }

  // --- CTR improvement opportunities ---
  const opportunities = findCTROpportunities(gsc.pages);
  if (opportunities.length > 0) {
    lines.push("");
    lines.push(`▸ CTR改善チャンス`);
    for (const o of opportunities) {
      const shortPage =
        o.page.length > 45 ? o.page.substring(0, 42) + "..." : o.page;
      lines.push(
        `  - ${shortPage}: ${num(o.impressions)}表示, CTR ${pct(o.ctr)}% → タイトル改善で+${o.potentialClicks} clicks/月 見込み`
      );
    }
  }

  // --- Advice ---
  lines.push("");
  lines.push(`▸ 今後の方針`);
  const directions = [];

  if (opportunities.length > 0) {
    directions.push(
      `  📉 CTR改善余地: ${opportunities.length}件（表示は多いがクリック率が低いページ）`
    );
  }

  if (weekUUChange > 5) {
    directions.push(
      `  📈 UU週間+${weekUUChange.toFixed(0)}%増。現在の施策を継続`
    );
  } else if (weekUUChange < -5) {
    directions.push(
      `  📉 UU週間${weekUUChange.toFixed(0)}%減。流入減の原因調査が必要`
    );
  }

  const bounceChangePt =
    tw.bounceRate && pw.bounceRate
      ? (tw.bounceRate - pw.bounceRate) * 100
      : 0;
  if (bounceChangePt > 5) {
    directions.push(
      `  ⚠️ 直帰率+${bounceChangePt.toFixed(1)}pt悪化。内部リンク・導線の見直しを検討`
    );
  }

  // Check if organic search is dominant
  const organicSource = ga4.sources.find(
    (s) => s.source === "google" || s.source === "yahoo"
  );
  const totalSourceSessions = ga4.sources.reduce(
    (a, s) => a + s.sessions,
    0
  );
  if (organicSource && totalSourceSessions > 0) {
    const organicShare =
      (organicSource.sessions / totalSourceSessions) * 100;
    if (organicShare < 40) {
      directions.push(
        `  🔎 検索流入比率${organicShare.toFixed(0)}% - SEO強化でオーガニック流入を増やす余地あり`
      );
    }
  }

  if (directions.length === 0) {
    directions.push(`  ✅ 特に緊急の課題なし。コンテンツ拡充を継続`);
  }
  for (const d of directions) {
    lines.push(d);
  }

  return lines.join("\n");
}

// --- Main ---
async function main() {
  const baseDate = getTargetDate();
  const today = fmt(baseDate);
  const ranges = getDateRanges(baseDate);

  log(`\n=== 戯曲図書館 SEO日次レポート [${today}] ===\n`);
  log(`📅 GSC: ${ranges.sc.start} 〜 ${ranges.sc.end}`);
  log(`📅 GA4昨日: ${ranges.yesterday.start}`);
  log(`📅 GA4今週: ${ranges.thisWeek.start} 〜 ${ranges.thisWeek.end}`);
  log(`📅 GA4前月: ${ranges.prevMonth.start} 〜 ${ranges.prevMonth.end}\n`);

  const auth = getAuth();

  log("📊 GA4 データ収集中...");
  const ga4 = await collectGA4(auth, ranges);
  log(
    `   → 昨日: ${ga4.yesterday.users}UU/${ga4.yesterday.pv}PV, ページ${ga4.topPages.length}件\n`
  );

  log("📊 Search Console データ収集中...");
  const gsc = await collectGSC(auth, ranges.sc);
  log(
    `   → ${gsc.totals.clicks}クリック / ${gsc.totals.impressions}表示, クエリ${gsc.queries.length}件\n`
  );

  // Format and output report
  const report = formatReport(today, ga4, gsc);
  process.stdout.write(report);

  log("\n✅ レポート出力完了");
}

main().catch((err) => {
  log(`❌ エラー: ${err.message}`);
  if (err.stack) log(err.stack);
  process.exit(1);
});
