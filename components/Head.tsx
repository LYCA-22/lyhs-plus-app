"use client";
import { GA_TRACKING_ID } from "@/lib/gtag";
import Script from "next/script";
import { useEffect, useState } from "react";

export function Head() {
  const [theme, setTheme] = useState<string>("");
  const [windowOpen, setWindowOpen] = useState<boolean>(false);
  const [themeColor, setThemeColor] = useState<string>("#ffffff");

  useEffect(() => {
    const html = document.querySelector("html");
    const observer = new MutationObserver(() => {
      if (html?.classList.contains("dark")) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    });

    observer.observe(html!, { attributes: true });

    if (html?.classList.contains("dark")) {
      setTheme("dark");
    } else {
      setTheme("light");
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "Open") {
        setWindowOpen(true);
      } else if (event.data.type === "Close") {
        setWindowOpen(false);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (windowOpen) {
      if (theme === "dark") {
        setThemeColor("#080808");
      } else {
        setThemeColor("#333333");
      }
    } else {
      setThemeColor(theme === "dark" ? "#27272A" : "#ffffff");
    }
  }, [windowOpen, theme]);

  return (
    <head>
      <link rel="manifest" href="/manifest.json" />
      <link
        rel="apple-touch-startup-image"
        media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
        href="/splash/iPhone_12_Pro.png"
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="application-name" content="LYHS+" />
      <meta name="apple-mobile-web-app-title" content="LYHS+" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content={themeColor} />
      <link rel="apple-touch-icon" href="/icon-192x192.png" />
      <meta name="apple-touch-fullscreen" content="yes" />
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
        }}
      />
    </head>
  );
}
