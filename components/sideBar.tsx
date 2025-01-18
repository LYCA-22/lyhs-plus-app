"use client";
import React, { useState, useEffect } from "react";
import { Dock, DockIcon } from "./ui/dock";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { icons } from "@/components/icons";
import Image from "next/image";
import { ThemeToggle } from "@/components/themeToggle";
import Link from "next/link";

export function SideBar() {
  const [theme, setTheme] = useState("");
  const [path, setPath] = useState("");
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 可以加入對主題變化的監聽
    const html = document.querySelector("html");
    const observer = new MutationObserver(() => {
      if (html?.classList.contains("dark")) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    });

    observer.observe(html!, { attributes: true });

    // 初始化主題
    if (html?.classList.contains("dark")) {
      setTheme("dark");
    } else {
      setTheme("light");
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setPath(pathname || "");
  }, [pathname]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex justify-between flex-col items-center p-3 py-7 min-w-32">
      <Image
        alt="logo"
        src={`${theme === "dark" ? "/logo-light.svg" : "/logo.svg"}`}
        width={40}
        height={40}
      />
      <Dock direction="middle" className="rounded-full flex flex-col">
        <DockIcon>
          <Link href="/">
            <div className="hover:bg-hoverbg p-4 rounded-full">
              {icons["home"](path)}
            </div>
          </Link>
        </DockIcon>
        <DockIcon>
          <Link href="/news">
            <div className="hover:bg-hoverbg p-4 rounded-full">
              {icons["news"](path)}
            </div>
          </Link>
        </DockIcon>
        <DockIcon>
          <div className="p-2 m-2 rounded-full bg-foreground hover:opacity-75">
            {icons["star"]()}
          </div>
        </DockIcon>
        <DockIcon>
          <Link href="/lyca">
            <div className="hover:bg-hoverbg p-4 rounded-full">
              {icons["lyca"](path)}
            </div>
          </Link>
        </DockIcon>
        <DockIcon>
          <Link href="/apps">
            <div className="hover:bg-hoverbg p-4 rounded-full">
              {icons["apps"](path)}
            </div>
          </Link>
        </DockIcon>
      </Dock>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="p-3 rounded-full hover:bg-hoverbg ring-0 outline-0">
            {icons["more"]()}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <p className="m-1">系統主題</p>
              <ThemeToggle />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>設定</DropdownMenuItem>
            <DropdownMenuItem>我的帳號</DropdownMenuItem>
            <DropdownMenuItem>登出</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
