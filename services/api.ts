const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.lyhsca.org";
import { logout } from "@/store/userSlice";

import { store } from "@/store/store";
import { Announcement } from "@/types";

// 獲取系統資料的輔助函數
const getSystemData = () => store.getState().systemData;
const systemData = getSystemData();

export const apiService = {
  async getUserData(sessionId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Session-Id": sessionId,
          "Login-Type": systemData.isPwa ? "APP" : "WEB",
        },
      });

      if (response.ok) {
        const result = await response.json();
        return result.data;
      } else {
        const result = await response.json();
        throw new Error(result.error);
      }
    } catch (e) {
      console.error("Error in getUserData:", e);
      throw e;
    }
  },
  async getNews() {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/lyps/list`, {
        method: "GET",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      } else {
        const data = await response.json();
        return data as { data: Announcement[] };
      }
    } catch (error) {
      console.error("Error in getNews:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred");
    }
  },
  async Logout(sessionId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Session-Id": decodeURIComponent(decodeURIComponent(sessionId)),
          "Login-Type": systemData.isPwa ? "APP" : "WEB",
        },
      });

      if (response.ok) {
        document.cookie =
          "sessionId=; path=/; domain=lyhsca.org; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        logout();
        window.location.reload();
      } else {
        const result = await response.json();
        return { success: false, error: result.error || "Logout failed" };
      }
    } catch (error) {
      console.error("Error in Logout:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error during logout",
      };
    }
  },
  async addProject(
    name: string,
    email: string,
    type: string,
    title: string,
    description: string,
    Class: string,
    number: string,
    solution: string,
  ) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/lyps/srm/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          type: type,
          title: title,
          description: description,
          Class: Class,
          number: number,
          solution: solution,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        const result = await response.json();
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error in addProject:", error);
      throw error;
    }
  },
  async getProjectData(code: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/lyps/srm/search?code=${code}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        return result.data;
      } else {
        const result = await response.json();
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error in getData:", error);
      throw error;
    }
  },
  async getAnnouncement(
    url: string,
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void,
  ) {
    try {
      const encodedUrl = encodeURIComponent(url);
      const apiUrl = `https://plus.lyhsca.org/api/v1/adDetail?url=${encodedUrl}`;
      const response = await fetch(apiUrl, {
        method: "GET",
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        const result = await response.json();
        setError(result.error);
        setLoading(false);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error in getAnnouncement:", error);
      throw error;
    }
  },
  async getAllEvents() {
    try {
      const result = await fetch(`${API_BASE_URL}/v1/cal/events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (result.ok) {
        const events = await result.json();
        return events.data.results;
      } else {
        const error = await result.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error in getAllEvents:", error);
      throw error;
    }
  },
  async addRepair(formData: FormData) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/lyps/repair/add`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        return;
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
  async getSchoolSystemCode() {
    try {
      const res = await fetch(`${API_BASE_URL}/v1/lyps/school/validate`);
      const result = await res.json();

      return result;
    } catch (error) {
      console.error(error);
    }
  },
  async getSessionKey(
    loginId: string,
    password: string,
    captcha: string,
    JSESSIONID: string,
    SRV: string,
  ) {
    try {
      const res = await fetch(`${API_BASE_URL}/v1/lyps/school/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId: loginId,
          password: password,
          captcha: captcha,
          JSESSIONID: JSESSIONID,
          SRV: SRV,
        }),
      });

      const data = await res.json();
      return data;
    } catch (e) {
      console.error(e);
    }
  },
  async getSessionKeyByOpenId(loginId: string, password: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/v1/lyps/school/openid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: loginId,
          password: password,
        }),
      });

      const data = await res.json();
      return data;
    } catch (e) {
      console.error(e);
    }
  },
  async getSemeScore(session_key: string, jsessionId: string, srv: string) {
    try {
      const res = await fetch(
        `https://api.lyhsca.org/v1/lyps/school/semeScore`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionKey: session_key,
            jsessionId: jsessionId,
            srv: srv,
          }),
        },
      );

      const result = await res.json();
      return result;
    } catch (e) {
      console.error(e);
    }
  },
  async getYearScore(session_key: string, jsessionId: string, srv: string) {
    try {
      const res = await fetch(
        `https://api.lyhsca.org/v1/lyps/school/yearScore`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionKey: session_key,
            jsessionId: jsessionId,
            srv: srv,
          }),
        },
      );

      const result = await res.json();
      return result;
    } catch (e) {
      console.error(e);
    }
  },
  async getYearData(
    session_key: string,
    jsessionId: string,
    srv: string,
    year: string,
    seme: string,
  ) {
    try {
      const res = await fetch(`https://api.lyhsca.org/v1/lyps/school/year`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionKey: session_key,
          jsessionId: jsessionId,
          srv: srv,
          year: year,
          seme: seme,
        }),
      });

      const result = await res.json();
      return result.result.dataRows;
    } catch (e) {
      console.error(e);
    }
  },
  async getScore(
    session_key: string,
    jsessionId: string,
    srv: string,
    itemId: string,
  ) {
    try {
      const res = await fetch(`https://api.lyhsca.org/v1/lyps/school/score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionKey: session_key,
          jsessionId: jsessionId,
          srv: srv,
          itemId: itemId,
        }),
      });

      const result = await res.json();
      return result;
    } catch (e) {
      console.error(e);
    }
  },
  async getAbsence(session_key: string, jsessionId: string, srv: string) {
    try {
      const res = await fetch(`https://api.lyhsca.org/v1/lyps/school/absence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionKey: session_key,
          jsessionId: jsessionId,
          srv: srv,
        }),
      });

      const result = await res.json();
      return result.result.dataRows;
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        throw new Error(e.message);
      }
      throw new Error("Unknown error while fetching absence data");
    }
  },
};
