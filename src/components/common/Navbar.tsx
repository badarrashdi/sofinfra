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
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2 sm:py-2.5 border-b border-slate-200/80'
          : 'bg-white/80 backdrop-blur-md shadow-xs py-3 sm:py-4 border-b border-white/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo only - Strictly no text beside it */}
          {/* Frosted glassy header ensures logo is 100% visible against drone video playback */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center group transition-transform duration-200 hover:opacity-95"
            aria-label="SOFINFRA Home"
          >
            <div
              className={`relative transition-all duration-300 ease-in-out ${
                isScrolled
                  ? 'h-10 w-36 sm:h-11 sm:w-44'
                  : 'h-13 w-48 sm:h-15 sm:w-56 md:w-64'
              }`}
            >
              <Image
                src="/brand/sofinfra-logo.png"
                alt="SOFINFRA - Building a Brighter Tomorrow"
                fill
                priority
                className="object-contain object-left transition-all duration-300"
                sizes="(max-width: 640px) 220px, 320px"
              />
            </div>
          </a>

          {/* Desktop Navigation Links: Buy & Rent, Societies, List Property, Reviews, Contact Us */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={(e) => handleNavClick(e, item)}
                  className={`px-3.5 py-2 text-sm tracking-wide transition-all duration-200 rounded-md relative cursor-pointer font-medium ${
                    isActive
                      ? 'text-[#c59b27] font-bold'
                      : isScrolled
                      ? 'text-slate-700 hover:text-[#0b2240] hover:bg-slate-100/80'
                      : 'text-slate-800 hover:text-[#0b2240] hover:bg-white/60'
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
            <a
              href="tel:+918178393751"
              className="hidden lg:flex items-center space-x-2 text-xs font-semibold tracking-wider px-3 py-2 text-slate-700 hover:text-[#0b2240] transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>+91 81783 93751</span>
            </a>

            {/* Prominent List Property CTA */}
            <button
              type="button"
              onClick={onSubmitPropertyClick}
              className={`group relative inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest font-semibold rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${
                isScrolled
                  ? 'text-white bg-[#0b2240] hover:bg-[#122f55]'
                  : 'text-[#07162c] bg-[#c59b27] hover:bg-[#d4af37] shadow-md shadow-[#c59b27]/20 font-bold'
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
              className="p-2 rounded-lg transition-colors cursor-pointer text-slate-800 hover:bg-slate-100"
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
