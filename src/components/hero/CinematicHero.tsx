"use client";

import { useState, useMemo } from "react";
import {
  Search,
  PlusCircle,
  MapPin,
  Building2,
  Sliders,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import { HeroSectionData } from "@/lib/wordpress";
import { Society } from "@/data/societies";
import { Property } from "@/types/property";

export interface HeroSearchFilter {
  location?: string;
  propertyType?: string;
  budget?: string;
}

interface CinematicHeroProps {
  onSubmitPropertyClick: () => void;
  data?: HeroSectionData;
  projects?: Society[];
  properties?: Property[];
  onSearch?: (filter: HeroSearchFilter) => void;
}

export default function CinematicHero({
  onSubmitPropertyClick,
  data,
  projects = [],
  properties = [],
  onSearch,
}: CinematicHeroProps) {
  const [selectedLocality, setSelectedLocality] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedBudget, setSelectedBudget] = useState("all");

  // Dynamically derive location options from projects and properties
  const locationOptions = useMemo(() => {
    const list: { label: string; value: string }[] = [
      { label: "All Delhi NCR Corridors", value: "all" },
    ];
    const seen = new Set<string>();

    // 1. Add from Projects
    projects.forEach((proj) => {
      const val = proj.location || proj.name;
      const key = val.toLowerCase().trim();
      if (val && !seen.has(key)) {
        seen.add(key);
        const label = proj.city ? `${val} (${proj.city})` : val;
        list.push({ label, value: val });
      }
    });

    // 2. Add from Properties if not already present
    properties.forEach((prop) => {
      const loc = prop.location?.locality;
      if (loc) {
        const key = loc.toLowerCase().trim();
        if (!seen.has(key)) {
          seen.add(key);
          const label = prop.location.city ? `${loc} (${prop.location.city})` : loc;
          list.push({ label, value: loc });
        }
      }
    });

    return list;
  }, [projects, properties]);

  // Dynamically derive property types from properties and projects
  const propertyTypeOptions = useMemo(() => {
    const list: { label: string; value: string }[] = [
      { label: "All Typologies", value: "all" },
    ];
    const seen = new Set<string>();

    properties.forEach((p) => {
      if (p.propertyType) {
        const key = p.propertyType.toLowerCase().trim();
        if (!seen.has(key)) {
          seen.add(key);
          list.push({ label: p.propertyType, value: p.propertyType });
        }
      }
    });

    projects.forEach((proj) => {
      if (proj.type) {
        const key = proj.type.toLowerCase().trim();
        if (!seen.has(key)) {
          seen.add(key);
          list.push({ label: proj.type, value: proj.type });
        }
      }
    });

    return list;
  }, [properties, projects]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        location: selectedLocality,
        propertyType: selectedType,
        budget: selectedBudget,
      });
    }
    const el =
      document.getElementById("buy-properties") ||
      document.getElementById("buy-rent");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const quickJumpToSociety = (societyName?: string) => {
    if (societyName) {
      setSelectedLocality(societyName);
      if (onSearch) {
        onSearch({
          location: societyName,
          propertyType: "all",
          budget: "all",
        });
      }
    }
    const el =
      document.getElementById("buy-properties") ||
      document.getElementById("societies");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen h-auto md:h-screen sm:min-h-[750px] lg:min-h-[850px] w-full flex items-center justify-center overflow-hidden bg-[#07162c] py-24 sm:py-0"
    >
      {/* BACKGROUND DRONE VIDEO ONLY with natural playback speed */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-700"
        >
          <source src={data?.video_url || "/videos/hero-noida-drone.mp4"} type="video/mp4" />
        </video>
        {/* Subtle top vignette for crystal clear header and logo contrast */}
        <div className="absolute top-0 left-0 right-0 h-36 bg-linear-to-b from-black/40 via-black/20 to-transparent pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 sm:pt-28 pb-10 sm:pb-16 flex flex-col items-center justify-center w-full my-auto">
        {/* Main Brand Headline */}
        <h1 className="text-[26px] xs:text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-tight leading-[1.22] sm:leading-[1.14] mb-3 sm:mb-5 max-w-4xl drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
          <span className="block">{data?.headline || "Premier Real Estate Across"}</span>
          <span className="block mt-1 sm:mt-2 font-semibold text-transparent bg-clip-text bg-linear-to-r from-white via-[#f4ebd0] to-[#c59b27]">
            {data?.headline_gradient || "Delhi NCR & Global Capitals."}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-xs sm:text-base md:text-lg text-slate-100/95 font-light leading-relaxed mb-6 sm:mb-8 px-2 sm:px-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
          {data?.subheadline ||
            "Curating vetted residential societies, sky villas on Golf Course Road, luxury suites along Noida Expressway, and Grade-A commercial tech parks."}
        </p>

        {/* GLASSY INTERACTIVE PROPERTY SEARCH WIDGET */}
        <div className="w-full max-w-4xl bg-white/15 backdrop-blur-xl rounded-2xl p-3.5 sm:p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/35 text-left transition-all duration-300">
          {/* Search Fields Grid */}
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
          >
            {/* Locality Selector (Dynamic from Projects & Properties) */}
            <div className="sm:col-span-4 relative">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/90 drop-shadow-xs mb-1">
                Location / Prime Corridor
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#c59b27] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/40 bg-white/90 hover:bg-white focus:bg-white text-base sm:text-sm font-semibold text-[#0b2240] focus:outline-hidden focus:ring-2 focus:ring-[#c59b27] shadow-sm transition-colors cursor-pointer"
                >
                  {locationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Property Typology (Dynamic from Projects & Properties) */}
            <div className="sm:col-span-3 relative">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/90 drop-shadow-xs mb-1">
                Property Type
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#c59b27] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/40 bg-white/90 hover:bg-white focus:bg-white text-base sm:text-sm font-semibold text-[#0b2240] focus:outline-hidden focus:ring-2 focus:ring-[#c59b27] shadow-sm transition-colors cursor-pointer"
                >
                  {propertyTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Budget Range */}
            <div className="sm:col-span-3 relative">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/90 drop-shadow-xs mb-1">
                Budget Bracket
              </label>
              <div className="relative">
                <Sliders className="w-4 h-4 text-[#c59b27] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/40 bg-white/90 hover:bg-white focus:bg-white text-base sm:text-sm font-semibold text-[#0b2240] focus:outline-hidden focus:ring-2 focus:ring-[#c59b27] shadow-sm transition-colors cursor-pointer"
                >
                  <option value="all">All Price Ranges</option>
                  <option value="under-5">Under ₹5 Cr</option>
                  <option value="5-15">₹5 Cr - ₹15 Cr</option>
                  <option value="15-35">₹15 Cr - ₹35 Cr</option>
                  <option value="35-plus">₹35 Cr+ (Ultra Luxury)</option>
                </select>
              </div>
            </div>

            {/* Search CTA */}
            <div className="sm:col-span-2 pt-1 sm:pt-4">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#c59b27] hover:bg-[#d4af37] text-[#07162c] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg hover:shadow-xl hover:scale-102 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Quick Trending Societies Ticker */}
          <div className="mt-3.5 pt-3 border-t border-white/20 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-white/90 font-medium flex items-center gap-1 drop-shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>Trending Societies:</span>
            </span>
            {(data?.trending_societies && data.trending_societies.length > 0
              ? data.trending_societies.map((s) => s.name)
              : projects && projects.length > 0
              ? projects.slice(0, 5).map((p) => p.name)
              : [
                  "DLF The Camellias",
                  "ATS Knightsbridge",
                  "M3M Golfestate",
                  "Godrej Woods",
                  "DLF Cyber City",
                ]
            ).map((soc) => (
              <button
                key={soc}
                type="button"
                onClick={() => quickJumpToSociety(soc)}
                className="text-white hover:text-[#07162c] bg-white/20 hover:bg-[#c59b27] border border-white/30 backdrop-blur-xs px-2.5 py-0.5 rounded-md font-medium text-[11px] transition-all cursor-pointer shadow-xs"
              >
                {soc}
              </button>
            ))}
          </div>
        </div>

        {/* Dual Actions below search */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onSubmitPropertyClick}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold text-white bg-white/15 backdrop-blur-md border border-white/30 hover:bg-white/25 shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#c59b27]" />
            <span>List Property (Owner / Broker Portal)</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-white/90 font-medium drop-shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>RERA Registered &amp; Fiduciary Audited</span>
          </div>
        </div>
      </div>
    </section>
  );
}
