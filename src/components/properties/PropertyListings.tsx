'use client';

import { useState, useMemo } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Property } from '@/types/property';
import { PropertyListingsSectionData } from '@/lib/wordpress';
import PropertyCard from './PropertyCard';

interface PropertyListingsProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  data?: PropertyListingsSectionData;
}

export default function PropertyListings({
  properties,
  onSelectProperty,
  data,
}: PropertyListingsProps) {
  const [selectedCity, setSelectedCity] = useState<'All' | 'Gurugram' | 'Noida' | 'New Delhi'>('All');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Filter properties by city (matching Top Societies filter)
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (selectedCity === 'All') return true;
      const city = (p.location?.city || '').toLowerCase();
      const locality = (p.location?.locality || '').toLowerCase();
      const target = selectedCity.toLowerCase();

      if (target === 'gurugram') {
        return city.includes('gurugram') || city.includes('gurgaon') || locality.includes('gurugram') || locality.includes('gurgaon');
      }
      return city.includes(target) || locality.includes(target);
    });
  }, [properties, selectedCity]);

  const displayedProperties = useMemo(() => {
    return filteredProperties.slice(0, visibleCount);
  }, [filteredProperties, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleCityChange = (city: 'All' | 'Gurugram' | 'Noida' | 'New Delhi') => {
    setSelectedCity(city);
    setVisibleCount(6); // Reset pagination on filter change
  };

  return (
    <section id="buy-properties" className="py-24 sm:py-32 bg-slate-50/70 relative">
      {/* Anchor alias for smooth legacy navigation */}
      <div id="buy-rent" className="absolute -top-24" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-[#0b2240] text-xs font-semibold tracking-widest uppercase mb-3">
              {data?.badge || 'Delhi NCR Prime Portfolio'}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0b2240] tracking-tight">
              {data?.heading || 'Curated Luxury Residences & Commercial Assets'}
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base font-light max-w-xl">
              {data?.subheading ||
                'Verified luxury apartments, golf-view sky villas, penthouses, and commercial floorplates across Gurugram, Noida, and New Delhi.'}
            </p>
          </div>

          {/* City Filter Tabs - Matching Top Societies filters */}
          <div className="inline-flex p-1 bg-white rounded-xl shadow-xs border border-slate-200 self-start md:self-auto overflow-x-auto">
            {(['All', 'Gurugram', 'Noida', 'New Delhi'] as const).map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => handleCityChange(city)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all tracking-wide whitespace-nowrap cursor-pointer ${
                  selectedCity === city
                    ? 'bg-[#0b2240] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0b2240] hover:bg-slate-50'
                }`}
              >
                {city === 'All' ? 'All NCR' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Property Grid (6 by default) */}
        {displayedProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSelectProperty={onSelectProperty}
                />
              ))}
            </div>

            {/* Load More Button if more than 6 projects */}
            {filteredProperties.length > visibleCount && (
              <div className="mt-14 text-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold text-white bg-[#0b2240] hover:bg-[#122f55] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Load More Projects ({filteredProperties.length - visibleCount} Remaining)</span>
                  <ChevronDown className="w-4 h-4 text-[#c59b27] group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-700">No properties found for {selectedCity}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              We are constantly onboarding verified prime residences and commercial spaces in this hub.
            </p>
            <button
              type="button"
              onClick={() => handleCityChange('All')}
              className="mt-4 px-4 py-2 rounded-lg bg-[#0b2240] text-white text-xs font-semibold cursor-pointer"
            >
              Show All NCR Properties
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
