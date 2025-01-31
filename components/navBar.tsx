"use client";
import { House, Newspaper, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function NavBar() {
  const pathname = usePathname();

  return (
    <div className="flex justify-around fixed pb-deviceBottom bottom-0 w-full items-center bg-white/70 dark:bg-zinc-800/70 backdrop-blur-lg shadow-md z-20 border-t border-border dark:border-zinc-700">
      <Link
        href={"/"}
        prefetch
        className={`flex flex-col gap-1 items-center justify-center relative min-w-[50px] ${pathname === "/" ? "text-primary" : "text-gray-400"}`}
      >
        {pathname === "/" && (
          <motion.div
            layoutId="active-line"
            className="bg-primary w-full h-[2px] absolute top-0"
          ></motion.div>
        )}
        <div className="p-2 flex flex-col items-center justify-center gap-1">
          <House />
          <p className="text-[10px] font-medium">首頁</p>
        </div>
      </Link>
      <Link
        href={"/news"}
        prefetch
        className={`flex flex-col gap-1 items-center justify-center relative min-w-[50px] ${pathname === "/news" ? "text-primary" : "text-gray-400"}`}
      >
        {pathname === "/news" && (
          <motion.div
            layoutId="active-line"
            className="bg-primary w-full h-[2px] absolute top-0"
          ></motion.div>
        )}
        <div className="p-2 flex flex-col items-center justify-center gap-1">
          <Newspaper />
          <p className="text-[10px] font-medium">校園公告</p>
        </div>
      </Link>
      <Link
        href={"/settings"}
        prefetch
        className={`flex flex-col gap-1 items-center justify-center relative min-w-[50px] ${pathname === "/settings" ? "text-primary" : "text-gray-400"}`}
      >
        {pathname === "/settings" && (
          <motion.div
            layoutId="active-line"
            className="bg-primary w-full h-[2px] absolute top-0"
          ></motion.div>
        )}
        <div className="p-2 flex flex-col items-center justify-center gap-1">
          <Menu />
          <p className="text-[10px] font-medium">設定</p>
        </div>
      </Link>
    </div>
  );
}
