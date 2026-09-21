import { ShieldCheck, TrendingUp, KeyRound, Compass, Scale, Landmark } from 'lucide-react';
import { ServicesSectionData } from '@/lib/wordpress';

const DEFAULT_SERVICES = [
  {
    icon: Landmark,
    title: 'Primary Luxury Acquisition',
    desc: 'Direct developer allocations and priority access to penthouses, sky villas, and luxury floors.',
  },
  {
    icon: Scale,
    title: 'Commercial Leasing & Sales',
    desc: 'Grade-A office spaces, retail anchors, and institutional pre-leased assets with guaranteed yields.',
  },
  {
    icon: TrendingUp,
    title: 'NRI & Global Investor Desk',
    desc: 'Seamless overseas acquisition, repatriation guidance, FEMA compliance, and property management.',
  },
  {
    icon: ShieldCheck,
    title: 'Fiduciary Legal Scrutiny',
    desc: '30-year chain title searches, encumbrance verification, and structural audit coordination.',
  },
  {
    icon: Compass,
    title: 'Portfolio Structuring',
    desc: 'Strategic asset allocation, exit timing, tax optimization, and yield-focused reinvestment.',
  },
  {
    icon: KeyRound,
    title: 'Private Concierge Viewings',
    desc: 'Confidential site visits, luxury chauffeured tours, and direct access to developer leadership.',
  },
];

interface ServicesSectionProps {
  data?: ServicesSectionData;
}

export default function ServicesSection({ data }: ServicesSectionProps) {
  const services =
    data?.services && data.services.length > 0
      ? data.services.map((s, i) => ({
          icon: DEFAULT_SERVICES[i % DEFAULT_SERVICES.length].icon,
          title: s.title,
          desc: s.description,
        }))
      : DEFAULT_SERVICES;

  return (
    <section id="services" className="py-24 sm:py-32 bg-slate-50/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-[#0b2240] text-xs font-semibold tracking-widest uppercase mb-3">
            {data?.badge || 'Advisory & Capabilities'}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0b2240] tracking-tight">
            {data?.heading || 'Comprehensive Real Estate Solutions'}
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base font-light leading-relaxed">
            {data?.subheading ||
              'From strategic asset acquisition to fiduciary closing, we provide full-spectrum advisory across premium asset classes.'}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.title}
                className="group p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-[#c59b27]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0b2240] text-[#c59b27] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#122f55] transition-all duration-300">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0b2240] group-hover:text-[#c59b27] transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-400 group-hover:text-[#0b2240] transition-colors">
                  <span>Standard Institutional Practice</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
