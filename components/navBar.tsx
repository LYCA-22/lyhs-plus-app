"use client";
import { apiService } from "@/services/api";
import { useAppDispatch } from "@/store/hook";
import { loadNews } from "@/store/newsSlice";
import {
  DotsThreeOutline,
  HandFist,
  House,
  MegaphoneSimple,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface Navigator {
  standalone?: boolean;
}

interface AppSchema {
  name: string;
  path: string;
  icon: React.ReactNode;
  active_icon: React.ReactNode;
}

const appSchema: AppSchema[] = [
  {
    name: "首頁",
    icon: <House size={25} />,
    active_icon: <House size={25} weight="fill" />,
    path: "/",
  },
  {
    name: "校園公告",
    icon: <MegaphoneSimple size={25} />,
    active_icon: <MegaphoneSimple size={25} weight="fill" />,
    path: "/news",
  },
  {
    name: "班聯會",
    icon: <HandFist size={25} />,
    active_icon: <HandFist size={25} weight="fill" />,
    path: "/lyca",
  },
  {
    name: "更多",
    icon: <DotsThreeOutline size={25} />,
    active_icon: <DotsThreeOutline size={25} weight="fill" />,
    path: "/settings",
  },
];

export function NavBar() {
  const pathname = usePathname();
  const [isPWA, setIsPWA] = useState(false);
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const news = await apiService.getNews();
        dispatch(loadNews(news.data));
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, [dispatch]);

  return (
    <div className="w-full flex items-center justify-center fixed bottom-0 sm:bottom-5">
      <div
        className={`flex justify-around w-full sm:w-[500px] sm:rounded-full sm:border sm:mx-auto ${isPWA ? "pb-8" : "py-2"} items-center bg-background dark:bg-zinc-800 z-20 border-t border-border dark:border-zinc-700`}
      >
        {appSchema.map((app) => (
          <Link
            key={app.path}
            href={app.path}
            className={`flex flex-col group items-center justify-center w-12 h-12 ${
              (app.path === "/" && pathname === "/") ||
              (app.path !== "/" && pathname.startsWith(app.path))
                ? "text-primary"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <div className="group-active:scale-85 transition-all">
              {(app.path === "/" && pathname === "/") ||
              (app.path !== "/" && pathname.startsWith(app.path))
                ? app.active_icon
                : app.icon}
            </div>
            <span className="text-[10px] font-medium">{app.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
