import Link from "next/link";

export type Crumb = { name: string; href?: string };

const Breadcrumb = ({ items }: { items: Crumb[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <nav aria-label="パンくずリスト" className="text-xs text-gray-500 mb-3 overflow-x-auto">
      <ol className="flex items-center gap-1 whitespace-nowrap">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-theater-primary-600 hover:underline">
                  {item.name}
                </Link>
              ) : (
                <span className={isLast ? "text-gray-700" : ""} aria-current={isLast ? "page" : undefined}>
                  {item.name}
                </span>
              )}
              {!isLast && <span className="text-gray-300">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
