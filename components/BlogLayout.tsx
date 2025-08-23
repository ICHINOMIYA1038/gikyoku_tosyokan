import React from 'react';
import Layout from '@/components/Layout';
import BlogSidebar from '@/components/BlogSidebar';
import Link from 'next/link';
import { FaHome, FaChevronRight } from 'react-icons/fa';

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BlogLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  category?: 'guide' | 'support' | 'news';
  currentPath?: string;
}

export default function BlogLayout({ 
  children, 
  breadcrumbs = [],
  category = 'guide',
  currentPath
}: BlogLayoutProps) {
  const defaultBreadcrumbs = [
    { name: 'ホーム', url: '/' },
    ...breadcrumbs
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* パンくずリスト */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            {defaultBreadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <FaChevronRight className="mx-2 text-gray-400" size={12} />}
                {item.url ? (
                  <Link href={item.url} className="hover:text-blue-600 transition-colors">
                    {index === 0 && <FaHome className="inline mr-1" />}
                    {item.name}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">{item.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* メインコンテンツ */}
          <main className="flex-1 min-w-0">
            <article className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
              {children}
            </article>
          </main>

          {/* サイドバー */}
          <aside className="lg:w-80">
            <div className="sticky top-4">
              <BlogSidebar category={category} currentPath={currentPath} />
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}