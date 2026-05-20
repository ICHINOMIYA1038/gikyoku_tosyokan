import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "戯曲図書館").slice(0, 28);
  const author = (searchParams.get("author") || "").slice(0, 20);
  const playtime = searchParams.get("playtime");
  const people = searchParams.get("people");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", color: "#ec4899", fontSize: 28, fontWeight: 700 }}>
          戯曲図書館
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 72, fontWeight: 800, color: "#1f2937", lineHeight: 1.15 }}>
            『{title}』
          </div>
          {author && (
            <div style={{ fontSize: 36, color: "#4b5563" }}>{author}</div>
          )}
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            {playtime && (
              <div style={{ display: "flex", padding: "10px 22px", background: "#ddd6fe", color: "#5b21b6", borderRadius: 999, fontSize: 26, fontWeight: 700 }}>
                {playtime}分
              </div>
            )}
            {people && (
              <div style={{ display: "flex", padding: "10px 22px", background: "#fed7aa", color: "#9a3412", borderRadius: 999, fontSize: 26, fontWeight: 700 }}>
                {people}人
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", color: "#6b7280", fontSize: 22 }}>
          gikyokutosyokan.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}
