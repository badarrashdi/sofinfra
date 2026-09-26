import { Star, ShieldCheck, Quote, CheckCircle } from "lucide-react";
import { TestimonialsSectionData } from "@/lib/wordpress";

const REVIEWS = [
  {
    quote:
      "SOFINFRA managed our purchase of a 5 BHK Sky Villa in DLF The Camellias with absolute transparency. Their legal vetting of title documents and developer liaison made our NRI transaction completely effortless.",
    author: "Vikramaditya Singhania",
    title: "NRI Investor & Tech Entrepreneur",
    location: "Gurugram / London",
    rating: 5,
    verified: "Verified Buyer",
  },
  {
    quote:
      "We acquired our Corporate Address floorplate in Cyber City through SOFINFRA. They secured exceptional capital terms and handled all RERA and compliance validations smoothly.",
    author: "Pooja Kashyap",
    title: "Chief Operating Officer, FinTech Global",
    location: "DLF Cyber City, Gurugram",
    rating: 5,
    verified: "Corporate Investor",
  },
  {
    quote:
      "Selling our residential apartment in ATS Knightsbridge on Noida Expressway was handled with complete privacy. They brought a qualified buyer within three weeks without endless unnecessary visits.",
    author: "Col. Rajeshwar Malhotra (Retd.)",
    title: "Property Owner",
    location: "Sector 124, Noida",
    rating: 5,
    verified: "Verified Seller",
  },
];

const TRUST_METRICS = [
  { label: "RERA Certified Advisory", desc: "100% compliant documentation" },
  { label: "₹1,500+ Cr Handled", desc: "In Delhi NCR luxury transactions" },
  { label: "Zero Hidden Charges", desc: "Complete fiduciary transparency" },
  { label: "Verified Societies Only", desc: "Clear legal & structural titles" },
];

interface TestimonialsSectionProps {
  data?: TestimonialsSectionData;
}

export default function TestimonialsSection({
  data,
}: TestimonialsSectionProps) {
  const reviews =
    data?.testimonials && data.testimonials.length > 0
      ? data.testimonials.map((t) => {
          const parsed =
            typeof t.rating === "number"
              ? t.rating
              : parseInt(String(t.rating), 10);
          const ratingCount =
            !isNaN(parsed) && parsed > 0 ? Math.min(parsed, 5) : 5;
          return {
            quote: t.review_text,
            author: t.author_name,
            title: t.role_locality,
            location: t.role_locality,
            rating: ratingCount,
            verified: "Verified Client",
          };
        })
      : REVIEWS;

  const trustMetrics =
    data?.trust_metrics && data.trust_metrics.length > 0
      ? data.trust_metrics.map((m) => ({
          label: m.label || m.title || "Trust Metric",
          desc: m.desc || m.description || "",
        }))
      : TRUST_METRICS;

  return (
    <section
      id="reviews"
      className="py-16 sm:pt-0 sm:pb-20 bg-slate-50/70 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-[#0b2240] text-xs font-semibold tracking-widest uppercase mb-3">
            {data?.badge || "Client Testimonials & Trust"}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0b2240] tracking-tight">
            {data?.heading || "Client Reviews & Ratings"}
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base font-light leading-relaxed">
            {data?.subheading ||
              `Rated ${data?.average_rating ||
                "4.9/5"} by premium home buyers, NRI investors, and high-net-worth property owners across Delhi NCR.`}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between relative group hover:shadow-xl transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-[#c59b27]/30 absolute top-6 right-6" />

              <div>
                {/* Rating Stars & Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="flex items-center gap-1"
                    aria-label={`${r.rating} stars`}
                  >
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[#c59b27] text-[#c59b27]"
                      />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>{r.verified}</span>
                  </span>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed font-light italic">
                  &ldquo;{r.quote}&rdquo;
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <p className="text-sm font-bold text-[#0b2240]">{r.author}</p>
                <p className="text-xs text-slate-500">{r.title}</p>
                <p className="text-[11px] text-[#c59b27] font-medium mt-0.5">
                  {r.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Bar */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {trustMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-2"
            >
              <ShieldCheck className="w-5 h-5 text-[#c59b27] mb-1.5" />
              <span className="text-xs sm:text-sm font-bold text-[#0b2240]">
                {metric.label}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                {metric.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
