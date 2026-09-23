export type DetailMode = 'popup' | 'external';

export type ListingType = 'For Sale' | 'Resale' | 'New Launch' | 'Other' | 'For Rent' | 'Lease';

export type PropertyCategory = 'residential' | 'commercial' | 'project' | 'land';

export type PropertyType =
  | 'Apartment'
  | 'Villa'
  | 'House'
  | 'Plot'
  | 'Land'
  | 'Office'
  | 'Shop'
  | 'Commercial Property'
  | 'Residential Property'
  | 'Building'
  | 'Project'
  | 'Penthouse'
  | 'Other';

export interface PropertyLocation {
  city: string;
  state?: string;
  country: string;
  locality?: string;
  subLocation?: string;
  pincode?: string;
  fullAddress?: string;
}

export interface PropertySpecs {
  area: number | string;
  areaUnit: 'sq ft' | 'sq m' | 'acres' | 'hectares';
  bedrooms?: number;
  bathrooms?: number;
  configurations?: string;
  developer?: string;
  reraId?: string;
  furnishingStatus?: 'Furnished' | 'Semi-Furnished' | 'Unfurnished' | string;
  parking?: number | string;
  floor?: number | string;
  totalFloors?: number | string;
  propertyAge?: string;
  facing?: string;
  availability?: string;
}

export interface PropertyPricing {
  priceAvailability: 'price' | 'request' | 'contact';
  amount?: number;
  maxAmount?: number;
  currency?: string;
  formattedPrice?: string; // e.g. "$3,500,000" or "Price on Request"
}

export interface OwnerContact {
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  preferredContactMethod?: 'phone' | 'whatsapp' | 'email';
}

export interface Property {
  id: string | number;
  title: string;
  slug: string;
  developer?: string;
  reraId?: string;
  category: PropertyCategory;
  propertyType: PropertyType;
  listingType: ListingType;
  propertyStatus?: string; // e.g. 'Ready to Move', 'Under Construction', 'Ultra Luxury'
  featured?: boolean;
  location: PropertyLocation;
  pricing: PropertyPricing;
  specs: PropertySpecs;
  amenities: string[];
  description: string;
  shortDescription?: string;
  featuredImage: string;
  galleryImages: string[];
  images?: string[];
  videoUrl?: string;
  floorPlanUrl?: string;
  brochureUrl?: string;
  detailMode?: DetailMode;
  externalUrl?: string;
  status: 'publish' | 'pending' | 'draft';
  createdAt?: string;
  owner?: OwnerContact;
}

export interface PropertySubmissionPayload {
  // Owner info
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  preferredContactMethod: 'phone' | 'whatsapp' | 'email';

  // Property info
  title: string;
  propertyType: PropertyType;
  listingType: ListingType;
  propertyStatus?: string;
  city: string;
  state?: string;
  country: string;
  locality?: string;
  pincode?: string;

  // Pricing
  priceAvailability: 'price' | 'request';
  price?: number | string;
  priceMax?: number | string;
  currency?: string;

  // Details
  area: number | string;
  areaUnit: 'sq ft' | 'sq m' | 'acres';
  bedrooms?: number;
  bathrooms?: number;
  furnishingStatus?: string;
  parking?: string;
  floor?: string;
  totalFloors?: string;
  propertyAge?: string;
  facing?: string;
  availability?: string;
  amenities: string[];
  description: string;

  // Media
  imageFiles?: File[];
  imageUrls?: string[];
  videoUrl?: string;
}

export interface PropertyFilterState {
  category: 'all' | 'residential' | 'commercial' | 'featured';
  propertyType: string;
  listingType: string;
  city: string;
  searchQuery: string;
}
