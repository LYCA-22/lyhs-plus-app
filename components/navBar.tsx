"use client";
import { useAppDispatch } from "@/store/hook";
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
  openw: string;
}

const appSchema: AppSchema[] = [
  {
    name: "首頁",
    icon: <House size={25} />,
    active_icon: <House size={25} weight="fill" />,
    path: "/",
    openw: "w-20",
  },
  {
    name: "校園公告",
    icon: <MegaphoneSimple size={25} />,
    active_icon: <MegaphoneSimple size={25} weight="fill" />,
    path: "/news",
    openw: "w-28",
  },
  {
    name: "班聯會",
    icon: <HandFist size={25} />,
    active_icon: <HandFist size={25} weight="fill" />,
    path: "/lyca",
    openw: "w-24",
  },
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

  if (pathname === "/repair" || pathname === "/calendar") {
    return;
  }

  return (
    <div
      className={`z-30 w-full flex items-center justify-center fixed bottom-0 sm:bottom-5 ${isPWA ? "pt-5 max-sm:pb-deviceBottom" : "pt-2 pb-5"}`}
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
        className={`flex justify-around items-center p-1 bg-zinc-900/50 shadow-xl drop-shadow-xl backdrop-blur-sm dark:bg-zinc-50/20 z-20 rounded-[30px]`}
      >
        {appSchema.map((app) => (
          <div
            key={app.path}
            onClick={() => handleVibration(app.path)}
            className={`flex group items-center transition-all p-3 gap-1 cursor-pointer ${
              (app.path === "/" && pathname === "/") ||
              (app.path !== "/" && pathname.startsWith(app.path))
                ? `bg-white rounded-[26px] dark:bg-zinc-50/25 ${app.openw} justify-center`
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
                className={`font-medium ${app.path == pathname ? "opacity-100" : "opacity-0"}`}
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
