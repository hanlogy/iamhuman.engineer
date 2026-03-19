import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '192.168.10.238',
        port: '9150',
      },
      {
        protocol: 'https',
        hostname: 'public.iamhuman.engineer',
      },
      {
        protocol: 'https',
        hostname: 'public.dev.iamhuman.engineer',
      },
    ],
  },
};

export default nextConfig;
