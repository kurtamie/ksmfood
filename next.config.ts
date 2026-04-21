import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

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

export default withNextIntl(nextConfig);
