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
  description:
    "LYHS Plus 由班聯會製作，致力於改善校園資訊流通，讓更多人可以藉由這款系統來讓生活更簡單、便利。你可以在這裡找到學校的公告，也可以查看到學校的行事曆。",
  keywords: [
    "LYHS+",
    "LYHS Plus",
    "林園高中",
    "林中+",
    "林園高中",
    "林園高中資訊整合平台",
    "智慧林中",
    "智慧林園高中",
    "林園高中班聯會",
    "LYCA",
    "LYCA22",
    "LYPS",
  ],
  openGraph: {
    title: "LYHS Plus",
    description:
      "LYHS Plus 是由林園高中第二十二屆班聯會製作，致力於改善校園資訊流通，讓更多人可以藉由這款系統來讓生活更簡單、便利。你可以在這裡找到學校的公告，也可以查看到學校的行事曆。快點進來看看吧！",
    url: "https://app.lyhsca.org",
    siteName: "LYHS Plus | 開啟智慧校園",
    locale: "zh_TW",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
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
