'use client';

import { useState, useMemo, useEffect } from 'react';
import { Filter, ChevronDown, Building, X } from 'lucide-react';
import { Property } from '@/types/property';
import { Society } from '@/data/societies';
import { PropertyListingsSectionData } from '@/lib/wordpress';
import { HeroSearchFilter } from '@/components/hero/CinematicHero';
import PropertyCard from './PropertyCard';

interface PropertyListingsProps {
  properties: Property[];
  projects?: Society[];
  onSelectProperty: (property: Property) => void;
  data?: PropertyListingsSectionData;
  heroSearchFilter?: HeroSearchFilter | null;
  onClearHeroFilter?: () => void;
}

// Matches a property to a project using name, keywords, and address
function propertyMatchesProject(prop: Property, proj: Society): boolean {
  const propText = `${prop.title} ${prop.location?.locality || ''} ${prop.location?.fullAddress || ''} ${prop.description || ''}`.toLowerCase();
  const projName = proj.name.toLowerCase();

  if (propText.includes(projName)) return true;

  const stopWords = new Set(['by', 'group', 'the', '&', 'and', 'luxury', 'living', 'delhi', 'ncr']);
  const keywords = projName
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));

  return keywords.some((kw) => propText.includes(kw));
}

function matchesBudget(prop: Property, budgetKey?: string): boolean {
  if (!budgetKey || budgetKey === 'all') return true;
  const price = prop.pricing?.amount;
  if (!price) return true;

  const priceInCr = price / 10000000;
  switch (budgetKey) {
    case 'under-5':
      return priceInCr < 5;
    case '5-15':
      return priceInCr >= 5 && priceInCr <= 15;
    case '15-35':
      return priceInCr > 15 && priceInCr <= 35;
    case '35-plus':
      return priceInCr > 35;
    default:
      return true;
  }
}

function matchesLocation(prop: Property, locationKey?: string): boolean {
  if (!locationKey || locationKey === 'all') return true;
  const target = locationKey.toLowerCase().trim();
  const text = `${prop.location?.city || ''} ${prop.location?.locality || ''} ${prop.location?.fullAddress || ''} ${prop.title}`.toLowerCase();
  return text.includes(target) || (target.includes('gurugram') && text.includes('gurgaon'));
}

function matchesType(prop: Property, typeKey?: string): boolean {
  if (!typeKey || typeKey === 'all') return true;
  const target = typeKey.toLowerCase().trim();
  const pType = (prop.propertyType || '').toLowerCase();
  const cat = (prop.category || '').toLowerCase();
  return pType.includes(target) || target.includes(pType) || cat.includes(target);
}

export default function PropertyListings({
  properties,
  projects = [],
  onSelectProperty,
  data,
  heroSearchFilter,
  onClearHeroFilter,
}: PropertyListingsProps) {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Synchronize when a hero search occurs
  useEffect(() => {
    if (heroSearchFilter && (heroSearchFilter.location !== 'all' || heroSearchFilter.propertyType !== 'all' || heroSearchFilter.budget !== 'all')) {
      setVisibleCount(6);
    }
  }, [heroSearchFilter]);

  // Dynamically derive city tabs from projects
  const dynamicCities = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.city) set.add(p.city);
    });
    // Fallback to property cities if projects don't have cities yet
    if (set.size === 0) {
      properties.forEach((p) => {
        if (p.location?.city) set.add(p.location.city);
      });
    }
    return ['All', ...Array.from(set)];
  }, [projects, properties]);

  // Dynamically derive project tabs (filtered by selected city if any)
  const availableProjects = useMemo(() => {
    if (selectedCity === 'All') return projects;
    return projects.filter((p) => p.city.toLowerCase() === selectedCity.toLowerCase());
  }, [projects, selectedCity]);

  // Filter properties based on city, project, and any hero search parameters
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // 1. City filter (derived from projects)
      if (selectedCity !== 'All') {
        const city = (prop.location?.city || '').toLowerCase();
        const target = selectedCity.toLowerCase();
        const matches = city.includes(target) || (target === 'gurugram' && city.includes('gurgaon'));
        if (!matches) return false;
      }

      // 2. Project filter (taken directly from projects)
      if (selectedProjectId !== 'All') {
        const proj = projects.find((p) => p.id === selectedProjectId);
        if (proj && !propertyMatchesProject(prop, proj)) {
          return false;
        }
      }

      // 3. Hero search active filters
      if (heroSearchFilter) {
        if (!matchesLocation(prop, heroSearchFilter.location)) return false;
        if (!matchesType(prop, heroSearchFilter.propertyType)) return false;
        if (!matchesBudget(prop, heroSearchFilter.budget)) return false;
      }

      return true;
    });
  }, [properties, projects, selectedCity, selectedProjectId, heroSearchFilter]);

  const displayedProperties = useMemo(() => {
    return filteredProperties.slice(0, visibleCount);
  }, [filteredProperties, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedProjectId('All');
    setVisibleCount(6);
  };

  const handleProjectChange = (projId: string) => {
    setSelectedProjectId(projId);
    setVisibleCount(6);
  };

  const handleResetAll = () => {
    setSelectedCity('All');
    setSelectedProjectId('All');
    setVisibleCount(6);
    if (onClearHeroFilter) onClearHeroFilter();
  };

  const isFiltered =
    selectedCity !== 'All' ||
    selectedProjectId !== 'All' ||
    (heroSearchFilter && (heroSearchFilter.location !== 'all' || heroSearchFilter.propertyType !== 'all' || heroSearchFilter.budget !== 'all'));

  return (
    <section id="buy-properties" className="py-24 sm:py-32 bg-slate-50/70 relative">
      {/* Anchor alias for smooth legacy navigation */}
      <div id="buy-rent" className="absolute -top-24" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
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

          {/* City Filter Tabs (Dynamically taken from Projects) */}
          <div className="inline-flex p-1 bg-white rounded-xl shadow-xs border border-slate-200 self-start md:self-auto overflow-x-auto">
            {dynamicCities.map((city) => (
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

        {/* Project Filter Pills (Dynamically taken from Projects) */}
        {availableProjects.length > 0 && (
          <div className="mb-10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 shrink-0 pr-2">
              <Building className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>Project:</span>
            </div>
            <button
              type="button"
              onClick={() => handleProjectChange('All')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                selectedProjectId === 'All'
                  ? 'bg-[#c59b27] text-[#07162c] shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:border-[#c59b27] hover:text-[#0b2240]'
              }`}
            >
              All Projects
            </button>
            {availableProjects.map((proj) => (
              <button
                key={proj.id}
                type="button"
                onClick={() => handleProjectChange(proj.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  selectedProjectId === proj.id
                    ? 'bg-[#c59b27] text-[#07162c] shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:border-[#c59b27] hover:text-[#0b2240]'
                }`}
              >
                {proj.name}
              </button>
            ))}
          </div>
        )}

        {/* Active Filter Notification Bar if search or project is applied */}
        {isFiltered && (
          <div className="mb-8 p-3.5 rounded-xl bg-white border border-[#c59b27]/30 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 text-slate-600">
              <span className="font-semibold text-[#0b2240]">Active Filters:</span>
              {selectedCity !== 'All' && (
                <span className="px-2.5 py-1 rounded-md bg-slate-100 font-medium text-slate-700">
                  City: {selectedCity}
                </span>
              )}
              {selectedProjectId !== 'All' && (
                <span className="px-2.5 py-1 rounded-md bg-[#faf7f2] border border-[#c59b27]/30 font-semibold text-[#ab841b]">
                  Project: {projects.find((p) => p.id === selectedProjectId)?.name || selectedProjectId}
                </span>
              )}
              {heroSearchFilter?.location && heroSearchFilter.location !== 'all' && (
                <span className="px-2.5 py-1 rounded-md bg-slate-100 font-medium text-slate-700">
                  Corridor: {heroSearchFilter.location}
                </span>
              )}
              {heroSearchFilter?.propertyType && heroSearchFilter.propertyType !== 'all' && (
                <span className="px-2.5 py-1 rounded-md bg-slate-100 font-medium text-slate-700">
                  Typology: {heroSearchFilter.propertyType}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-1 font-semibold text-[#c59b27] hover:text-[#a37f1b] hover:underline cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}

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
            <h3 className="text-lg font-semibold text-slate-700">
              No properties found matching current criteria
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              We are constantly onboarding verified prime residences and commercial spaces in this hub.
            </p>
            <button
              type="button"
              onClick={handleResetAll}
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
