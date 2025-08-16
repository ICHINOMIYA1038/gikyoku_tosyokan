import Head from "next/head";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface StructuredDataProps {
  type?: "WebSite" | "Article" | "BreadcrumbList" | "Organization";
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
  logo = "https://gikyokutosyokan.com/logo.png"
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