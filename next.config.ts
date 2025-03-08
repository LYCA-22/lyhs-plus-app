import type { NextConfig } from "next";
import nextPwa from "next-pwa";

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
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
        ],
      },
    ];
  },
  images: {
    domains: ["highschool.kh.edu.tw"],
  },
  output: "standalone",
};

export default withPWA(nextConfig);
