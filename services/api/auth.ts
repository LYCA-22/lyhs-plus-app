import { API_BASE_URL } from "./config";

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export class AuthApiService {
  static async userLogin(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const result = (await response.json()) as LoginResponse;
      localStorage.setItem("lyps_auth_access_token", result.access_token);
      localStorage.setItem("lyps_auth_refresh_token", result.refresh_token);
    } catch (error) {
      console.error("Error logging in:", error);
      return false;
    }
  }
}
