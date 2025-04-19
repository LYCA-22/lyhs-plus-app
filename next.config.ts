import type { NextConfig } from "next";
import nextPwa from "next-pwa";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none';",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];

interface PWAConfigExtended {
  dest: string;
  register: boolean;
  skipWaiting: boolean;
  disable?: boolean;
  importScripts?: string[];
}

const pwaConfig: PWAConfigExtended = {
  dest: "public",
  register: true,
  skipWaiting: true,
};

const withPWA = nextPwa(pwaConfig);

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/school-system/:path*",
        destination: "https://highschool.kh.edu.tw/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    domains: ["highschool.kh.edu.tw"],
  },
  output: "standalone",
};

export default withPWA(nextConfig);
