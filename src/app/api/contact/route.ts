import { NextResponse } from 'next/server';
import { submitContactInquiry, ContactInquiryPayload } from '@/lib/wordpress';

export async function POST(request: Request) {
  try {
    const payload: ContactInquiryPayload = await request.json();

    // Server-side validation
    if (!payload.name || !payload.email || !payload.phone || !payload.message) {
      return NextResponse.json(
        { error: 'Name, email, phone, and requirements message are required.' },
        { status: 400 }
      );
    }

    const result = await submitContactInquiry(payload);

    return NextResponse.json({
      success: true,
      message: result.message,
      id: result.id,
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process inquiry. Please try again or WhatsApp us directly.' },
      { status: 500 }
    );
  }
}
