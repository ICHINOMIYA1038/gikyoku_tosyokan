import React from 'react';
import { ShareLinks } from '@/components/BoardDetail';

interface BlogShareButtonsProps {
  url: string;
  title: string;
  lang?: 'ja' | 'en';
}

// 記事の共有。掲示板と同じ、文字のボタン（X・LINE・URLのコピー）
const BlogShareButtons: React.FC<BlogShareButtonsProps> = ({ url, title, lang = 'ja' }) => <ShareLinks url={url} text={title} lang={lang} />;

export default BlogShareButtons;
