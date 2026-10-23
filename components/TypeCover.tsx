// 画像のない作品の表紙。薄い地に作品名を明朝で組む（No Image の代わり）
type TypeCoverProps = {
  title: string;
  author?: string | null;
  className?: string;
  titleClassName?: string;
};

export default function TypeCover({ title, author, className = "", titleClassName = "text-base" }: TypeCoverProps) {
  return (
    <div
      className={`flex flex-col justify-between overflow-hidden border border-[#D9D5CF] bg-[#F4F2EE] p-2 text-gray-900 ${className}`}
      aria-hidden="true"
    >
      <span className={`font-serif font-bold leading-snug line-clamp-4 break-all ${titleClassName}`} style={{ fontFeatureSettings: '"palt"' }}>
        {title}
      </span>
      {author && <span className="mt-1 text-[10px] leading-tight text-gray-600 line-clamp-1">{author}</span>}
    </div>
  );
}
