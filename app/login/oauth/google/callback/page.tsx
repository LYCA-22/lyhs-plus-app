"use client";
import { apiFetch } from "@/services/apiClass";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function GoogleApiCallBackPage() {
  const [error, setError] = useState<boolean>(false);
  useEffect(() => {
    const handleCallback = async () => {
      const Url = new URL(window.location.href);
      const params = Url.searchParams;

      // 獲取相關資訊
      const authCode = params.get("code");
      const googleUserDateApiUrl =
        "https://lyhs-app-backend.lysa23.workers.dev/v1/auth/googleLogin";
      const googleUserDataApi = new apiFetch(googleUserDateApiUrl);
      const fetchBody = {
        flow: "authorization_code",
        grant_value: authCode,
        redirect_url: window.location.origin + "/login/oauth/google/callback",
      };

      try {
        if (authCode) {
          const data = await googleUserDataApi.POST(fetchBody);
          document.cookie = `lyps_access_token=${data.access_token}; path=/; expires=${new Date(Date.now() + data.expires_in * 1000).toUTCString()}; SameSite=Strict; Secure`;
          document.cookie = `lyps_refresh_token=${data.refresh_token}; path=/; expires=${new Date(Date.now() + data.refresh_expires_in * 1000).toUTCString()}; SameSite=Strict; Secure`;
          window.location.href = "/";
        } else {
          setError(true);
        }
      } catch (e) {
        console.error(e);
        setError(true);
      }
    };

    setTimeout(() => handleCallback(), 5000);
  }, []);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center">
      {error ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <TriangleAlert />
          <p className="font-medium text-lg">伺服器發生錯誤，無法登入</p>
          <Link
            href={"/"}
            className="bg-buttonBg p-2 px-5 font-medium flex items-center justify-center w-full rounded-xl"
          >
            重新登入
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-6 h-6 rounded-full border-[3px] border-buttonBg border-t-primary dark:border-t-white animate-spin"></div>
          <p className="font-medium text-lg">登入中</p>
        </div>
      )}
    </div>
  );
}
