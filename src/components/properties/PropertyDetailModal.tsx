'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  X,
  MapPin,
  Building2,
  Layers,
  Maximize2,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Phone,
  Navigation,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Compass,
  Calendar,
} from 'lucide-react';
import { Property } from '@/types/property';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
}

export default function PropertyDetailModal({ property, onClose }: PropertyDetailModalProps) {
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images: string[] =
    property?.galleryImages && property.galleryImages.length > 0
      ? property.galleryImages
      : property?.images && property.images.length > 0
      ? property.images
      : property?.featuredImage
      ? [property.featuredImage]
      : [];

  const handleClose = useCallback(() => {
    setInquirySent(false);
    setSelectedImageIndex(0);
    onClose();
  }, [onClose]);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Reset image index when property changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [property?.id]);

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

  const getPriceDisplay = () => {
    if (property.pricing.formattedPrice) return property.pricing.formattedPrice;
    if (property.pricing.priceAvailability === 'request') return 'Price on Request';
    if (property.pricing.amount) {
      const cr = property.pricing.amount / 10000000;
      return cr >= 1 ? `₹${cr.toFixed(1)} Cr` : `₹${(property.pricing.amount / 100000).toFixed(1)} L`;
    }
    return 'Price on Request';
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: property.title,
          text: `Explore ${property.title} in ${property.location.locality || property.location.city}.`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Property link copied to clipboard!');
    }
  };

  const developerName =
    property.developer ||
    property.specs?.developer ||
    (property.title.toLowerCase().includes('dlf')
      ? 'DLF Luxury Living'
      : property.title.toLowerCase().includes('godrej')
      ? 'Godrej Properties'
      : property.title.toLowerCase().includes('m3m')
      ? 'M3M India'
      : property.title.toLowerCase().includes('ats')
      ? 'ATS Infrastructure'
      : property.title.toLowerCase().includes('amaryllis')
      ? 'Unity Group'
      : 'SOFINFRA Prime');

  const reraNumber = property.reraId || property.specs?.reraId || 'Verified';

  const configurationsText =
    property.specs?.configurations ||
    (property.specs?.bedrooms
      ? `${property.specs.bedrooms} Luxury Suites`
      : property.propertyType);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-[#0b2240] text-[#c59b27]">
              {property.location.city}
            </span>
            <span className="px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-slate-200 text-slate-700">
              {property.propertyType}
            </span>
            <span className="hidden sm:inline-flex px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              {property.propertyStatus || property.listingType}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Share Property"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8">
          {/* Property Image Gallery Carousel */}
          <div>
            <div className="relative h-72 sm:h-[440px] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
              {images.length > 0 ? (
                <Image
                  src={images[selectedImageIndex] || property.featuredImage}
                  alt={property.title}
                  fill
                  priority
                  unoptimized={
                    images[selectedImageIndex]?.includes('.local') ||
                    images[selectedImageIndex]?.includes('localhost') ||
                    images[selectedImageIndex]?.includes('admin.sofinfra.com') ||
                    images[selectedImageIndex]?.includes('sofinfraadmin')
                  }
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1000px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Building2 className="w-12 h-12 stroke-[1.5]" />
                </div>
              )}

              {/* Prev / Next Arrows & Counter if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
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
                    className={`relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-[#c59b27] ring-2 ring-[#c59b27]/30 scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      unoptimized={
                        img.includes('.local') ||
                        img.includes('localhost') ||
                        img.includes('admin.sofinfra.com') ||
                        img.includes('sofinfraadmin')
                      }
                      className="object-cover"
                    />
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
                  {property.location.locality ? `${property.location.locality}, ` : ''}
                  {property.location.subLocation ? `${property.location.subLocation}, ` : ''}
                  {property.location.city}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-light text-[#0b2240] tracking-tight">
                {property.title}
              </h2>
            </div>

            <div className="bg-[#faf7f2] px-5 py-3 rounded-xl border border-[#c59b27]/20 shrink-0">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#ab841b]">
                Estimated Price Band
              </span>
              <span className="text-2xl font-bold text-[#0b2240]">{getPriceDisplay()}</span>
            </div>
          </div>

          {/* Specifications & Scale Grid (Identical 4-column layout to Society popup) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Property Specifications &amp; Scale
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <Building2 className="w-4 h-4 text-[#c59b27]" />
                  <span>Developer</span>
                </div>
                <span className="text-sm font-semibold text-[#0b2240] truncate block">
                  {developerName}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <Layers className="w-4 h-4 text-[#c59b27]" />
                  <span>Configurations</span>
                </div>
                <span className="text-sm font-semibold text-[#0b2240] truncate block">
                  {configurationsText}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <Maximize2 className="w-4 h-4 text-[#c59b27]" />
                  <span>Total Scale / Area</span>
                </div>
                <span className="text-sm font-semibold text-[#0b2240] block">
                  {Number(property.specs.area).toLocaleString()} {property.specs.areaUnit || 'sq ft'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>RERA Verified</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#0b2240] truncate block">
                  {reraNumber}
                </span>
              </div>
            </div>

            {/* Detailed Attributes Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-3">
              {property.specs.bathrooms !== undefined && (
                <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                    <Bath className="w-3.5 h-3.5 text-[#c59b27]" />
                    <span>Baths</span>
                  </div>
                  <span className="text-xs font-semibold text-[#0b2240]">{property.specs.bathrooms} Luxury Baths</span>
                </div>
              )}
              {property.specs.furnishingStatus && (
                <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
                  <span className="block text-slate-500 text-xs mb-1">Furnishing</span>
                  <span className="text-xs font-semibold text-[#0b2240] truncate block">{property.specs.furnishingStatus}</span>
                </div>
              )}
              {property.specs.parking && (
                <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
                  <span className="block text-slate-500 text-xs mb-1">Parking</span>
                  <span className="text-xs font-semibold text-[#0b2240] truncate block">{property.specs.parking}</span>
                </div>
              )}
              {property.specs.floor && (
                <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
                  <span className="block text-slate-500 text-xs mb-1">Floor</span>
                  <span className="text-xs font-semibold text-[#0b2240]">{property.specs.floor} of {property.specs.totalFloors || 'High'}</span>
                </div>
              )}
              {property.specs.facing && (
                <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                    <Compass className="w-3.5 h-3.5 text-[#c59b27]" />
                    <span>Facing</span>
                  </div>
                  <span className="text-xs font-semibold text-[#0b2240] truncate block">{property.specs.facing}</span>
                </div>
              )}
              {property.specs.propertyAge && (
                <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#c59b27]" />
                    <span>Age</span>
                  </div>
                  <span className="text-xs font-semibold text-[#0b2240] truncate block">{property.specs.propertyAge}</span>
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
                Amenities &amp; Key Features
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

          {/* Location & Connectivity Overview */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                Location &amp; Connectivity
              </span>
              <p className="text-sm font-semibold text-[#0b2240]">
                {property.location.locality ? `${property.location.locality}, ` : ''}
                {property.location.subLocation ? `${property.location.subLocation}, ` : ''}
                {property.location.city}
              </p>
              <p className="text-xs text-slate-500">
                Prime Delhi NCR micro-market with arterial connectivity to major expressways, metro corridors, and key commercial hubs.
              </p>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                `${property.title}, ${property.location.locality || ''}, ${property.location.city}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:border-[#c59b27] hover:text-[#0b2240] transition-colors shrink-0"
            >
              <Navigation className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>Open in Google Maps</span>
            </a>
          </div>

          {/* Direct Private Inquiry & Contact Section */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0b2240] text-white">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c59b27]">
                Private Client Concierge
              </span>
              <h3 className="text-xl sm:text-2xl font-light mt-1">
                Schedule Private Viewing &amp; Request Property Dossier
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 font-light">
                Connect directly with our senior {property.location.city} property advisor for verified floor plans, layout options, and private appointment scheduling.
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
                  placeholder="Phone / WhatsApp (+91)"
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
                    href={`https://wa.me/918178393751?text=${encodeURIComponent(
                      `Hello SOFINFRA, I would like to request information and arrange a private viewing for ${property.title} in ${property.location.locality || property.location.city}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>Instant WhatsApp Inquiry (+91 81783 93751)</span>
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
