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
import { X } from "lucide-react";
import Link from "next/link";
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
  const [badgeClose, setBagdeClose] = useState<boolean>(true);

  const checkPWA = () => {
    const isStandalone = (window.navigator as Navigator).standalone;
    const isDisplayModeStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches;

    setIsPWA(isStandalone || isDisplayModeStandalone);

    dispatch(updateSystemData({ isPwa: isPWA }));
  };

  useEffect(() => {
    if (isPWA) {
      setBagdeClose(true);
    } else {
      setBagdeClose(false);
    }
  }, [isPWA]);

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

  if (pathname === "/repair") {
    return;
  }

  return (
    <div
      className={`z-30 w-full flex items-center justify-center fixed bottom-0 bg-gradient-to-t from-background to-white/0 dark:to-gray-800/0 sm:bottom-5 ${isPWA ? "pt-5 max-sm:pb-deviceBottom" : "pt-2 pb-5"}`}
    >
      {!badgeClose && (
        <div className="fixed top-0 w-full flex">
          <div className="flex items-center justify-between bg-gradient-to-br from-inputPrimary to-zinc-200 p-2 px-4 text-white w-full">
            <div className="flex flex-col">
              <h1 className="font-medium">安裝 LYHS+</h1>
              <p className="text-xs">下載應用程式，使用更便利！</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={"/install"}
                className="p-2 px-3 rounded-full text-sm bg-inputPrimary text-white"
              >
                安裝
              </Link>
              <button
                onClick={() => setBagdeClose(true)}
                className="rounded-full p-2 bg-zinc-50 text-zinc-700"
              >
                <X size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className={`flex justify-around items-center p-1 px-2 bg-zinc-100/75 shadow-2xl backdrop-blur-sm dark:bg-zinc-800/75 z-20 border rounded-full border-border dark:border-zinc-700`}
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
            <div className="group-active:opacity-60 transition-all">
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
        className={`flex items-center justify-center shadow-xl absolute right-5 w-10 h-10 bg-zinc-100/75 backdrop-blur-sm dark:bg-zinc-800/50 z-20 border rounded-full border-border dark:border-zinc-700`}
      >
        <DotsThreeOutline size={22} className="opacity-50" />
      </button>
    </div>
  );
}
