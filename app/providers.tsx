"use client";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "next-themes";
import { LoadingPage } from "@/components/loadingPage";
import { usePathname } from "next/navigation";
import { SystemCheck } from "@/utils/initSystemCheck";
import { NavBar } from "@/components/navBar";
import BetaAlert from "@/components/welcome";
import { DynamicBack } from "@/components/dynamicBack";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LoadingSvg } from "@/components/loadingSvg";
import SettingsDrawer from "@/components/settings/drawer";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

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
    "/school": "校務系統",
    "/school/verify": "驗證碼",
    "/school/score": "選擇學期",
    "/school/score/detail": "成績資料",
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
    if (isMobile) {
      SystemCheck();
    }
  }, [isMobile]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Provider store={store}>
        {!isMobile ? (
          <div className="bg-white p-10">
            <div className="w-full h-dvh flex flex-col gap-3 justify-center text-black">
              <Image
                alt="logo"
                src={"/logo.svg"}
                width={50}
                height={50}
                className={`opacity-100 transition-all fixed top-10`}
              />
              <div className="flex flex-col gap-2">
                <h1 className="font-medium text-3xl">
                  您正在使用
                  <span className="text-inputPrimary">電腦或平板</span>
                </h1>
                <p>
                  本平台是專為手機設計，請使用手機輸入此網址或掃描下方QRCode。
                </p>
                <div className="hover:scale-105 transition-all p-2 bg-gradient-to-br from-zinc-100 to-white border border-zinc-100 shadow-xl shadow-zinc-100 rounded-3xl flex items-center gap-4 w-fit pr-5 my-5">
                  <Image
                    alt="phone-qrcode"
                    src={"/phone-qrcode.png"}
                    width={100}
                    height={100}
                    className={`opacity-100 transition-all`}
                  />
                  <div className="flex flex-col gap-2">
                    <h1 className="font-medium text-xl">
                      打開您的手機掃描左方的QRCode
                    </h1>
                    <h1>
                      或在網址列輸入
                      <span className="p-1 rounded-md bg-zinc-200 px-2 m-1">
                        app.lyhsca.org
                      </span>
                    </h1>
                  </div>
                </div>
              </div>
              <div className="fixed bottom-10 flex w-fit gap-2 items-center justify-center text-sm font-sans font-medium rounded-full border border-zinc-200 bg-zinc-100 shadow-xl pl-3 p-1">
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
          </div>
        ) : (
          <>
            <LoadingPage />
            <BetaAlert />
            <LoadingSvg />
            <div className="w-full flex items-center justify-center">
              <main className="w-full sm:w-[500px] h-dvh flex flex-col items-center justify-center relative sm:border-x sm:border-border">
                {pathname !== "/" &&
                  pathname !== "/news" &&
                  pathname !== "/lyca" && (
                    <div className="w-full flex pt-deviceTop items-center justify-center p-2 py-3 bg-white dark:bg-zinc-800">
                      <DynamicBack />
                      <div className="z-20 dark:border-borderColor text-[18px] opacity-80">
                        {pathAllName[pathname] || "未知頁面"}
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
                <NavBar />
                <SettingsDrawer />
              </main>
            </div>
          </>
        )}
      </Provider>
    </ThemeProvider>
  );
}
