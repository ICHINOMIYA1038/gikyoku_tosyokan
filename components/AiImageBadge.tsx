/**
 * AI生成画像画像のラベルバッジ
 * image_url に "covers/post-" が含まれる場合にAI画像と判定
 */
const AiImageBadge = ({ imageUrl, size = "sm" }: { imageUrl: string | null; size?: "sm" | "xs" }) => {
  if (!imageUrl || !imageUrl.includes("covers/post-")) return null;

  return (
    <span
      className={`absolute bottom-1 left-1 bg-black/60 text-white rounded px-1.5 leading-tight backdrop-blur-sm ${
        size === "xs" ? "text-[10px] py-0.5" : "text-[11px] py-0.5"
      }`}
    >
      AI生成画像
    </span>
  );
};

export default AiImageBadge;
