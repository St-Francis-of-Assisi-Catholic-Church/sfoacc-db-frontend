import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  env: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://13.60.62.124:8000/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
