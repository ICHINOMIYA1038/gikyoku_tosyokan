import Image, { ImageProps } from "next/image";

const ALLOWED_DOMAINS = [
  "www.hanmoto.com",
  "playwright.s3.ap-northeast-1.amazonaws.com",
  "gikyokutosyokan-public.s3.ap-northeast-1.amazonaws.com",
  "shukou.org",
  "www.geigeki.jp",
];

// S3ホスト画像は Vercel Image Optimization をバイパスしてコスト削減
const S3_HOSTS = [
  "playwright.s3.ap-northeast-1.amazonaws.com",
  "gikyokutosyokan-public.s3.ap-northeast-1.amazonaws.com",
];

const classify = (src: string): "next" | "raw" => {
  if (!src) return "raw";
  if (src.startsWith("/")) return "next";
  try {
    const host = new URL(src).host;
    if (S3_HOSTS.includes(host)) return "raw";
    if (ALLOWED_DOMAINS.includes(host)) return "next";
    return "raw";
  } catch {
    return "raw";
  }
};

type Props = Omit<ImageProps, "src"> & {
  src: string;
  imgClassName?: string;
};

const OptimizedImage = ({ src, alt, width, height, className, imgClassName, sizes, priority, loading, ...rest }: Props) => {
  if (classify(src) === "next") {
    return (
      <Image
        src={src}
        alt={alt}
        width={width as number}
        height={height as number}
        className={className}
        sizes={sizes}
        priority={priority}
        loading={loading}
        {...rest}
      />
    );
  }
  return (
    <img
      src={src}
      alt={alt as string}
      width={width as number | undefined}
      height={height as number | undefined}
      className={imgClassName || className}
      loading={priority ? "eager" : (loading as any) || "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
};

export default OptimizedImage;
