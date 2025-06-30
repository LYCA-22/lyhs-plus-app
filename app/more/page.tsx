"use client";
import { appSchema } from "@/components/settings/schema";
import { apiService } from "@/services/api";
import { useAppSelector } from "@/store/hook";
import { schemaItem } from "@/types";
import { ChevronRight, CircleUser, IdCard, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const userData = useAppSelector((state) => state.userData);
  const AppData = useAppSelector((state) => state.systemData);
  const version = process.env.NEXT_PUBLIC_APP_VERSION;

  const renderItem = (item: schemaItem) => {
    if (item.access_manage && userData.type !== "staff") {
      return null;
    }

    if (item.userCheck && !userData.isLoggedIn && item.type === "btn") {
      return null;
    }

    const title = item.userCheck
      ? userData.isLoggedIn
        ? item.title
        : item.title2
      : item.title;

    const href = item.userCheck
      ? userData.isLoggedIn
        ? item.href
        : item.href2
      : item.href;

    const commonClasses =
      "flex items-center justify-between py-3 hover:opacity-60 transition-all text-lg";

    switch (item.type) {
      case "component":
        return (
          <div className={commonClasses}>
            <div className="flex items-center gap-3">
              {item.itemIcon}
              <p className="font-medium">{item.title}</p>
            </div>
            {item.component}
          </div>
        );
      case "btn":
        return (
          <button className={`${commonClasses} w-full text-left`}>
            <div className="flex items-center gap-3">
              {item.itemIcon}
              <p className="font-medium">{title}</p>
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
              <p className="font-medium">{title}</p>
            </div>
            <div className="opacity-40">{item.icon && item.icon}</div>
          </Link>
        );
    }
  };

  const Logout = async (sessionId: string) => {
    await apiService.Logout(sessionId);
  };

  return (
    <div
      className={`relative bg-zinc-100 dark:bg-zinc-800 h-dvh pb-32 border-t border-zinc-200 overflow-y-auto ${AppData.isPwa ? "pt-deviceTop" : "pt-5"}`}
    >
      <div>
        <h1 className="text-2xl font-custom mx-6 font-medium">更多</h1>
      </div>
      {!userData.name && (
        <div className="bg-white dark:to-zinc-900 m-5 p-5 rounded-[30px] px-6 flex flex-col">
          <p className="text-2xl font-medium">登入享用完整服務</p>
          <div className="flex items-center justify-evenly relative gap-5 w-full">
            <Link
              href={`https://auth.lyhsca.org/account/login?redirect_url=https://app.lyhsca.org&lgt=${AppData.isPwa ? "APP" : "WEB"}`}
              className="p-3 bg-inputPrimary w-full text-background rounded-xl active:scale-90 transition-all flex items-center justify-center font-medium mt-6 mb-2"
            >
              登入
            </Link>
            <Link
              href="https://auth.lyhsca.org/account/register"
              className="p-3 bg-zinc-200 w-full text-foreground rounded-xl active:scale-90 transition-all flex items-center justify-center font-medium mt-6 mb-2"
            >
              註冊
            </Link>
          </div>
        </div>
      )}
      <ul className="list-none flex flex-col bg-white m-5 pb-2 rounded-[30px]">
        {userData.name && (
          <>
            <li className="flex flex-col transition-all mx-7 pt-1">
              <div className="flex items-center font-medium justify-between py-3 hover:opacity-60 transition-all text-lg">
                <div className="flex items-center gap-3">
                  <IdCard size={24} strokeWidth={2.5} />
                  顯示名稱
                </div>
                <p className="opacity-50">{userData.name || "發生錯誤"}</p>
              </div>
              <div className="w-full bg-border h-[2px] rounded-full dark:bg-zinc-700 opacity-50 mt-1"></div>
            </li>
            <li className="flex flex-col transition-all mx-7 pt-1">
              <div className="flex items-center font-medium justify-between py-3 hover:opacity-60 transition-all text-lg">
                <div className="flex items-center gap-3">
                  <CircleUser size={24} strokeWidth={2.5} />
                  管理我的帳號
                </div>
                <ChevronRight
                  className="opacity-40"
                  size={22}
                  strokeWidth={2.5}
                />
              </div>
              <div className="w-full bg-border h-[2px] rounded-full dark:bg-zinc-700 opacity-50 mt-1"></div>
            </li>
          </>
        )}
        {appSchema.map((item, index) => (
          <li key={index} className="flex flex-col transition-all mx-7 pt-1">
            {renderItem(item)}
            {index < appSchema.length - 1 && (
              <div className="w-full bg-border h-[2px] rounded-full dark:bg-zinc-700 opacity-50 mt-1"></div>
            )}
          </li>
        ))}
        {userData.name && (
          <li className="flex flex-col transition-all mx-7 pt-1">
            <div className="w-full bg-border h-[2px] rounded-full dark:bg-zinc-700 opacity-50 mb-1"></div>
            <button
              onClick={() => Logout(userData.sessionId)}
              className="flex items-center font-medium justify-between py-3 hover:opacity-60 transition-all text-lg"
            >
              <div className="flex items-center gap-3">
                <LogOut size={24} strokeWidth={2.5} />
                登出帳號
              </div>
              <ChevronRight
                className="opacity-40"
                size={22}
                strokeWidth={2.5}
              />
            </button>
          </li>
        )}
      </ul>
      <div className="flex flex-col items-center m-5 mt-10 gap-2">
        <Image
          alt="LycaLogo"
          src="/lyca/lyca-logo.svg"
          width={20}
          height={20}
          className="opacity-30"
        />
        <div className="text-center">
          <h1 className="opacity-40 font-medium">林園高中學生會 版權所有</h1>
          <p className="text-sm opacity-40 font-normal">
            本平台由林園高中學生會資訊組建置與維護
          </p>
        </div>
        <div className="flex items-center justify-center font-custom text-sm opacity-40">
          <p>LYHS Plus Version {version} TW</p>
        </div>
      </div>
    </div>
  );
}
