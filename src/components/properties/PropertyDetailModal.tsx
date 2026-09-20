'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Compass,
  Layers,
  CheckCircle2,
  MessageSquare,
  Share2,
  ChevronLeft,
  ChevronRight,
  Phone,
} from 'lucide-react';
import { Property } from '@/types/property';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
}

export default function PropertyDetailModal({ property, onClose }: PropertyDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (property) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [property]);

  if (!property) return null;

  const images =
    property.galleryImages && property.galleryImages.length > 0
      ? property.galleryImages
      : [property.featuredImage];

  const getPriceDisplay = () => {
    if (property.pricing.formattedPrice) return property.pricing.formattedPrice;
    if (property.pricing.priceAvailability === 'request') return 'Price on Request';
    if (property.pricing.amount) {
      return `$${Number(property.pricing.amount).toLocaleString()}`;
    }
    return 'Price on Request';
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      // simulate sent
    }, 1000);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-[#0b2240] text-[#c59b27]">
              {property.propertyType}
            </span>
            <span className="px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-slate-200 text-slate-700">
              {property.listingType}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: property.title,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Property link copied to clipboard!');
                }
              }}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
              title="Share Property"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8">
          {/* Gallery Carousel & Thumbnails */}
          <div>
            <div className="relative h-72 sm:h-[440px] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
              <Image
                src={images[selectedImageIndex]}
                alt={property.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1000px"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-mono">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 mt-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#c59b27] scale-105 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Location & Price Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-1.5">
                <MapPin className="w-4 h-4 text-[#c59b27]" />
                <span>
                  {property.location.fullAddress ||
                    `${property.location.locality ? `${property.location.locality}, ` : ''}${
                      property.location.city
                    }, ${property.location.country}`}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-light text-[#0b2240] tracking-tight">
                {property.title}
              </h2>
            </div>

            <div className="bg-[#faf7f2] px-5 py-3 rounded-xl border border-[#c59b27]/20">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#ab841b]">
                Valuation / Pricing
              </span>
              <span className="text-2xl font-bold text-[#0b2240]">{getPriceDisplay()}</span>
            </div>
          </div>

          {/* Specifications Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Property Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <Maximize2 className="w-4 h-4 text-[#c59b27]" />
                  <span>Total Area</span>
                </div>
                <span className="text-sm font-semibold text-[#0b2240]">
                  {Number(property.specs.area).toLocaleString()} {property.specs.areaUnit}
                </span>
              </div>

              {property.specs.bedrooms !== undefined && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Bed className="w-4 h-4 text-[#c59b27]" />
                    <span>Bedrooms</span>
                  </div>
                  <span className="text-sm font-semibold text-[#0b2240]">
                    {property.specs.bedrooms} Luxury Suites
                  </span>
                </div>
              )}

              {property.specs.bathrooms !== undefined && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Bath className="w-4 h-4 text-[#c59b27]" />
                    <span>Bathrooms</span>
                  </div>
                  <span className="text-sm font-semibold text-[#0b2240]">
                    {property.specs.bathrooms} Marble Baths
                  </span>
                </div>
              )}

              {property.specs.furnishingStatus && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Layers className="w-4 h-4 text-[#c59b27]" />
                    <span>Furnishing</span>
                  </div>
                  <span className="text-sm font-semibold text-[#0b2240]">
                    {property.specs.furnishingStatus}
                  </span>
                </div>
              )}

              {property.specs.parking && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-slate-500 text-xs mb-1">Parking</span>
                  <span className="text-sm font-semibold text-[#0b2240]">
                    {property.specs.parking}
                  </span>
                </div>
              )}

              {property.specs.floor && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-slate-500 text-xs mb-1">Floor Level</span>
                  <span className="text-sm font-semibold text-[#0b2240]">
                    {property.specs.floor} of {property.specs.totalFloors || 'N/A'}
                  </span>
                </div>
              )}

              {property.specs.facing && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                    <Compass className="w-3.5 h-3.5 text-[#c59b27]" />
                    <span>Orientation</span>
                  </div>
                  <span className="text-sm font-semibold text-[#0b2240]">
                    {property.specs.facing}
                  </span>
                </div>
              )}

              {property.specs.propertyAge && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#c59b27]" />
                    <span>Age / Status</span>
                  </div>
                  <span className="text-sm font-semibold text-[#0b2240]">
                    {property.specs.propertyAge}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              About This Property
            </h3>
            <p className="text-slate-700 leading-relaxed font-light text-base whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities & Features */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Amenities & Key Features
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {property.amenities.map((amenity, idx) => (
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
          )}

          {/* Direct Private Inquiry & Contact Section */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0b2240] text-white">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c59b27]">
                Private Client Concierge
              </span>
              <h3 className="text-xl sm:text-2xl font-light mt-1">Request Private Viewing & Dossier</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 font-light">
                Connect directly with our senior acquisitions director for discreet floor plans, legal verification, and private appointment scheduling.
              </p>
            </div>

            {inquirySent ? (
              <div className="mt-6 p-4 rounded-xl bg-emerald-900/40 border border-emerald-500/50 text-emerald-200 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Thank you. Our luxury property advisor will contact you within 2 business hours.</span>
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
                  placeholder="Your Email"
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  className="px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-[#c59b27]"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone / WhatsApp"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  className="px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-[#c59b27]"
                />
                <div className="sm:col-span-3 flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#c59b27] text-[#07162c] text-xs font-bold uppercase tracking-wider hover:bg-[#d4af37] transition-colors"
                  >
                    Submit Confidential Inquiry
                  </button>
                  <a
                    href="https://wa.me/918178393751"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp (+91 81783 93751)</span>
                  </a>
                  <a
                    href="tel:+919212316521"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wider transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#c59b27]" />
                    <span>Call Direct (+91 92123 16521)</span>
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
