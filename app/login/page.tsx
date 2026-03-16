"use client";
import { updatePageLoadingStatus } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import Image from "next/image";
import { useDispatch } from "react-redux";

interface googleApiParams {
  [key: string]: string | undefined;
  client_id: string | undefined;
  redirect_uri: string;
  response_type: string;
  scope: string;
  state?: string;
}

export default function LoginPage() {
  const dispatch = useDispatch();
  const AppData = useAppSelector((state) => state.appStatus);

  const handleGoogleLogin = () => {
    dispatch(updatePageLoadingStatus(true));
    try {
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth`;
      const GoogleredirectUri = `${window.location.origin}/login/oauth/google/callback`;

      const params: googleApiParams = {
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        redirect_uri: GoogleredirectUri,
        response_type: "code",
        scope: "https://www.googleapis.com/auth/userinfo.email openid",
        hd: "ms.ly.kh.edu.tw",
        prompt: "select_account",
      };

      const queryString = new URLSearchParams(
        params as Record<string, string>,
      ).toString();
      window.location.href = `${googleAuthUrl}?${queryString}`;
    } catch (e) {
      console.error(e);
      dispatch(updatePageLoadingStatus(false));
    }
  };

  const handleGoogleReg = () => {
    dispatch(updatePageLoadingStatus(true));
    try {
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth`;
      const GoogleredirectUri = `${window.location.origin}/login/oauth/google/callback/reg`;

      const params: googleApiParams = {
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        redirect_uri: GoogleredirectUri,
        response_type: "code",
        scope:
          "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        hd: "ms.ly.kh.edu.tw",
        prompt: "select_account",
      };

      const queryString = new URLSearchParams(
        params as Record<string, string>,
      ).toString();
      window.location.href = `${googleAuthUrl}?${queryString}`;
    } catch (e) {
      console.error(e);
      dispatch(updatePageLoadingStatus(false));
    }
  };

  return (
    <div
      className={`h-dvh flex flex-col justify-between bg-gradient-to-br from-sky-50 dark:from-sky-950 to-background ${AppData.device_info.operate_type === "PWA" ? "pt-12" : ""}`}
    >
      <div className="p-8 space-y-4">
        <Image
          alt="logo"
          src="/assets/logo.svg"
          width={50}
          height={50}
          className="dark:invert"
        />
        <h1 className="text-3xl font-bold font-custom ml-1">
          歡迎使用 LYHS Plus
        </h1>
        <p className="ml-1 opacity-50">請先登入帳號才可以進入 APP</p>
      </div>
      <div className="p-10 space-y-4">
        <button
          onClick={handleGoogleLogin}
          className="w-full text-lg rounded-full p-2.5 bg-primary text-background font-medium active:scale-95 transition-all"
        >
          登入
        </button>
        <button
          onClick={handleGoogleReg}
          className="w-full text-lg rounded-full p-2.5 bg-buttonBg dark:bg-zinc-700 font-medium active:scale-95 transition-all"
        >
          註冊
        </button>
      </div>
    </div>
  );
}
