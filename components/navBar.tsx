"use client";
import { House, Newspaper, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Navigator {
  standalone?: boolean;
}

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const checkPWA = () => {
      const isStandalone = (window.navigator as Navigator).standalone;
      const isDisplayModeStandalone = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;

      setIsPWA(isStandalone || isDisplayModeStandalone);
    };

    checkPWA();

    // 監聽顯示模式變化
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addListener(checkPWA);

    return () => mediaQuery.removeListener(checkPWA);
  }, []);

  return (
    <div
      className={`flex justify-around fixed bottom-0 w-full ${isPWA ? "pb-8" : ""} items-center bg-white/70 dark:bg-zinc-800/70 backdrop-blur-lg shadow-md z-20 border-t border-border dark:border-zinc-700`}
    >
      <button
        onClick={() => router.replace("/")}
        className={`flex flex-col gap-1 items-center justify-center relative min-w-[50px] ${
          pathname === "/" ? "text-primary" : "text-gray-400"
        }`}
      >
        {pathname === "/" && (
          <motion.div
            layoutId="active-line"
            className="bg-primary w-full h-[2px] absolute top-0"
          />
        )}
        <div className="p-2 flex flex-col items-center justify-center gap-1">
          <House />
          <p className="text-[10px] font-medium">首頁</p>
        </div>
      </button>

      <button
        onClick={() => router.replace("/news")}
        className={`flex flex-col gap-1 items-center justify-center relative min-w-[50px] ${
          pathname === "/news" ? "text-primary" : "text-gray-400"
        }`}
      >
        {pathname === "/news" && (
          <motion.div
            layoutId="active-line"
            className="bg-primary w-full h-[2px] absolute top-0"
          />
        )}
        <div className="p-2 flex flex-col items-center justify-center gap-1">
          <Newspaper />
          <p className="text-[10px] font-medium">校園公告</p>
        </div>
      </button>

      <button
        onClick={() => router.replace("/settings")}
        className={`flex flex-col gap-1 items-center justify-center relative min-w-[50px] ${
          pathname === "/settings" ? "text-primary" : "text-gray-400"
        }`}
      >
        {pathname === "/settings" && (
          <motion.div
            layoutId="active-line"
            className="bg-primary w-full h-[2px] absolute top-0"
          />
        )}
        <div className="p-2 flex flex-col items-center justify-center gap-1">
          <Menu />
          <p className="text-[10px] font-medium">設定</p>
        </div>
      </button>
    </div>
  );
}
