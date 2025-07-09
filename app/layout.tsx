import "@/styles/globals.css";
import { Providers } from "./providers";
import { GoogleTagManager } from "@/components/GoogleAnalytics";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: {
    default: "LYHS Plus | 開啟林園高中智慧校園",
    template: "%s | LYHS Plus",
  },
  description:
    "LYHS Plus 由班聯會製作，致力於改善校園資訊流通，讓更多人可以藉由這款系統來讓生活更簡單、便利。你可以在這裡找到學校的公告，也可以查看到學校的行事曆。",
  keywords:
    "LYHS+, LYHS Plus, 林園高中, 林中+, 林園高中, 林園高中資訊整合平台, 智慧林中, 智慧林園高中, 林園高中班聯會, LYCA, LYCA22, LYPS",
  authors: [{ name: "林園高中班聯會" }],
  creator: "林園高中班聯會",
  publisher: "林園高中班聯會",
  alternates: {
    canonical: "https://app.lyhsca.org",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://app.lyhsca.org",
    title: "LYHS Plus | 開啟林園高中智慧校園",
    description:
      "LYHS Plus 是由林園高中第二十二屆班聯會製作，致力於改善校園資訊流通，讓更多人可以藉由這款系統來讓生活更簡單、便利。你可以在這裡找到學校的公告，也可以查看到學校的行事曆。快點進來看看吧！",
    siteName: "LYHS Plus | 開啟智慧校園",
  },
  twitter: {
    card: "summary_large_image",
    title: "LYHS Plus | 開啟林園高中智慧校園",
    description: "LYHS Plus 致力於改善校園資訊流通，讓校園生活更簡單、便利。",
    creator: "@lyhsca",
  },
  verification: {
    google: "verification_token",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="theme-color" content="#000000" />
        <meta
          name="apple-mobile-web-app-title"
          content="LYHS+"
          data-next-head
        />
        <meta name="orientation" content="portrait" />
        <meta name="screen-orientation" content="portrait" />
        <meta name="geo.region" content="TW" />
        <meta name="geo.placename" content="林園" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://app.lyhsca.org" />
      </head>
      <body>
        <div id="_next" className="transition-all duration-500">
          <Providers>{children}</Providers>
        </div>
        <GoogleTagManager />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "LYHS Plus",
              alternateName: "林園高中智慧校園",
              description:
                "林園高中智慧校園平台，提供校園公告、行事曆、學權信箱、線上報修等服務",
              url: "https://app.lyhsca.org",
              applicationCategory: "EducationalApplication",
              applicationSubCategory: "School Management System",
              operatingSystem: "All",
              browserRequirements: "Requires JavaScript",
              softwareVersion: "2.0",
              releaseNotes: "最新版本包含優化的用戶體驗和更多功能",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "TWD",
                availability: "https://schema.org/InStock",
              },
              author: {
                "@type": "Organization",
                name: "林園高中班聯會",
                alternateName: "LYCA22",
                url: "https://app.lyhsca.org",
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer service",
                  availableLanguage: "zh-TW",
                },
              },
              publisher: {
                "@type": "Organization",
                name: "林園高中班聯會",
                logo: {
                  "@type": "ImageObject",
                  url: "https://app.lyhsca.org/logo.png",
                },
              },
              potentialAction: [
                {
                  "@type": "SearchAction",
                  target:
                    "https://app.lyhsca.org/search?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
                {
                  "@type": "ViewAction",
                  target: "https://app.lyhsca.org/news",
                  name: "查看校園公告",
                },
                {
                  "@type": "ViewAction",
                  target: "https://app.lyhsca.org/calendar",
                  name: "查看行事曆",
                },
              ],
              featureList: [
                "校園公告查詢",
                "行事曆查看",
                "學權信箱",
                "線上報修",
                "成績查詢",
                "課程資訊",
              ],
              sameAs: [
                "https://www.facebook.com/lyhsca",
                "https://www.instagram.com/lyhs.ca",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
