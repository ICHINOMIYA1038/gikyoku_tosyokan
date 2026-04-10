import Head from "next/head";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface EventItem {
  name: string;
  startDate: string;
  endDate?: string;
  location?: {
    name: string;
  };
  url?: string;
  offers?: {
    priceMin?: number;
    priceMax?: number;
    priceCurrency?: string;
  };
  performer?: {
    name: string;
  };
  description?: string;
}

interface ReviewInfo {
  author: string;
  content: string;
  date?: string;
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
  reviews?: ReviewInfo[];
  categories?: string[];
  datePublished?: string;
}

interface StructuredDataProps {
  type?: "WebSite" | "Article" | "BreadcrumbList" | "Organization" | "Play" | "FAQPage" | "EventList";
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
  // EventList用の追加プロパティ
  events?: EventItem[];
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
  faqItems,
  events
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
          "foundingDate": "2024",
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "email": "gekidankatakago@gmail.com",
            "availableLanguage": ["Japanese"]
          }
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

        // レビュー（最大5件）
        if (playInfo.reviews && playInfo.reviews.length > 0) {
          playData["review"] = playInfo.reviews.slice(0, 5).map((review) => ({
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": review.author
            },
            "reviewBody": review.content,
            ...(review.date ? { "datePublished": review.date } : {})
          }));
        }

        // 公開日
        if (playInfo.datePublished) {
          playData["datePublished"] = playInfo.datePublished;
        }

        return playData;

      case "EventList":
        if (!events || events.length === 0) return null;
        return {
          "@context": "https://schema.org",
          "@graph": events.map((ev) => {
            const eventData: Record<string, unknown> = {
              "@type": "TheaterEvent",
              "name": ev.name,
              "startDate": ev.startDate,
              "eventStatus": "https://schema.org/EventScheduled",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
            };
            if (ev.endDate) eventData["endDate"] = ev.endDate;
            if (ev.description) eventData["description"] = ev.description;
            if (ev.url) eventData["url"] = ev.url;
            if (ev.location?.name) {
              eventData["location"] = {
                "@type": "Place",
                "name": ev.location.name,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Tokyo",
                  "addressCountry": "JP"
                }
              };
            }
            if (ev.offers && (ev.offers.priceMin !== undefined || ev.offers.priceMax !== undefined)) {
              eventData["offers"] = {
                "@type": "Offer",
                "price": ev.offers.priceMin ?? ev.offers.priceMax,
                "priceCurrency": ev.offers.priceCurrency || "JPY",
                "availability": "https://schema.org/InStock",
                ...(ev.url ? { "url": ev.url } : {})
              };
            }
            if (ev.performer?.name) {
              eventData["performer"] = {
                "@type": "TheaterGroup",
                "name": ev.performer.name
              };
            }
            eventData["organizer"] = {
              "@type": "Organization",
              "name": organizationName,
              "url": siteUrl
            };
            return eventData;
          })
        };

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