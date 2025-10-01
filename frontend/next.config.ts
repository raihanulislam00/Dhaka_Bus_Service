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
  // Remove rewrites for now since we don't have backend deployed yet
  // async rewrites() {
  //   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  //   if (apiUrl && apiUrl !== 'http://localhost:3000') {
  //     return [
  //       {
  //         source: '/api/:path*',
  //         destination: `${apiUrl}/api/:path*`,
  //       },
  //     ];
  //   }
  //   return [];
  // },
};

export default nextConfig;
