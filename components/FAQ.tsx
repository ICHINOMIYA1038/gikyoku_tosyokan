import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Head from "next/head";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

const FAQ: React.FC<FAQProps> = ({ items, title = "よくある質問" }) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // FAQ構造化データ
  const generateFAQSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": items.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateFAQSchema())
          }}
        />
      </Head>
      
      <section className="max-w-4xl mx-auto my-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          {title}
        </h2>
        
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                onClick={() => toggleItem(index)}
                aria-expanded={openItems.includes(index)}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg font-semibold pr-4">
                  {item.question}
                </h3>
                {openItems.includes(index) ? (
                  <FaChevronUp className="text-gray-500 flex-shrink-0" />
                ) : (
                  <FaChevronDown className="text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openItems.includes(index) && (
                <div
                  id={`faq-answer-${index}`}
                  className="px-6 py-4 border-t bg-gray-50"
                >
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default FAQ;