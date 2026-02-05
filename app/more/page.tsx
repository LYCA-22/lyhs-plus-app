"use client";
import { appSchema } from "@/app/more/schema";
import { apiService } from "@/services/api";
import { updatePageLoadingStatus } from "@/store/appSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { schemaItem } from "@/types";
import { ChevronRight, CircleUser, Info, LogOut } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const userData = useAppSelector((state) => state.userData);
  const AppData = useAppSelector((state) => state.appStatus);
  const version = process.env.NEXT_PUBLIC_APP_VERSION;
  const gitHash = process.env.NEXT_PUBLIC_GIT_HASH;
  const dispatch = useAppDispatch();

  const renderItem = (item: schemaItem) => {
    if (item.access_manage && userData.role !== "lysaStaff") {
      return null;
    }

    if (item.userCheck && !AppData.user_logged && item.type === "btn") {
      return null;
    }

    const title = item.userCheck
      ? AppData.user_logged
        ? item.title
        : item.title2
      : item.title;

    const href = item.userCheck
      ? AppData.user_logged
        ? item.href
        : item.href2
      : item.href;

    const commonClasses = "flex items-center justify-between text-lg py-3";

    switch (item.type) {
      case "component":
        return (
          <div className={commonClasses}>
            <div className="flex items-center gap-3">
              {item.itemIcon}
              <p>{item.title}</p>
            </div>
            {item.component}
          </div>
        );
      case "btn":
        return (
          <button className={`${commonClasses} w-full text-left`}>
            <div className="flex items-center gap-3">
              {item.itemIcon}
              <p>{title}</p>
            </div>
            <div className="opacity-40">{item.icon && item.icon}</div>
          </button>
        );
      case "link":
        return (
          <Link
            href={href || ""}
            target={item.isOutLink ? "_blank" : "_self"}
            className={commonClasses}
          >
            <div className="flex items-center gap-3">
              {item.itemIcon}
              <p>{title}</p>
            </div>
            <div className="opacity-40">{item.icon && item.icon}</div>
          </Link>
        );
    }
  };

  const Logout = async (sessionId: string) => {
    try {
      dispatch(updatePageLoadingStatus(true));
      await apiService.Logout(sessionId);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        dispatch(updatePageLoadingStatus(false));
      }, 500);
    }
  };

  return (
    <div
      className={`relative min-h-dvh pb-32 ${AppData.device_info.operate_type === "PWA" ? "pt-deviceTop" : "pt-5"}`}
    >
      <div>
        <h1 className="text-3xl font-custom mx-6 mt-4">更多</h1>
      </div>
      <div className={`mx-6 pb-6 flex flex-col`}>
        {!userData.display_name ? (
          <>
            <p className="text-lg opacity-50">登入享用完整服務</p>
            <div className="flex items-center justify-evenly relative gap-2 w-full mt-4">
              <Link
                href={`https://auth.lyhsca.org/account/login?redirect_url=https://app.lyhsca.org&lgt=${AppData.device_info.operate_type === "PWA" ? "APP" : "WEB"}`}
                className="p-3 bg-zinc-900 dark:bg-zinc-200 w-full text-background rounded-[30px] active:scale-90 font-custom transition-all flex items-center justify-center font-medium"
              >
                登入 Login
              </Link>
              <Link
                href="https://auth.lyhsca.org/account/register"
                className="p-3 bg-zinc-200 dark:bg-zinc-800 w-full text-foreground rounded-[30px] active:scale-90 font-custom transition-all flex items-center justify-center font-medium"
              >
                註冊 Register
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-col pt-5 mt-5 border-t border-t-borderColor">
            <li className="flex flex-col transition-all px-4 font-custom font-medium">
              <div className="flex items-center justify-between py-3 hover:opacity-60 transition-all text-xl">
                {userData.display_name || "發生錯誤"}
              </div>
            </li>
            <li className="flex flex-col px-4 transition-all rounded-[30px] hover:bg-hoverbg">
              <Link
                href={"/mylyps"}
                className="flex items-center justify-between py-3 text-lg"
              >
                <div className="flex items-center gap-3">
                  <CircleUser size={24} strokeWidth={2} />
                  管理我的帳號
                </div>
                <ChevronRight
                  className="opacity-40"
                  size={22}
                  strokeWidth={2.5}
                />
              </Link>
            </li>
          </div>
        )}
      </div>

      <ul className="list-none flex flex-col p-2 bg-hoverbg rounded-3xl mx-6">
        {appSchema.map((item, index) => (
          <li
            key={index}
            className="flex flex-col transition-all rounded-2xl hover:bg-buttonBg px-4"
          >
            {renderItem(item)}
          </li>
        ))}
        {userData.display_name && (
          <li className="flex flex-col transition-all rounded-2xl text-red-500 hover:bg-buttonBg px-4">
            <button className="flex items-center justify-between text-lg py-3">
              <div className="flex gap-3 items-center">
                <LogOut size={24} strokeWidth={2} />
                <div className="flex items-center gap-3">登出帳號</div>
              </div>
              <ChevronRight size={22} strokeWidth={2} />
            </button>
          </li>
        )}
      </ul>
      <ul className="list-none flex flex-col py-4 border-b border-b-borderColor mx-6">
        <li className="flex justify-between px-4 py-3 text-lg font-custom">
          <div className="items-center flex gap-3">
            <Info size={24} strokeWidth={2} />
            <h1>版本資訊</h1>
          </div>
          <p className="opacity-50">
            {version} ({gitHash})
          </p>
        </li>
      </ul>
      <div className="flex flex-col justify-center m-6 mx-8 my-6 gap-2">
        <div>
          <p className="text-sm opacity-40 font-normal">
            本平台由林園高中學生會資訊組建置與維護
          </p>
          <h1 className="opacity-40 font-custom text-[14px]">
            Copyright © 2024 - 2025 LYSA.
          </h1>
        </div>
      </div>
    </div>
  );
}
