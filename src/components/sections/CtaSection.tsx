import { PlusCircle, Calendar, ShieldCheck } from 'lucide-react';
import { CtaSectionData } from '@/lib/wordpress';

interface CtaSectionProps {
  onSubmitPropertyClick: () => void;
  data?: CtaSectionData;
}

export default function CtaSection({ onSubmitPropertyClick, data }: CtaSectionProps) {
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="list-property" className="py-16 sm:py-20 bg-[#0b2240] text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c59b27]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#c59b27] text-xs font-semibold tracking-widest uppercase mb-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{data?.badge || 'Delhi NCR Owner & Investor Portal'}</span>
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-tight max-w-3xl mx-auto">
          {data?.heading || 'Looking to Sell or Lease Your Property in Delhi NCR?'}
        </h2>

        <p className="mt-6 text-base sm:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
          {data?.subheading ||
            'List your luxury apartment, penthouse, floor, or commercial shop with SOFINFRA. Connect directly with pre-verified buyers and corporate tenants with full RERA compliance and zero spam.'}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onSubmitPropertyClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-xs uppercase tracking-widest font-bold bg-[#c59b27] text-[#07162c] hover:bg-[#d4af37] shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{data?.button_text || 'List Property Now (Free)'}</span>
          </button>

          <button
            type="button"
            onClick={scrollToContact}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-xs uppercase tracking-widest font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-300 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#c59b27]" />
            <span>Schedule Property Valuation</span>
          </button>
        </div>
      </div>
    </section>
  );
}
