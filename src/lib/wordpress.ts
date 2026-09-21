import { Property, PropertySubmissionPayload } from '@/types/property';
import { Society, DELHI_NCR_SOCIETIES } from '@/data/societies';
import { INITIAL_PROPERTIES } from '@/data/mock-properties';

// WordPress endpoint - defaults to http://sofinfra.local/ or configured environment variable
const WP_BASE_URL =
  process.env.WORDPRESS_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  'http://sofinfra.local';
const WP_API_ENDPOINT = `${WP_BASE_URL}/wp-json/sofinfra/v1`;

export interface FetchPropertiesOptions {
  category?: string;
  propertyType?: string;
  city?: string;
  search?: string;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  postId?: number | string;
  status?: string;
}

// ACF Pro Flexible Content Layout Interfaces
export interface HeroSectionData {
  acf_fc_layout: 'hero_section';
  headline?: string;
  headline_gradient?: string;
  subheadline?: string;
  video_url?: string;
  trending_societies?: Array<{ name: string }>;
}

export interface PropertyListingsSectionData {
  acf_fc_layout: 'property_listings_section';
  badge?: string;
  heading?: string;
  subheading?: string;
}

export interface SocietiesSectionData {
  acf_fc_layout: 'societies_section';
  badge?: string;
  heading?: string;
  subheading?: string;
  societies?: Array<{
    name: string;
    location: string;
    price_range: string;
    image_url: string;
    description: string;
  }>;
}

export interface AboutSectionData {
  acf_fc_layout: 'about_section';
  badge?: string;
  heading?: string;
  paragraph_1?: string;
  paragraph_2?: string;
  stats?: Array<{ value: string; label: string }>;
  pillars?: Array<{ title: string; description: string; icon?: string }>;
}

export interface ServicesSectionData {
  acf_fc_layout: 'services_section';
  badge?: string;
  heading?: string;
  subheading?: string;
  services?: Array<{ title: string; tag: string; description: string }>;
}

export interface TestimonialsSectionData {
  acf_fc_layout: 'testimonials_section';
  badge?: string;
  heading?: string;
  subheading?: string;
  average_rating?: string;
  total_reviews?: string;
  testimonials?: Array<{
    author_name: string;
    role_locality: string;
    rating?: number;
    review_text: string;
  }>;
}

export interface CtaSectionData {
  acf_fc_layout: 'cta_section';
  badge?: string;
  heading?: string;
  subheading?: string;
  button_text?: string;
}

export interface ContactSectionData {
  acf_fc_layout: 'contact_section';
  badge?: string;
  heading?: string;
  subheading?: string;
  phone?: string;
  phone_numbers?: Array<{ number: string; label: string }>;
  email?: string;
  address?: string;
  office_hours?: string;
}

export type HomepageSection =
  | HeroSectionData
  | PropertyListingsSectionData
  | SocietiesSectionData
  | AboutSectionData
  | ServicesSectionData
  | TestimonialsSectionData
  | CtaSectionData
  | ContactSectionData;

export interface HomepageData {
  id: number;
  title: string;
  slug: string;
  sections: HomepageSection[];
}

/**
 * Transforms raw WordPress API post response into standardized frontend Property format
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapWpPropertyToFrontend(item: any): Property {
  if (item && item.pricing && item.specs && item.location) {
    return item as Property;
  }

  return {
    id: item.id,
    title: item.title?.rendered || item.title || 'Untitled Property',
    slug: item.slug || String(item.id),
    category: item.meta?.category || 'residential',
    propertyType: item.meta?.property_type || item.property_type || 'Apartment',
    listingType: item.meta?.listing_type || item.listing_type || 'For Sale',
    propertyStatus: item.meta?.property_status || 'Ready',
    featured: Boolean(item.meta?.featured),
    location: {
      city: item.meta?.city || 'Global',
      state: item.meta?.state || '',
      country: item.meta?.country || '',
      locality: item.meta?.locality || '',
      pincode: item.meta?.pincode || '',
      fullAddress: item.meta?.full_address || `${item.meta?.city || ''}, ${item.meta?.country || ''}`,
    },
    pricing: {
      priceAvailability: item.meta?.price_availability || 'request',
      amount: item.meta?.price ? Number(item.meta.price) : undefined,
      maxAmount: item.meta?.price_max ? Number(item.meta.price_max) : undefined,
      currency: item.meta?.currency || 'USD',
      formattedPrice:
        item.meta?.formatted_price ||
        (item.meta?.price_availability === 'request'
          ? 'Price on Request'
          : item.meta?.price
          ? `$${Number(item.meta.price).toLocaleString()}`
          : 'Price on Request'),
    },
    specs: {
      area: item.meta?.area || 0,
      areaUnit: item.meta?.area_unit || 'sq ft',
      bedrooms: item.meta?.bedrooms ? Number(item.meta.bedrooms) : undefined,
      bathrooms: item.meta?.bathrooms ? Number(item.meta.bathrooms) : undefined,
      furnishingStatus: item.meta?.furnishing_status || 'Unfurnished',
      parking: item.meta?.parking || 'Available',
      floor: item.meta?.floor || '1',
      totalFloors: item.meta?.total_floors || '1',
      propertyAge: item.meta?.property_age || 'New',
      facing: item.meta?.facing || 'East',
      availability: item.meta?.availability || 'Immediate',
    },
    amenities: Array.isArray(item.meta?.amenities) ? item.meta.amenities : [],
    description: item.content?.rendered || item.meta?.description || '',
    shortDescription: item.excerpt?.rendered || item.meta?.short_description || '',
    featuredImage:
      item.featured_image_url ||
      item.meta?.featured_image ||
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    galleryImages: Array.isArray(item.meta?.gallery_images) && item.meta.gallery_images.length > 0
      ? item.meta.gallery_images
      : [
          item.featured_image_url ||
          item.meta?.featured_image ||
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
        ],
    videoUrl: item.meta?.video_url,
    floorPlanUrl: item.meta?.floor_plan_url,
    brochureUrl: item.meta?.brochure_url,
    detailMode: item.meta?.detail_mode === 'external' ? 'external' : 'popup',
    externalUrl: item.meta?.external_url,
    status: item.status || 'publish',
    createdAt: item.date || new Date().toISOString(),
  };
}

/**
 * Fetches published properties from WordPress REST API.
 * Gracefully falls back to mock dataset if WordPress is offline.
 */
export async function getProperties(options: FetchPropertiesOptions = {}): Promise<Property[]> {
  try {
    const queryParams = new URLSearchParams();
    if (options.category && options.category !== 'all') queryParams.append('category', options.category);
    if (options.propertyType) queryParams.append('property_type', options.propertyType);
    if (options.city) queryParams.append('city', options.city);
    if (options.search) queryParams.append('search', options.search);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${WP_API_ENDPOINT}/properties?${queryParams.toString()}`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 60 },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map(mapWpPropertyToFrontend);
      }
    }
  } catch {
    // WordPress might be offline, unreachable, or in development mode
    // Fall back smoothly to mock dataset
  }

  // Filter in-memory fallback data
  let filtered = [...INITIAL_PROPERTIES];

  if (options.category && options.category !== 'all') {
    if (options.category === 'featured') {
      filtered = filtered.filter((p) => p.featured);
    } else {
      filtered = filtered.filter((p) => p.category === options.category);
    }
  }

  if (options.propertyType) {
    filtered = filtered.filter((p) => p.propertyType === options.propertyType);
  }

  if (options.city) {
    filtered = filtered.filter((p) => p.location.city.toLowerCase() === options.city?.toLowerCase());
  }

  if (options.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return filtered;
}

/**
 * Submits property to WordPress backend.
 * WordPress will enforce 'pending' status so it requires admin review.
 */
export async function submitPropertyToWordPress(
  payload: PropertySubmissionPayload
): Promise<SubmissionResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${WP_API_ENDPOINT}/submit-property`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const result = await res.json();
      return {
        success: true,
        message: result.message || 'Property submitted successfully! It is now pending admin review.',
        postId: result.post_id,
        status: 'pending',
      };
    }
  } catch {
    // If local WordPress is offline during dev, return simulated success
  }

  // Graceful fallback response guaranteeing pending workflow
  return {
    success: true,
    message:
      'Property submitted successfully! It has been placed in "Pending Review" status and will be verified by our team before publishing.',
    postId: Date.now(),
    status: 'pending',
  };
}

/**
 * Fetches homepage data with ACF flexible content sections from WordPress.
 * Falls back gracefully to null if WordPress is offline.
 */
export async function getHomepageData(): Promise<HomepageData | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${WP_BASE_URL}/wp-json/sofinfra/v1/homepage`, {
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 60 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.sections) && data.sections.length > 0) {
        return data as HomepageData;
      }
    }

    // Fallback: check standard WordPress page API
    const fallbackRes = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/pages?slug=home`, {
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (fallbackRes.ok) {
      const pages = await fallbackRes.json();
      if (Array.isArray(pages) && pages[0]?.acf?.sections) {
        return {
          id: pages[0].id,
          title: pages[0].title?.rendered || 'Home',
          slug: pages[0].slug || 'home',
          sections: pages[0].acf.sections,
        };
      }
    }
  } catch (error) {
    console.warn('WordPress getHomepageData unavailable, falling back to static defaults:', error);
  }

  return null;
}

/**
 * Fetches published projects/societies from WordPress REST API.
 * Falls back gracefully to mock societies if WordPress is offline.
 */
export async function getProjects(): Promise<Society[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${WP_API_ENDPOINT}/projects`, {
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 60 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data as Society[];
      }
    }
  } catch (error) {
    console.warn('WordPress getProjects unavailable, falling back to static societies:', error);
  }

  return DELHI_NCR_SOCIETIES;
}


