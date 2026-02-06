import { setAppError } from "@/store/appSlice";
import { store } from "@/store/store";

interface apiError {
  status: number;
  code: string;
  message: string;
  detail?: string;
}

export const API_BASE_URL = "https://lyhs-app-backend.lysa23.workers.dev";

export class apiFetch {
  private url: string;
  private cookies: string;

  constructor(url: string, cookies?: string) {
    this.url = url;
    this.cookies = cookies ? cookies : "";
  }

  public async GET(access_token?: string) {
    try {
      const response = await fetch(this.url, {
        method: "GET",
        headers: {
          Authorization: access_token ? `Bearer ${access_token}` : "",
          Cookie: this.cookies ? this.cookies : "",
        },
      });

      if (!response.ok) {
        const errorData = (await response.json()) as apiError;

        store.dispatch(
          setAppError({
            type: "server",
            status: errorData.status,
            code: errorData.code,
            message: errorData.message,
            detail: errorData.detail,
          }),
        );

        throw Error(
          `HTTP error! status: ${response.status}, code: ${errorData.code}, message: ${errorData.message}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  }

  public async POST(fetchBody: unknown) {
    try {
      const response = await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: this.cookies ? this.cookies : "",
        },
        body: JSON.stringify(fetchBody),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as apiError;

        // 更新錯誤資料
        store.dispatch(
          setAppError({
            type: "server",
            status: errorData.status,
            code: errorData.code,
            message: errorData.message,
            detail: errorData.detail,
          }),
        );

        console.error(
          `HTTP error! status: ${response.status}, code: ${errorData.code}, message: ${errorData.message}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error putting data:", error);
      throw error;
    }
  }

  public async PUT(fetchBody: JSON) {
    try {
      const response = await fetch(this.url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: this.cookies ? this.cookies : "",
        },
        body: JSON.stringify(fetchBody),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as apiError;

        // 更新錯誤資料
        setAppError({
          type: "server",
          status: errorData.status,
          code: errorData.code,
          message: errorData.message,
          detail: errorData.detail,
        });

        console.error(
          `HTTP error! status: ${response.status}, code: ${errorData.code}, message: ${errorData.message}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error putting data:", error);
      throw error;
    }
  }

  public async DELETE() {
    try {
      const response = await fetch(this.url, {
        method: "DELETE",
        headers: {
          Cookie: this.cookies ? this.cookies : "",
        },
      });

      if (!response.ok) {
        const errorData = (await response.json()) as apiError;

        // 更新錯誤資料
        setAppError({
          type: "server",
          status: errorData.status,
          code: errorData.code,
          message: errorData.message,
          detail: errorData.detail,
        });

        console.error(
          `HTTP error! status: ${response.status}, code: ${errorData.code}, message: ${errorData.message}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting data:", error);
      throw error;
    }
  }
}
