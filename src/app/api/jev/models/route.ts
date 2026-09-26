import { NextResponse } from 'next/server';
import { listJevModels } from '@/lib/jev';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await listJevModels();
    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to query Jev AI models';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
