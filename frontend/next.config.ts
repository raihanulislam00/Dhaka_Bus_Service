import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: process.cwd(),
  turbopack: {
    rules: {
      '*.svg': ['@svgr/webpack'],
    },
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  async rewrites() {
    // Only add rewrites for local development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3000/:path*',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
