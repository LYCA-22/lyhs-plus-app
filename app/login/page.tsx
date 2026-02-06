"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import { updatePageLoadingStatus } from "@/store/appSlice";
import {
  ArrowLeftRight,
  ArrowRight,
  CircleQuestionMark,
  Info,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
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
  const [loginType, setLoginType] = useState<"studentMember" | "lysaStaff">(
    "studentMember",
  );
  const [informText, setInformText] = useState<string>("");
  const [account, setAccount] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();
  const [rememberAccount, setRememberAccount] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const storedAccount = localStorage.getItem("lyps_staff_account");
    if (storedAccount !== null) {
      setRememberAccount(true);
      setAccount(storedAccount);
    }
  }, []);

  const handleStaffLogin = async () => {
    dispatch(updatePageLoadingStatus(true));
    try {
      if (!account || !password) {
        setError("帳號或密碼未填寫");
        dispatch(updatePageLoadingStatus(false));
        return;
      }

      if (rememberAccount) {
        localStorage.setItem("lyps_staff_account", account);
      }
      const staffLoginUrl = `${API_BASE_URL}/v1/auth/login`;
      const staffLogin = new apiFetch(staffLoginUrl);

      const data = await staffLogin.POST({
        email: `${account}@ms.ly.kh.edu.tw`,
        password: password,
      });

      document.cookie = `lyps_access_token=${data.access_token}; path=/; expires=${new Date(Date.now() + data.expires_in * 1000).toUTCString()}; SameSite=Strict; Secure`;
      document.cookie = `lyps_refresh_token=${data.refresh_token}; path=/; expires=${new Date(Date.now() + data.refresh_expires_in * 1000).toUTCString()}; SameSite=Strict; Secure`;
      window.location.href = "/";
    } catch (e) {
      console.error(e);
      setError("登入錯誤");
    } finally {
      dispatch(updatePageLoadingStatus(false));
    }
  };

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

  return (
    <div className="h-dvh flex flex-col bg-sky-50 dark:bg-sky-950">
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
          src="/icon_with_text.svg"
          width={230}
          height={100}
          className="dark:invert"
        />
        <p className="opacity-60 text-[15px]">
          Creating infinite possibilities
        </p>
        <div className="absolute left-0 bottom-5 px-5 w-full">
          <div className="bg-background rounded-2xl w-full p-3 px-4 text-sm flex items-center gap-2">
            <Info size={18} />
            <p>您必須先登入才能使用此應用程式。</p>
          </div>
        </div>
      </div>
      <div className="p-5 px-7 rounded-t-[35px] grow bg-background z-10 shadow-lg shadow-zinc-500">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium">登入帳號</h1>
          <div className="bg-hoverbg rounded-xl p-1 flex items-center text-[14px]">
            <button
              onClick={() => setLoginType("studentMember")}
              className={`p-1 px-2 rounded-lg ${loginType === "studentMember" ? "bg-background " : ""}`}
            >
              一般登入
            </button>
            <button
              onClick={() => setLoginType("lysaStaff")}
              className={`p-1 px-2 rounded-lg ${loginType === "lysaStaff" ? "bg-background " : ""}`}
            >
              管理員登入
            </button>
          </div>
        </div>
        {loginType === "studentMember" ? (
          <div className="p-5 px-2 pt-7 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-sky-50 dark:from-sky-950 to-background rounded-2xl mt-5">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                width={40}
                height={40}
                className="fill-sky-500"
              >
                <path d="M564 325.8C564 467.3 467.1 568 324 568C186.8 568 76 457.2 76 320C76 182.8 186.8 72 324 72C390.8 72 447 96.5 490.3 136.9L422.8 201.8C334.5 116.6 170.3 180.6 170.3 320C170.3 406.5 239.4 476.6 324 476.6C422.2 476.6 459 406.2 464.8 369.7L324 369.7L324 284.4L560.1 284.4C562.4 297.1 564 309.3 564 325.8z" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="font-medium text-lg">Google 帳號登入</h2>
              <p className="opacity-50 text-sm">此登入方式支援學生與管理員</p>
            </div>
            <div className="flex border border-border dark:border-zinc-700 rounded-2xl p-2 items-center gap-2 text-sm w-full">
              <Info size={20} className="w-10" />
              只能使用林園高中頒發給您的帳號登入，請勿選擇個人帳號。
            </div>
            <div className="flex items-center justify-between w-full gap-3">
              <button
                type="button"
                onClick={() => setLoginType("lysaStaff")}
                className="font-medium rounded-xl bg-buttonBg dark:bg-zinc-700 text-center p-3 py-2 w-full hover:opacity-60 transition-all active:scale-95"
              >
                管理員登入
              </button>
              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                className="font-medium rounded-xl bg-sky-600 text-center p-3 py-2 text-white w-full hover:opacity-90 transition-all active:scale-95"
              >
                下一步
              </button>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-center gap-3 relative">
              <Input
                placeholder="帳號"
                type="email"
                className={`p-4 py-3 text-[14px] ${error ? "border border-red-500 focus:border-0" : ""}`}
                required
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              />
              <p>@ms.ly.kh.edu.tw</p>
            </div>
            <div className="flex items-center justify-center gap-3 relative">
              <Input
                placeholder="密碼"
                type="password"
                className={`p-4 py-3 text-[14px] ${error ? "border border-red-500 focus:border-0" : ""}`}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={() => handleStaffLogin()}
                className="bg-sky-600 text-white px-4 py-3 rounded-xl w-16 h-full"
              >
                <ArrowRight />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="toggle-checkbox"
                name="toggle-checkbox"
                checked={rememberAccount}
                onCheckedChange={() => setRememberAccount(!rememberAccount)}
              />
              <label
                htmlFor="toggle-checkbox"
                className="cursor-pointer text-sm"
              >
                記住我的帳號
              </label>
            </div>
            <div>{error && <p className="text-red-500">{error}</p>}</div>
            <div className="text-sm space-y-2">
              <p className="opacity-50">請使用學校帳密以管理員身份進行登入。</p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setLoginType("studentMember");
                  }}
                  className="flex items-center gap-1 font-medium text-sky-600"
                >
                  <ArrowLeftRight size={18} />
                  <p>一般登入</p>
                </button>
                <button
                  onClick={() => {
                    setInformText("請聯絡學生會請求重設。");
                    setTimeout(() => setInformText(""), 3000);
                  }}
                  className="flex items-center gap-1 font-medium text-sky-600"
                >
                  <CircleQuestionMark size={18} />
                  <p>忘記帳密</p>
                </button>
                <button
                  onClick={() => {
                    setInformText("請聯絡資訊組申辦帳號。");
                    setTimeout(() => setInformText(""), 3000);
                  }}
                  className="flex items-center gap-1 font-medium text-sky-600"
                >
                  <CircleQuestionMark size={18} />
                  <p>註冊管理員帳號</p>
                </button>
              </div>
              <p className="opacity-50">2026 © 林園高中學生會版權所有</p>
            </div>
          </div>
        )}
        <div
          className={`fixed bottom-0 left-0 w-full p-10 flex items-center justify-center ${informText ? "opacity-100 scale-100" : "opacity-0 scale-0"} transition-all`}
        >
          <div
            className={`p-3 rounded-xl bg-zinc-800 flex items-center gap-2 text-white shadow-xl transition-all`}
          >
            <Info size={20} />
            {informText}
          </div>
        </div>
      </div>
    </div>
  );
}
