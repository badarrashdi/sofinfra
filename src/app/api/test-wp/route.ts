import { NextResponse } from 'next/server';

export async function GET() {
  const wpBaseUrl =
    process.env.WORDPRESS_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_URL ||
    (process.env.NODE_ENV === 'production' || process.env.VERCEL
      ? 'https://sofinfraadmin.accelerance.in'
      : 'http://sofinfra.local');

  const endpoint = `${wpBaseUrl}/wp-json/sofinfra/v1/homepage`;

  try {
    const startTime = Date.now();
    const res = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; SOFINFRA-Headless/1.0)',
      },
      cache: 'no-store',
    });
    const duration = Date.now() - startTime;
    const status = res.status;
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      // not json
    }

    return NextResponse.json({
      wpBaseUrl,
      endpoint,
      status,
      duration,
      isJson: json !== null,
      data: json,
      rawSample: text.substring(0, 300),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    return NextResponse.json({
      wpBaseUrl,
      endpoint,
      error: message,
      stack,
    }, { status: 500 });
  }
}
