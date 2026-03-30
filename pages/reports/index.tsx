import { useState } from "react";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import Link from "next/link";
import Image from "next/image";
import { FaTheaterMasks, FaCalendarAlt, FaMapMarkerAlt, FaCamera, FaPlus } from "react-icons/fa";
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
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-green-100 via-emerald-50 to-green-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-200/50 text-green-800 text-sm font-medium mb-2">
                    <FaCamera />
                    上演レポート
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    みんなの上演レポート
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    上演した感想や写真を共有して、次に演じる人の参考に
                  </p>
                </div>
                <Link
                  href="/reports/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-colors self-start"
                >
                  <FaPlus />
                  レポートを書く
                </Link>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 py-8">
            {reports.length === 0 ? (
              <div className="text-center py-16">
                <FaTheaterMasks className="text-gray-300 text-5xl mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-600 mb-2">
                  まだレポートはありません
                </h2>
                <p className="text-gray-400 mb-6">
                  最初の上演レポートを投稿してみませんか？
                </p>
                <Link
                  href="/reports/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-colors"
                >
                  <FaPlus />
                  レポートを書く
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {reports.map((report) => (
                  <Link
                    key={report.id}
                    href={`/reports/${report.id}`}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    {report.imageUrl && (
                      <div className="relative h-48 bg-gray-100">
                        <Image
                          src={report.imageUrl}
                          alt={report.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h2 className="font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors line-clamp-2">
                        {report.title}
                      </h2>
                      {report.scriptTitle && (
                        <p className="text-sm text-green-600 mb-2">
                          <FaTheaterMasks className="inline mr-1" />
                          {report.scriptTitle}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {report.content}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        {report.theaterGroupName && <span>{report.theaterGroupName}</span>}
                        {report.venue && (
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt />
                            {report.venue}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt />
                          {report.createdAt}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
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

    return { props: { reports }, revalidate: 86400 };
  } catch {
    return { props: { reports: [] } };
  }
};
