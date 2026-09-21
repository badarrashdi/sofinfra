import { NextResponse } from 'next/server';
import { submitContactInquiry, ContactInquiryPayload } from '@/lib/wordpress';

export async function POST(request: Request) {
  try {
    const payload: ContactInquiryPayload = await request.json();

    // Server-side validation - name and at least phone or email
    if (!payload.name || (!payload.email && !payload.phone)) {
      return NextResponse.json(
        { error: 'Name and at least a Phone number or Email are required.' },
        { status: 400 }
      );
    }

    // Default message if empty
    if (!payload.message || !payload.message.trim()) {
      payload.message = `Client requested advisory consultation regarding ${payload.subject || 'properties'}.`;
    }

    const result = await submitContactInquiry(payload);

    return NextResponse.json({
      success: true,
      message: result.message,
      id: result.id,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to process inquiry.';
    console.error('Contact API Error:', msg);
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
