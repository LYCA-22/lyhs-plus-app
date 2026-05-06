"use client";
import { updatePageLoadingStatus } from "@/store/appSlice";
import { ArrowRight, FaceWink } from "@untitledui/icons";
import Image from "next/image";
import { useDispatch } from "react-redux";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
    <div className={`h-dvh flex justify-center items-center bg-background`}>
      <div className="w-full pb-20">
        <div className="p-8 flex flex-col justify-center items-center">
          <Image
            alt="logo"
            src="/assets/logo.svg"
            width={50}
            height={50}
            className="dark:invert pb-5"
          />
          <h1 className="text-3xl pb-6 flex items-center gap-2">
            歡迎
            <FaceWink />
          </h1>
          <h3 className="font-medium text-lg opacity-60">
            學生會製作，旨在建立便利校園生活
          </h3>
          <p className="opacity-30">請點擊下面按鈕，進一步使用我們的系統</p>
        </div>
        <div className="px-10 flex items-center gap-4 whitespace-nowrap w-full">
          <button
            onClick={handleGoogleLogin}
            className="w-full text-lg rounded-[18px] p-2.5 bg-primary text-background font-medium active:scale-95 transition-all"
          >
            登入
          </button>
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full text-lg rounded-[18px] p-2.5 border dark:bg-zinc-700 font-medium active:scale-95 transition-all">
                註冊
              </button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2 rounded-[18px] items-start w-fit">
              <button
                onClick={handleGoogleReg}
                className="flex items-center gap-4"
              >
                學生帳號
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => window.alert("此身份別暫不開放。")}
                className="flex items-center gap-4 border-t pt-2"
              >
                教職員帳號
                <ArrowRight size={20} />
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="w-full fixed bottom-0 bg-buttonBg p-4 opacity-60">
        <h3 className="font-medium text-sm">
          Copyright © 2026 LYSA. All rights reserved.
        </h3>
        <p className="opacity-60 text-sm">
          此網頁應用程式由林園高中學生會營運與維護。
        </p>
      </div>
    </div>
  );
}
