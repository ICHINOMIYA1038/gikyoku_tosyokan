#!/usr/bin/env node
/**
 * 戯曲図書館 SEO日次データ収集スクリプト
 * Search Console + GA4 のデータを収集し JSON に保存
 *
 * Usage: node scripts/seo-daily-collect.js [--date=YYYY-MM-DD]
 *
 * 環境変数は /Users/macmini/blog/.env.local から読み込み
 * (GA4_SERVICE_ACCOUNT_EMAIL, GA4_PRIVATE_KEY を共有)
 *
 * GA4 Property: properties/406288193
 * Search Console: sc-domain:gikyokutosyokan.com
 */

require("dotenv").config({ path: "/Users/macmini/blog/.env.local" });
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// --- Config ---
const GA4_PROPERTY = "properties/406288193";
const SC_SITE_URL = "sc-domain:gikyokutosyokan.com";
const SC_SITE_ORIGIN = "https://gikyokutosyokan.com";
const REPORTS_DIR = path.join(__dirname, "../data/seo-reports");

// Ensure output directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
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

function getDateRanges() {
  const now = new Date();
  // JST
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  // SC data has ~3 day lag
  const scEnd = new Date(jst.getTime() - 3 * 86400000);
  const scStart = new Date(scEnd.getTime() - 28 * 86400000);

  // GA4: this month
  const ga4MonthStart = new Date(jst.getFullYear(), jst.getMonth(), 1);

  // GA4: yesterday
  const yesterday = new Date(jst.getTime() - 86400000);
  // GA4: day before yesterday
  const dayBeforeYesterday = new Date(jst.getTime() - 2 * 86400000);

  // GA4: this week (7 days ago ~ yesterday)
  const weekAgo = new Date(jst.getTime() - 7 * 86400000);
  // GA4: prev week (14 days ago ~ 8 days ago)
  const prevWeekStart = new Date(jst.getTime() - 14 * 86400000);
  const prevWeekEnd = new Date(jst.getTime() - 8 * 86400000);

  // GA4: prev month
  const prevMonthStart = new Date(jst.getFullYear(), jst.getMonth() - 1, 1);
  const prevMonthEnd = new Date(jst.getFullYear(), jst.getMonth(), 0);

  return {
    sc: { start: fmt(scStart), end: fmt(scEnd) },
    ga4Month: { start: fmt(ga4MonthStart), end: fmt(jst) },
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

// --- GA4 helper ---
async function ga4Report(ad, dateRange, opts = {}) {
  const { dimensions, metrics, orderBys, limit, dimensionFilter } = opts;
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
  if (dimensionFilter) requestBody.dimensionFilter = dimensionFilter;

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

  console.log("  [GA4] 月間サマリー...");
  const summaryRows = await ga4Report(ad, ranges.ga4Month);
  const summary = parseMetrics(summaryRows[0]);

  console.log("  [GA4] 昨日...");
  const yesterdayRows = await ga4Report(ad, ranges.yesterday);
  const yesterday = parseMetrics(yesterdayRows[0]);
  yesterday.date = ranges.yesterday.start;

  console.log("  [GA4] 一昨日...");
  const dbyRows = await ga4Report(ad, ranges.dayBeforeYesterday);
  const dayBeforeYesterday = parseMetrics(dbyRows[0]);
  dayBeforeYesterday.date = ranges.dayBeforeYesterday.start;

  console.log("  [GA4] 今週...");
  const twRows = await ga4Report(ad, ranges.thisWeek);
  const thisWeek = parseMetrics(twRows[0]);

  console.log("  [GA4] 前週...");
  const pwRows = await ga4Report(ad, ranges.prevWeek);
  const prevWeek = parseMetrics(pwRows[0]);

  console.log("  [GA4] 前月...");
  const pmRows = await ga4Report(ad, ranges.prevMonth);
  const prevMonth = parseMetrics(pmRows[0]);

  console.log("  [GA4] ページ別 TOP50...");
  const pageRows = await ga4Report(ad, ranges.ga4Month, {
    dimensions: [{ name: "pagePath" }],
    metrics: [
      { name: "screenPageViews" },
      { name: "activeUsers" },
      { name: "bounceRate" },
      { name: "averageSessionDuration" },
      { name: "engagementRate" },
    ],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 50,
  });
  const topPages = pageRows.map((r) => ({
    path: r.dimensionValues[0].value,
    pv: Number(r.metricValues[0].value),
    users: Number(r.metricValues[1].value),
    bounceRate: Number(r.metricValues[2].value),
    avgDuration: Number(r.metricValues[3].value),
    engagementRate: Number(r.metricValues[4].value),
  }));

  console.log("  [GA4] ブログ記事ページ別 (pagePath starts with /blog/)...");
  const blogPageRows = await ga4Report(ad, ranges.ga4Month, {
    dimensions: [{ name: "pagePath" }],
    metrics: [
      { name: "screenPageViews" },
      { name: "activeUsers" },
      { name: "bounceRate" },
      { name: "averageSessionDuration" },
      { name: "engagementRate" },
    ],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 500,
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        stringFilter: {
          matchType: "BEGINS_WITH",
          value: "/blog/",
        },
      },
    },
  });
  // Client-side filter as fallback (GA4 API filter can be unreliable)
  const blogPages = blogPageRows
    .map((r) => ({
      path: r.dimensionValues[0].value,
      pv: Number(r.metricValues[0].value),
      users: Number(r.metricValues[1].value),
      bounceRate: Number(r.metricValues[2].value),
      avgDuration: Number(r.metricValues[3].value),
      engagementRate: Number(r.metricValues[4].value),
    }))
    .filter((p) => p.path.startsWith("/blog/"));

  console.log("  [GA4] 流入元 TOP10...");
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

  console.log("  [GA4] デバイス別...");
  const devRows = await ga4Report(ad, ranges.ga4Month, {
    dimensions: [{ name: "deviceCategory" }],
    metrics: [
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "bounceRate" },
    ],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  });
  const devices = devRows.map((r) => ({
    device: r.dimensionValues[0].value,
    users: Number(r.metricValues[0].value),
    sessions: Number(r.metricValues[1].value),
    pv: Number(r.metricValues[2].value),
    bounceRate: Number(r.metricValues[3].value),
  }));

  return {
    dateRange: { start: ranges.ga4Month.start, end: ranges.ga4Month.end },
    summary,
    yesterday,
    dayBeforeYesterday,
    thisWeek,
    prevWeek,
    prevMonth,
    topPages,
    blogPages,
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

  console.log("  [GSC] トータル...");
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

  console.log("  [GSC] クエリ TOP50...");
  const queriesRes = await sc.searchanalytics.query({
    ...common,
    requestBody: {
      ...common.requestBody,
      dimensions: ["query"],
      rowLimit: 50,
    },
  });
  const queries = (queriesRes.data.rows || []).map((r) => ({
    query: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));

  console.log("  [GSC] ページ TOP100...");
  const pagesRes = await sc.searchanalytics.query({
    ...common,
    requestBody: {
      ...common.requestBody,
      dimensions: ["page"],
      rowLimit: 100,
    },
  });
  const pages = (pagesRes.data.rows || []).map((r) => ({
    page: r.keys[0].replace(SC_SITE_ORIGIN, ""),
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));

  console.log("  [GSC] クエリ x ページ TOP500...");
  const qpRes = await sc.searchanalytics.query({
    ...common,
    requestBody: {
      ...common.requestBody,
      dimensions: ["query", "page"],
      rowLimit: 500,
    },
  });
  const queryPages = (qpRes.data.rows || []).map((r) => ({
    query: r.keys[0],
    page: r.keys[1].replace(SC_SITE_ORIGIN, ""),
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));

  console.log("  [GSC] デバイス別...");
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

  console.log("  [GSC] 国別 TOP10...");
  const countryRes = await sc.searchanalytics.query({
    ...common,
    requestBody: {
      ...common.requestBody,
      dimensions: ["country"],
      rowLimit: 10,
    },
  });
  const countries = (countryRes.data.rows || []).map((r) => ({
    country: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));

  // Blog-specific GSC: pages under /blog/
  console.log("  [GSC] ブログページ別...");
  const blogPagesRes = await sc.searchanalytics.query({
    ...common,
    requestBody: {
      ...common.requestBody,
      dimensions: ["page"],
      rowLimit: 100,
      dimensionFilterGroups: [
        {
          filters: [
            {
              dimension: "page",
              operator: "contains",
              expression: "/blog/",
            },
          ],
        },
      ],
    },
  });
  const blogPages = (blogPagesRes.data.rows || []).map((r) => ({
    page: r.keys[0].replace(SC_SITE_ORIGIN, ""),
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));

  return {
    dateRange: { start: dateRange.start, end: dateRange.end },
    totals,
    queries,
    pages,
    queryPages,
    devices,
    countries,
    blogPages,
  };
}

// --- Main ---
async function main() {
  const dateArg = process.argv
    .find((a) => a.startsWith("--date="))
    ?.split("=")[1];
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const today = dateArg || fmt(jst);

  console.log(`\n=== 戯曲図書館 SEO日次データ収集 [${today}] ===\n`);

  const auth = getAuth();
  const ranges = getDateRanges();

  console.log(`  GSC: ${ranges.sc.start} - ${ranges.sc.end}`);
  console.log(`  GA4月間: ${ranges.ga4Month.start} - ${ranges.ga4Month.end}`);
  console.log(`  GA4昨日: ${ranges.yesterday.start}`);
  console.log(`  GA4今週: ${ranges.thisWeek.start} - ${ranges.thisWeek.end}`);
  console.log(`  GA4前月: ${ranges.prevMonth.start} - ${ranges.prevMonth.end}\n`);

  console.log("Search Console データ収集中...");
  const gsc = await collectGSC(auth, ranges.sc);
  console.log(
    `  -> クエリ${gsc.queries.length}件, ページ${gsc.pages.length}件, QP${gsc.queryPages.length}件, ブログ${gsc.blogPages.length}件\n`
  );

  console.log("GA4 データ収集中...");
  const ga4 = await collectGA4(auth, ranges);
  console.log(
    `  -> ページ${ga4.topPages.length}件, ブログ${ga4.blogPages.length}件, 流入元${ga4.sources.length}件\n`
  );

  // Save report
  const report = {
    date: today,
    collectedAt: new Date().toISOString(),
    gsc,
    ga4,
  };
  const outPath = path.join(REPORTS_DIR, `${today}.json`);
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log(`レポート保存: ${outPath}`);
  console.log(`  GSC: ${gsc.totals.clicks}クリック / ${gsc.totals.impressions}表示`);
  console.log(`  GA4: ${ga4.summary.users}ユーザー / ${ga4.summary.pv}PV`);
  console.log(`  GA4昨日: ${ga4.yesterday.users}UU / ${ga4.yesterday.pv}PV`);
  console.log(`  ブログ記事(GA4): ${ga4.blogPages.length}件 / ブログ記事(GSC): ${gsc.blogPages.length}件\n`);

  // Output summary JSON for OpenClaw to read
  console.log(
    JSON.stringify({
      status: "ok",
      date: today,
      file: outPath,
      gscTotals: gsc.totals,
      ga4Summary: ga4.summary,
      ga4Yesterday: ga4.yesterday,
      blogPageCount: { ga4: ga4.blogPages.length, gsc: gsc.blogPages.length },
    })
  );
}

main().catch((err) => {
  console.error("エラー:", err.message);
  if (err.stack) console.error(err.stack);
  console.log(JSON.stringify({ status: "error", error: err.message }));
  process.exit(1);
});
