import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.mixkit.co',
      },
      {
        protocol: 'http',
        hostname: 'sofinfra.local',
      },
      {
        protocol: 'https',
        hostname: 'sofinfra.local',
      },
    ],
  },
};

export default nextConfig;
