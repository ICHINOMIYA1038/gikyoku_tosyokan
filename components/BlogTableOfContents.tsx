import React, { useEffect, useState } from 'react';
import { FaListUl } from 'react-icons/fa';
import { slugifyHeading } from '@/lib/blogMetadata';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface BlogTableOfContentsProps {
  content: string;
}

function extractHeadings(markdown: string): TocItem[] {
  const headings: TocItem[] = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      // バッジ（inline code）やリンクのMarkdown記法を除去してプレーンテキスト化
      const text = match[2]
        .replace(/\*\*/g, '')
        .replace(/`([^`]*)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .trim();
      const id = slugifyHeading(text);
      headings.push({ id, text, level });
    }
  }

  return headings;
}

const BlogTableOfContents: React.FC<BlogTableOfContentsProps> = ({ content }) => {
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

  if (headings.length < 2) return null;

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="bg-gradient-to-br from-gray-50 to-blue-50/30 border border-gray-200 rounded-xl p-5 my-8 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold text-sm">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-600">
          <FaListUl className="text-xs" />
        </div>
        <span>目次</span>
      </div>
      <ul className="space-y-0.5 text-sm">
        {headings.map((heading, i) => (
          <li key={i} className={heading.level === 3 ? 'ml-4' : ''}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`block px-3 py-1.5 rounded-lg transition-all duration-200 ${
                activeId === heading.id
                  ? 'text-blue-700 font-semibold bg-blue-100/60'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100/60'
              } ${heading.level === 2 ? 'font-medium' : ''}`}
            >
              {heading.level === 3 && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 mr-2 align-middle" />
              )}
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export { extractHeadings };
export default BlogTableOfContents;
