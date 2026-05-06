import { setAppError } from "@/store/appSlice";
import { store } from "@/store/store";

interface apiError {
  status: number;
  code: string;
  message: string;
  detail?: string;
}

export const API_BASE_URL = "https://api.lyhssa.org";

export class apiFetch {
  private url: string;
  private cookies: string;

  constructor(url: string, cookies?: string) {
    this.url = url;
    this.cookies = cookies ? cookies : "";
  }

  private getRequestUrl(useBackendProxy: boolean) {
    if (!useBackendProxy || !this.url.startsWith(API_BASE_URL)) {
      return this.url;
    }

    const url = new URL(this.url);
    return `/api/backend${url.pathname}${url.search}`;
  }

  public async GET(access_token?: string, ksaAuthKey?: string) {
    try {
      const useBackendProxy = arguments.length > 0;
      const headers: Record<string, string> = {};

      if (access_token && !useBackendProxy) {
        headers.Authorization = `Bearer ${access_token}`;
      }

      if (ksaAuthKey) {
        headers.KsaAuthKey = ksaAuthKey;
      }

      const response = await fetch(this.getRequestUrl(useBackendProxy), {
        method: "GET",
        headers,
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

  public async POST(
    fetchBody: unknown | FormData,
    isformData?: boolean,
    access_token?: string,
  ) {
    try {
      const useBackendProxy = arguments.length >= 3;
      const headers: Record<string, string> = {};

      if (this.cookies) {
        headers.Cookie = this.cookies;
      }

      if (access_token && !useBackendProxy) {
        headers.Authorization = `Bearer ${access_token}`;
      }

      if (!isformData) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(this.getRequestUrl(useBackendProxy), {
        method: "POST",
        headers,
        body: isformData ? (fetchBody as FormData) : JSON.stringify(fetchBody),
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

  public async PUT(access_token?: string, fetchBody?: unknown) {
    try {
      const useBackendProxy = arguments.length >= 1;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (this.cookies) {
        headers.Cookie = this.cookies;
      }

      if (access_token && !useBackendProxy) {
        headers.Authorization = `Bearer ${access_token}`;
      }

      const response = await fetch(this.getRequestUrl(useBackendProxy), {
        method: "PUT",
        headers,
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

  public async DELETE(access_token?: string) {
    try {
      const useBackendProxy = arguments.length >= 1;
      const headers: Record<string, string> = {};

      if (this.cookies) {
        headers.Cookie = this.cookies;
      }

      if (access_token && !useBackendProxy) {
        headers.Authorization = `Bearer ${access_token}`;
      }

      const response = await fetch(this.getRequestUrl(useBackendProxy), {
        method: "DELETE",
        headers,
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
