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
    <li className="item">
      <a href={url}>
        <p className="date">{date}</p>
        <p className={`category ${categoryClassName}`}>
          <span>{category}</span>
        </p>
        <p className="title">{title}</p>
      </a>
    </li>
  );
};

const NewsList: React.FC<{ news: NewsItemProps[] }> = ({ news }) => {
  return (
    <ul className="news-list">
      {news.slice(0, 5).map((item: any) => (
        <NewsItem
          key={item.id}
          date={item.date}
          category={item.category}
          title={item.title}
          url={item.url}
        />
      ))}
    </ul>
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
