import { loadImageResponse } from '@/lib/imageResponse';
import type { NextApiRequest, NextApiResponse } from 'next';
import { notoSansJpFonts } from '@/lib/ogFont';

// Cloudflare Workers（OpenNext）は edge runtime に対応していないため、Node.js ランタイムで動かす
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { searchParams } = new URL(req.url ?? '/', 'http://localhost');
  const title = searchParams.get('title') || '戯曲図書館';
  const date = searchParams.get('date') || '';
  const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const fonts = await notoSansJpFonts(['戯曲図書館ブログ', title, date, ...tags.slice(0, 3)].join(''));

  const ImageResponse = await loadImageResponse();
  const image = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1a1a2e',
          padding: '60px',
          fontFamily: '"Noto Sans JP", sans-serif',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <img
            src="https://gikyokutosyokan.com/logo.png"
            width={48}
            height={48}
            style={{ borderRadius: '8px', marginRight: '16px' }}
          />
          <span style={{ color: '#e0e0e0', fontSize: '24px' }}>
            戯曲図書館ブログ
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              color: '#ffffff',
              fontSize: title.length > 30 ? '40px' : '52px',
              fontWeight: 'bold',
              lineHeight: 1.3,
              maxWidth: '100%',
              wordBreak: 'break-word',
            }}
          >
            {title}
          </h1>
        </div>

        {/* Bottom: date + tags */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {date && (
            <span style={{ color: '#a0a0a0', fontSize: '20px' }}>{date}</span>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  backgroundColor: '#2d5f8a',
                  color: '#ffffff',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '16px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );

  image.headers.forEach((value, key) => res.setHeader(key, value));
  res.status(image.status).send(Buffer.from(await image.arrayBuffer()));
}
