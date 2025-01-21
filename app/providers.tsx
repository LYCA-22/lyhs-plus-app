"use client";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "next-themes";
import { HeroUIProvider } from "@heroui/system";
import UserCheck from "@/components/sidebar/initUserCheck";
import { SideBar } from "@/components/sidebar/sideBar";
import { LoadingPage } from "@/components/loadingPage";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { icons } from "@/components/icons";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pathAllName: Record<string, string> = {
    "/": "首頁",
    "/news": "學校網站公告",
    "/lyca": "班聯會",
    "/apps": "更多服務",
  };
  const [canGoBack, setCanGoBack] = useState(false);

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
      paths.pop(); // 移除當前路徑
      sessionStorage.setItem("navigationPaths", JSON.stringify(paths));
      router.back();
    }
  };

  return (
    <HeroUIProvider>
      <ThemeProvider attribute="class" defaultTheme="system">
        <Provider store={store}>
          <UserCheck />
          <LoadingPage />
          <main className="w-full h-dvh flex">
            <SideBar />
            <div
              aria-label="content"
              className="flex grow items-center justify-center"
            >
              <div className="w-full sm:w-[550px] min-h-dvh flex flex-col">
                <div className="z-10 backdrop-blur-sm flex p-3 h-14 font-medium w-full items-center justify-center max-sm:bg-background max-sm:border-b max-sm:border-borderColor max-sm:fixed max-sm:top-0 ">
                  <div className="flex items-center opacity-70">
                    {canGoBack && (
                      <button
                        className="absolute items-center justify-center shadow-md bg-background rounded-full border border-borderColor left-0 m-2 p-1 max-sm:shadow-none max-sm:border-none"
                        onClick={goBack}
                      >
                        {icons["arrowRight"]()}
                      </button>
                    )}
                    {pathAllName[pathname] || "未知頁面"}
                  </div>
                </div>
                <div className="bg-background overflow-y-auto overflow-x-hidden border border-borderColor shadow-lg grow rounded-tl-[40px] rounded-tr-[40px] pt-2 sm:max-h-screen-56 max-sm:pt-16 max-sm:h-dvh max-sm:border-0 max-sm:rounded-none">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={pathname}
                      initial={{ scale: 0.995, opacity: 0.9 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.995, opacity: 0.9 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                    >
                      {children}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </main>
        </Provider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
