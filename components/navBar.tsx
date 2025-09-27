"use client";
import { useAppDispatch } from "@/store/hook";
import { updateSystemData } from "@/store/systemSlice";
import {
  DotsThreeOutline,
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
  openw: string;
}

const appSchema: AppSchema[] = [
  {
    name: "首頁",
    icon: <House size={25} />,
    active_icon: <House size={25} weight="fill" />,
    path: "/",
    openw: "w-24",
  },
  {
    name: "校園公告",
    icon: <MegaphoneSimple size={25} />,
    active_icon: <MegaphoneSimple size={25} weight="fill" />,
    path: "/news",
    openw: "w-32",
  },
  /*
  {
    name: "學生會",
    icon: <HandFist size={25} />,
    active_icon: <HandFist size={25} weight="fill" />,
    path: "/lyca",
    openw: "w-24",
    },*/
  {
    name: "更多",
    icon: <DotsThreeOutline size={25} />,
    active_icon: <DotsThreeOutline size={25} weight="fill" />,
    path: "/more",
    openw: "w-24",
  },
];

export function NavBar() {
  const pathname = usePathname();
  const [isPWA, setIsPWA] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const checkPWA = () => {
    const isStandalone = (window.navigator as Navigator).standalone;
    const isDisplayModeStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches;

    setIsPWA(isStandalone || isDisplayModeStandalone);

    dispatch(updateSystemData({ isPwa: isPWA }));
  };

  useEffect(() => {
    checkPWA();
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addListener(checkPWA);
    return () => mediaQuery.removeListener(checkPWA);
  });

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
      className={`z-30 w-full flex items-center justify-center fixed bottom-0 sm:bottom-5 ${isPWA ? "pt-5 max-sm:pb-deviceBottom" : "pt-2 pb-5"}`}
    >
      <div
        className={`flex justify-around items-center p-1 bg-zinc-900/70 dark:bg-zinc-50/20 backdrop-blur-md shadow-lg z-20 rounded-[30px]`}
      >
        {appSchema.map((app) => (
          <div
            key={app.path}
            onClick={() => handleVibration(app.path)}
            className={`flex group items-center transition-all rounded-[26px] p-3 gap-1 cursor-pointer ${
              (app.path === "/" && pathname === "/") ||
              (app.path !== "/" && pathname.startsWith(app.path))
                ? `bg-white dark:bg-zinc-50/25 ${app.openw} justify-center`
                : "text-background opacity-50 dark:text-zinc-400 w-12 overflow-hidden justify-start"
            }`}
          >
            <div className="flex group items-center justify-center gap-1 whitespace-nowrap">
              <div className="group-active:opacity-60 transition-all">
                {(app.path === "/" && pathname === "/") ||
                (app.path !== "/" && pathname.startsWith(app.path))
                  ? app.active_icon
                  : app.icon}
              </div>
              <p
                className={`font-medium ${app.path == pathname ? "opacity-100" : "opacity-0"} text-[18px]`}
              >
                {app.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
