import { useState } from "react";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import Link from "next/link";
import BoardHeader, { BoardEmpty, BOARD_ROW_TITLE } from "@/components/BoardHeader";
import { prisma } from "@/lib/prisma";
import { GetStaticProps } from "next";

type Report = {
  id: number;
  title: string;
  content: string;
  authorName: string;
  theaterGroupName: string | null;
  scriptTitle: string | null;
  venue: string | null;
  performanceDate: string | null;
  imageUrl: string | null;
  createdAt: string;
  postId: number | null;
};

export default function ReportsPage({ reports }: { reports: Report[] }) {
  return (
    <>
      <Seo
        pageTitle="上演レポート｜みんなの公演体験を共有"
        pageDescription="実際に上演した方の声を集めた上演レポート。写真付きの公演体験談から、次の舞台のヒントが見つかります。"
        pagePath="/reports"
        pageType="website"
      />
      <Layout>
        <div className="max-w-5xl mx-auto pb-12">
          <BoardHeader
            current="reports"
            title="上演レポート"
            description="上演した感想や、稽古・本番で工夫したこと。次にその作品を選ぶ人の参考になります。"
            postHref="/reports/new"
            postLabel="レポートを書く"
          />

          <div className="mt-8">
            {reports.length === 0 ? (
              <BoardEmpty message="まだレポートはありません。" postHref="/reports/new" postLabel="最初のレポートを書く" />
            ) : (
              <ul className="border-t border-[#D9D5CF]">
                {reports.map((report) => (
                  <li key={report.id} className="border-b border-[#D9D5CF]">
                    <Link
                      href={`/reports/${report.id}`}
                      className="group grid md:grid-cols-[minmax(0,1fr)_9rem] gap-x-4 py-4 px-2 hover:bg-[#F4F2EE] transition-colors"
                    >
                      <div className="min-w-0">
                        <h2 className={BOARD_ROW_TITLE}>
                          {report.title}
                        </h2>
                        {(report.scriptTitle || report.theaterGroupName || report.venue) && (
                          <p className="mt-1 text-sm text-gray-700 truncate">
                            {[report.scriptTitle, report.theaterGroupName, report.venue].filter(Boolean).join("　/　")}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{report.content}</p>
                        <p className="md:hidden mt-2 text-xs text-gray-500">
                          {report.authorName}・{report.createdAt.replace(/-/g, "/")}
                        </p>
                      </div>
                      <div className="hidden md:block text-right text-xs text-gray-500 leading-relaxed">
                        <p className="truncate">{report.authorName}</p>
                        <p className="tabular-nums">{report.createdAt.replace(/-/g, "/")}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const announcements = await prisma.announcement.findMany({
      where: {
        title: { not: "" },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        title: true,
        content: true,
        authorName: true,
        theaterGroupName: true,
        scriptTitle: true,
        venue: true,
        performanceDate: true,
        createdAt: true,
        postId: true,
      },
    });

    const reports = announcements.map((a) => ({
      ...a,
      imageUrl: null,
      performanceDate: a.performanceDate ? a.performanceDate.toISOString() : null,
      createdAt: a.createdAt.toISOString().split("T")[0],
    }));

    return { props: { reports }, revalidate: 2592000 };
  } catch {
    return { props: { reports: [] } };
  }
};
