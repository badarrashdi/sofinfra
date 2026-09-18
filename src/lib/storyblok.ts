/**
 * Storyblok Client & Content Helper
 * Storyblok is used exclusively for editable marketing and brand narrative sections.
 * All property and project inventory is strictly managed in WordPress.
 */

export interface MarketingContent {
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    exploreCtaText: string;
    submitCtaText: string;
  };
  about: {
    sectionSubtitle: string;
    heading: string;
    descriptionPara1: string;
    descriptionPara2: string;
    stats: Array<{ value: string; label: string }>;
  };
  whyChooseUs: {
    subtitle: string;
    heading: string;
    features: Array<{ title: string; description: string; icon: string }>;
  };
  testimonials: {
    subtitle: string;
    heading: string;
    items: Array<{ quote: string; author: string; title: string; location: string }>;
  };
}

export const DEFAULT_MARKETING_CONTENT: MarketingContent = {
  hero: {
    badge: 'Global Luxury Real Estate & Infrastructure',
    headline: 'Elevating Spaces. Building A Brighter Tomorrow.',
    subheadline:
      'Curating world-class residential estates and premier commercial landmarks across the most distinguished global metropolises.',
    exploreCtaText: 'Explore Collection',
    submitCtaText: 'Submit Property',
  },
  about: {
    sectionSubtitle: 'The SOFINFRA Standard',
    heading: 'Redefining Prestige Real Estate Across Global Capitals',
    descriptionPara1:
      'SOFINFRA was founded with a singular conviction: real estate should transcend mere physical structures to become enduring monuments of architectural excellence and generational wealth creation.',
    descriptionPara2:
      'Operating across prime international jurisdictions—from Dubai and London to New York, Singapore, and Mumbai—we represent discerning private investors, developers, and institutional buyers in sourcing and marketing unlisted and marquee assets.',
    stats: [
      { value: '$2.8B+', label: 'Global Transaction Volume' },
      { value: '1,400+', label: 'Prime Properties Represented' },
      { value: '18+', label: 'International Metropolises' },
      { value: '99.4%', label: 'Discreet Execution Rate' },
    ],
  },
  whyChooseUs: {
    subtitle: 'Institutional Rigor. Private Client Discretion.',
    heading: 'Why Global Leaders Entrust SOFINFRA',
    features: [
      {
        title: 'Global High-Yield Sourcing',
        description:
          'Direct access to off-market residential penthouses, trophy commercial towers, and sovereign-grade developments before public syndication.',
        icon: 'Globe',
      },
      {
        title: 'Architectural Due Diligence',
        description:
          'Comprehensive structural, zoning, and legal auditing conducted by seasoned in-house property advisors and structural engineers.',
        icon: 'ShieldCheck',
      },
      {
        title: 'Tailored Asset Structuring',
        description:
          'Cross-border transaction structuring, tax-optimized holding advice, and end-to-end conveyance management.',
        icon: 'Building2',
      },
      {
        title: 'Discreet Private Representation',
        description:
          'Absolute privacy protocols safeguarding client identities and high-value transactional assets throughout negotiations.',
        icon: 'Lock',
      },
    ],
  },
  testimonials: {
    subtitle: 'Client Endorsements',
    heading: 'Trusted by Ultra-High-Net-Worth Individuals & Family Offices',
    items: [
      {
        quote:
          'SOFINFRA managed the private sale of our family estate in Belgravia with unparalleled discretion and achieved a benchmark valuation within 45 days.',
        author: 'Lord Alistair Sterling',
        title: 'Family Office Principal',
        location: 'London, UK',
      },
      {
        quote:
          'Their command of the Dubai luxury market and swift cross-border acquisition process allowed our investment fund to secure two prime commercial assets seamlessly.',
        author: 'Tariq Al-Mansoor',
        title: 'Managing Director, Horizon Capital',
        location: 'Dubai, UAE',
      },
      {
        quote:
          'From initial consultation to title transfer on our Manhattan penthouse, the SOFINFRA team exemplified supreme professionalism and modern technological transparency.',
        author: 'Elena Rostova',
        title: 'Private Investor',
        location: 'New York, USA',
      },
    ],
  },
};

/**
 * Retrieves marketing content from Storyblok if an API token is provided,
 * otherwise falls back seamlessly to the default brand marketing content.
 */
export async function getMarketingContent(): Promise<MarketingContent> {
  const token = process.env.STORYBLOK_ACCESS_TOKEN;

  if (!token) {
    return DEFAULT_MARKETING_CONTENT;
  }

  try {
    const res = await fetch(
      `https://api.storyblok.com/v2/cdn/stories/home?token=${token}&version=published`,
      { next: { revalidate: 300 } }
    );
    if (res.ok) {
      const data = await res.json();
      if (data?.story?.content) {
        // Merge fetched Storyblok content with defaults
        return {
          ...DEFAULT_MARKETING_CONTENT,
          ...data.story.content,
        };
      }
    }
  } catch {
    // Storyblok unreachable or unconfigured
  }

  return DEFAULT_MARKETING_CONTENT;
}
