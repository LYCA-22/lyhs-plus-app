const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { logout } from "@/store/userSlice";

export const apiService = {
  // 使用者登入
  async userLogin(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/userLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const sessionId = result.sessionId;
        document.cookie = `sessionId=${sessionId}; path=/; domain=lyhsca.org; Secure; SameSite=Strict; max-age=172800`;
      } else {
        const result = await response.json();
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error in userLogin:", error);
      throw error;
    }
  },
  async getUserData(sessionId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/veritySession`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        return result;
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
      const response = await fetch(`${API_BASE_URL}/getAD`, {
        method: "GET",
      });

      if (response.ok) {
        // 获取响应的 HTML 内容
        const data = await response.text(); // 获取HTML内容（字符串）

        // 获取要插入的 DOM 元素
        const contentElement = document.getElementById("announcement-content");
        if (contentElement) {
          // 使用 innerHTML 将 HTML 内容插入到页面
          contentElement.innerHTML = data;
        } else {
          console.error('Element with id "announcement-content" not found');
        }
      } else {
        const result = await response.json();
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error in getNews:", error);
      throw error;
    }
  },
  async getWeatherInfo() {
    try {
      const API_KEY = "CWA-C2C5DCE1-4A66-4FE8-9918-CA244456227F";

      const response = await fetch(
        `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=${API_KEY}&format=JSON&StationName=%E6%9E%97%E5%9C%92`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const weatherElement = data?.records?.Station?.[0]?.WeatherElement;
      console.log("WeatherElement:", weatherElement);

      let weatherData = {};

      if (Array.isArray(weatherElement)) {
        weatherData = weatherElement.reduce((acc, el) => {
          acc[el.elementName] = el.elementValue;
          return acc;
        }, {});
      } else if (
        typeof weatherElement === "object" &&
        weatherElement !== null
      ) {
        weatherData = weatherElement;
      }
      return weatherData;
    } catch (err) {
      console.error("Error details:", err);
    }
  },
  async Logout(sessionId: string, email: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          sessionId: sessionId,
        }),
      });

      if (response.ok) {
        document.cookie =
          "sessionId=; path=/; domain=lyhsca.org; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        logout();
        window.location.reload();
      } else {
        const result = await response.json();
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error in Logout:", error);
      throw error;
    }
  },
};
