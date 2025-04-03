"use client";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import Link from "next/link";
import { apiService } from "@/services/api";
import { useEffect } from "react";
import { closeBack } from "@/store/systemSlice";
import { appSchema } from "./schema";
import { schemaItem } from "@/types";
import Image from "next/image";
import { ChevronRight, IdCard, LogOut } from "lucide-react";

export default function SettingHome({
  setPageAction,
}: {
  setPageAction: (page: string) => void;
}) {
  const userData = useAppSelector((state) => state.userData);
  const dispatch = useAppDispatch();
  const version = process.env.NEXT_PUBLIC_APP_VERSION;

  useEffect(() => {
    dispatch(closeBack());
  });

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
          <button
            onClick={() => setPageAction(item.btnfunction || "")}
            className={`${commonClasses} w-full text-left`}
          >
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
    <div className="relative">
      {!userData.name && (
        <div className="bg-gradient-to-br from-buttonBg dark:from-zinc-700 to-white dark:to-zinc-900 m-4 mt-0 p-5 rounded-[30px] border-border border shadow-xl px-6 flex flex-col">
          <p className="text-3xl font-medium">登入享用完整服務</p>
          <Link
            href="https://auth.lyhsca.org/account/login?redirect_url=https://app.lyhsca.org"
            className="p-3 bg-primary text-background rounded-full active:scale-90 transition-all flex items-center justify-center font-medium mt-6 mb-2"
          >
            登入或註冊
          </Link>
        </div>
      )}
      <ul className="list-none flex flex-col">
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
          </>
        )}
        {appSchema.map((item, index) => (
          <li key={index} className="flex flex-col transition-all mx-7 pt-1">
            {renderItem(item)}
            <div className="w-full bg-border h-[2px] rounded-full dark:bg-zinc-700 opacity-50 mt-1"></div>
          </li>
        ))}
        <li className="flex flex-col transition-all mx-7 pt-1">
          <button
            onClick={() => Logout(userData.sessionId)}
            className="flex items-center font-medium justify-between py-3 hover:opacity-60 transition-all text-lg"
          >
            <div className="flex items-center gap-3">
              <LogOut size={24} strokeWidth={2.5} />
              登出帳號
            </div>
            <ChevronRight className="opacity-40" size={22} strokeWidth={2.5} />
          </button>
          <div className="w-full bg-border h-[2px] rounded-full dark:bg-zinc-700 opacity-50 mt-1"></div>
        </li>
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
          <h1 className="opacity-40 font-medium">林園班聯 版權所有</h1>
          <p className="text-sm opacity-40 font-normal">
            本平台由林園高中班聯會資訊組建置與維護
          </p>
        </div>
        <div className="flex items-center justify-center font-mono text-sm opacity-40">
          Version {version}
        </div>
      </div>
    </div>
  );
}
