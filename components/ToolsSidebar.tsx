import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaClock, FaChartBar, FaCalendarAlt, FaStopwatch } from "react-icons/fa";

interface Tool {
  slug: string;
  name: string;
  icon: React.ReactNode;
  href: string;
}

const TOOLS: Tool[] = [
  {
    slug: "playtime-estimator",
    name: "上演時間見積もり",
    icon: <FaClock />,
    href: "/tools/playtime-estimator",
  },
  {
    slug: "script-analyzer",
    name: "セリフ量分析",
    icon: <FaChartBar />,
    href: "/tools/script-analyzer",
  },
  {
    slug: "schedule-generator",
    name: "スケジュール作成",
    icon: <FaCalendarAlt />,
    href: "/tools/schedule-generator",
  },
  {
    slug: "rehearsal-timer",
    name: "稽古タイマー",
    icon: <FaStopwatch />,
    href: "/tools/rehearsal-timer",
  },
];

interface ToolsSidebarProps {
  currentTool: string;
}

export default function ToolsSidebar({ currentTool }: ToolsSidebarProps) {
  const { data: session } = useSession();

  return (
    <>
      {/* Desktop: vertical sidebar */}
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <div className="sticky top-24">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            ツール一覧
          </h2>
          <nav className="space-y-1">
            {TOOLS.map((tool) => {
              const isActive = tool.slug === currentTool;
              return (
                <Link
                  key={tool.slug}
                  href={tool.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className={`text-base ${isActive ? "text-blue-500" : "text-gray-400"}`}>
                    {tool.icon}
                  </span>
                  {tool.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
            {session && (
              <Link
                href="/mypage"
                className="block text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                マイデータ &rarr;
              </Link>
            )}
            <Link
              href="/"
              className="block text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              戯曲を探す &rarr;
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile: horizontal scrollable tab bar */}
      <div className="lg:hidden -mx-4 px-4 mb-6 overflow-x-auto">
        <nav className="flex gap-2 min-w-max pb-2">
          {TOOLS.map((tool) => {
            const isActive = tool.slug === currentTool;
            return (
              <Link
                key={tool.slug}
                href={tool.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span className="text-xs">{tool.icon}</span>
                {tool.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
