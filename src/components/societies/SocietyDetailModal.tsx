'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  X,
  MapPin,
  Building,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Share2,
  Phone,
  Send,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { Society } from '@/data/societies';

interface SocietyDetailModalProps {
  society: Society | null;
  onClose: () => void;
}

export default function SocietyDetailModal({ society, onClose }: SocietyDetailModalProps) {
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');

  const handleClose = useCallback(() => {
    setInquirySent(false);
    onClose();
  }, [onClose]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (society) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [society]);

  if (!society) return null;

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: society.name,
        text: `Explore ${society.name} by ${society.developer} in ${society.location}, ${society.city}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-[#0b2240] text-[#c59b27]">
              {society.city}
            </span>
            <span className="px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-slate-200 text-slate-800">
              {society.type}
            </span>
            <span className="hidden sm:inline-flex px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              {society.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              aria-label="Share society"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Main Hero Image */}
          <div className="relative h-[260px] sm:h-[360px] rounded-2xl overflow-hidden bg-slate-900 shadow-md">
            <Image
              src={society.image}
              alt={society.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 text-white">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-[#c59b27] mb-2">
                <Building className="w-3.5 h-3.5" />
                <span>{society.developer}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight drop-shadow-sm">
                {society.name}
              </h2>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-200 mt-1">
                <MapPin className="w-4 h-4 text-[#c59b27] shrink-0" />
                <span>{society.location}, {society.subLocation}, {society.city}</span>
              </div>
            </div>
          </div>

          {/* Pricing & RERA Accreditation Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#faf7f2] border border-[#c59b27]/25">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#ab841b]">
                Estimated Price Band
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-[#0b2240]">
                {society.priceRange}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white border border-[#c59b27]/30 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                    RERA Registration Verified
                  </span>
                  <span className="text-xs font-mono font-bold text-[#0b2240]">
                    {society.reraId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Specifications Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Project Architecture &amp; Scale
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-slate-500 text-xs mb-1">Developer</span>
                <span className="text-sm font-semibold text-[#0b2240]">{society.developer}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-slate-500 text-xs mb-1">Configurations</span>
                <span className="text-sm font-semibold text-[#0b2240]">{society.configurations}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-slate-500 text-xs mb-1">Project Scale</span>
                <span className="text-sm font-semibold text-[#0b2240]">{society.units}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-slate-500 text-xs mb-1">Current Status</span>
                <span className="text-sm font-semibold text-emerald-700">{society.status}</span>
              </div>
            </div>
          </div>

          {/* Key Society Amenities & World-Class Features */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Clubhouse Amenities &amp; Infrastructure
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {society.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#c59b27] shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Connectivity Overview */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                Location &amp; Connectivity
              </span>
              <p className="text-sm font-semibold text-[#0b2240]">
                {society.location}, {society.subLocation}, {society.city}
              </p>
              <p className="text-xs text-slate-500">
                Prime Delhi NCR micro-market with arterial access to expressways, rapid metro corridors, and commercial hubs.
              </p>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                `${society.name}, ${society.location}, ${society.city}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:border-[#c59b27] hover:text-[#0b2240] transition-colors shrink-0"
            >
              <Navigation className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>Open in Google Maps</span>
            </a>
          </div>

          {/* Private Site Inspection & Dossier Concierge */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0b2240] text-white">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-[#c59b27] text-xs font-semibold tracking-wider uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Private Advisory Concierge</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-light">
                Schedule Site Visit &amp; Request Society Dossier
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 font-light leading-relaxed">
                Connect with our certified {society.city} advisory desk for official builder floor plans, unit availability, resale listings, and escorted site visit cab booking.
              </p>
            </div>

            {inquirySent ? (
              <div className="mt-6 p-4 rounded-xl bg-emerald-900/40 border border-emerald-500/50 text-emerald-200 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Thank you. Our {society.city} society advisor will call you within 30 minutes to confirm your site visit.</span>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-[#c59b27]"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  className="px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-[#c59b27]"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone / WhatsApp (+91)"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  className="px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-[#c59b27]"
                />
                <div className="sm:col-span-3 flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#c59b27] text-[#07162c] text-xs font-bold uppercase tracking-wider hover:bg-[#d4af37] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Dossier &amp; Site Visit</span>
                  </button>

                  <a
                    href={`https://wa.me/918178393751?text=${encodeURIComponent(
                      `Hello SOFINFRA, I would like to request information and arrange a site visit for ${society.name} (${society.location}, ${society.city}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Concierge (+91 81783 93751)</span>
                  </a>

                  <a
                    href="tel:+918178393751"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wider transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#c59b27]" />
                    <span>Call Direct</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
