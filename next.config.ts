import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/services/nasi-kotak",
        destination: "/services/ricebox",
      },
    ];
  },
};

export default nextConfig;
