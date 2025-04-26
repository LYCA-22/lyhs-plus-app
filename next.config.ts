import type { NextConfig } from "next";
import nextPwa from "next-pwa";

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' https://www.googletagmanager.com https://static.cloudflareinsights.com https://api.lyhsca.org 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://www.googletagmanager.com https://api.lyhsca.org;
  connect-src 'self' https://www.google-analytics.com https://api.lyhsca.org https://plus.lyhsca.org https://cloudflareinsights.com;
  frame-src 'none';
  object-src 'none';
`;

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\n/g, ""),
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
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
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
