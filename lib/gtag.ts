// lib/gtag.ts
export const GA_TRACKING_ID = "G-NS0LEV3L76";

interface GTagEvent {
  action: string;
  category: string;
  label: string;
  value?: number;
}

interface PageviewParams {
  page_path: string;
  [key: string]: string | number | boolean | null | undefined;
}

interface EventParams {
  event_category: string;
  event_label: string;
  value?: number;
  [key: string]: string | number | boolean | null | undefined;
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  } as PageviewParams);
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  } as EventParams);
};

// 添加更精確的 TypeScript 類型定義
declare global {
  interface Window {
    gtag: (
      command: "config" | "event",
      targetId: string,
      config?: PageviewParams | EventParams,
    ) => void;
  }
}
