'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ShieldCheck,
  Building2,
  DollarSign,
  UserCheck,
  Clock,
} from 'lucide-react';
import { PropertyType, ListingType, PropertySubmissionPayload } from '@/types/property';

interface SubmitPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROPERTY_TYPES: PropertyType[] = [
  'Apartment',
  'Villa',
  'House',
  'Plot',
  'Land',
  'Office',
  'Shop',
  'Commercial Property',
  'Residential Property',
  'Building',
  'Project',
  'Penthouse',
  'Other',
];

const LISTING_TYPES: ListingType[] = ['For Sale', 'Resale', 'New Launch', 'Other'];

const AMENITY_OPTIONS = [
  'Swimming Pool',
  'Private Elevator',
  'Gym / Wellness Studio',
  'Security & Concierge',
  'Smart Home Automation',
  'Covered Parking',
  'Terrace / Balcony',
  'Sea / Skyline View',
  'Staff Accommodation',
  'Green Building / Solar',
];

export default function SubmitPropertyModal({ isOpen, onClose }: SubmitPropertyModalProps) {
  // Tabs / Steps
  const [activeStep, setActiveStep] = useState<'owner' | 'property' | 'details' | 'media'>('owner');

  // Form State
  const [formData, setFormData] = useState<PropertySubmissionPayload>({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    preferredContactMethod: 'phone',

    title: '',
    propertyType: 'Villa',
    listingType: 'For Sale',
    propertyStatus: 'Ready to Move',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    locality: 'Palam Vihar',
    pincode: '122017',

    priceAvailability: 'request',
    price: '',
    priceMax: '',
    currency: 'INR',

    area: '',
    areaUnit: 'sq ft',
    bedrooms: 3,
    bathrooms: 3,
    furnishingStatus: 'Furnished',
    parking: '2 Stalls',
    floor: '',
    totalFloors: '',
    propertyAge: 'Brand New',
    facing: 'East',
    availability: 'Immediate',
    amenities: ['Swimming Pool', 'Security & Concierge'],
    description: '',
    videoUrl: '',
  });

  // Media state
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; previewUrl: string }[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ postId?: string | number; message?: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const maxFiles = 8;
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB

    if (selectedFiles.length + files.length > maxFiles) {
      setUploadError(`You can upload a maximum of ${maxFiles} images.`);
      return;
    }

    const newFiles: { file: File; previewUrl: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!allowedTypes.includes(file.type)) {
        setUploadError(`"${file.name}" is not a supported format. Please use JPEG, PNG, or WebP.`);
        return;
      }

      if (file.size > maxSizeBytes) {
        setUploadError(`"${file.name}" exceeds the 10MB maximum file size.`);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      newFiles.push({ file, previewUrl });
    }

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadError(null);

    try {
      // Basic validation
      if (!formData.fullName || !formData.email || !formData.phone) {
        setActiveStep('owner');
        setUploadError('Please fill in all mandatory owner contact fields.');
        setIsSubmitting(false);
        return;
      }

      if (!formData.title || !formData.city) {
        setActiveStep('property');
        setUploadError('Please provide property title and city.');
        setIsSubmitting(false);
        return;
      }

      if (!formData.area || !formData.description) {
        setActiveStep('details');
        setUploadError('Please provide property area size and description.');
        setIsSubmitting(false);
        return;
      }

      // Convert selected file object previews to simulated or WP upload URLs
      const imageUrls = selectedFiles.map(
        (item) =>
          item.previewUrl ||
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85'
      );

      const payload = {
        ...formData,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      };

      const res = await fetch('/api/submit-property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitSuccess(true);
        setSubmissionResult({
          postId: data.postId,
          message: data.message,
        });
      } else {
        setUploadError(data.error || 'Submission failed. Please check inputs.');
      }
    } catch {
      setUploadError('Network communication error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0b2240] text-white">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-[#c59b27]" />
            <div>
              <h2 className="text-base sm:text-lg font-semibold tracking-tight">
                Submit Property For Consideration
              </h2>
              <p className="text-xs text-slate-300">
                Direct Submission to SOFINFRA Portfolio (Subject to Verification)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Tabs */}
        {!submitSuccess && (
          <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveStep('owner')}
              className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-colors ${
                activeStep === 'owner'
                  ? 'bg-white text-[#0b2240] border-b-2 border-[#c59b27]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#c59b27]" />
              <span className="hidden sm:inline">1. Owner Info</span>
              <span className="sm:hidden">1. Owner</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStep('property')}
              className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-colors ${
                activeStep === 'property'
                  ? 'bg-white text-[#0b2240] border-b-2 border-[#c59b27]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#c59b27]" />
              <span className="hidden sm:inline">2. Property Info</span>
              <span className="sm:hidden">2. Property</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStep('details')}
              className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-colors ${
                activeStep === 'details'
                  ? 'bg-white text-[#0b2240] border-b-2 border-[#c59b27]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-[#c59b27]" />
              <span className="hidden sm:inline">3. Pricing & Specs</span>
              <span className="sm:hidden">3. Specs</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStep('media')}
              className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-colors ${
                activeStep === 'media'
                  ? 'bg-white text-[#0b2240] border-b-2 border-[#c59b27]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#c59b27]" />
              <span className="hidden sm:inline">4. Media & Review</span>
              <span className="sm:hidden">4. Media</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          {submitSuccess ? (
            /* Success State - Explaining Pending Review Guarantee */
            <div className="py-8 text-center max-w-lg mx-auto space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-[#0b2240]">Submission Received</h3>
              <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-left space-y-2 text-xs sm:text-sm text-amber-900">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Status: Pending Review (Post #{submissionResult?.postId || 'New'})</span>
                </div>
                <p className="leading-relaxed">
                  In accordance with SOFINFRA security and verification policies, submitted properties <strong>never become public automatically</strong>.
                </p>
                <p className="leading-relaxed">
                  Our acquisitions team will review title integrity, architectural specifications, and imagery in the WordPress administration panel before publishing.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitSuccess(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-lg bg-[#0b2240] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#122f55]"
                >
                  Return to Home
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitSuccess(false);
                    setActiveStep('owner');
                    setSelectedFiles([]);
                  }}
                  className="px-6 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                >
                  Submit Another Property
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {uploadError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* STEP 1: OWNER / CONTACT INFO */}
              {activeStep === 'owner' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-[#0b2240]">Owner / Contact Information</h3>
                    <p className="text-xs text-slate-500">
                      Your identity is kept strictly confidential and accessible only to authorized administrators.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alistair Sterling"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-[#c59b27]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. principal@sterling.co.uk"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-[#c59b27]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 81783 93751"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-[#c59b27]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        WhatsApp Number (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 81783 93751"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-[#c59b27]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Preferred Contact Method
                    </label>
                    <div className="flex gap-4">
                      {(['phone', 'whatsapp', 'email'] as const).map((method) => (
                        <label key={method} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name="contactMethod"
                            checked={formData.preferredContactMethod === method}
                            onChange={() => setFormData({ ...formData, preferredContactMethod: method })}
                            className="text-[#c59b27] focus:ring-[#c59b27]"
                          />
                          <span className="capitalize">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveStep('property')}
                      className="px-6 py-2.5 rounded-lg bg-[#0b2240] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#122f55]"
                    >
                      Next: Property Info →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PROPERTY / PROJECT INFORMATION */}
              {activeStep === 'property' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-[#0b2240]">Property / Project Information</h3>
                    <p className="text-xs text-slate-500">Provide geographical and taxonomic classifications.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Property / Project Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DLF The Camellias 4BHK Golf Facing"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-[#c59b27]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Property Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as PropertyType })}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-[#c59b27]"
                      >
                        {PROPERTY_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Listing Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.listingType}
                        onChange={(e) => setFormData({ ...formData, listingType: e.target.value as ListingType })}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-[#c59b27]"
                      >
                        {LISTING_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Property Status
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ready to Move, Under Construction"
                        value={formData.propertyStatus}
                        onChange={(e) => setFormData({ ...formData, propertyStatus: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-[#c59b27]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Gurugram, Noida, New Delhi"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-[#c59b27]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Locality / Area
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Palam Vihar, Golf Course Rd, Sector 126"
                        value={formData.locality}
                        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-[#c59b27]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. India"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-[#c59b27]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveStep('owner')}
                      className="px-5 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStep('details')}
                      className="px-6 py-2.5 rounded-lg bg-[#0b2240] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#122f55]"
                    >
                      Next: Pricing & Details →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PRICING & PROPERTY SPECIFICATIONS */}
              {activeStep === 'details' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-[#0b2240]">Pricing & Architectural Specifications</h3>
                    <p className="text-xs text-slate-500">
                      Pricing is completely optional. You may select &apos;Price on Request&apos; without entering a figure.
                    </p>
                  </div>

                  {/* Pricing Toggle */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Pricing Availability
                    </label>
                    <div className="flex gap-6 mb-3">
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="priceAvail"
                          checked={formData.priceAvailability === 'request'}
                          onChange={() => setFormData({ ...formData, priceAvailability: 'request' })}
                          className="text-[#c59b27] focus:ring-[#c59b27]"
                        />
                        <span>Price on Request (Do not display exact price)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="priceAvail"
                          checked={formData.priceAvailability === 'price'}
                          onChange={() => setFormData({ ...formData, priceAvailability: 'price' })}
                          className="text-[#c59b27] focus:ring-[#c59b27]"
                        />
                        <span>Enter Specific Price / Range</span>
                      </label>
                    </div>

                    {formData.priceAvailability === 'price' && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div>
                          <label className="block text-[11px] text-slate-600 mb-1">Currency</label>
                          <select
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="AED">AED (AED)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="INR">INR (₹)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-600 mb-1">Price (or Min Price)</label>
                          <input
                            type="number"
                            placeholder="e.g. 8500000"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-600 mb-1">Max Price (If Range)</label>
                          <input
                            type="number"
                            placeholder="Optional max price"
                            value={formData.priceMax}
                            onChange={(e) => setFormData({ ...formData, priceMax: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Area / Size <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 5400"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
                      <select
                        value={formData.areaUnit}
                        onChange={(e) =>
                          setFormData({ ...formData, areaUnit: e.target.value as 'sq ft' | 'sq m' | 'acres' })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      >
                        <option value="sq ft">sq ft</option>
                        <option value="sq m">sq m</option>
                        <option value="acres">acres</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
                      <input
                        type="number"
                        min={0}
                        placeholder="e.g. 4"
                        value={formData.bedrooms || ''}
                        onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Bathrooms</label>
                      <input
                        type="number"
                        min={0}
                        placeholder="e.g. 5"
                        value={formData.bathrooms || ''}
                        onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Key Amenities
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {AMENITY_OPTIONS.map((item) => (
                        <label
                          key={item}
                          className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 text-xs cursor-pointer hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(item)}
                            onChange={() => toggleAmenity(item)}
                            className="text-[#c59b27] rounded focus:ring-[#c59b27]"
                          />
                          <span className="truncate">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Property Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Detailed architectural summary, unique fixtures, views, and provenance..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#c59b27]"
                    />
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveStep('property')}
                      className="px-5 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStep('media')}
                      className="px-6 py-2.5 rounded-lg bg-[#0b2240] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#122f55]"
                    >
                      Next: Media & Review →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: MEDIA UPLOAD & REVIEW */}
              {activeStep === 'media' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-[#0b2240]">Property Images & Media</h3>
                    <p className="text-xs text-slate-500">
                      Upload high-resolution photographs. Stored securely and reviewed in WordPress Media Library.
                    </p>
                  </div>

                  {/* Dropzone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#c59b27] rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-[#faf7f2] transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <UploadCloud className="w-10 h-10 text-[#c59b27] mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">
                      Click to upload property images
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      JPEG, PNG, WebP up to 10MB each (Max 8 images)
                    </p>
                  </div>

                  {/* Image Previews */}
                  {selectedFiles.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-700">
                          Selected Images ({selectedFiles.length} of 8)
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {selectedFiles.map((item, idx) => (
                          <div
                            key={idx}
                            className="relative h-24 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100"
                          >
                            <Image src={item.previewUrl} alt="Preview" fill className="object-cover" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(idx);
                              }}
                              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600/90 text-white hover:bg-red-700 transition-colors"
                              title="Remove image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video URL optional */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Property Video URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="e.g. YouTube, Vimeo, or MP4 direct link"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#c59b27]"
                    />
                  </div>

                  {/* Workflow Notice */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#c59b27] shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-900 block mb-0.5">
                        Fiduciary Verification Protocol
                      </strong>
                      Submissions are transferred to the WordPress backend as <em>Pending Review</em>. Our governance committee validates all disclosures before any property is syndicated on the public platform.
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setActiveStep('details')}
                      className="px-5 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                    >
                      ← Back
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 rounded-lg bg-[#c59b27] text-[#07162c] text-xs font-bold uppercase tracking-wider hover:bg-[#d4af37] disabled:opacity-50 shadow-md transition-all"
                    >
                      {isSubmitting ? 'Submitting to WordPress...' : 'Confirm & Submit Property'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
