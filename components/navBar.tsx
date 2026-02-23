"use client";
import { appSchema } from "@/lib/appConfig";
import { useAppSelector } from "@/store/hook";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavBar() {
  const pathname = usePathname();
  const appData = useAppSelector((state) => state.appStatus);

  return (
    <div
      className={`z-30 bg-background border-t dark:border-zinc-600 flex justify-evenly items-center border-border w-full fixed bottom-0 ${appData.device_info.operate_type == "PWA" ? "pt-5 max-sm:pb-deviceBottom" : "pt-3 pb-2"}`}
    >
      {appSchema.map((app) => (
        <Link
          href={app.path}
          key={app.path}
          className="gap-1 flex flex-col items-center justify-center"
        >
          {(app.path === "/" && pathname === "/") ||
          (app.path !== "/" && pathname.startsWith(app.path))
            ? app.active_icon
            : app.icon}
          <p className={`text-xs font-medium`}>{app.name}</p>
        </Link>
      ))}
    </div>
  );
}
