'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, PlusCircle, PhoneCall } from 'lucide-react';

interface NavbarProps {
  onSubmitPropertyClick: () => void;
}

export default function Navbar({ onSubmitPropertyClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Explicit menu: Buy Properties, Societies, List Property, Reviews, Contact Us
  const NAV_ITEMS = [
    { name: 'Buy Properties', href: '#buy-properties', isAction: false },
    { name: 'Societies', href: '#societies', isAction: false },
    { name: 'List Property', href: '#list-property', isAction: true },
    { name: 'Reviews', href: '#reviews', isAction: false },
    { name: 'Contact Us', href: '#contact', isAction: false },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sectionIds = ['buy-properties', 'buy-rent', 'societies', 'reviews', 'contact'];
      let current = '';

      for (const sectionId of sectionIds) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            current = sectionId === 'buy-rent' ? '#buy-properties' : `#${sectionId}`;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    item: { name: string; href: string; isAction: boolean }
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (item.isAction) {
      onSubmitPropertyClick();
      return;
    }

    const targetId = item.href.replace('#', '');
    const element = document.getElementById(targetId) || (targetId === 'buy-properties' ? document.getElementById('buy-rent') : null);
    if (element) {
      const navHeight = 84;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-md shadow-md py-2 sm:py-2.5 border-b border-slate-200'
          : 'bg-transparent py-3 sm:py-4 border-b border-transparent shadow-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - Background only on logo in default mode with whitespace removed below */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center group transition-all duration-300 rounded-[2px] ${
              isScrolled
                ? 'p-0 bg-transparent shadow-none hover:opacity-95'
                : 'px-3 sm:px-4 pt-1.5 pb-1 sm:pt-2 sm:pb-1 bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-white/80 hover:shadow-[0_6px_24px_rgba(197,155,39,0.3)] hover:scale-[1.02]'
            }`}
            aria-label="SOFINFRA Home"
          >
            <div
              className={`relative transition-all duration-300 ease-in-out aspect-[995/665] ${
                isScrolled
                  ? 'h-[68px]'
                  : 'h-[68px] md:h-[76px]'
              }`}
            >
              <Image
                src="/brand/sofinfra-logo.png"
                alt="SOFINFRA - Building a Brighter Tomorrow"
                fill
                priority
                className="object-contain object-left transition-all duration-300"
                sizes="(max-width: 640px) 180px, 220px"
              />
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={(e) => handleNavClick(e, item)}
                  className={`px-3.5 py-2 text-sm tracking-wide transition-all duration-200 rounded-md relative cursor-pointer font-medium ${
                    isScrolled
                      ? isActive
                        ? 'text-[#c59b27] font-bold'
                        : 'text-slate-700 hover:text-[#0b2240] hover:bg-slate-100/80 font-medium'
                      : isActive
                      ? 'text-[#c59b27] font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]'
                      : 'text-white hover:text-[#c59b27] hover:bg-white/10 font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#c59b27] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center space-x-3.5">
            {/* Direct Dual Phone Numbers */}
            <div
              className={`hidden lg:flex items-center space-x-1.5 text-xs font-semibold tracking-wider px-2 py-1.5 transition-colors ${
                isScrolled ? 'text-slate-700' : 'text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#c59b27] shrink-0" />
              <div className="flex items-center gap-1.5">
                <a
                  href="tel:+918178393751"
                  className="hover:text-[#c59b27] transition-colors whitespace-nowrap"
                  title="Call +91 81783 93751"
                >
                  +91 81783 93751
                </a>
                <span className={isScrolled ? 'text-slate-400' : 'text-white/60'}>/</span>
                <a
                  href="tel:+919212316521"
                  className="hover:text-[#c59b27] transition-colors whitespace-nowrap"
                  title="Call +91 92123 16521"
                >
                  +91 92123 16521
                </a>
              </div>
            </div>

            {/* Prominent List Property CTA */}
            <button
              type="button"
              onClick={onSubmitPropertyClick}
              className={`group relative inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest font-semibold rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${
                isScrolled
                  ? 'text-white bg-[#0b2240] hover:bg-[#122f55]'
                  : 'text-[#07162c] bg-[#c59b27] hover:bg-[#d4af37] shadow-lg shadow-[#c59b27]/30 font-bold'
              }`}
            >
              <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <PlusCircle className={`w-4 h-4 ${isScrolled ? 'text-[#c59b27]' : 'text-[#07162c]'}`} />
              <span>List Property</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              type="button"
              onClick={onSubmitPropertyClick}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-md transition-colors ${
                isScrolled
                  ? 'text-white bg-[#0b2240]'
                  : 'text-[#07162c] bg-[#c59b27] font-bold'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isScrolled
                  ? 'text-slate-700 hover:bg-slate-100'
                  : 'text-white hover:bg-white/15 drop-shadow-md'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-xl px-6 py-6 transition-all duration-300 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-3">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={(e) => handleNavClick(e, item)}
                className={`py-2 text-left text-base font-medium transition-colors cursor-pointer ${
                  activeSection === item.href
                    ? 'text-[#c59b27] font-semibold pl-2 border-l-2 border-[#c59b27]'
                    : 'text-slate-700 hover:text-[#0b2240]'
                }`}
              >
                {item.name}
              </button>
            ))}
            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSubmitPropertyClick();
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 text-xs uppercase tracking-widest font-semibold text-white bg-[#0b2240] rounded-lg shadow-sm hover:bg-[#122f55] cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#c59b27]" />
                <span>List Property</span>
              </button>

              <div className="pt-2 flex flex-col space-y-2 text-xs font-semibold text-slate-700">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Direct Concierge</span>
                <a
                  href="tel:+918178393751"
                  className="flex items-center gap-2 py-1 text-slate-800 hover:text-[#c59b27]"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#c59b27]" />
                  <span>+91 81783 93751</span>
                </a>
                <a
                  href="tel:+919212316521"
                  className="flex items-center gap-2 py-1 text-slate-800 hover:text-[#c59b27]"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#c59b27]" />
                  <span>+91 92123 16521</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
