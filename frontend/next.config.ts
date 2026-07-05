import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true, // Enables gzip/brotli compression
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
