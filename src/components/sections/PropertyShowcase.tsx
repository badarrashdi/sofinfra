'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, CheckCircle, Sparkles, Eye } from 'lucide-react';
import { Property } from '@/types/property';

interface PropertyShowcaseProps {
  onSelectProperty: (property: Property) => void;
  featuredProperty?: Property;
}

export default function PropertyShowcase({ onSelectProperty, featuredProperty }: PropertyShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'plans'>('overview');

  return (
    <section id="showcase" className="py-24 sm:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#faf7f2] border border-[#c59b27]/20 text-[#ab841b] text-xs font-semibold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#c59b27]" />
            <span>Flagship Spotlight</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0b2240] tracking-tight">
            Architectural Masterwork: <br />
            <span className="font-semibold">The Sky Crest Penthouse</span>
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base font-light leading-relaxed">
            Perched 74 stories above the Dubai Marina, this residence commands unobstructed views of the Arabian Gulf and Dubai skyline. Designed in collaboration with Pritzker-caliber architects.
          </p>
        </div>

        {/* Spotlight Showcase Container */}
        <div className="bg-[#0b2240] rounded-3xl overflow-hidden shadow-2xl text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Visual Media Left */}
            <div className="lg:col-span-7 relative h-[360px] sm:h-[480px] lg:h-auto min-h-[440px] bg-slate-900">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85"
                alt="The Sky Crest Penthouse Living Space"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0b2240] via-transparent to-black/30" />

              {/* Badges on image */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-[#c59b27] text-[#07162c] text-xs font-bold uppercase tracking-wider">
                  Penthouse Collection
                </span>
                <span className="px-3 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-medium">
                  Dubai Marina
                </span>
              </div>

              {/* Virtual Tour Play Action */}
              {featuredProperty && (
                <button
                  type="button"
                  onClick={() => onSelectProperty(featuredProperty)}
                  className="absolute bottom-6 left-6 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold hover:bg-white hover:text-[#0b2240] transition-all duration-300 group"
                >
                  <Eye className="w-4 h-4 text-[#c59b27] group-hover:text-[#0b2240]" />
                  <span>Launch Interactive Property Dossier</span>
                </button>
              )}
            </div>

            {/* Showcase Specs & Narrative Right */}
            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between">
              <div>
                {/* Tabs */}
                <div className="flex gap-4 border-b border-white/10 pb-4 mb-6 text-xs font-semibold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className={`pb-1 transition-colors ${
                      activeTab === 'overview'
                        ? 'text-[#c59b27] border-b-2 border-[#c59b27]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('features')}
                    className={`pb-1 transition-colors ${
                      activeTab === 'features'
                        ? 'text-[#c59b27] border-b-2 border-[#c59b27]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Amenities
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('plans')}
                    className={`pb-1 transition-colors ${
                      activeTab === 'plans'
                        ? 'text-[#c59b27] border-b-2 border-[#c59b27]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Floor Plan
                  </button>
                </div>

                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-300 font-light leading-relaxed">
                      Spanning 8,400 sq ft across the entire 74th floor, with a cantilevered private infinity pool extending beyond the façade, double-height ceiling galleries, and custom Poliform Italian cabinetry.
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="block text-[11px] text-slate-400">Total Area</span>
                        <span className="text-base font-bold text-white">8,400 sq ft</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="block text-[11px] text-slate-400">Suites / Baths</span>
                        <span className="text-base font-bold text-white">5 Bed / 6 Bath</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="block text-[11px] text-slate-400">Elevation</span>
                        <span className="text-base font-bold text-white">Level 74</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="block text-[11px] text-slate-400">Price</span>
                        <span className="text-base font-bold text-[#c59b27]">$14,500,000</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="space-y-3">
                    {[
                      'Cantilevered Private Glass-Bottom Pool',
                      'Private High-Speed Elevator with Biometric Access',
                      'Temperature-Controlled 400-Bottle Wine Vault',
                      'Sonance Architectural Acoustic Sound Engineering',
                      'Sub-Zero & Wolf Professional Chef’s Kitchen',
                      '4 Dedicated Secured Underground Bays',
                    ].map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                        <CheckCircle className="w-4 h-4 text-[#c59b27] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'plans' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      Schematic architectural floorplate includes primary gallery, grand salon, dual primary master wings, private screening room, and separate staff quarters with dedicated service lift.
                    </p>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                      <p className="text-xs font-semibold text-white">Architectural Dossier PDF</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">High-resolution CAD blueprints &amp; structural schedule</p>
                      <button
                        type="button"
                        onClick={() => alert('Architectural dossier request sent to our concierge desk.')}
                        className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#c59b27] text-[#07162c] text-xs font-bold uppercase tracking-wider hover:bg-[#d4af37]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Dossier</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                    Acquisitions Desk
                  </span>
                  <span className="text-sm font-semibold text-white">Direct Representation</span>
                </div>
                {featuredProperty && (
                  <button
                    type="button"
                    onClick={() => onSelectProperty(featuredProperty)}
                    className="px-5 py-2.5 rounded-xl bg-white text-[#0b2240] text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
