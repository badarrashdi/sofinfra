import { Building2 } from "lucide-react";
import { Property } from "@/types/property";
import PropertyCard from "../properties/PropertyCard";

interface CommercialSectionProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export default function CommercialSection({
  properties,
  onSelectProperty,
}: CommercialSectionProps) {
  const commercialProperties = properties
    .filter((p) => p.category === "commercial")
    .slice(0, 3);

  return (
    <section
      id="commercial"
      className="py-16 sm:py-20 bg-[#faf7f2] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-[#0b2240] text-xs font-semibold tracking-widest uppercase mb-3">
              <Building2 className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>Institutional Grade Assets</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0b2240] tracking-tight">
              Trophy <span className="font-semibold">Commercial Landmarks</span>
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base font-light leading-relaxed">
              Prime Corporate Address, high-yield retail flagships, and
              sovereign-grade commercial developments positioned in
              high-velocity international business hubs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 text-xs text-slate-700 hidden sm:block">
              <span className="font-bold text-[#0b2240]">7.8% - 10.4%</span>{" "}
              Average Commercial Net Yields
            </div>
          </div>
        </div>

        {/* Commercial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {commercialProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelectProperty={onSelectProperty}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
