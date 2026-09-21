'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
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
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'residential' | 'commercial'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Extract unique cities
  const cities = useMemo(() => {
    const set = new Set(properties.map((p) => p.location.city));
    return Array.from(set);
  }, [properties]);

  // Extract unique types
  const propertyTypes = useMemo(() => {
    const set = new Set(properties.map((p) => p.propertyType));
    return Array.from(set);
  }, [properties]);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Category filter (Residential vs Commercial)
      if (categoryFilter !== 'all' && p.category !== categoryFilter) {
        return false;
      }

      // City filter
      if (selectedCity !== 'all' && p.location.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && p.propertyType !== selectedType) {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesCity = p.location.city.toLowerCase().includes(q);
        const matchesLocality = p.location.locality?.toLowerCase().includes(q);
        const matchesType = p.propertyType.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCity && !matchesLocality && !matchesType) {
          return false;
        }
      }

      return true;
    });
  }, [properties, categoryFilter, selectedCity, selectedType, searchQuery]);

  const displayedProperties = useMemo(() => {
    return filteredProperties.slice(0, visibleCount);
  }, [filteredProperties, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleFilterChange = (cb: () => void) => {
    cb();
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
              {data?.heading || 'Featured Properties'}
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base font-light max-w-xl">
              {data?.subheading ||
                'Verified luxury apartments, golf-view sky villas, penthouses, and commercial floorplates across Gurugram, Noida, and New Delhi.'}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="inline-flex p-1 bg-white rounded-xl shadow-xs border border-slate-200 self-start md:self-auto overflow-x-auto">
            {(
              [
                { id: 'all', label: 'All Properties' },
                { id: 'residential', label: 'Luxury Residential' },
                { id: 'commercial', label: 'Grade-A Commercial' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleFilterChange(() => setCategoryFilter(tab.id))}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all tracking-wide whitespace-nowrap cursor-pointer ${
                  categoryFilter === tab.id
                    ? 'bg-[#0b2240] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0b2240] hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Golf Course Rd, Sector 150, Noida..."
                value={searchQuery}
                onChange={(e) => handleFilterChange(() => setSearchQuery(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#c59b27]"
              />
            </div>

            {/* City Dropdown */}
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => handleFilterChange(() => setSelectedCity(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#c59b27] bg-white cursor-pointer"
              >
                <option value="all">All Delhi NCR Hubs</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type Dropdown */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => handleFilterChange(() => setSelectedType(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#c59b27] bg-white cursor-pointer"
              >
                <option value="all">All Typologies</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset / Status Counter */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">
                Showing <strong className="text-[#0b2240]">{displayedProperties.length}</strong> of{' '}
                <strong className="text-[#0b2240]">{filteredProperties.length}</strong> listings
              </span>
              {(selectedCity !== 'all' || selectedType !== 'all' || searchQuery !== '' || categoryFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCity('all');
                    setSelectedType('all');
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setVisibleCount(6);
                  }}
                  className="text-[#c59b27] hover:underline font-semibold cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
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
            <h3 className="text-lg font-semibold text-slate-700">No properties match your filter</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or resetting filters to explore all available properties.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('all');
                setSelectedCity('all');
                setSelectedType('all');
                setSearchQuery('');
                setVisibleCount(6);
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#0b2240] text-white text-xs font-semibold cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
