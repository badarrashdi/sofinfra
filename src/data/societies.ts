export interface Society {
  id: string;
  name: string;
  developer: string;
  location: string;
  subLocation: string;
  city: 'Gurugram' | 'Noida' | 'New Delhi' | 'Greater Noida';
  type: 'Ultra Luxury Residential' | 'Premium High-Rise' | 'Commercial & Retail' | 'Integrated Township';
  status: 'Ready to Move' | 'Under Construction' | 'Newly Launched';
  priceRange: string;
  units: string;
  configurations: string;
  image: string;
  featured: boolean;
  amenities: string[];
  reraId: string;
}

export const DELHI_NCR_SOCIETIES: Society[] = [
  {
    id: 'soc-1',
    name: 'DLF The Camellias & Magnolias',
    developer: 'DLF Luxury Living',
    location: 'Sector 42, Golf Course Road',
    subLocation: 'DLF Phase 5',
    city: 'Gurugram',
    type: 'Ultra Luxury Residential',
    status: 'Ready to Move',
    priceRange: '₹35 Cr - ₹85 Cr',
    units: '429 Exclusive Penthouses & Apartments',
    configurations: '4, 5 & 6 BHK Penthouses',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
    featured: true,
    amenities: ['Private Golf Course', 'Helipad', '7-Star Clubhouse', 'Olympic Pool', 'Concierge Desk'],
    reraId: 'RC/REP/HARERA/GGM/2018/14',
  },
  {
    id: 'soc-2',
    name: 'ATS Knightsbridge',
    developer: 'ATS Infrastructure',
    location: 'Sector 124, Noida Expressway',
    subLocation: 'Noida-Delhi Border',
    city: 'Noida',
    type: 'Ultra Luxury Residential',
    status: 'Ready to Move',
    priceRange: '₹12 Cr - ₹28 Cr',
    units: '215 Bespoke Suites',
    configurations: '4 & 6 BHK Super-Luxury Suites',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=85',
    featured: true,
    amenities: ['1 Suite Per Floor', 'Yamuna River Views', '35,000 sq ft Club', 'Biometric Elevators'],
    reraId: 'UPRERAPRJ3574',
  },
  {
    id: 'soc-3',
    name: 'M3M Golfestate',
    developer: 'M3M India',
    location: 'Sector 65, Golf Course Extension Road',
    subLocation: 'Golf Course Extension',
    city: 'Gurugram',
    type: 'Premium High-Rise',
    status: 'Ready to Move',
    priceRange: '₹4.5 Cr - ₹14 Cr',
    units: '870 Luxury Units',
    configurations: '3, 4 & 5 BHK Golf Residences',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
    featured: true,
    amenities: ['9-Hole Executive Golf Course', 'Rooftop Infinity Pool', 'Boutique Spa', 'Private Mini-Theatre'],
    reraId: 'RC/REP/HARERA/GGM/2017/28',
  },
  {
    id: 'soc-4',
    name: 'DLF One Midtown',
    developer: 'DLF Home Developers',
    location: 'Shivaji Marg, Moti Nagar',
    subLocation: 'Central-West Delhi',
    city: 'New Delhi',
    type: 'Ultra Luxury Residential',
    status: 'Under Construction',
    priceRange: '₹4.2 Cr - ₹9.8 Cr',
    units: '913 Residential Suites',
    configurations: '2, 3 & 4 BHK Luxury Residences',
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=85',
    featured: false,
    amenities: ['128 Acres Surrounding Greens', '5-Tier Security', 'Sports Arena', 'Temperature Controlled Pool'],
    reraId: 'DLRERA2021P0007',
  },
  {
    id: 'soc-5',
    name: 'Godrej Woods & Palm Retreat',
    developer: 'Godrej Properties',
    location: 'Sector 43 & Sector 150',
    subLocation: 'Noida Expressway',
    city: 'Noida',
    type: 'Integrated Township',
    status: 'Ready to Move',
    priceRange: '₹2.4 Cr - ₹6.5 Cr',
    units: '1,200 Forest-Theme Homes',
    configurations: '2, 3, 4 BHK & Sky Villas',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
    featured: false,
    amenities: ['Urban Forest & Orchard', 'Organic Farming Zone', 'Multi-level Clubhouse', 'EV Charging Bays'],
    reraId: 'UPRERAPRJ704730',
  },
  {
    id: 'soc-6',
    name: 'Cyber City Corporate Hub & Tech Parks',
    developer: 'DLF Commercial',
    location: 'DLF Cyber City, DLF Phase 2',
    subLocation: 'NH-48 Corridor',
    city: 'Gurugram',
    type: 'Commercial & Retail',
    status: 'Ready to Move',
    priceRange: 'Price on Request',
    units: 'Grade-A Commercial Suites',
    configurations: '5,000 to 120,000 sq ft Floorplates',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
    featured: true,
    amenities: ['Rapid Metro Connectivity', 'LEED Platinum', 'CyberHub Dining', 'Multi-tier Screening'],
    reraId: 'RC/REP/HARERA/GGM/2019/52',
  },
];
