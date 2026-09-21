import { NextResponse } from 'next/server';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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
    const errorObj = err as { message?: string; stack?: string; cause?: any };
    const causeDetails = errorObj.cause ? {
      name: errorObj.cause.name,
      message: errorObj.cause.message,
      code: errorObj.cause.code,
      errno: errorObj.cause.errno,
      syscall: errorObj.cause.syscall,
      hostname: errorObj.cause.hostname,
    } : null;

    return NextResponse.json({
      wpBaseUrl,
      endpoint,
      error: errorObj.message || String(err),
      cause: causeDetails,
      stack: errorObj.stack,
    }, { status: 500 });
  }
}
