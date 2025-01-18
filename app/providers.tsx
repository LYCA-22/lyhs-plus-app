"use client";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "next-themes";
import { HeroUIProvider } from "@heroui/system";
import UserCheck from "@/components/initUserCheck";
import { SideBar } from "@/components/sideBar";
import { LoadingPage } from "@/components/loadingPage";
import { usePathname } from "next/navigation";

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
              <div className="w-full sm:w-[450px] min-h-dvh flex flex-col">
                <div className="flex p-3 h-14 font-medium w-full items-center justify-center">
                  {pathAllName[pathname] || "未知頁面"}
                </div>
                <div className="bg-background max-h-screen-56 overflow-y-auto border border-borderColor shadow-lg grow rounded-tl-[30px] rounded-tr-[30px] pt-2">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </Provider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
