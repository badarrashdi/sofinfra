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

  // Explicit menu specified by user: Buy & Rent, Societies, List Property, Reviews, Contact Us
  const NAV_ITEMS = [
    { name: 'Buy & Rent', href: '#buy-rent', isAction: false },
    { name: 'Societies', href: '#societies', isAction: false },
    { name: 'List Property', href: '#list-property', isAction: true },
    { name: 'Reviews', href: '#reviews', isAction: false },
    { name: 'Contact Us', href: '#contact', isAction: false },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sectionIds = ['buy-rent', 'societies', 'reviews', 'contact'];
      let current = '';

      for (const sectionId of sectionIds) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            current = `#${sectionId}`;
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
    const element = document.getElementById(targetId);
    if (element) {
      const navHeight = 76;
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
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 sm:py-3 border-b border-slate-200/80'
          : 'bg-linear-to-b from-black/55 via-black/20 to-transparent py-4 sm:py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo with Creative Architectural Glassmorphic Pod for Maximum Visibility & Prestige */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`group relative flex items-center transition-all duration-300 ${
              isScrolled
                ? 'p-0 bg-transparent border-transparent shadow-none ring-0'
                : 'px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(197,155,39,0.3)] hover:scale-[1.02] ring-1 ring-black/5'
            }`}
            aria-label="SOFINFRA Home"
          >
            {/* Subtle Luxury Gold Accent Bar on the Logo Pod */}
            {!isScrolled && (
              <span className="absolute -bottom-px left-4 right-4 h-[2px] bg-linear-to-r from-transparent via-[#c59b27] to-transparent" />
            )}

            <div
              className={`relative transition-all duration-300 ease-in-out ${
                isScrolled
                  ? 'h-10 w-36 sm:h-11 sm:w-44'
                  : 'h-14 w-52 sm:h-16 sm:w-64 md:h-18 md:w-72'
              }`}
            >
              <Image
                src="/brand/sofinfra-logo.png"
                alt="SOFINFRA - Building a Brighter Tomorrow"
                fill
                priority
                className="object-contain object-left transition-all duration-300"
                sizes="(max-width: 640px) 240px, 340px"
              />
            </div>
          </a>

          {/* Desktop Navigation Links: Buy & Rent, Societies, List Property, Reviews, Contact Us */}
          <nav
            className={`hidden md:flex items-center space-x-1 lg:space-x-1.5 transition-all duration-300 ${
              isScrolled
                ? ''
                : 'px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 shadow-lg'
            }`}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={(e) => handleNavClick(e, item)}
                  className={`px-3.5 py-2 text-sm tracking-wide transition-all duration-200 rounded-full relative cursor-pointer font-medium ${
                    isScrolled
                      ? isActive
                        ? 'text-[#c59b27] font-bold'
                        : 'text-slate-700 hover:text-[#0b2240] hover:bg-slate-100'
                      : isActive
                      ? 'text-[#c59b27] font-bold bg-white/15 drop-shadow-sm'
                      : 'text-white/90 hover:text-white hover:bg-white/10 drop-shadow-sm'
                  }`}
                >
                  {item.name}
                  {isActive && isScrolled && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#c59b27] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href="tel:+918178393751"
              className={`hidden lg:flex items-center space-x-2 text-xs font-semibold tracking-wider px-3.5 py-2 transition-all rounded-full ${
                isScrolled
                  ? 'text-slate-700 hover:text-[#0b2240]'
                  : 'text-white bg-black/30 backdrop-blur-md border border-white/20 shadow-md hover:bg-black/50'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>+91 81783 93751</span>
            </a>

            {/* Prominent List Property CTA */}
            <button
              type="button"
              onClick={onSubmitPropertyClick}
              className={`group relative inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest font-bold rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer ${
                isScrolled
                  ? 'text-white bg-[#0b2240] hover:bg-[#122f55]'
                  : 'text-[#07162c] bg-[#c59b27] hover:bg-[#d4af37] shadow-[#c59b27]/30'
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
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm ${
                isScrolled
                  ? 'text-white bg-[#0b2240]'
                  : 'text-[#07162c] bg-[#c59b27]'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isScrolled
                  ? 'text-slate-800 hover:bg-slate-100'
                  : 'text-white bg-black/35 backdrop-blur-md border border-white/25 hover:bg-black/50'
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
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
