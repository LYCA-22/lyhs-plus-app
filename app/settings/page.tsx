"use client";
import { ThemeToggle } from "@/components/sidebar/themeToggle";
import { useAppSelector } from "@/store/hook";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const IsLoggedIn = useAppSelector((state) => state.userData.isLoggedIn);

  return (
    <div className="p-5">
      <ul className="list-none flex flex-col gap-2">
        <div className="bg-hoverbg rounded-xl p-2 m-1">
          <li className="flex items-center justify-between px-2">
            <div className="font-medium ml-1">我的帳號</div>
            {IsLoggedIn ? (
              <ChevronRight />
            ) : (
              <Link
                className="p-1.5 px-3 bg-background m-1 text-[15px] font-medium hover:bg-buttonBg rounded-full border border-border dark:border-zinc-700"
                href={
                  "https://auth.lyhsca.org/account/login?redirect_url=https://beta.plus.lyhsca.org"
                }
              >
                登入
              </Link>
            )}
          </li>
        </div>
        <div className="bg-hoverbg rounded-xl p-2 m-1">
          <li className="flex items-center justify-between px-2">
            <div className="font-medium ml-1">系統主題</div>
            <div className="rounded-full">
              <ThemeToggle />
            </div>
          </li>
        </div>
      </ul>
    </div>
  );
}
