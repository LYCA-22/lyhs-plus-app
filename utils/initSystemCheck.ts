import { store } from "@/store/store";
import { getDeviceInfo } from "@/utils/getDeviceInfo";
import type { AppDispatch } from "@/store/store";
import { apiService } from "@/services/api";
import { updateStatus, updateSystemData } from "@/store/systemSlice";
import { updateUserData } from "@/store/userSlice";
import { getCookie } from "./getCookie";
import { loadNews } from "@/store/newsSlice";
import { Event, updateCalendarData } from "@/store/calendar";
import * as Sentry from "@sentry/react";

export async function systemLoad(
  dispatch: AppDispatch,
  os: string,
  browser: string,
  isMobile: boolean,
) {
  await Sentry.startSpan(
    {
      name: "App System Load",
      op: "initSystemCheck",
    },
    async () => {
      try {
        // 先載入校園網站公告
        const news = await apiService.getNews();
        dispatch(loadNews(news.data));

        // 檢查是否有訂閱資訊
        const subscribeInfo = localStorage.getItem(
          "lyps_subscription",
        ) as unknown as [];
        if (subscribeInfo) {
          dispatch(
            updateSystemData({
              isSubscribe: true,
              subscribe: subscribeInfo,
            }),
          );
        }

        // 載入校園行事曆
        const calendarData: Event[] = await apiService.getAllEvents();
        if (calendarData) {
          const dates = new Set<string>();
          calendarData.forEach((event: Event) => {
            dates.add(event.date);
          });
          dispatch(
            updateCalendarData({
              events: calendarData,
              dateWithEvents: dates,
            }),
          );
        }

        // 檢查用戶登入狀態
        const sessionId = getCookie("sessionId");
        if (!sessionId) {
          dispatch(updateStatus(false));
          return;
        }
        const decoded = decodeURIComponent(sessionId);
        const data = await apiService.getUserData(decodeURIComponent(decoded));
        dispatch(
          updateUserData({
            sessionId: sessionId,
            id: data.id,
            name: data.name,
            email: data.email,
            level: data.level,
            type: data.type,
            role: data.role,
            grade: data.grade,
            class: data.class,
            isLoggedIn: true,
          }),
        );

        dispatch(
          updateSystemData({
            initialize: false,
            isLoading: false,
            os: os,
            browser: browser,
            isMobile: isMobile,
          }),
        );
      } catch (error) {
        console.error("Failed to initialize LYHS+ app:", error);
        Sentry.captureException(error, { level: "fatal" });
        throw error;
      }
    },
  );
}

export function SystemCheck() {
  const isMobile = window.matchMedia("(max-width: 640px)").matches;
  const { os, browser } = getDeviceInfo();
  systemLoad(store.dispatch, os, browser, isMobile);

  // 設置應用程式版本
  const version = process.env.NEXT_PUBLIC_APP_VERSION;
  if (version) {
    localStorage.setItem("lyps_ver", version);
  }
}
