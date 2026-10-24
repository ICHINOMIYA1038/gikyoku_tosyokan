import Link from "next/link";
import React from "react";

interface NewsItemProps {
  date: string;
  category: string;
  title: string;
  url: string;
}

// 種類は色分けせず、文字で示す。「重要」だけ紅にする
const NewsItem: React.FC<NewsItemProps> = ({ date, category, title, url }) => {
  const content = (
    <span className="grid grid-cols-[6.5rem_minmax(0,1fr)] md:grid-cols-[7rem_5rem_minmax(0,1fr)] gap-x-3 gap-y-0.5">
      <span className="text-sm text-gray-600 tabular-nums">{date}</span>
      <span className={`text-xs md:text-sm ${category === "重要" ? "text-theater-primary-700 font-bold" : "text-gray-600"}`}>{category}</span>
      <span className="col-span-2 md:col-span-1 text-[15px] text-gray-900">{title}</span>
    </span>
  );

  return (
    <li className="border-b border-[#D9D5CF]">
      {url ? (
        <Link href={url} className="group block py-3 px-1 hover:bg-[#F4F2EE]">
          {content}
        </Link>
      ) : (
        <div className="py-3 px-1">{content}</div>
      )}
    </li>
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
      <div className="flex items-baseline justify-between border-b-2 border-gray-900 pb-2">
        <h2 className="!my-0 !pb-0 !text-base !font-bold !text-gray-900">お知らせ</h2>
        {!showAll && sorted.length > limit && (
          <Link href="/news" className="text-sm text-theater-primary-700 hover:underline">
            すべて見る
          </Link>
        )}
      </div>
      {displayed.length > 0 ? (
        <ul>
          {displayed.map((item: any) => (
            <NewsItem key={item.id || item.date} date={item.date} category={item.category} title={item.title} url={item.url} />
          ))}
        </ul>
      ) : (
        <p className="py-4 text-sm text-gray-600">お知らせはありません</p>
      )}
    </div>
  );
};

export default NewsList;
