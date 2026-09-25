"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Navigation,
  Loader2,
} from "lucide-react";
import { ContactSectionData } from "@/lib/wordpress";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";

interface ContactSectionProps {
  data?: ContactSectionData;
}

export default function ContactSection({ data }: ContactSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Buying Residential (Gurugram/Noida)",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(
          json.error || "Failed to submit inquiry. Please check your inputs.",
        );
      }

      setSubmitted(true);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Submission error. Please try again or WhatsApp us directly.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentAddress =
    data?.address && !data.address.includes("Golf Course Road")
      ? data.address
      : "S-306-308, 2nd Floor, Tower A, Palam Vihar, Gurugram(HR)-122017";

  const currentEmail =
    data?.email && data.email !== "contact@sofinfra.com"
      ? data.email
      : "sales@sofinfra.com";

  const offices = [
    {
      city: "Corporate Address",
      address: currentAddress,
      landmark:
        "Ansal Corporate Plaza, block c, 2, Carterpuri Rd, Block C 2, Palam Vihar, Gurugram, Haryana 122017",
      phone:
        data?.phone || data?.phone_numbers?.[0]?.number || "+91 81783 93751",
      secondaryPhone: "+91 92123 16521",
      email: currentEmail,
      isPrimary: true,
    },
  ];

  return (
    <section id="contact" className="py-24 sm:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#faf7f2] border border-[#c59b27]/20 text-[#ab841b] text-xs font-semibold tracking-widest uppercase mb-3">
            {data?.badge || "Private Client Advisory"}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0b2240] tracking-tight">
            {data?.heading || "Initiate Discreet Consultation"}
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base font-light leading-relaxed">
            {data?.subheading ||
              "Direct access to senior partners specializing in high-value NCR society acquisitions, title due diligence, and capital asset placement."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Offices & Fast Channels */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick WhatsApp & Call Box */}
            <div className="p-6 rounded-2xl bg-[#0b2240] text-white">
              <span className="text-[11px] uppercase tracking-wider text-[#c59b27] font-semibold">
                Instant Advisory Desk
              </span>
              <h3 className="text-lg font-bold mt-1">
                Priority WhatsApp &amp; Direct Phone
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Connect directly with our desk for fast brochures, verified
                pricing sheets, and escorted site visits.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <a
                  href="https://wa.me/918178393751"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:scale-102 cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>WhatsApp (+91 81783 93751)</span>
                </a>
                <a
                  href="tel:+919212316521"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#c59b27]" />
                  <span>Direct (+91 92123 16521)</span>
                </a>
              </div>
            </div>

            {/* Offices List */}
            <div className="space-y-4">
              {offices.map((office) => (
                <div
                  key={office.city}
                  className={`p-5 rounded-xl border transition-colors ${
                    office.isPrimary
                      ? "border-[#c59b27]/40 bg-[#faf7f2]/70 shadow-sm"
                      : "border-slate-200/80 bg-slate-50/50 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#0b2240]">
                      {office.city}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-[#c59b27] shrink-0 mt-0.5" />
                    <span>{office.address}</span>
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Phone className="w-3 h-3 text-[#c59b27]" />
                      <a
                        href={`tel:${office.phone.replace(/\s+/g, "")}`}
                        className="hover:text-[#0b2240] transition-colors"
                      >
                        {office.phone}
                      </a>
                      {office.secondaryPhone && (
                        <>
                          <span className="text-slate-400">/</span>
                          <a
                            href={`tel:${office.secondaryPhone.replace(
                              /\s+/g,
                              "",
                            )}`}
                            className="hover:text-[#0b2240] transition-colors"
                          >
                            {office.secondaryPhone}
                          </a>
                        </>
                      )}
                    </div>
                    <a
                      href={`mailto:${office.email}`}
                      className="flex items-center gap-1 hover:text-[#0b2240] transition-colors"
                    >
                      <Mail className="w-3 h-3 text-[#c59b27]" />
                      <span>{office.email}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-slate-50 p-8 sm:p-10 rounded-2xl border border-slate-200/80">
            <h3 className="text-xl font-bold text-[#0b2240] mb-2">
              Request Property Details / Site Visit
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Our certified RERA advisors will share verified society pricing
              and brochures.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#0b2240]">
                  Inquiry Dispatched
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you for contacting SOFINFRA. An advisor will reach out
                  via WhatsApp or call within 30 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#0b2240] text-white"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-base sm:text-sm focus:outline-hidden focus:border-[#c59b27] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-base sm:text-sm focus:outline-hidden focus:border-[#c59b27] bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 81783 93751"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-base sm:text-sm focus:outline-hidden focus:border-[#c59b27] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Requirement Type
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-base sm:text-sm focus:outline-hidden focus:border-[#c59b27] bg-white cursor-pointer"
                    >
                      <option value="Buying Residential (Gurugram/Noida)">
                        Buying Residential (Gurugram/Noida)
                      </option>
                      <option value="Commercial Acquisition / Cyber City">
                        Commercial Acquisition / Cyber City
                      </option>
                      <option value="Listing My Property For Sale">
                        Listing My Property For Sale
                      </option>
                      <option value="NRI Investment Consultation">
                        NRI Investment Consultation
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Requirements / Target Society *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Mention preferred budget, BHK configuration (3/4/5 BHK), target society (e.g. DLF, ATS, M3M, Godrej), or specific sector..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-base sm:text-sm focus:outline-hidden focus:border-[#c59b27] bg-white"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-lg bg-[#0b2240] hover:bg-[#122f55] disabled:opacity-75 text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#c59b27]" />
                      <span>Transmitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#c59b27]" />
                      <span>Request Callback &amp; Society Dossier</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map Location Section */}
        <div className="mt-16 rounded-2xl overflow-hidden border border-slate-200/80 shadow-lg bg-white">
          <div className="p-6 sm:p-8 bg-[#0b2240] text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 text-[#c59b27] text-xs font-semibold tracking-wider uppercase">
                <MapPin className="w-3.5 h-3.5" />
                <span>Corporate Address</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-light">
                Ansal Corporate Plaza{" "}
                <span className="font-medium text-slate-200">
                  · Palam Vihar, Gurugram
                </span>
              </h3>
              <div className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl leading-relaxed space-y-1">
                <p>
                  <strong className="text-white font-medium">
                    Official Address:
                  </strong>{" "}
                  S-306-308, 2nd Floor, Tower A, Palam Vihar,
                  Gurugram(HR)-122017
                </p>
                <p>
                  <strong className="text-white font-medium">
                    Map Landmark:
                  </strong>{" "}
                  Ansal Corporate Plaza, block c, 2, Carterpuri Rd, Block C 2,
                  Palam Vihar, Gurugram, Haryana 122017
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a
                href="tel:+918178393751"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/20"
              >
                <Phone className="w-4 h-4 text-[#c59b27]" />
                <span>+91 81783 93751</span>
              </a>
              <a
                href="https://maps.google.com/?q=Ansal+Corporate+Plaza,+block+c,+2,+Carterpuri+Rd,+Block+C+2,+Palam+Vihar,+Gurugram,+Haryana+122017"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#c59b27] hover:bg-[#d4af37] text-[#07162c] text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-100">
            <iframe
              title="SOFINFRA Headquarters - Ansal Corporate Plaza, Gurugram"
              src="https://maps.google.com/maps?q=Ansal+Corporate+Plaza,+block+c,+2,+Carterpuri+Rd,+Block+C+2,+Palam+Vihar,+Gurugram,+Haryana+122017&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full filter saturate-110 contrast-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
