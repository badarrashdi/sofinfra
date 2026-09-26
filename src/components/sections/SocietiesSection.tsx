'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Building, MapPin, CheckCircle2, ShieldCheck, ArrowRight, Search } from 'lucide-react';
import { DELHI_NCR_SOCIETIES, Society } from '@/data/societies';
import { SocietiesSectionData } from '@/lib/wordpress';

interface SocietiesSectionProps {
  onSelectSociety?: (society: Society) => void;
  onSubmitPropertyClick?: () => void;
  data?: SocietiesSectionData;
  societies?: Society[];
}

export default function SocietiesSection({ onSelectSociety, data, societies }: SocietiesSectionProps) {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const list = societies && societies.length > 0 ? societies : DELHI_NCR_SOCIETIES;

  // Dynamically derive unique cities from projects
  const cities: string[] = useMemo(() => {
    const set = new Set<string>();
    list.forEach((s) => {
      if (s.city) set.add(s.city);
    });
    return Array.from(set);
  }, [list]);

  // Dynamically derive unique developers from projects
  const developers: string[] = useMemo(() => {
    const set = new Set<string>();
    list.forEach((s) => {
      if (s.developer) set.add(s.developer);
    });
    return Array.from(set);
  }, [list]);

  // Dynamically derive unique types from projects
  const types: string[] = useMemo(() => {
    const set = new Set<string>();
    list.forEach((s) => {
      if (s.type) set.add(s.type);
    });
    return Array.from(set);
  }, [list]);

  // Filter societies matching criteria
  const filteredSocieties = useMemo(() => {
    return list.filter((s) => {
      // 1. City Filter
      if (selectedCity !== 'all') {
        const sCity = (s.city || '').toLowerCase();
        const target = selectedCity.toLowerCase();
        const matches = sCity.includes(target) || (target === 'gurugram' && sCity.includes('gurgaon'));
        if (!matches) return false;
      }

      // 2. Developer Filter
      if (selectedDeveloper !== 'all') {
        const sDev = (s.developer || '').toLowerCase();
        const target = selectedDeveloper.toLowerCase();
        if (!sDev.includes(target) && !target.includes(sDev)) {
          return false;
        }
      }

      // 3. Typology / Project Type Filter
      if (selectedType !== 'all') {
        const sType = (s.type || '').toLowerCase();
        const target = selectedType.toLowerCase();
        if (!sType.includes(target) && !target.includes(sType)) {
          return false;
        }
      }

      // 4. Search query text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const text = `${s.name} ${s.developer} ${s.location} ${s.subLocation || ''} ${s.city} ${s.type} ${s.configurations || ''} ${s.description || ''}`.toLowerCase();
        if (!text.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [list, selectedCity, selectedDeveloper, selectedType, searchQuery]);

  const displayedSocieties = useMemo(() => {
    return filteredSocieties.slice(0, visibleCount);
  }, [filteredSocieties, visibleCount]);

  const handleFilterChange = (cb: () => void) => {
    cb();
    setVisibleCount(6);
  };

  const handleResetAll = () => {
    setSelectedCity('all');
    setSelectedDeveloper('all');
    setSelectedType('all');
    setSearchQuery('');
    setVisibleCount(6);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <section id="societies" className="py-16 sm:py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#faf7f2] border border-[#c59b27]/20 text-[#ab841b] text-xs font-semibold tracking-widest uppercase mb-3">
              <Building className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>{data?.badge || 'Delhi NCR Megaprojects'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0b2240] tracking-tight">
              {data?.heading || 'Top Societies & Townships'}
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
              {data?.subheading ||
                'Explore premier gated societies across Gurugram, Noida, and Delhi with verified RERA registration, institutional amenities, and superior appreciation potential.'}
            </p>
          </div>

          {/* City Filter Capsule Bar (All NCR | Gurugram | Noida | New Delhi) */}
          <div className="inline-flex max-w-full p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto overflow-x-auto shrink-0 shadow-xs">
            {['all', 'Gurugram', 'Noida', 'New Delhi'].map((city) => {
              const isActive = selectedCity.toLowerCase() === city.toLowerCase();
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleFilterChange(() => setSelectedCity(city))}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#0b2240] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#0b2240]'
                  }`}
                >
                  {city === 'all' ? 'All NCR' : city}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Bar (Search, Developer, City, Typology & Status Counter) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search society, developer, locality..."
                value={searchQuery}
                onChange={(e) => handleFilterChange(() => setSearchQuery(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#c59b27]"
              />
            </div>

            {/* Developer Dropdown */}
            <div className="relative">
              <select
                value={selectedDeveloper}
                onChange={(e) => handleFilterChange(() => setSelectedDeveloper(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#c59b27] bg-white cursor-pointer"
              >
                <option value="all">All Developers</option>
                {developers.map((dev) => (
                  <option key={dev} value={dev}>
                    {dev}
                  </option>
                ))}
              </select>
            </div>

            {/* City Dropdown */}
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => handleFilterChange(() => setSelectedCity(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#c59b27] bg-white cursor-pointer"
              >
                <option value="all">All Delhi NCR Hubs</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Typology Dropdown */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => handleFilterChange(() => setSelectedType(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#c59b27] bg-white cursor-pointer"
              >
                <option value="all">All Typologies</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset / Status Counter */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">
                Showing <strong className="text-[#0b2240]">{displayedSocieties.length}</strong> of{' '}
                <strong className="text-[#0b2240]">{filteredSocieties.length}</strong> societies
              </span>
              {(selectedCity !== 'all' || selectedDeveloper !== 'all' || selectedType !== 'all' || searchQuery !== '') && (
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="text-[#c59b27] hover:underline font-semibold cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Societies Grid or Empty State */}
        {filteredSocieties.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <Building className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700">No societies found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
              No societies match your current filter and search criteria. Try clearing your filters.
            </p>
            <button
              type="button"
              onClick={handleResetAll}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#0b2240] text-[#c59b27] hover:bg-[#12335c] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedSocieties.map((society) => (
                <div
                  key={society.id}
                  onClick={() => onSelectSociety?.(society)}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#c59b27]/40 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  {/* Image & Badges */}
                  <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={society.image}
                      alt={society.name}
                      fill
                      unoptimized={
                        society.image?.includes('.local') ||
                        society.image?.includes('localhost') ||
                        society.image?.includes('admin.sofinfra.com') ||
                        society.image?.includes('sofinfraadmin')
                      }
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#0b2240] text-[#c59b27] shadow-sm">
                        {society.city}
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-white/95 text-slate-800 shadow-sm">
                        {society.status}
                      </span>
                    </div>

                    {/* Location on image */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white pointer-events-none">
                      <p className="text-[11px] text-[#c59b27] font-semibold uppercase tracking-wider">
                        {society.developer}
                      </p>
                      <p className="text-base sm:text-lg font-bold leading-snug drop-shadow-md truncate">
                        {society.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-slate-200 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#c59b27]" />
                        <span className="truncate">{society.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Society Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                        <span className="text-slate-500">Configurations</span>
                        <span className="font-semibold text-[#0b2240]">{society.configurations}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                        <span className="text-slate-500">Inventory Scale</span>
                        <span className="font-semibold text-[#0b2240]">{society.units}</span>
                      </div>

                      {/* Amenities */}
                      <div className="pt-2">
                        <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">
                          Key Highlights
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {society.amenities.slice(0, 3).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-slate-50 text-slate-700 border border-slate-200/60 font-medium"
                            >
                              <CheckCircle2 className="w-3 h-3 text-[#c59b27]" />
                              <span>{amenity}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Price Range & RERA Footer */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                          Price Band
                        </span>
                        <span className="text-base font-bold text-[#0b2240]">
                          {society.priceRange}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSociety?.(society);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#0b2240] bg-slate-100 hover:bg-[#0b2240] hover:text-white transition-all duration-200 cursor-pointer shadow-2xs"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* RERA Strip */}
                    <div className="mt-3 pt-2 text-[10px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>RERA: {society.reraId}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {filteredSocieties.length > visibleCount && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#0b2240] text-white hover:bg-[#c59b27] hover:text-[#0b2240] shadow-md transition-all duration-300 cursor-pointer"
                >
                  Load More Societies ({filteredSocieties.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
