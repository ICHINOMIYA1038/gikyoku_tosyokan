import React, { useEffect, useState } from 'react';
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
    <nav className="border border-gray-200 rounded-lg p-5 my-8 bg-white">
      <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <span className="inline-block w-1 h-4 bg-theater-primary-500 rounded-sm" />
        目次
      </p>
      <ul className="space-y-0.5 text-sm border-l border-gray-200 pl-3">
        {headings.map((heading, i) => {
          const isActive = activeId === heading.id;
          return (
            <li key={i} className={`relative ${heading.level === 3 ? 'ml-4' : ''}`}>
              {isActive && (
                <span className="absolute -left-[13px] top-1/2 -translate-y-1/2 w-1 h-5 bg-theater-primary-500 rounded-r" />
              )}
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={`block py-1.5 transition-colors ${
                  isActive
                    ? 'text-theater-primary-700 font-semibold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {heading.level === 3 && (
                  <span className="inline-block w-1 h-1 rounded-full bg-gray-300 mr-2 align-middle" />
                )}
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export { extractHeadings };
export default BlogTableOfContents;
