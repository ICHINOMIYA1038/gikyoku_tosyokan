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
    <nav className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-6">
      <div className="flex items-center gap-2 mb-3 text-gray-700 font-bold text-sm">
        <FaListUl />
        <span>目次</span>
      </div>
      <ul className="space-y-1.5 text-sm">
        {headings.map((heading, i) => (
          <li key={i} style={{ paddingLeft: heading.level === 3 ? '1rem' : 0 }}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`block py-0.5 transition-colors hover:text-blue-600 ${
                activeId === heading.id
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600'
              }`}
            >
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
