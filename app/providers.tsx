"use client";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "next-themes";
import { LoadingPage } from "@/components/loadingPage";
import { usePathname, useRouter } from "next/navigation";
import { SystemCheck } from "@/utils/initSystemCheck";
import { DynamicBack } from "@/components/dynamicBack";
import { useEffect, useState } from "react";
import { LoadingSvg } from "@/components/statusControl";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { NavBar } from "@/components/navBar";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [navBarOpen, setNavBarOpen] = useState(false);

  const pathAllName: Record<string, string> = {
    "/mail/stu": "學權信箱",
    "/mail/success": "學權信箱",
    "/mail/view": "信件查詢",
    "/calendar": "行事曆",
    "/repair": "線上報修",
    "/schoolweb": "學校網站",
    "/school": "校務系統",
    "/school/login/old": "校務系統登入",
    "/school/login/openId": "校務系統登入",
    "/school/score": "成績系統",
    "/mylyps": "帳號管理",
    "/school/absence": "缺曠課資料",
    "/school/getId": "OPENID 查詢",
  };

  const getPageTitle = (pathname: string) => {
    if (/^\/school\/score\/[^/]+$/.test(pathname)) {
      return "成績資料";
    } else if (/^\/school\/score\/[^/]+\/[^/]+$/.test(pathname)) {
      return "成績資料";
    }
    return pathAllName[pathname] || "未知頁面";
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

  useEffect(() => {
    if (
      pathname === "/repair" ||
      pathname === "/calendar" ||
      pathname.startsWith("/school/login") ||
      pathname.startsWith("/learn")
    ) {
      setNavBarOpen(false);
    } else {
      setNavBarOpen(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (isMobile) {
      SystemCheck();
    } else {
      router.push("/desktop");
    }
  }, [isMobile, router]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Provider store={store}>
        <LoadingPage />
        <LoadingSvg />
        <div className="w-full flex items-center justify-center">
          <main className="w-full sm:w-[500px] h-dvh flex flex-col items-center justify-center relative sm:border-x sm:border-border">
            {pathname !== "/" &&
              pathname !== "/news" &&
              pathname !== "/lyca" &&
              pathname !== "/more" && (
                <div className="w-full flex pt-deviceTop items-center justify-center p-2 py-3 bg-background">
                  <DynamicBack />
                  <div className="font-custom z-20 dark:border-borderColor text-[18px] opacity-80">
                    {getPageTitle(pathname)}
                  </div>
                </div>
              )}
            <div
              id="main-area"
              className="bg-background overflow-hidden relative w-full grow"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ scale: 0.99, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.7 }}
                  className="overflow-y-auto overflow-x-hidden box-border h-full"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
            {navBarOpen ? <NavBar /> : null}
          </main>
        </div>
      </Provider>
    </ThemeProvider>
  );
}
