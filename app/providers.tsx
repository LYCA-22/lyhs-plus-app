"use client";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "next-themes";
import { LoadingPage } from "@/components/loadingPage";
import { usePathname } from "next/navigation";
import SystemCheck from "@/components/initUserCheck";
import { NavBar } from "@/components/navBar";
import BetaAlert from "@/components/betaAlert";
import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathAllName: Record<string, string> = {
    "/": "首頁",
    "/news": "校園公告",
    "/lyca": "班聯會",
    "/apps": "更多服務",
    "/mailbox/student": "學權信箱 (測試版)",
    "/mailbox/success": "學權信箱 (測試版)",
    "/mailbox/view": "信件查詢",
    "/settings": "設定",
    "/settings/shortcuts": "管理快速捷徑",
    "/settings/notification": "管理無聲廣播",
    "/calendar": "行事曆",
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Provider store={store}>
        <SystemCheck />
        <LoadingPage />
        <BetaAlert />
        <div className="w-full flex items-center justify-center">
          <main className="w-full sm:w-[500px] h-dvh flex flex-col items-center justify-center relative sm:border-x sm:border-border">
            {pathname !== "/" && (
              <div className="w-full flex pt-deviceTop items-center border-b border-border p-2 py-3 bg-white dark:bg-zinc-800">
                {pathname.startsWith("/mailbox") && (
                  <Link href={"/"}>
                    <CaretLeft
                      size={22}
                      className="text-primary"
                      weight="bold"
                    />
                  </Link>
                )}
                <div className="z-20 font-medium dark:border-borderColor mx-3">
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
          </main>
        </div>
      </Provider>
    </ThemeProvider>
  );
}
