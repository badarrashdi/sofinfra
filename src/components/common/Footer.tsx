"use client";

import Image from "next/image";
import { ArrowUp, Mail, Phone, MapPin, Globe } from "lucide-react";

import { Property } from "@/types/property";
import { Society } from "@/data/societies";

interface FooterProps {
  onSubmitPropertyClick: () => void;
  properties?: Property[];
  societies?: Society[];
  onSelectProperty?: (property: Property) => void;
  onSelectSociety?: (society: Society) => void;
}

export default function Footer({
  onSubmitPropertyClick,
  societies,
  onSelectSociety,
}: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    if (href === "#list-property") {
      onSubmitPropertyClick();
      return;
    }
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      const navHeight = 84;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const defaultSocieties = [
    { name: "The Camellias (Gurugram)", keyword: "camellias" },
    { name: "ATS Knightsbridge (Noida)", keyword: "knightsbridge" },
    { name: "M3M Golfestate (Extn Rd)", keyword: "golfestate" },
    { name: "Godrej Woods (Sec 43 Noida)", keyword: "godrej" },
    { name: "The Amaryllis (New Delhi)", keyword: "amaryllis" },
  ];

  return (
    <footer className="bg-[#07162c] text-slate-300 pt-16 pb-12 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-5">
            <div className="relative h-16 sm:h-20 aspect-[995/665]">
              <Image
                src="/brand/sofinfra-logo.png"
                alt="SOFINFRA"
                fill
                className="object-contain object-left brightness-0 invert"
                sizes="(max-width: 640px) 180px, 240px"
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed max-w-sm">
              SOFINFRA is a premier real estate advisory firm serving Delhi NCR.
              Representing iconic residential societies, golf-facing penthouses,
              and Grade-A commercial towers across Gurugram, Noida, and New
              Delhi.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#c59b27] hover:text-[#07162c] transition-all flex items-center justify-center text-slate-400"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.88a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#c59b27] hover:text-[#07162c] transition-all flex items-center justify-center text-slate-400"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#c59b27] hover:text-[#07162c] transition-all flex items-center justify-center text-slate-400"
                aria-label="Global"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Navigation - Explore Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#c59b27] mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {[
                // { name: "Societies", href: "#buy-properties" },
                { name: "Societies", href: "#societies" },
                { name: "List Property", href: "#list-property" },
                { name: "Reviews", href: "#reviews" },
                { name: "Contact Us", href: "#contact" },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Top Societies & Townships */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#c59b27] mb-4">
              Societies &amp; Townships
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              {defaultSocieties.map((item) => {
                const matchedSoc = societies?.find((s) =>
                  s.name.toLowerCase().includes(item.keyword),
                );
                return (
                  <li key={item.name}>
                    <a
                      href="#buy-properties"
                      onClick={(e) => {
                        if (matchedSoc && onSelectSociety) {
                          e.preventDefault();
                          onSelectSociety(matchedSoc);
                        } else {
                          handleNavClick(e, "#buy-properties");
                        }
                      }}
                      className="hover:text-white transition-colors cursor-pointer block truncate"
                    >
                      {item.name}
                    </a>
                  </li>
                );
              })}
              <li className="pt-1.5">
                <a
                  href="#buy-properties"
                  onClick={(e) => handleNavClick(e, "#buy-properties")}
                  className="text-[#c59b27] hover:underline transition-colors inline-flex items-center gap-1 text-xs cursor-pointer font-medium"
                >
                  <span>Explore All Societies &rarr;</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Delhi NCR Headquarters */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#c59b27] mb-4">
              Delhi NCR Hub
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-1.5 leading-relaxed">
                <MapPin className="w-3.5 h-3.5 text-[#c59b27] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Corporate Address</p>
                  <p>
                    S-306-308, 2nd Floor, Tower A, Palam Vihar,
                    Gurugram(HR)-122017
                  </p>
                  <a
                    href="https://maps.google.com/?q=Ansal+Corporate+Plaza,+block+c,+2,+Carterpuri+Rd,+Block+C+2,+Palam+Vihar,+Gurugram,+Haryana+122017"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#c59b27] hover:underline inline-block mt-0.5"
                  >
                    Ansal Corporate Plaza (View Map)
                  </a>
                </div>
              </div>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#c59b27] shrink-0" />
                <span className="space-x-1.5">
                  <a
                    href="tel:+918178393751"
                    className="hover:text-white transition-colors"
                  >
                    +91 81783 93751
                  </a>
                  <span className="text-slate-500">/</span>
                  <a
                    href="tel:+919212316521"
                    className="hover:text-white transition-colors"
                  >
                    +91 92123 16521
                  </a>
                </span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#c59b27] shrink-0" />
                <a
                  href="mailto:sales@sofinfra.com"
                  className="hover:text-white transition-colors"
                >
                  sales@sofinfra.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} SOFINFRA India. Building A Brighter
            Tomorrow. RERA Registered.
          </p>
          <div className="flex items-center">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-[#c59b27] hover:underline cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
