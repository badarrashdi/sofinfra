"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  PlusCircle,
  MapPin,
  Building2,
  Sliders,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface CinematicHeroProps {
  onSubmitPropertyClick: () => void;
}

export default function CinematicHero({
  onSubmitPropertyClick,
}: CinematicHeroProps) {
  const [searchTab, setSearchTab] = useState<"buy" | "societies">("buy");
  const [selectedLocality, setSelectedLocality] = useState("Golf Course Road");
  const [selectedBudget, setSelectedBudget] = useState("All Budgets");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Slow down video playback for a smooth, cinematic aerial glide (0.5x speed - 30% slower)
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.5;
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTab === "societies") {
      const el = document.getElementById("societies");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      const el =
        document.getElementById("buy-properties") ||
        document.getElementById("buy-rent");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const quickJumpToSociety = (societyName?: string) => {
    if (societyName) {
      setSelectedLocality(societyName);
    }
    const el = document.getElementById("societies");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[750px] lg:min-h-[850px] h-screen w-full flex items-center justify-center overflow-hidden bg-[#07162c]"
    >
      {/* BACKGROUND DRONE VIDEO ONLY with 0.5x slow cinematic playback starting from 0s */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-700"
        >
          <source src="/videos/hero-noida-drone.mp4" type="video/mp4" />
        </video>
        {/* Subtle top vignette for crystal clear header and logo contrast */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-black/30 to-transparent pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 pb-16 flex flex-col items-center justify-center h-full">
        {/* Real-time Badge */}

        {/* Main Brand Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-tight leading-[1.12] mb-4 max-w-4xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
          Premier Real Estate Across <br className="hidden sm:inline" />
          <span className="font-semibold text-transparent bg-clip-text bg-linear-to-r from-white via-[#f4ebd0] to-[#c59b27] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Delhi NCR &amp; Global Capitals.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-100 font-light leading-relaxed mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Curating vetted residential societies, sky villas on Golf Course Road,
          luxury suites along Noida Expressway, and Grade-A commercial tech
          parks.
        </p>

        {/* GLASSY INTERACTIVE PROPERTY SEARCH WIDGET */}
        <div className="w-full max-w-4xl bg-white/15 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/35 text-left transition-all duration-300">
          {/* Search Tabs: Buy Properties | Societies */}
          <div className="flex items-center gap-2 mb-4 border-b border-white/20 pb-3">
            {[
              { id: "buy", label: "Buy Properties" },
              { id: "societies", label: "Top Societies" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSearchTab(tab.id as "buy" | "societies")}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  searchTab === tab.id
                    ? "bg-white text-[#0b2240] shadow-md scale-102"
                    : "text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-xs"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Fields Grid */}
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
          >
            {/* Locality Selector */}
            <div className="sm:col-span-4 relative">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/90 drop-shadow-xs mb-1">
                Location / Prime Corridor
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#c59b27] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/40 bg-white/85 hover:bg-white focus:bg-white text-xs sm:text-sm font-semibold text-[#0b2240] focus:outline-hidden focus:ring-2 focus:ring-[#c59b27] shadow-sm transition-colors cursor-pointer"
                >
                  <option value="Golf Course Road">
                    Golf Course Road, Gurugram
                  </option>
                  <option value="Golf Course Extn Road">
                    Golf Course Extn, Gurugram
                  </option>
                  <option value="Noida Expressway">
                    Noida Expressway, Sector 124/150
                  </option>
                  <option value="DLF Cyber City">
                    DLF Cyber City &amp; Phase 2
                  </option>
                  <option value="Dwarka Expressway">
                    Dwarka Expressway Corridors
                  </option>
                  <option value="Central Delhi">
                    Central &amp; South Delhi
                  </option>
                </select>
              </div>
            </div>

            {/* Property Typology */}
            <div className="sm:col-span-3 relative">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/90 drop-shadow-xs mb-1">
                Property Type
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#c59b27] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/40 bg-white/85 hover:bg-white focus:bg-white text-xs sm:text-sm font-semibold text-[#0b2240] focus:outline-hidden focus:ring-2 focus:ring-[#c59b27] shadow-sm transition-colors cursor-pointer">
                  <option value="all">All Typologies</option>
                  <option value="Sky Villa / Penthouse">
                    Sky Villa / Penthouse
                  </option>
                  <option value="Luxury Apartment">
                    3 &amp; 4 BHK Apartment
                  </option>
                  <option value="Independent Floor">
                    Luxury Builder Floor
                  </option>
                  <option value="Commercial Office">
                    Commercial Tech Suite
                  </option>
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
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/40 bg-white/85 hover:bg-white focus:bg-white text-xs sm:text-sm font-semibold text-[#0b2240] focus:outline-hidden focus:ring-2 focus:ring-[#c59b27] shadow-sm transition-colors cursor-pointer"
                >
                  <option value="All Budgets">All Price Ranges</option>
                  <option value="₹2 - 5 Cr">₹2 Cr - ₹5 Cr</option>
                  <option value="₹5 - 12 Cr">₹5 Cr - ₹12 Cr</option>
                  <option value="₹12 Cr+">₹12 Cr+ (Ultra Luxury)</option>
                </select>
              </div>
            </div>

            {/* Search CTA */}
            <div className="sm:col-span-2 pt-3 sm:pt-4">
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
            {[
              "DLF The Camellias",
              "ATS Knightsbridge",
              "M3M Golfestate",
              "Godrej Woods",
              "DLF Cyber City",
            ].map((soc) => (
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
