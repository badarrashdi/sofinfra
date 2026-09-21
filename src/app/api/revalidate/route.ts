import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const REVALIDATION_SECRET =
  process.env.REVALIDATION_SECRET || 'sofinfra_publish_secret_2026';

async function handleRevalidation(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret') || request.headers.get('x-revalidate-secret');
  const path = searchParams.get('path') || '/';
  const tag = searchParams.get('tag');

  // Validate secret
  if (secret !== REVALIDATION_SECRET) {
    return NextResponse.json(
      { message: 'Invalid or missing revalidation secret token' },
      { status: 401 }
    );
  }

  try {
    // Purge cached data on-demand for the requested path and layout
    revalidatePath(path, 'page');
    revalidatePath('/', 'layout');

    return NextResponse.json({
      revalidated: true,
      path,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown revalidation error';
    return NextResponse.json(
      { message: 'Error triggering revalidation', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleRevalidation(request);
}

export async function POST(request: NextRequest) {
  return handleRevalidation(request);
}
