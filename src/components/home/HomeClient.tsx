'use client';

import { useState } from 'react';
import { Property } from '@/types/property';
import { Society } from '@/data/societies';
import { HomepageData, HomepageSection } from '@/lib/wordpress';
import Navbar from '@/components/common/Navbar';
import CinematicHero, { HeroSearchFilter } from '@/components/hero/CinematicHero';
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
  initialProjects?: Society[];
  homepageData?: HomepageData | null;
}

export default function HomeClient({ initialProperties, initialProjects, homepageData }: HomeClientProps) {
  const [properties] = useState<Property[]>(initialProperties);
  const [societies] = useState<Society[]>(initialProjects || []);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedSociety, setSelectedSociety] = useState<Society | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [heroSearchFilter, setHeroSearchFilter] = useState<HeroSearchFilter | null>(null);

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleSelectSociety = (society: Society) => {
    setSelectedSociety(society);
  };

  const renderSection = (section: HomepageSection, index: number) => {
    switch (section.acf_fc_layout) {
      case 'hero_section':
        return (
          <CinematicHero
            key={`section-hero-${index}`}
            data={section}
            projects={societies}
            properties={properties}
            onSearch={(filter) => setHeroSearchFilter(filter)}
            onSubmitPropertyClick={() => setIsSubmitModalOpen(true)}
          />
        );
      case 'property_listings_section':
        return (
          <PropertyListings
            key={`section-listings-${index}`}
            data={section}
            properties={properties}
            projects={societies}
            heroSearchFilter={heroSearchFilter}
            onClearHeroFilter={() => setHeroSearchFilter(null)}
            onSelectProperty={handleSelectProperty}
          />
        );
      case 'societies_section':
        return (
          <SocietiesSection
            key={`section-societies-${index}`}
            data={section}
            societies={societies}
            onSelectSociety={handleSelectSociety}
            onSubmitPropertyClick={() => setIsSubmitModalOpen(true)}
          />
        );
      case 'about_section':
        return <AboutSection key={`section-about-${index}`} data={section} />;
      case 'services_section':
        return <ServicesSection key={`section-services-${index}`} data={section} />;
      case 'testimonials_section':
        return <TestimonialsSection key={`section-reviews-${index}`} data={section} />;
      case 'cta_section':
        return (
          <CtaSection
            key={`section-cta-${index}`}
            data={section}
            onSubmitPropertyClick={() => setIsSubmitModalOpen(true)}
          />
        );
      case 'contact_section':
        return <ContactSection key={`section-contact-${index}`} data={section} />;
      default:
        return null;
    }
  };

  const hasDynamicSections =
    homepageData?.sections && Array.isArray(homepageData.sections) && homepageData.sections.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Sticky Blur Navbar */}
      <Navbar onSubmitPropertyClick={() => setIsSubmitModalOpen(true)} />

      {/* Flexible Content Sections from WordPress (or static fallbacks) */}
      {hasDynamicSections ? (
        homepageData.sections.map((section, index) => renderSection(section, index))
      ) : (
        <>
          {/* 1. Cinematic Hero Section */}
          <CinematicHero
            projects={societies}
            properties={properties}
            onSearch={(filter) => setHeroSearchFilter(filter)}
            onSubmitPropertyClick={() => setIsSubmitModalOpen(true)}
          />

          {/* 2. Buy Properties Section (#buy-properties) */}
          <PropertyListings
            properties={properties}
            projects={societies}
            heroSearchFilter={heroSearchFilter}
            onClearHeroFilter={() => setHeroSearchFilter(null)}
            onSelectProperty={handleSelectProperty}
          />

          {/* 3. Top Societies & Townships Section (#societies) */}
          <SocietiesSection
            societies={societies}
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
        </>
      )}

      {/* 9. Footer */}
      <Footer
        onSubmitPropertyClick={() => setIsSubmitModalOpen(true)}
        properties={properties}
        societies={societies}
        onSelectProperty={handleSelectProperty}
        onSelectSociety={handleSelectSociety}
      />

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
