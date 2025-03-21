import "@/styles/globals.css";
import { Providers } from "./providers";
import { GoogleTagManager } from "@/components/GoogleAnalytics";

export const viewport = {
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
        <title>LYHS Plus | 開啟林園高中智慧校園</title>
        <meta
          name="description"
          content="LYHS Plus 由班聯會製作，致力於改善校園資訊流通，讓更多人可以藉由這款系統來讓生活更簡單、便利。你可以在這裡找到學校的公告，也可以查看到學校的行事曆。"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="theme-color" content="#ffffff00" />
        <meta
          name="apple-mobile-web-app-title"
          content="LYHS+"
          data-next-head
        />
        <meta name="orientation" content="portrait" />
        <meta name="screen-orientation" content="portrait" />
        <meta property="og:title" content="LYHS Plus" />
        <meta
          property="og:description"
          content="LYHS Plus 是由林園高中第二十二屆班聯會製作，致力於改善校園資訊流通，讓更多人可以藉由這款系統來讓生活更簡單、便利。你可以在這裡找到學校的公告，也可以查看到學校的行事曆。快點進來看看吧！"
        />
        <meta property="og:url" content="https://app.lyhsca.org" />
        <meta property="og:site_name" content="LYHS Plus | 開啟智慧校園" />
        <meta property="og:locale" content="zh_TW" />
        <meta property="og:type" content="website" />
        <meta
          name="keywords"
          content="LYHS+, LYHS Plus, 林園高中, 林中+, 林園高中, 林園高中資訊整合平台, 智慧林中, 智慧林園高中, 林園高中班聯會, LYCA, LYCA22, LYPS"
        />
        <meta name="robots" content="index, follow" />
      </head>
      <body>
        <div id="_next">
          <Providers>{children}</Providers>
        </div>
        <GoogleTagManager />
      </body>
    </html>
  );
}
