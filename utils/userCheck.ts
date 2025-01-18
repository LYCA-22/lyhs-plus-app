import type { AppDispatch } from "@/store/store";
import { apiService } from "@/services/api";
import { updateStatus } from "@/store/systemSlice";

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

export async function checkUserSession(dispatch: AppDispatch) {
  try {
    dispatch({ type: "systemStatus/setLoading", payload: true });
    const sessionId = getCookie("sessionId");

    if (!sessionId) {
      setTimeout(() => {
        dispatch(updateStatus(false));
      }, 500);
      return;
    }

    const userData = await apiService.getUserData(sessionId);
    dispatch({ type: "user/setUserData", payload: userData });
  } catch (error) {
    console.error("Failed to check user:", error);
  } finally {
    dispatch(updateStatus(true));
  }
}
