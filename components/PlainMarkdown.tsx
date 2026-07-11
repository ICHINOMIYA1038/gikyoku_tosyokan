import React from "react";
import { marked } from "marked";

/**
 * CustomMarkdown と違い、`.markdown-content` クラスを付けない素のMarkdownレンダラー。
 * Tailwind Typography (`prose`) と組み合わせて使う想定。
 */
const PlainMarkdown: React.FC<{ content: string }> = ({ content }) => {
  marked.setOptions({ breaks: true, gfm: true });
  const html = marked(content) as string;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default PlainMarkdown;
