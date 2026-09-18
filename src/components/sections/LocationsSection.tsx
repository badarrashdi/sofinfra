import Image from 'next/image';
import { MapPin, ArrowUpRight } from 'lucide-react';

interface LocationCard {
  city: string;
  country: string;
  headline: string;
  count: string;
  image: string;
}

const LOCATIONS: LocationCard[] = [
  {
    city: 'Dubai',
    country: 'United Arab Emirates',
    headline: 'Palm Jumeirah, Downtown & Marina',
    count: '34 Exclusive Listings',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    city: 'New York',
    country: 'United States',
    headline: 'Manhattan Central Park & Park Ave',
    count: '28 Prime Listings',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    city: 'London',
    country: 'United Kingdom',
    headline: 'Mayfair, Belgravia & Kensington',
    count: '22 Heritage Estates',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    headline: 'Marina Bay & Orchard Boulevard',
    count: '19 Institutional Assets',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    city: 'Mumbai',
    country: 'India',
    headline: 'Worli Sea Face & BKC Financial Centre',
    count: '16 Luxury Waterfronts',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function LocationsSection() {
  const scrollToFeatured = () => {
    const el = document.getElementById('featured');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="locations" className="py-24 sm:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#faf7f2] border border-[#c59b27]/20 text-[#ab841b] text-xs font-semibold tracking-widest uppercase mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#c59b27]" />
            <span>Global Presence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0b2240] tracking-tight">
            Strategic Footprint Across <span className="font-semibold">Leading Capitals</span>
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base font-light leading-relaxed">
            Our portfolio is unconstrained by single geographic borders. We operate where private wealth converges with architectural distinction and high-yield fundamentals.
          </p>
        </div>

        {/* Global Locations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LOCATIONS.map((loc, idx) => (
            <div
              key={loc.city}
              onClick={scrollToFeatured}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-200/60 ${
                idx === 0 ? 'sm:col-span-2 lg:col-span-2 h-80 sm:h-96' : 'h-80 sm:h-96'
              }`}
            >
              <Image
                src={loc.image}
                alt={loc.city}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0b2240]/90 via-[#0b2240]/40 to-transparent" />

              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide">
                  <span>{loc.count}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#c59b27]" />
                </span>
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs uppercase tracking-widest text-[#c59b27] font-semibold">
                  {loc.country}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
                  {loc.city}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 font-light opacity-90">
                  {loc.headline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
