"use client";
import { apiService } from "@/services/api";
import { useAppDispatch } from "@/store/hook";
import { loadNews } from "@/store/newsSlice";
import { updateSystemData } from "@/store/systemSlice";
import {
  DotsThreeOutline,
  HandFist,
  House,
  MegaphoneSimple,
} from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
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
];

export function NavBar() {
  const pathname = usePathname();
  const [isPWA, setIsPWA] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const checkPWA = () => {
    const isStandalone = (window.navigator as Navigator).standalone;
    const isDisplayModeStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;

    setIsPWA(isStandalone || isDisplayModeStandalone);
    dispatch(updateSystemData({ isPwa: isPWA }));
  };

  useEffect(() => {
    checkPWA();
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addListener(checkPWA);
    return () => mediaQuery.removeListener(checkPWA);
  });

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

  const handleVibration = (path: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    if (
      (path === "/" && pathname !== "/") ||
      (path !== "/" && !pathname.startsWith(path))
    ) {
      router.push(path);
    }
  };

  return (
    <div
      className={`w-full flex items-center justify-center fixed bottom-0 max-sm:bg-gradient-to-t from-background to-white/10 dark:to-gray-800/10 sm:bottom-5 ${isPWA ? "pt-5 max-sm:pb-deviceBottom" : "py-2"}`}
    >
      <div
        className={`flex justify-around items-center p-1 px-2 bg-zinc-100/75 backdrop-blur-sm dark:bg-zinc-800/75 z-20 border rounded-full border-border dark:border-zinc-700`}
      >
        {appSchema.map((app) => (
          <div
            key={app.path}
            onClick={() => handleVibration(app.path)}
            className={`flex flex-col group items-center justify-center w-12 h-12 cursor-pointer ${
              (app.path === "/" && pathname === "/") ||
              (app.path !== "/" && pathname.startsWith(app.path))
                ? "text-primary"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <div className="group-active:scale-90 transition-transform duration-150 ease-out">
              {(app.path === "/" && pathname === "/") ||
              (app.path !== "/" && pathname.startsWith(app.path))
                ? app.active_icon
                : app.icon}
            </div>
            {pathname === app.path && (
              <div className="h-1 w-1 rounded-full bg-inputPrimary absolute bottom-2"></div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => dispatch(updateSystemData({ isSetOpen: true }))}
        className={`flex items-center justify-center absolute right-5 w-10 h-10 bg-zinc-100/75 backdrop-blur-sm dark:bg-zinc-800/50 z-20 border rounded-full border-border dark:border-zinc-700`}
      >
        <DotsThreeOutline size={22} className="opacity-50" />
      </button>
    </div>
  );
}
