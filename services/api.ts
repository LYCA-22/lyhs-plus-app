const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { logout } from "@/store/userSlice";
import { getDocsFromCollection } from "./Firebase";

export const apiService = {
  async getUserData(sessionId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
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

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const result = await response.json();
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error in getNews:", error);
      throw error;
    }
  },
  async Logout(sessionId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
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
  async getProposal() {
    console.log("執行測試任務中。");
    try {
      const response = await getDocsFromCollection("政見進度");
      console.log("測試任務結束。");
      return response;
    } catch (error) {
      console.error("Error in getDocs:", error);
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
      const apiUrl = `https://plus.lyhsca.org/api/v1/getAdDetail?url=${encodedUrl}`;
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
};
