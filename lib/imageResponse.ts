type ImageResponseCtor = {
  new (...args: any[]): Response;
};

// Cloudflare Workers では next/og が Node 版（フォントを fs で読む）を選んでしまうため、edge 版を使う。
// OpenNext がビルド時に edge 版の既定フォント読み込みを Workers 向けに差し替える。
const isWorkers =
  typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

export async function loadImageResponse(): Promise<ImageResponseCtor> {
  if (isWorkers) {
    const mod = await import(
      /* webpackIgnore: true */ "next/dist/compiled/@vercel/og/index.edge.js"
    );
    return mod.ImageResponse as ImageResponseCtor;
  }
  return (await import("next/og")).ImageResponse;
}
