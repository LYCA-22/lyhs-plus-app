"use client";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "next-themes";
import { HeroUIProvider } from "@heroui/system";
import UserCheck from "@/components/initUserCheck";
import { SideBar } from "@/components/sideBar";
import { LoadingPage } from "@/components/loadingPage";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathAllName: Record<string, string> = {
    "/": "首頁",
    "/news": "校園公告",
    "/lyca": "班聯會",
    "/apps": "更多服務",
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
                <div className="z-10 backdrop-blur-sm flex p-3 h-14 font-medium w-full items-center justify-center max-sm:bg-background/50 max-sm:border-b max-sm:border-borderColor max-sm:opacity-70 max-sm:fixed max-sm:top-0 ">
                  {pathAllName[pathname] || "未知頁面"}
                </div>
                <div className="bg-background overflow-y-auto border border-borderColor shadow-lg grow rounded-tl-[40px] rounded-tr-[40px] pt-2 sm:max-h-screen-56 max-sm:pt-14 max-sm:h-dvh max-sm:border-0 max-sm:rounded-none">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={pathname}
                      initial={{ scale: 0.99, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.99, opacity: 0.8 }}
                      transition={{
                        duration: 0.2,
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
