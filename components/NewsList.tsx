import Link from "next/link";
import React from "react";

interface NewsItemProps {
  date: string;
  category: string;
  title: string;
  url: string;
}

const categoryStyles: Record<string, string> = {
  "重要": "bg-red-600",
  "お知らせ": "bg-blue-600",
  "新着脚本": "bg-green-600",
  "公演情報": "bg-purple-600",
};

const NewsItem: React.FC<NewsItemProps> = ({ date, category, title, url }) => {
  const bgColor = categoryStyles[category] || "bg-gray-600";

  const content = (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`px-2 py-0.5 text-xs font-semibold text-white rounded ${bgColor}`}>
        {category}
      </span>
      <span className="text-sm text-gray-500">{date}</span>
      <span className="text-sm text-gray-800">{title}</span>
    </div>
  );

  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      {url ? (
        <Link href={url} className="block hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors">
          {content}
        </Link>
      ) : (
        <div className="px-2 py-1">{content}</div>
      )}
    </div>
  );
};

interface NewsListProps {
  news: NewsItemProps[];
  limit?: number;
  showAll?: boolean;
}

const NewsList: React.FC<NewsListProps> = ({ news, limit = 3, showAll = false }) => {
  const sorted = [...(news || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const displayed = showAll ? sorted : sorted.slice(0, limit);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">News</h2>
        {!showAll && sorted.length > limit && (
          <Link href="/news" className="text-sm text-blue-600 hover:underline">
            すべて見る
          </Link>
        )}
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4">
        {displayed.length > 0 ? (
          displayed.map((item: any) => (
            <NewsItem
              key={item.id || item.date}
              date={item.date}
              category={item.category}
              title={item.title}
              url={item.url}
            />
          ))
        ) : (
          <p className="py-4 text-sm text-gray-500 text-center">お知らせはありません</p>
        )}
      </div>
    </div>
  );
};

export default NewsList;
