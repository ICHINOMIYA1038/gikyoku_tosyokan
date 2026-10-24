import React, { useEffect, useState } from 'react';
import { slugifyHeading } from '@/lib/blogMetadata';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface BlogTableOfContentsProps {
  content: string;
  lang?: 'ja' | 'en';
}

function extractHeadings(markdown: string): TocItem[] {
  const headings: TocItem[] = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2]
        // 強調の記号（**太字** と *斜体*）は本文では消えて表示されるので、目次と ID でも消す
        .replace(/\*/g, '')
        .replace(/`([^`]*)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .trim();
      const id = slugifyHeading(text);
      headings.push({ id, text, level });
    }
  }

  return headings;
}

const BlogTableOfContents: React.FC<BlogTableOfContentsProps> = ({ content, lang = 'ja' }) => {
  const [activeId, setActiveId] = useState<string>('');
  const headings = extractHeadings(content);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // 小見出しまで並べると最初の画面が目次で埋まるので、大見出しだけを出す
  const sections = headings.filter((h) => h.level === 2);
  if (sections.length < 2) return null;

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <details open className="group my-8 border-y border-[#D9D5CF]">
      <summary className="flex items-center justify-between py-3 cursor-pointer list-none text-sm font-bold text-gray-900">
        <span>{lang === "en" ? "Contents" : "目次"}<span className="ml-2 font-normal text-gray-600">{lang === "en" ? `${sections.length} sections` : `${sections.length}項目`}</span></span>
        <span className="text-xs font-normal text-gray-600 group-open:hidden">{lang === "en" ? "Show" : "開く"}</span>
        <span className="text-xs font-normal text-gray-600 hidden group-open:inline">{lang === "en" ? "Hide" : "閉じる"}</span>
      </summary>
      <ol className="pb-3 text-sm">
        {sections.map((heading, i) => {
          const isActive = activeId === heading.id;
          return (
            <li key={heading.id || i}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={`grid grid-cols-[2rem_minmax(0,1fr)] py-1.5 hover:text-theater-primary-700 ${isActive ? 'text-theater-primary-700 font-bold' : 'text-gray-800'}`}
              >
                <span className="text-gray-500 tabular-nums">{i + 1}.</span>
                <span>{heading.text}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </details>
  );
};

export { extractHeadings };
export default BlogTableOfContents;
