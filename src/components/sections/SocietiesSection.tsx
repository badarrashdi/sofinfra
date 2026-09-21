'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Building, MapPin, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { DELHI_NCR_SOCIETIES, Society } from '@/data/societies';
import { SocietiesSectionData } from '@/lib/wordpress';

interface SocietiesSectionProps {
  onSelectSociety?: (society: Society) => void;
  onSubmitPropertyClick?: () => void;
  data?: SocietiesSectionData;
}

export default function SocietiesSection({ onSelectSociety, data }: SocietiesSectionProps) {
  const [selectedCity, setSelectedCity] = useState<'All' | 'Gurugram' | 'Noida' | 'New Delhi'>('All');

  const filteredSocieties = DELHI_NCR_SOCIETIES.filter((soc) => {
    if (selectedCity === 'All') return true;
    return soc.city === selectedCity;
  });

  return (
    <section id="societies" className="py-24 sm:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
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

          {/* City Filter Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto overflow-x-auto">
            {(['All', 'Gurugram', 'Noida', 'New Delhi'] as const).map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedCity === city
                    ? 'bg-[#0b2240] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0b2240]'
                }`}
              >
                {city === 'All' ? 'All NCR' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Societies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSocieties.map((society) => (
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
      </div>
    </section>
  );
}
