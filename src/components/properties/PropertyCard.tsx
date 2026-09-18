'use client';

import Image from 'next/image';
import { MapPin, Bed, Bath, Maximize2, ExternalLink, Eye } from 'lucide-react';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
  onSelectProperty: (property: Property) => void;
}

export default function PropertyCard({ property, onSelectProperty }: PropertyCardProps) {
  // Format price accurately based on rules
  const getDisplayPrice = (): string => {
    if (property.pricing.formattedPrice) {
      return property.pricing.formattedPrice;
    }
    if (property.pricing.priceAvailability === 'request') {
      return 'Price on Request';
    }
    if (property.pricing.priceAvailability === 'contact') {
      return 'Contact for Price';
    }
    if (property.pricing.amount) {
      const sym = property.pricing.currency === 'USD' ? '$' : property.pricing.currency === 'GBP' ? '£' : '₹';
      return `${sym}${Number(property.pricing.amount).toLocaleString()}`;
    }
    return 'Price on Request';
  };

  const handleCardClick = () => {
    if (property.detailMode === 'external' && property.externalUrl) {
      window.open(property.externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      onSelectProperty(property);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-[#c59b27]/30 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Property Featured Image with Hover Zoom & Badges */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
        <Image
          src={property.featuredImage}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#0b2240] text-[#c59b27] shadow-sm">
            {property.propertyType}
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
            {property.listingType}
          </span>
        </div>

        {/* Bottom Location & Detail Mode Cue */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white pointer-events-none">
          <div className="flex items-center gap-1.5 text-xs drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-[#c59b27]" />
            <span className="font-medium truncate max-w-[180px]">
              {property.location.locality ? `${property.location.locality}, ` : ''}
              {property.location.city}
            </span>
          </div>
          {property.detailMode === 'external' ? (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-black/50 backdrop-blur-xs text-slate-200">
              <span>External</span>
              <ExternalLink className="w-3 h-3 text-[#c59b27]" />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-black/50 backdrop-blur-xs text-slate-200">
              <span>Quick View</span>
              <Eye className="w-3 h-3 text-[#c59b27]" />
            </span>
          )}
        </div>
      </div>

      {/* Property Details Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Status Tag if present */}
          {property.propertyStatus && (
            <div className="text-[11px] font-semibold text-[#c59b27] uppercase tracking-wider mb-1.5">
              {property.propertyStatus}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-medium text-[#0b2240] line-clamp-1 group-hover:text-[#c59b27] transition-colors">
            {property.title}
          </h3>

          {/* Short Description */}
          <p className="mt-2 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed font-light">
            {property.shortDescription || property.description}
          </p>
        </div>

        {/* Specs Strip */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-slate-600 text-xs">
          {property.specs.bedrooms !== undefined && (
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.specs.bedrooms} Beds</span>
            </div>
          )}
          {property.specs.bathrooms !== undefined && (
            <div className="flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.specs.bathrooms} Baths</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {Number(property.specs.area).toLocaleString()} {property.specs.areaUnit}
            </span>
          </div>
        </div>

        {/* Price & Action CTA */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Valuation
            </span>
            <span className="text-base sm:text-lg font-bold text-[#0b2240]">
              {getDisplayPrice()}
            </span>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase text-[#0b2240] bg-slate-50 group-hover:bg-[#0b2240] group-hover:text-white transition-all duration-200"
          >
            <span>{property.detailMode === 'external' ? 'Visit Project' : 'View Details'}</span>
            {property.detailMode === 'external' ? (
              <ExternalLink className="w-3.5 h-3.5" />
            ) : (
              <span className="text-xs">→</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
