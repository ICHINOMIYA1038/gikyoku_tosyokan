import React from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import { FaClock, FaChartBar, FaCalendarAlt, FaStopwatch } from "react-icons/fa";

interface ToolCard {
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

const TOOLS: ToolCard[] = [
  {
    name: "上演時間見積もり",
    description:
      "脚本のテキストを貼り付けるだけで上演時間を推定。ト書きを自動除外し、台詞の文字数から計算します。",
    href: "/tools/playtime-estimator",
    icon: <FaClock />,
    color: "text-blue-500 bg-blue-50",
  },
  {
    name: "セリフ量分析",
    description:
      "台本から登場人物ごとのセリフ量を自動分析。キャスティングや役作りの参考に。",
    href: "/tools/script-analyzer",
    icon: <FaChartBar />,
    color: "text-indigo-500 bg-indigo-50",
  },
  {
    name: "スケジュール作成",
    description:
      "本番日から逆算して稽古スケジュールを自動生成。読み合わせからゲネプロまでの週別計画を作成。",
    href: "/tools/schedule-generator",
    icon: <FaCalendarAlt />,
    color: "text-emerald-500 bg-emerald-50",
  },
  {
    name: "稽古タイマー",
    description:
      "稽古の進行を管理するタイマー。プリセットメニューやカスタムメニューでセグメントごとにカウントダウン。",
    href: "/tools/rehearsal-timer",
    icon: <FaStopwatch />,
    color: "text-orange-500 bg-orange-50",
  },
];

export default function ToolsIndex() {
  return (
    <Layout>
      <Seo
        pageTitle="演劇ツール"
        pageDescription="演劇の準備に役立つ無料ツール集。上演時間の見積もり、セリフ量分析、稽古スケジュール作成、稽古タイマーなど。"
        pagePath="/tools"
        pageKeywords={[
          "演劇ツール",
          "上演時間",
          "セリフ分析",
          "稽古スケジュール",
          "稽古タイマー",
          "戯曲",
          "脚本",
        ]}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "演劇ツール", url: "https://gikyokutosyokan.com/tools" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">
              ホーム
            </Link>
            <span className="mx-2">/</span>
            <span>演劇ツール</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            演劇ツール
          </h1>
          <p className="text-gray-600">
            演劇の準備・稽古に役立つ無料ツールを提供しています。
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg text-lg flex-shrink-0 ${tool.color}`}
                >
                  {tool.icon}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                    {tool.name}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
