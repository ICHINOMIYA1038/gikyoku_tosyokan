import Link from "next/link";
import React from "react";

interface NewsItemProps {
  date: string;
  category: string;
  title: string;
  url: string;
}

const NewsItem: React.FC<NewsItemProps> = ({ date, category, title, url }) => {
  const categoryClassName = getCategoryClassName(category);

  return (
    <div className="m-5 border-b-2 border-black lg:w-1/3">
      {url ? (
        <Link
          href={url}
          className="flex flex-wrap items-center border-b border-gray-300 hover:text-blue-500"
        >
          <p
            className={`px-2 py-1 mr-2 text-xs font-semibold bg-blue-600 text-white rounded-sm`}
          >
            {category}
          </p>
          <p className="text-sm mr-4">{date}</p>

          <p className="">{title}</p>
        </Link>
      ) : (
        <div className="flex">
          <p
            className={`px-2 py-1 mr-2 text-xs font-semibold bg-blue-600 text-white rounded-sm`}
          >
            {category}
          </p>
          <p className="text-sm mr-4">{date}</p>

          <p className="">{title}</p>
        </div>
      )}
    </div>
  );
};

const NewsList: React.FC<{ news: NewsItemProps[] }> = ({ news }) => {
  return (
    <>
      <h2 className="m-5 text-2xl font-bold">News</h2>
      {news
        .slice(0, 5)
        .reverse()
        .map((item: any) => (
          <NewsItem
            key={item.id}
            date={item.date}
            category={item.category}
            title={item.title}
            url={item.url}
          />
        ))}
    </>
  );
};

function getCategoryClassName(category: string): string {
  switch (category) {
    case "新着脚本":
      return "new-script";
    case "公演情報":
      return "performance-info";
    case "お知らせ":
      return "notice";
    case "重要":
      return "important";
    default:
      return "";
  }
}

export default NewsList;
