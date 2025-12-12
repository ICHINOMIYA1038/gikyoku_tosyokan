import Head from "next/head";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface RatingInfo {
  ratingValue: number;
  ratingCount: number;
}

interface PlayInfo {
  title: string;
  author: {
    name: string;
    url?: string;
  };
  description?: string;
  url: string;
  image?: string;
  duration?: number; // 上演時間（分）
  castSize?: {
    man?: number;
    woman?: number;
    others?: number;
    total?: number;
  };
  rating?: RatingInfo;
  categories?: string[];
  datePublished?: string;
}

interface StructuredDataProps {
  type?: "WebSite" | "Article" | "BreadcrumbList" | "Organization" | "Play" | "FAQPage";
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  author?: {
    name: string;
    url?: string;
  };
  datePublished?: string;
  dateModified?: string;
  breadcrumbs?: BreadcrumbItem[];
  organizationName?: string;
  logo?: string;
  // Play用の追加プロパティ
  playInfo?: PlayInfo;
  // FAQPage用の追加プロパティ
  faqItems?: FAQItem[];
}

const StructuredData = ({
  type = "WebSite",
  title,
  description,
  url,
  image,
  author,
  datePublished,
  dateModified,
  breadcrumbs,
  organizationName = "戯曲図書館",
  logo = "https://gikyokutosyokan.com/logo.png",
  playInfo,
  faqItems
}: StructuredDataProps) => {
  const siteUrl = "https://gikyokutosyokan.com";
  
  const generateStructuredData = () => {
    switch (type) {
      case "WebSite":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": title || "戯曲図書館",
          "alternateName": "Gikyoku Tosyokan",
          "description": description || "上演する脚本を探しの方に。上演時間や人数などから検索ができます。",
          "url": url || siteUrl,
          "inLanguage": "ja-JP",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${siteUrl}/?keyword={search_term_string}`
            },
            "query-input": {
              "@type": "PropertyValueSpecification",
              "valueRequired": true,
              "valueName": "search_term_string"
            }
          },
          "publisher": {
            "@type": "Organization",
            "name": organizationName,
            "logo": {
              "@type": "ImageObject",
              "url": logo,
              "width": 512,
              "height": 512
            }
          },
          "sameAs": [
            "https://twitter.com/gikyokutosyokan"
          ]
        };
        
      case "Article":
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": title,
          "description": description,
          "image": image || logo,
          "datePublished": datePublished,
          "dateModified": dateModified || datePublished,
          "author": author ? {
            "@type": "Person",
            "name": author.name,
            "url": author.url
          } : undefined,
          "publisher": {
            "@type": "Organization",
            "name": organizationName,
            "logo": {
              "@type": "ImageObject",
              "url": logo
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
          }
        };
        
      case "BreadcrumbList":
        if (!breadcrumbs || breadcrumbs.length === 0) return null;
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        };
        
      case "Organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": organizationName,
          "url": siteUrl,
          "logo": logo,
          "description": "戯曲図書館は、演劇・舞台の脚本を検索できるサービスです。",
          "sameAs": [
            "https://twitter.com/gikyokutosyokan"
          ]
        };

      case "Play":
        if (!playInfo) return null;

        // 上演時間をISO 8601形式に変換（例: PT30M = 30分）
        const formatDuration = (minutes?: number) => {
          if (!minutes) return undefined;
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          if (hours > 0 && mins > 0) return `PT${hours}H${mins}M`;
          if (hours > 0) return `PT${hours}H`;
          return `PT${mins}M`;
        };

        // キャスト情報のテキスト生成
        const generateCastDescription = () => {
          if (!playInfo.castSize) return undefined;
          const { man, woman, others, total } = playInfo.castSize;
          const parts: string[] = [];
          if (man) parts.push(`男性${man}人`);
          if (woman) parts.push(`女性${woman}人`);
          if (others) parts.push(`その他${others}人`);
          if (total) parts.push(`計${total}人`);
          return parts.length > 0 ? `出演者: ${parts.join("、")}` : undefined;
        };

        const playData: Record<string, unknown> = {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "additionalType": "Play",
          "name": playInfo.title,
          "description": playInfo.description,
          "url": playInfo.url,
          "image": playInfo.image || logo,
          "inLanguage": "ja",
          "author": {
            "@type": "Person",
            "name": playInfo.author.name,
            "url": playInfo.author.url
          },
          "publisher": {
            "@type": "Organization",
            "name": organizationName,
            "logo": {
              "@type": "ImageObject",
              "url": logo
            }
          }
        };

        // 上演時間
        if (playInfo.duration) {
          playData["timeRequired"] = formatDuration(playInfo.duration);
          playData["duration"] = formatDuration(playInfo.duration);
        }

        // キャスト情報を説明に追加
        const castDescription = generateCastDescription();
        if (castDescription) {
          playData["abstract"] = castDescription;
        }

        // カテゴリ/ジャンル
        if (playInfo.categories && playInfo.categories.length > 0) {
          playData["genre"] = playInfo.categories;
        }

        // 評価情報（AggregateRating）
        if (playInfo.rating && playInfo.rating.ratingCount > 0) {
          playData["aggregateRating"] = {
            "@type": "AggregateRating",
            "ratingValue": playInfo.rating.ratingValue.toFixed(1),
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": playInfo.rating.ratingCount
          };
        }

        // 公開日
        if (playInfo.datePublished) {
          playData["datePublished"] = playInfo.datePublished;
        }

        return playData;

      case "FAQPage":
        if (!faqItems || faqItems.length === 0) return null;
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqItems.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        };

      default:
        return null;
    }
  };
  
  const structuredData = generateStructuredData();
  
  if (!structuredData) return null;
  
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    </Head>
  );
};

export default StructuredData;