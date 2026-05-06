"use client";
import { appSchema } from "@/lib/appConfig";
import { useAppSelector } from "@/store/hook";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppDock() {
  const pathname = usePathname();
  const appData = useAppSelector((state) => state.appStatus);

  return (
    <div
      className={`z-30 bg-white/50 backdrop-blur-2xl dark:bg-zinc-700/50 border-t flex justify-evenly items-center fixed bottom-0 w-full ${appData.device_info.operate_type == "PWA" ? "pt-5 max-sm:pb-deviceBottom" : "py-4"}`}
    >
      {appSchema.map((app) => (
        <Link
          href={app.path}
          key={app.path}
          className={`gap-1 flex flex-col items-center justify-center ${
            (app.path === "/" && pathname === "/") ||
            (app.path !== "/" && pathname.startsWith(app.path))
              ? "opacity-100"
              : "opacity-50"
          }`}
        >
          {(app.path === "/" && pathname === "/") ||
          (app.path !== "/" && pathname.startsWith(app.path))
            ? app.activeIcon
            : app.icon}
          <p className={`text-xs font-medium`}>{app.name}</p>
        </Link>
      ))}
    </div>
  );
}
