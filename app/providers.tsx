"use client";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "next-themes";
import { LoadingPage } from "@/components/loadingPage";
import { usePathname } from "next/navigation";
import SystemCheck from "@/components/initUserCheck";
import { NavBar } from "@/components/navBar";
import BetaAlert from "@/components/welcome";
import { DynamicBack } from "@/components/dynamicBack";
import SettingsDrawer from "@/components/settings/drawer";
import { MonitorX } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathAllName: Record<string, string> = {
    "/": "首頁",
    "/news": "校園公告",
    "/lyca": "班聯會",
    "/apps": "更多服務",
    "/mail/stu": "學權信箱",
    "/mail/success": "學權信箱",
    "/mail/view": "信件查詢",
    "/settings": "設定",
    "/settings/shortcuts": "管理快速捷徑",
    "/settings/notification": "管理無聲廣播",
    "/calendar": "行事曆",
    "/repair": "線上報修",
    "/schoolweb": "學校網站",
  };
  const [isMobile, setIsMobile] = useState<boolean>(true);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  });

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Provider store={store}>
        {!isMobile ? (
          <div className="w-full h-dvh flex flex-col gap-3 items-center justify-center bg-white text-black">
            <MonitorX size={50} strokeWidth={2.5} />
            <div className="text-center flex flex-col gap-2">
              <h1 className="font-medium text-lg">
                我們發現您正在使用電腦或平板！
              </h1>
              <p>本系統是專為手機設計，請使用手機打開。</p>
            </div>
            <div className="flex gap-2 items-center justify-center font-medium rounded-full border border-border pl-3 p-1">
              <Image
                alt="LycaLogo"
                src="/lyca/lyca-logo.svg"
                width={16}
                height={16}
              />
              <p>此系統由林園高中班聯會建置與維護</p>
              <Link
                href={"https://www.instagram.com/lyca_22nd"}
                className="bg-zinc-200 hover:bg-black hover:text-white p-1 rounded-full px-2 text-sm"
              >
                聯絡我們
              </Link>
            </div>
          </div>
        ) : (
          <>
            <SystemCheck />
            <LoadingPage />
            <BetaAlert />
            <div className="w-full flex items-center justify-center">
              <main className="w-full sm:w-[500px] h-dvh flex flex-col items-center justify-center relative sm:border-x sm:border-border">
                {pathname !== "/" &&
                  pathname !== "/news" &&
                  pathname !== "/lyca" && (
                    <div className="w-full flex pt-deviceTop items-center border-b border-border dark:border-borderColor p-2 py-3 bg-white dark:bg-zinc-800">
                      <DynamicBack />
                      <div className="z-20 font-medium dark:border-borderColor mx-1">
                        {pathAllName[pathname] || "未知頁面"}
                      </div>
                    </div>
                  )}
                <div
                  id="main-area"
                  className="bg-background overflow-hidden relative w-full grow"
                >
                  <div className="overflow-y-auto overflow-x-hidden box-border h-full">
                    {children}
                  </div>
                </div>
                {!pathname.startsWith("/mailbox") && <NavBar />}
                <SettingsDrawer />
              </main>
            </div>
          </>
        )}
      </Provider>
    </ThemeProvider>
  );
}
