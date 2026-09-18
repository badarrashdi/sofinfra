import { ShieldCheck, TrendingUp, KeyRound, Compass, Scale, Landmark } from 'lucide-react';

const SERVICES = [
  {
    icon: Landmark,
    title: 'Off-Market Asset Sourcing',
    desc: 'Bespoke access to prime penthouses, trophy commercial towers, and private family compounds never marketed on public syndicates.',
  },
  {
    icon: Scale,
    title: 'Cross-Border Legal Due Diligence',
    desc: 'Comprehensive multi-jurisdictional legal auditing, land registry verification, tax efficiency, and escrow governance.',
  },
  {
    icon: TrendingUp,
    title: 'Institutional Yield Optimization',
    desc: 'Commercial leasing restructuring, blue-chip tenant acquisition, and asset enhancement modeling to maximize capitalization rates.',
  },
  {
    icon: ShieldCheck,
    title: 'Private Wealth Discretion',
    desc: 'Strict non-disclosure agreements, encrypted correspondence, and confidential beneficial ownership representation.',
  },
  {
    icon: Compass,
    title: 'Architectural & Engineering Auditing',
    desc: 'Structural health diagnostics, MEP mechanical evaluations, and sustainability certification feasibility studies.',
  },
  {
    icon: KeyRound,
    title: 'End-to-End Asset Stewardship',
    desc: 'Turnkey handover, property maintenance coordination, interior design curation, and tenant liaison post-closing.',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 sm:py-32 bg-slate-50/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-[#0b2240] text-xs font-semibold tracking-widest uppercase mb-3">
            Advisory &amp; Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0b2240] tracking-tight">
            Why Discerning Clients <span className="font-semibold">Choose SOFINFRA</span>
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base font-light leading-relaxed">
            Combining the analytical rigor of an investment bank with the private discretion of a boutique family office.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((item) => {
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
