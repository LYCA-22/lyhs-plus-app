"use client";
import { GA_TRACKING_ID } from "@/lib/gtag";
import Script from "next/script";
import { useEffect, useState } from "react";

export function Head() {
  const [theme, setTheme] = useState<string>("");

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
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="application-name" content="LYHS+" />
      <meta name="apple-mobile-web-app-title" content="LYHS+" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      {theme === "light" ? (
        <meta name="theme-color" content="#ffffff" />
      ) : (
        <meta name="theme-color" content="#27272A" />
      )}
      <link rel="apple-touch-icon" href="/icon-192x192.png" />
      <meta name="apple-touch-fullscreen" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
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
