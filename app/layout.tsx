import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "./providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Head } from "@/components/Head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LYHS Plus",
  description: "LYHS Plus 是一個為了提供更好的學校生活而設計的應用程式",
  keywords: [
    "LYHS+",
    "LYHS Plus",
    "林園高中",
    "林中+",
    "林園高中",
    "林園高中資訊整合平台",
  ],
  openGraph: {
    title: "LYHS Plus",
    description: "LYHS Plus 是一個為了提供更好的學校生活而設計的應用程式",
    url: "https://beta.plus.lyhsca.org",
    siteName: "LYHS Plus",
    locale: "zh_TW",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <Head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
