import https from 'node:https';
import http from 'node:http';
import { Property, PropertySubmissionPayload } from '@/types/property';
import { Society, DELHI_NCR_SOCIETIES } from '@/data/societies';
import { INITIAL_PROPERTIES } from '@/data/mock-properties';

// Allow connections to WordPress hosts with self-signed or incomplete SSL certificate chains
if (typeof process !== 'undefined' && process.env) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// WordPress endpoint - defaults to live production host in production, or http://sofinfra.local in local development
const WP_BASE_URL =
  process.env.WORDPRESS_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  (process.env.NODE_ENV === 'production' || process.env.VERCEL
    ? 'https://admin.sofinfra.com'
    : 'http://sofinfra.local');
const WP_API_ENDPOINT = `${WP_BASE_URL}/wp-json/sofinfra/v1`;

interface WpFetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

/**
 * Universal fetch helper that handles self-signed SSL certificates and LiteSpeed SNI
 * in Node.js / Vercel serverless functions without throwing DEPTH_ZERO_SELF_SIGNED_CERT.
 */
async function wpFetchJson<T>(
  urlString: string,
  options: WpFetchOptions = {}
): Promise<{ ok: boolean; status: number; data: T | null }> {
  // If running in browser, use standard fetch
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(urlString, {
        method: options.method || 'GET',
        headers: {
          Accept: 'application/json',
          ...(options.headers || {}),
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
      if (!res.ok) return { ok: false, status: res.status, data: null };
      const data = (await res.json()) as T;
      return { ok: true, status: res.status, data };
    } catch {
      return { ok: false, status: 500, data: null };
    }
  }

  // Server-side (Node.js / Vercel): use native https with rejectUnauthorized: false and SNI Host
  return new Promise((resolve) => {
    try {
      const url = new URL(urlString);
      const isHttps = url.protocol === 'https:';
      const lib = isHttps ? https : http;

      const bodyData = options.body
        ? typeof options.body === 'string'
          ? options.body
          : JSON.stringify(options.body)
        : undefined;

      const reqOptions: https.RequestOptions = {
        method: options.method || 'GET',
        headers: {
          Host: url.hostname,
          'User-Agent': 'Mozilla/5.0 (compatible; SOFINFRA-Headless/1.0)',
          Accept: 'application/json',
          ...(bodyData
            ? {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bodyData).toString(),
              }
            : {}),
          ...(options.headers || {}),
        },
        rejectUnauthorized: false,
        timeout: options.timeout || 10000,
      };

      const req = lib.request(url, reqOptions, (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          const status = res.statusCode || 500;
          if (status >= 200 && status < 300) {
            try {
              const data = JSON.parse(rawData) as T;
              resolve({ ok: true, status, data });
            } catch {
              resolve({ ok: false, status, data: null });
            }
          } else {
            try {
              const data = JSON.parse(rawData) as T;
              resolve({ ok: false, status, data });
            } catch {
              resolve({ ok: false, status, data: null });
            }
          }
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, status: 408, data: null });
      });

      req.on('error', (err) => {
        console.error('wpFetchJson request error:', err);
        resolve({ ok: false, status: 500, data: null });
      });

      if (bodyData) {
        req.write(bodyData);
      }

      req.end();
    } catch {
      resolve({ ok: false, status: 500, data: null });
    }
  });
}

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
  approach_heading?: string;
  paragraph_2?: string;
  image?: string | { url?: string };
  image_url?: string;
  image_badge?: string;
  image_caption?: string;
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
  trust_metrics?: Array<{
    label?: string;
    desc?: string;
    title?: string;
    description?: string;
  }>;
  testimonials?: Array<{
    author_name: string;
    role_locality: string;
    rating?: number | string;
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

    const result = await wpFetchJson<unknown[]>(
      `${WP_API_ENDPOINT}/properties?${queryParams.toString()}`
    );

    if (result.ok && Array.isArray(result.data) && result.data.length > 0) {
      return result.data.map(mapWpPropertyToFrontend);
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
  const result = await wpFetchJson<{ message?: string; post_id?: number | string; error?: string }>(
    `${WP_API_ENDPOINT}/submit-property`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    }
  );

  if (result.ok && result.data) {
    return {
      success: true,
      message: result.data.message || 'Property submitted successfully! It is now pending admin review.',
      postId: result.data.post_id,
      status: 'pending',
    };
  }

  throw new Error(
    (result.data as { error?: string; message?: string })?.error ||
      (result.data as { error?: string; message?: string })?.message ||
      `Failed to record property submission in SOFINFRA backend (HTTP ${result.status}).`
  );
}

/**
 * Fetches homepage data with ACF flexible content sections from WordPress.
 * Falls back gracefully to null if WordPress is offline.
 */
export async function getHomepageData(): Promise<HomepageData | null> {
  try {
    const result = await wpFetchJson<HomepageData>(`${WP_API_ENDPOINT}/homepage`);

    if (result.ok && result.data && Array.isArray(result.data.sections) && result.data.sections.length > 0) {
      return result.data;
    }

    // Fallback: check standard WordPress page API
    const fallbackResult = await wpFetchJson<Array<{ id: number; title?: { rendered?: string }; slug?: string; acf?: { sections?: unknown[] } }>>(
      `${WP_BASE_URL}/wp-json/wp/v2/pages?slug=home`
    );

    if (fallbackResult.ok && Array.isArray(fallbackResult.data) && fallbackResult.data[0]?.acf?.sections) {
      const p = fallbackResult.data[0];
      return {
        id: p.id,
        title: p.title?.rendered || 'Home',
        slug: p.slug || 'home',
        sections: p.acf!.sections as HomepageSection[],
      };
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
    const result = await wpFetchJson<Society[]>(`${WP_API_ENDPOINT}/projects`);

    if (result.ok && Array.isArray(result.data) && result.data.length > 0) {
      return result.data;
    }
  } catch (error) {
    console.warn('WordPress getProjects unavailable, falling back to static societies:', error);
  }

  return DELHI_NCR_SOCIETIES;
}

/**
 * Submits contact inquiry to WordPress backend.
 * WordPress stores it as a lead and sends email notification to admin.
 */
export interface ContactInquiryPayload {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}

export interface ContactInquiryResponse {
  success: boolean;
  message: string;
  id?: number | string;
}

export async function submitContactInquiry(
  payload: ContactInquiryPayload
): Promise<ContactInquiryResponse> {
  const result = await wpFetchJson<{ message?: string; id?: number | string; error?: string }>(
    `${WP_API_ENDPOINT}/contact`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    }
  );

  if (result.ok && result.data) {
    return {
      success: true,
      message:
        result.data.message ||
        'Your inquiry has been received! Our senior advisory desk will connect with you within 30 minutes.',
      id: result.data.id,
    };
  }

  throw new Error(
    (result.data as { error?: string; message?: string })?.error ||
      (result.data as { error?: string; message?: string })?.message ||
      `Failed to record inquiry in SOFINFRA backend (HTTP ${result.status}).`
  );
}
