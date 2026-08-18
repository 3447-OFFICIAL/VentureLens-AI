import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
