import { API_BASE_URL } from "./config";

export class SystemApiService {
  static async checkBackendStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/status`, {
        credentials: "include",
      });
      return response.ok;
    } catch (error) {
      console.error("Error checking backend status:", error);
      return false;
    }
  }
}
