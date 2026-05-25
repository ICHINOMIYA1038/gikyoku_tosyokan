import { NextApiRequest, NextApiResponse } from "next";

// 一時的なデバッグ用エンドポイント。env が正しく入っているか長さと先頭/末尾だけ返す。
// 確認が済んだら削除すること。
export default function handler(_: NextApiRequest, res: NextApiResponse) {
  const tag = (v?: string) => {
    if (!v) return { set: false, length: 0, sample: null };
    return {
      set: true,
      length: v.length,
      head: v.slice(0, 6),
      tail: v.slice(-4),
    };
  };
  res.status(200).json({
    GMAIL_USER: tag(process.env.GMAIL_USER),
    GMAIL_CLIENT_ID: tag(process.env.GMAIL_CLIENT_ID),
    GMAIL_CLIENT_SECRET: tag(process.env.GMAIL_CLIENT_SECRET),
    GMAIL_REFRESH_TOKEN: tag(process.env.GMAIL_REFRESH_TOKEN),
  });
}
