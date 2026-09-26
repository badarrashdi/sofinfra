import { NextResponse } from 'next/server';
import { triageInquiry } from '@/lib/jev';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const text = body.inquiry || 'Client interested in booking a 5-marla plot in Park View City with immediate plan.';

    const result = await triageInquiry(text);
    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to execute Jev AI decision';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
