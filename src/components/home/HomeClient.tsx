'use client';

import { useState } from 'react';
import { Property } from '@/types/property';
import { Society } from '@/data/societies';
import Navbar from '@/components/common/Navbar';
import CinematicHero from '@/components/hero/CinematicHero';
import PropertyListings from '@/components/properties/PropertyListings';
import SocietiesSection from '@/components/sections/SocietiesSection';
import SocietyDetailModal from '@/components/societies/SocietyDetailModal';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CtaSection from '@/components/sections/CtaSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/common/Footer';
import PropertyDetailModal from '@/components/properties/PropertyDetailModal';
import SubmitPropertyModal from '@/components/submit/SubmitPropertyModal';

interface HomeClientProps {
  initialProperties: Property[];
}

export default function HomeClient({ initialProperties }: HomeClientProps) {
  const [properties] = useState<Property[]>(initialProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedSociety, setSelectedSociety] = useState<Society | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleSelectSociety = (society: Society) => {
    setSelectedSociety(society);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Sticky Blur Navbar (Menu: Buy & Rent | Societies | List Property | Reviews | Contact Us) */}
      <Navbar onSubmitPropertyClick={() => setIsSubmitModalOpen(true)} />

      {/* 1. Cinematic Hero Section */}
      <CinematicHero onSubmitPropertyClick={() => setIsSubmitModalOpen(true)} />

      {/* 2. Buy & Rent Section (#buy-rent) */}
      <PropertyListings
        properties={properties}
        onSelectProperty={handleSelectProperty}
      />

      {/* 3. Top Societies & Townships Section (#societies) */}
      <SocietiesSection
        onSelectSociety={handleSelectSociety}
        onSubmitPropertyClick={() => setIsSubmitModalOpen(true)}
      />

      {/* 4. About SOFINFRA Standard */}
      <AboutSection />

      {/* 5. Services & Advisory */}
      <ServicesSection />

      {/* 6. Client Reviews & Ratings (#reviews) */}
      <TestimonialsSection />

      {/* 7. List Property CTA (#list-property) */}
      <CtaSection onSubmitPropertyClick={() => setIsSubmitModalOpen(true)} />

      {/* 8. Contact Us (#contact) */}
      <ContactSection />

      {/* 9. Footer */}
      <Footer onSubmitPropertyClick={() => setIsSubmitModalOpen(true)} />

      {/* Option A — Property Detail Popup Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />

      {/* Society Detail Popup Modal */}
      <SocietyDetailModal
        society={selectedSociety}
        onClose={() => setSelectedSociety(null)}
      />

      {/* Submit Property Modal (Multi-Step Form to WordPress Pending Status) */}
      <SubmitPropertyModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
}
