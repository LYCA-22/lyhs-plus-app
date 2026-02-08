"use client";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/services/apiClass";
import { TriangleAlert } from "lucide-react";
import Image from "next/image";
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
    <div className="min-h-dvh flex flex-col bg-sky-50 dark:bg-background">
      <div className="p-10 space-y-2 py-20 relative">
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "[mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]",
          )}
        />
        <Image
          alt="logo"
          src="/assets/icon_with_text.svg"
          width={230}
          height={100}
          className="dark:invert"
        />
        <p className="opacity-60 text-[15px]">
          Creating infinite possibilities
        </p>
      </div>
      <div className="p-5 px-7 rounded-t-[35px] grow bg-background dark:bg-blue-300/10 z-10 shadow-lg shadow-zinc-500">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium">Google 登入</h1>
        </div>
        <div className="mt-5 w-full h-full flex flex-col items-center justify-center gap-2 p-10 px-8 bg-hoverbg dark:bg-sky-300/10 rounded-2xl">
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
            <div className="flex flex-col items-center justify-center">
              <Spinner className="m-5" />
              <p className="font-medium text-lg">登入中，請稍候</p>
              <p>正在獲取您的 Google 帳號資料</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
