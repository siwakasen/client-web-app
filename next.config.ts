import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  allowedDevOrigins: [
    "https://siwakasen.mole-mintaka.ts.net",
    "https://vulpies.tail66dfd8.ts.net",
    "localhost:3005",
  ],
  experimental: {
    useCache: true,
    serverActions: {
      bodySizeLimit: '30mb',
    },

  },
};

export default nextConfig;
