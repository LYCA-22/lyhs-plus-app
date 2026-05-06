"use client";
import { appSchema } from "@/lib/appConfig";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppDock() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 w-full z-30 pb-4 px-4 flex items-center justify-center">
      <div
        className={`bg-white/50 backdrop-blur-2xl dark:bg-zinc-700/50 border flex justify-evenly items-center rounded-full p-1 gap-1 shadow-lg shadow-zinc-200 dark:shadow-zinc-700`}
      >
        {appSchema.map((app) => (
          <Link
            href={app.path}
            key={app.path}
            className={`gap-1 flex flex-col items-center justify-center rounded-full p-3 ${
              (app.path === "/" && pathname === "/") ||
              (app.path !== "/" && pathname.startsWith(app.path))
                ? "opacity-100 bg-buttonBg"
                : "opacity-50"
            }`}
          >
            {app.icon}
          </Link>
        ))}
      </div>
    </div>
  );
}
