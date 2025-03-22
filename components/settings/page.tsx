"use client";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import Link from "next/link";
import { SlidersHorizontal, SignOut } from "@phosphor-icons/react";
import { apiService } from "@/services/api";
import { useEffect } from "react";
import { closeBack } from "@/store/systemSlice";
import { appSchema } from "./schema";
import { schemaItem } from "@/types";

export default function SettingHome({
  setPage,
}: {
  setPage: (page: string) => void;
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
      "flex items-center justify-between py-3 hover:opacity-60 transition-all";

    switch (item.type) {
      case "component":
        return (
          <div className={commonClasses}>
            <p>{item.title}</p>
            {item.component}
          </div>
        );
      case "btn":
        return (
          <button
            onClick={() => setPage(item.btnfunction || "")}
            className={`${commonClasses} w-full text-left`}
          >
            <p>{title}</p>
            {item.icon && item.icon}
          </button>
        );
      case "link":
        return (
          <Link
            href={href || ""}
            target={item.isOutLink ? "_blank" : "_self"}
            className={commonClasses}
          >
            <p>{title}</p>
            {item.icon && item.icon}
          </Link>
        );
    }
  };

  const Logout = async (sessionId: string) => {
    await apiService.Logout(sessionId);
  };

  return (
    <div className="relative">
      <div className="w-full bg-hoverbg mb-4 p-5 px-6 flex flex-col">
        <p className="text-3xl font-medium">
          {userData.name ? <>{userData.name}</> : <>登入享用完整服務</>}
        </p>
        {!userData.name && (
          <Link
            href="https://auth.lyhsca.org/account/login?redirect_url=https://app.lyhsca.org"
            className="p-3 bg-primary text-background rounded-full active:scale-90 transition-all flex items-center justify-center font-medium my-3 mt-6"
          >
            登入或註冊
          </Link>
        )}
        {userData.name && (
          <div className="flex mt-6 gap-4">
            <Link
              href={"/account"}
              className="bg-background flex flex-col w-28 p-4 font-medium text-medium gap-1 rounded-xl border border-border items-center justify-center"
            >
              <SlidersHorizontal size={25} />
              管理帳號
            </Link>
            <button
              onClick={() => Logout(userData.sessionId)}
              className="bg-background flex flex-col w-28 p-4 font-medium text-medium gap-1 rounded-xl border border-border items-center justify-center"
            >
              <SignOut size={25} />
              登出
            </button>
          </div>
        )}
      </div>
      <ul className="list-none flex flex-col gap-2">
        {appSchema.map((group, groupIndex) => (
          <li
            key={groupIndex}
            className="flex flex-col px-5 bg-background transition-all"
          >
            <h3 className="text-lg font-medium">{group.groupTitle}</h3>
            <div className="flex flex-col">
              {group.items.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-borderColor last:border-b-0"
                >
                  {renderItem(item)}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-center p-2 font-mono text-sm opacity-40">
        Version {version}
      </div>
    </div>
  );
}
