"use client";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "next-themes";
import { HeroUIProvider } from "@heroui/system";
import { SideBar } from "@/components/sidebar/sideBar";
import { LoadingPage } from "@/components/loadingPage";
import { usePathname, useRouter } from "next/navigation";
import { icons } from "@/components/icons";
import SystemCheck from "@/components/initUserCheck";
import { NavBar } from "@/components/navBar";
import BetaAlert from "@/components/betaAlert";

export function Providers({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const pathAllName: Record<string, string> = {
    "/": "首頁",
    "/news": "學校網站公告",
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
  const [canGoBack, setCanGoBack] = useState<boolean>(false);

  useEffect(() => {
    // 讀取或初始化路徑歷史
    const paths = JSON.parse(sessionStorage.getItem("navigationPaths") || "[]");

    // 如果當前路徑不在歷史中，添加它
    if (!paths.includes(pathname)) {
      paths.push(pathname);
      sessionStorage.setItem("navigationPaths", JSON.stringify(paths));
    }

    // 更新是否可以返回的狀態
    setCanGoBack(paths.length > 1);

    // 監聽 popstate 事件（用戶使用瀏覽器的前進/後退按鈕時觸發）
    const handlePopState = () => {
      const currentPaths = JSON.parse(
        sessionStorage.getItem("navigationPaths") || "[]",
      );
      if (currentPaths.length > 0) {
        currentPaths.pop();
        sessionStorage.setItem("navigationPaths", JSON.stringify(currentPaths));
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname]);

  const goBack = () => {
    const paths = JSON.parse(sessionStorage.getItem("navigationPaths") || "[]");
    if (paths.length > 1) {
      paths.pop();
      sessionStorage.setItem("navigationPaths", JSON.stringify(paths));
      router.back();
    }
  };

  useEffect(() => {
    const checkIsMobile = () => {
      const isMobileDevice = window.innerWidth <= 640;
      setIsMobile(isMobileDevice);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return (
    <HeroUIProvider id="mainApp">
      <ThemeProvider attribute="class" defaultTheme="system">
        <Provider store={store}>
          <SystemCheck />
          <LoadingPage />
          <BetaAlert />
          <main className="w-full h-dvh flex">
            <SideBar />
            {isMobile && <NavBar />}
            <div className="flex grow items-center justify-center">
              <div className="w-full sm:w-[550px] min-h-dvh flex flex-col relative">
                <div className="z-20 flex p-3 h-14 font-medium w-full items-center justify-center max-sm:bg-white max-sm:dark:bg-zinc-800 max-sm:fixed max-sm:top-0">
                  <div className="flex items-center sm:opacity-70 max-sm:text-lg">
                    {canGoBack && pathname !== "/" && pathname !== "/news" && (
                      <button
                        className="absolute items-center sm:hover:scale-110 transition-all justify-center shadow-md bg-background max-sm:bg-transparent rounded-full border border-borderColor left-0 m-2 ml-5 sm:ml-3 p-1 max-sm:shadow-none max-sm:border-none"
                        onClick={goBack}
                      >
                        {icons["arrowRight"](isMobile ? 20 : 15)}
                      </button>
                    )}
                    {pathAllName[pathname] || "未知頁面"}
                  </div>
                </div>
                <div className="bg-background overflow-hidden relative border border-borderColor shadow-lg grow rounded-tl-[30px] rounded-tr-[30px] max-sm:border-0 max-sm:rounded-none ">
                  <div className="max-sm:py-9 max-sm:pb-14 sm:max-h-screen-56 max-sm:h-dvh overflow-y-auto overflow-x-hidden box-border">
                    <div>{children}</div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </Provider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
