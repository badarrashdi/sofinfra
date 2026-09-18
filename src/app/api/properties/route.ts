import { NextResponse } from 'next/server';
import { getProperties } from '@/lib/wordpress';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const propertyType = searchParams.get('propertyType') || undefined;
  const city = searchParams.get('city') || undefined;
  const search = searchParams.get('search') || undefined;

  try {
    const properties = await getProperties({
      category,
      propertyType,
      city,
      search,
    });
    return NextResponse.json(properties);
  } catch {
    return NextResponse.json(
      { error: 'Failed to retrieve properties' },
      { status: 500 }
    );
  }
}
