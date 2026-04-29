/**
 * PV Report Script
 *
 * Queries the Access table for the last 30 days and outputs a markdown
 * summary with total PVs, top articles, article type breakdown, and
 * BlogPost language breakdown.
 *
 * Also loads the latest SEO daily collect report (GA4/GSC) if available
 * from data/seo-reports/ to include blog article performance metrics.
 *
 * Usage:
 *   set -a && source .env.local && set +a && npx tsx scripts/openclaw/pv-report.ts
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

/** Classify a BlogPost slug into an article type category. */
function classifySlug(slug: string): string {
  if (slug.includes("daily-tokyo")) return "daily-tokyo-performances";
  if (slug.startsWith("guide-")) return "English articles";
  if (slug.includes("-profile")) return "Author profiles";
  return "Other";
}

async function main() {
  const now = new Date();
  const daysAgo7 = new Date(now);
  daysAgo7.setDate(daysAgo7.getDate() - 7);
  const daysAgo30 = new Date(now);
  daysAgo30.setDate(daysAgo30.getDate() - 30);

  // ---------- Access (Post pages) ----------

  // Total PV counts
  const totalPv30d = await prisma.access.count({
    where: { date: { gte: daysAgo30 } },
  });
  const totalPv7d = await prisma.access.count({
    where: { date: { gte: daysAgo7 } },
  });

  // Top 20 posts by PV (last 30 days)
  const top20 = await prisma.access.groupBy({
    by: ["postId"],
    where: { date: { gte: daysAgo30 } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 20,
  });

  // Fetch post titles for the top 20
  const postIds = top20.map((r) => r.postId);
  const posts = await prisma.post.findMany({
    where: { id: { in: postIds } },
    select: { id: true, title: true },
  });
  const postMap = new Map(posts.map((p) => [p.id, p.title]));

  // ---------- BlogPost type & language breakdown ----------

  const blogPosts = await prisma.blogPost.findMany({
    select: { slug: true, language: true },
  });

  // Type breakdown
  const typeCounts: Record<string, number> = {};
  for (const bp of blogPosts) {
    const type = classifySlug(bp.slug);
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  }

  // Language breakdown
  const langCounts: Record<string, number> = {};
  for (const bp of blogPosts) {
    const lang = bp.language || "unknown";
    langCounts[lang] = (langCounts[lang] || 0) + 1;
  }

  // ---------- Load SEO daily collect report ----------

  const REPORTS_DIR = path.join(__dirname, "../../data/seo-reports");
  let seoReport: any = null;
  if (fs.existsSync(REPORTS_DIR)) {
    const files = fs
      .readdirSync(REPORTS_DIR)
      .filter((f) => f.endsWith(".json") && /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .sort()
      .reverse();
    if (files.length > 0) {
      try {
        seoReport = JSON.parse(
          fs.readFileSync(path.join(REPORTS_DIR, files[0]), "utf-8")
        );
      } catch {
        // ignore parse errors
      }
    }
  }

  // ---------- Output ----------

  const lines: string[] = [];
  const dateStr = now.toISOString().slice(0, 10);

  lines.push(`# PV Report (${dateStr})`);
  lines.push("");
  lines.push("## Total PV (Access table - unique IP/post/day)");
  lines.push("");
  lines.push(`| Period | PV |`);
  lines.push(`|--------|---:|`);
  lines.push(`| Last 7 days | ${totalPv7d.toLocaleString()} |`);
  lines.push(`| Last 30 days | ${totalPv30d.toLocaleString()} |`);
  lines.push("");

  lines.push("## Top 20 Articles by PV (30 days)");
  lines.push("");
  lines.push("| # | Post ID | Title | PV |");
  lines.push("|--:|--------:|-------|---:|");
  top20.forEach((row, i) => {
    const title = postMap.get(row.postId) ?? "(unknown)";
    const pv = row._count.id;
    lines.push(`| ${i + 1} | ${row.postId} | ${title} | ${pv.toLocaleString()} |`);
  });
  lines.push("");

  lines.push("## BlogPost Article Type Breakdown");
  lines.push("");
  lines.push("| Type | Count |");
  lines.push("|------|------:|");
  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  for (const [type, count] of sortedTypes) {
    lines.push(`| ${type} | ${count} |`);
  }
  lines.push("");

  lines.push("## BlogPost Language Breakdown");
  lines.push("");
  lines.push("| Language | Count |");
  lines.push("|----------|------:|");
  const sortedLangs = Object.entries(langCounts).sort((a, b) => b[1] - a[1]);
  for (const [lang, count] of sortedLangs) {
    lines.push(`| ${lang} | ${count} |`);
  }
  lines.push("");

  // ---------- GA4 / GSC data (from seo-daily-collect.js) ----------

  if (seoReport) {
    const ga4 = seoReport.ga4;
    const gsc = seoReport.gsc;

    lines.push(`## GA4 Site Metrics (collected ${seoReport.date})`);
    lines.push("");
    if (ga4?.summary) {
      lines.push(`| Metric | Value |`);
      lines.push(`|--------|------:|`);
      lines.push(`| Monthly UU | ${ga4.summary.users.toLocaleString()} |`);
      lines.push(`| Monthly PV | ${ga4.summary.pv.toLocaleString()} |`);
      lines.push(`| Monthly Sessions | ${ga4.summary.sessions.toLocaleString()} |`);
      if (ga4.yesterday) {
        lines.push(`| Yesterday UU | ${ga4.yesterday.users.toLocaleString()} |`);
        lines.push(`| Yesterday PV | ${ga4.yesterday.pv.toLocaleString()} |`);
      }
      lines.push("");
    }

    if (ga4?.thisWeek && ga4?.prevWeek) {
      const tw = ga4.thisWeek;
      const pw = ga4.prevWeek;
      const pvChange = pw.pv > 0 ? ((tw.pv - pw.pv) / pw.pv * 100).toFixed(1) : "N/A";
      const uuChange = pw.users > 0 ? ((tw.users - pw.users) / pw.users * 100).toFixed(1) : "N/A";
      lines.push(`Weekly comparison: PV ${tw.pv.toLocaleString()} (${pvChange}%), UU ${tw.users.toLocaleString()} (${uuChange}%)`);
      lines.push("");
    }

    // Blog article performance (GA4) - filter to /blog/ paths only
    const blogPagesGA4 = (ga4?.blogPages || []).filter((p: any) => p.path.startsWith("/blog/"));
    if (blogPagesGA4.length > 0) {
      lines.push("## Blog Article PV (GA4 - monthly)");
      lines.push("");
      lines.push("| # | Path | PV | UU |");
      lines.push("|--:|------|---:|---:|");
      const sorted = [...blogPagesGA4].sort((a: any, b: any) => b.pv - a.pv);
      for (let i = 0; i < Math.min(20, sorted.length); i++) {
        const p = sorted[i];
        const shortPath = p.path.length > 55 ? p.path.substring(0, 52) + "..." : p.path;
        lines.push(`| ${i + 1} | ${shortPath} | ${p.pv.toLocaleString()} | ${p.users.toLocaleString()} |`);
      }
      lines.push("");

      // Summary: how many blog articles have PV
      const totalBlog = blogPosts.length;
      const withPV = blogPagesGA4.length;
      lines.push(`Blog articles with PV this month: ${withPV}/${totalBlog} (${((withPV / totalBlog) * 100).toFixed(0)}%)`);
      lines.push("");
    }

    // Search Console
    if (gsc?.totals) {
      lines.push("## Search Console (28 days)");
      lines.push("");
      lines.push(`| Metric | Value |`);
      lines.push(`|--------|------:|`);
      lines.push(`| Clicks | ${gsc.totals.clicks.toLocaleString()} |`);
      lines.push(`| Impressions | ${gsc.totals.impressions.toLocaleString()} |`);
      lines.push(`| CTR | ${((gsc.totals.ctr || 0) * 100).toFixed(1)}% |`);
      lines.push(`| Avg Position | ${(gsc.totals.position || 0).toFixed(1)} |`);
      lines.push("");
    }

    // Blog-specific GSC
    if (gsc?.blogPages && gsc.blogPages.length > 0) {
      lines.push("## Blog Article GSC Performance (28 days)");
      lines.push("");
      lines.push("| # | Page | Clicks | Impressions | CTR |");
      lines.push("|--:|------|-------:|------------:|----:|");
      const blogGSC = [...gsc.blogPages].sort((a: any, b: any) => b.clicks - a.clicks);
      for (let i = 0; i < Math.min(15, blogGSC.length); i++) {
        const p = blogGSC[i];
        const shortPage = p.page.length > 45 ? p.page.substring(0, 42) + "..." : p.page;
        lines.push(`| ${i + 1} | ${shortPage} | ${p.clicks} | ${p.impressions.toLocaleString()} | ${((p.ctr || 0) * 100).toFixed(1)}% |`);
      }
      lines.push("");
    }

    // Top queries
    if (gsc?.queries && gsc.queries.length > 0) {
      lines.push("## Top Search Queries (28 days)");
      lines.push("");
      lines.push("| # | Query | Clicks | Impressions | Position |");
      lines.push("|--:|-------|-------:|------------:|---------:|");
      for (let i = 0; i < Math.min(15, gsc.queries.length); i++) {
        const q = gsc.queries[i];
        lines.push(`| ${i + 1} | ${q.query} | ${q.clicks} | ${q.impressions.toLocaleString()} | ${q.position.toFixed(1)} |`);
      }
      lines.push("");
    }

    // Countries (ja vs en effectiveness)
    if (gsc?.countries && gsc.countries.length > 0) {
      lines.push("## Country Breakdown (GSC)");
      lines.push("");
      lines.push("| Country | Clicks | Impressions | CTR |");
      lines.push("|---------|-------:|------------:|----:|");
      for (const c of gsc.countries) {
        lines.push(`| ${c.country} | ${c.clicks} | ${c.impressions.toLocaleString()} | ${((c.ctr || 0) * 100).toFixed(1)}% |`);
      }
      lines.push("");
    }

    // CTR improvement opportunities
    if (gsc?.pages) {
      const opportunities = gsc.pages
        .filter((p: any) => p.impressions >= 50 && p.ctr < 0.03)
        .sort((a: any, b: any) => b.impressions - a.impressions)
        .slice(0, 5);
      if (opportunities.length > 0) {
        lines.push("## CTR Improvement Opportunities");
        lines.push("");
        lines.push("| Page | Impressions | CTR | Potential +Clicks |");
        lines.push("|------|------------:|----:|------------------:|");
        for (const o of opportunities) {
          const shortPage = o.page.length > 40 ? o.page.substring(0, 37) + "..." : o.page;
          const potential = Math.max(0, Math.round(o.impressions * 0.05 - o.clicks));
          lines.push(`| ${shortPage} | ${o.impressions.toLocaleString()} | ${((o.ctr || 0) * 100).toFixed(1)}% | +${potential} |`);
        }
        lines.push("");
      }
    }
  } else {
    lines.push("## GA4 / GSC Data");
    lines.push("");
    lines.push("No SEO report found. Run `node scripts/seo-daily-collect.js` to generate.");
    lines.push("");
  }

  console.log(lines.join("\n"));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
