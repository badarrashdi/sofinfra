'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { Property } from '@/types/property';
import PropertyCard from '../properties/PropertyCard';

interface ResidentialSectionProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onSubmitPropertyClick: () => void;
}

export default function ResidentialSection({
  properties,
  onSelectProperty,
  onSubmitPropertyClick,
}: ResidentialSectionProps) {
  const residentialProperties = properties.filter((p) => p.category === 'residential').slice(0, 3);

  return (
    <section id="residential" className="py-16 sm:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#faf7f2] border border-[#c59b27]/20 text-[#ab841b] text-xs font-semibold tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>Private Sanctuaries</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0b2240] tracking-tight">
              Exclusive <span className="font-semibold">Residential Estates</span>
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base font-light leading-relaxed">
              From waterfront villas along the Arabian Gulf to stately white-stucco mansions in London and penthouses overlooking Central Park, explore residences designed for generations.
            </p>
          </div>

          <button
            type="button"
            onClick={onSubmitPropertyClick}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#0b2240] hover:text-[#c59b27] transition-colors"
          >
            <span>Have a luxury home to list?</span>
            <ArrowRight className="w-4 h-4 text-[#c59b27]" />
          </button>
        </div>

        {/* Residential Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {residentialProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelectProperty={onSelectProperty}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
