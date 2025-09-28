import { store } from "@/store/store";
import { getDeviceInfo } from "@/utils/getDeviceInfo";
import type { AppDispatch } from "@/store/store";
import { apiService } from "@/services/api";
import {
  subscribeInfo,
  updateStatus,
  updateSystemData,
} from "@/store/systemSlice";
import { updateUserData } from "@/store/userSlice";
import { getCookie } from "./getCookie";
import { loadNews } from "@/store/newsSlice";
import { Event, updateCalendarData } from "@/store/calendar";
import * as Sentry from "@sentry/react";
import { Announcement } from "@/types";
import { format, parseISO, eachDayOfInterval } from "date-fns";

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
        // 檢查是否有訂閱資訊
        const subscribeInfoString = localStorage.getItem("lyps_subscription");
        if (subscribeInfoString) {
          try {
            const subscribeInfoData = JSON.parse(
              subscribeInfoString,
            ) as subscribeInfo;
            dispatch(
              updateSystemData({
                subscribe: {
                  status: true,
                  info: subscribeInfoData,
                },
              }),
            );
          } catch (error) {
            console.error("Failed to parse subscription info:", error);
          }
        }

        // 先載入校園網站公告
        const news = (await apiService.getNews()) as { data: Announcement[] };
        dispatch(loadNews(news.data));

        // 載入校園行事曆
        const calendarData: Event[] = await apiService.getAllEvents();
        if (calendarData) {
          const dates = new Set<string>();
          calendarData.forEach((event: Event) => {
            const eventStartDate = parseISO(event.start_time);
            const eventEndDate = parseISO(event.end_time);

            // 為事件範圍內的每一天添加日期標記
            const eventDays = eachDayOfInterval({
              start: eventStartDate,
              end: eventEndDate,
            });

            eventDays.forEach((day) => {
              dates.add(format(day, "yyyy-MM-dd"));
            });
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
        if (data) {
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
              stu_id: data.stu_id,
              number: data.number,
              isLoggedIn: true,
            }),
          );
        } else {
          document.cookie =
            "sessionId=; domain=lyhsca.org; Secure;path=/; max-age=0";
        }

        dispatch(
          updateSystemData({
            initialize: false,
            isLoading: false,
            deviceInfo: {
              os: os,
              browser: browser,
              isMobile: isMobile,
            },
          }),
        );
      } catch (error) {
        console.error("Failed to initialize LYHS+ app:", error);
        Sentry.captureException(error, { level: "fatal" });
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
