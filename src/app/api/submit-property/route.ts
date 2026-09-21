import { NextResponse } from 'next/server';
import { submitPropertyToWordPress, submitContactInquiry } from '@/lib/wordpress';
import { PropertySubmissionPayload } from '@/types/property';

export async function POST(request: Request) {
  try {
    const payload: PropertySubmissionPayload = await request.json();

    // Basic server-side validation for critical fields
    if (!payload.fullName || !payload.email || !payload.phone) {
      return NextResponse.json(
        { error: 'Owner contact fields (Full Name, Email, Phone) are required.' },
        { status: 400 }
      );
    }

    if (!payload.title || !payload.propertyType || !payload.listingType || !payload.city) {
      return NextResponse.json(
        { error: 'Property details (Title, Property Type, Listing Type, City) are required.' },
        { status: 400 }
      );
    }

    if (!payload.area) {
      return NextResponse.json(
        { error: 'Property Area/Size is required.' },
        { status: 400 }
      );
    }

    if (!payload.description) {
      return NextResponse.json(
        { error: 'Property description is required.' },
        { status: 400 }
      );
    }

    // Submit to WordPress backend (enforcing pending review status)
    const result = await submitPropertyToWordPress(payload);

    // Also explicitly ensure a lead is logged in Inquiries & Leads
    const priceDisplay = payload.priceAvailability === 'request' ? 'Price on Request' : (payload.price ? `${payload.price} ${payload.currency || 'INR'}` : 'Not Specified');
    await submitContactInquiry({
      name: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      subject: `Property Listing: ${payload.title} (${payload.city})`,
      message: `[Property Submission]\nTitle: ${payload.title}\nProperty Type: ${payload.propertyType}\nListing Type: ${payload.listingType}\nCity: ${payload.city}\nLocality/Society: ${payload.locality || 'N/A'}\nArea: ${payload.area} ${payload.areaUnit || 'sq ft'}\nExpected Price: ${priceDisplay}\n\nDescription:\n${payload.description}`,
    }).catch((inqErr) => {
      console.warn('Failed to mirror property submission into Inquiries & Leads:', inqErr);
    });

    return NextResponse.json({
      success: true,
      message: result.message,
      postId: result.postId,
      status: 'pending',
    });
  } catch {
    return NextResponse.json(
      { error: 'An error occurred while submitting your property. Please try again.' },
      { status: 500 }
    );
  }
}
