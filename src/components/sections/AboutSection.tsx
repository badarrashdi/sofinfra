import Image from "next/image";
import { Award, Shield, Globe2, Building } from "lucide-react";
import { AboutSectionData } from "@/lib/wordpress";

interface AboutSectionProps {
  data?: AboutSectionData;
}

export default function AboutSection({ data }: AboutSectionProps) {
  const defaultStats = [
    { value: "₹2,500+ Cr", label: "Transaction Volume" },
    { value: "100%", label: "Verified Clear Titles" },
    { value: "15+ Yrs", label: "NCR Advisory Heritage" },
    { value: "98%", label: "Client Retention Rate" },
  ];

  const defaultPillars = [
    {
      icon: Award,
      title: "Architectural Distinctiveness",
      desc:
        "Every property in our portfolio represents peerless engineering, exceptional materials, and timeless aesthetic prestige.",
    },
    {
      icon: Shield,
      title: "Fiduciary Integrity",
      desc:
        "Transparent verification, rigorous structural diligence, and institutional governance for every private and corporate client.",
    },
    {
      icon: Globe2,
      title: "Cross-Border Connectivity",
      desc:
        "Seamless acquisition pathways connecting global family offices, international investors, and sovereign-grade developments.",
    },
    {
      icon: Building,
      title: "Holistic Asset Stewardship",
      desc:
        "From initial site acquisition and tenant placement to asset optimization and portfolio syndication.",
    },
  ];

  const stats =
    data?.stats && data.stats.length > 0 ? data.stats : defaultStats;
  const pillars =
    data?.pillars && data.pillars.length > 0
      ? data.pillars.map((p, i) => ({
          icon: defaultPillars[i % defaultPillars.length].icon,
          title: p.title,
          desc: p.description,
        }))
      : defaultPillars;

  return (
    <section
      id="about"
      className="py-16 sm:pt-0 sm:pb-20 bg-white relative overflow-hidden"
    >
      {/* Subtle Background Geometry */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-slate-50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c59b27]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#faf7f2] border border-[#c59b27]/20 text-[#ab841b] text-xs font-semibold tracking-widest uppercase mb-4">
            {data?.badge || "The SOFINFRA Standard"}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0b2240] tracking-tight leading-[1.2]">
            {data?.heading ||
              "Building Trust, Delivering Excellence in Prime Real Estate"}
          </h2>
          <p className="mt-6 text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            {data?.paragraph_1 ||
              "At SOFINFRA, we bridge discerning private capital and institutional visionaries with the world’s most consequential real estate. Rooted in absolute discretion and refined aesthetic taste, our platform curates unlisted penthouses, private coastal compounds, and premier commercial hubs across global capitals."}
          </p>
        </div>

        {/* Highlight Image & Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20">
          <div className="lg:col-span-7 relative">
            <div className="relative h-[380px] sm:h-[480px] rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
              <Image
                src={
                  (typeof data?.image === "string" && data.image) ||
                  (typeof data?.image === "object" && data.image?.url) ||
                  data?.image_url ||
                  "/images/luxury-architecture.jpg"
                }
                alt={data?.heading || "SOFINFRA Luxury Architecture"}
                fill
                priority
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0b2240]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs uppercase tracking-widest text-[#c59b27] font-semibold">
                  {data?.image_badge || "Excellence In Execution"}
                </p>
                <p className="text-lg font-light mt-1">
                  {data?.image_caption ||
                    "Transforming premier spaces into generational legacies."}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-semibold text-[#0b2240]">
              {data?.approach_heading ||
                "An Uncompromised Approach to Real Estate"}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {data?.paragraph_2 ||
                "We do not treat real estate as a static transaction. From zoning intricacies and structural feasibility to private wealth preservation, our multidisciplinary team ensures every asset adheres to the highest benchmarks of value creation."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {pillars.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#0b2240] text-[#c59b27] flex items-center justify-center mb-3">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0b2240]">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Key Metrics Counter Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 sm:p-10 rounded-2xl bg-[#0b2240] text-white shadow-xl">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center md:text-left border-r last:border-r-0 border-white/10 pr-4"
            >
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white via-[#f3e7c4] to-[#c59b27]">
                {stat.value}
              </p>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
