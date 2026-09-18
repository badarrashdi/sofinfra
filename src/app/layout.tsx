import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'SOFINFRA | Building A Brighter Tomorrow - Global Luxury Real Estate',
  description:
    'Curating world-class residential estates and premier commercial landmarks across leading international destinations.',
  keywords: [
    'luxury real estate',
    'penthouses',
    'commercial properties',
    'Dubai real estate',
    'London estates',
    'New York luxury homes',
    'SOFINFRA',
  ],
  icons: {
    icon: '/brand/sofinfra-logo.png',
  },
  openGraph: {
    title: 'SOFINFRA | Building A Brighter Tomorrow',
    description:
      'Curating world-class residential estates and premier commercial landmarks across leading international destinations.',
    images: ['/brand/sofinfra-logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans">{children}</body>
    </html>
  );
}
