import type { AppDispatch } from "@/store/store";
import { apiService } from "@/services/api";
import { updateStatus, updateSystemData } from "@/store/systemSlice";
import { updateUserData } from "@/store/userSlice";
import { homeApps } from "@/types";

function getCookie(name: string) {
  if (typeof window === "undefined") return null;

  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const lastPart = parts.pop();
      return lastPart?.split(";")[0] ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

export async function checkUserSession(
  dispatch: AppDispatch,
  os: string,
  browser: string,
  isMobile: boolean,
) {
  const end = localStorage.getItem("lyps_used");
  const homeApps = localStorage.getItem("lyps_homeApps");
  const apps: homeApps[] = homeApps
    ? JSON.parse(homeApps)
    : [
        "eSchool",
        "studyHistory",
        "schoolWeb",
        "mailBox",
        "mailSearch",
        "calendar",
      ];
  const used = end === "true" ? true : false;

  if (!used) {
    localStorage.setItem("lyps_homeApps", JSON.stringify(apps));
  }

  try {
    dispatch({ type: "systemStatus/setLoading", payload: true });
    const sessionId = getCookie("sessionId");

    if (!sessionId) {
      setTimeout(() => {
        dispatch(updateStatus(false));
      }, 500);
      return;
    }

    const data = await apiService.getUserData(sessionId);
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
  } catch (error) {
    console.error("Failed to check user:", error);
  } finally {
    setTimeout(() => {
      dispatch(
        updateSystemData({
          isLoading: false,
          os: os,
          browser: browser,
          isMobile: isMobile,
          used: used,
          homeApps: apps,
        }),
      );
    }, 1000);
  }
}
