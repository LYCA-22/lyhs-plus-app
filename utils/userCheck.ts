import type { AppDispatch } from "@/store/store";
import { apiService } from "@/services/api";
import { updateStatus } from "@/store/systemSlice";
import { updateUserData } from "@/store/userSlice";

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

    const data = await apiService.getUserData(sessionId);
    dispatch(
      updateUserData({
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
      dispatch(updateStatus(false));
    }, 1000);
  }
}
