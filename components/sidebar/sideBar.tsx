"use client";
import React, { useState, useEffect } from "react";
import { Dock, DockIcon } from "../ui/dock";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { icons } from "@/components/icons";
import Image from "next/image";
import { ThemeToggle } from "@/components/sidebar/themeToggle";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import { apiService } from "@/services/api";
import { LoginPage } from "./LoginPage";
import { loadNews } from "@/store/newsSlice";

export function SideBar() {
  const [theme, setTheme] = useState("");
  const [path, setPath] = useState("");
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const IsLoggedIn = useAppSelector((state) => state.userData.isLoggedIn);
  const SystemData = useAppSelector((state) => state.systemStatus);
  const version = process.env.NEXT_PUBLIC_APP_VERSION;
  let time = process.env.NEXT_PUBLIC_BUILD_TIME;
  const { sessionId } = useAppSelector((state) => state.userData);
  const router = useRouter();
  const dispatch = useAppDispatch();

  if (!time) {
    throw new Error("Build time not found");
  } else {
    time = time
      .replace("T", " ")
      .replace("Z", "")
      .replace(/-/g, "/")
      .split(".")[0];
  }

  useEffect(() => {
    // 接收來自 iframe 的訊息處理器
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://auth.lyhsca.org") {
        return;
      }

      const data = event.data;

      if (data.type === "loginSuccess") {
        window.location.reload();
      } else if (data.type === "loginFailed") {
        alert(`登入失敗: ${data.message}`);
        window.location.reload();
      }
    };

    // 添加事件監聽
    window.addEventListener("message", handleMessage);

    // 清理函數
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [router]);

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

  useEffect(() => {
    const checkIsMobile = () => {
      const isMobileDevice = window.innerWidth <= 640;
      setIsMobile(isMobileDevice);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
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

  if (!mounted) {
    return null;
  }

  if (isMobile) {
    return <></>;
  }

  return (
    <div className="flex justify-between flex-col items-center p-3 py-7 min-w-32">
      <Image
        alt="logo"
        src={`${theme === "dark" ? "/logo-light.svg" : "/logo.svg"}`}
        width={40}
        height={40}
      />
      <Dock
        direction="middle"
        className="rounded-full flex flex-col bg-background"
      >
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
          <DropdownMenuTrigger className="p-3 rounded-full hover:bg-background ring-0 outline-0">
            {icons["more"]()}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <p className="m-1">系統主題</p>
              <ThemeToggle />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={"./settings"} className="w-full">
                設定
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>我的帳號</DropdownMenuItem>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  系統資訊
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="mb-2">
                    LYHS Plus App 系統資訊
                  </DialogTitle>
                  <DialogDescription>
                    <p className="m-1 ml-0">目前版本：{version} [BETA]</p>
                    <p className="m-1 ml-0">發佈時間：{time}</p>
                    <p className="m-1 ml-0">裝置系統：{SystemData.os}</p>
                    <p className="m-1 ml-0">
                      裝置類型：
                      {SystemData.isMobile === true ? "手機設備" : "平板或電腦"}
                    </p>
                    <p className="m-1 ml-0">
                      瀏覽器：
                      {SystemData.browser}
                    </p>
                    <div className="flex items-center justify-between border-t-1 border-borderColor pt-2 mt-4">
                      <p className="font-bold">
                        Copyright © 2025 LYHS+ 保留一切權利。
                      </p>
                      <div className="flex">
                        <button className="hover:bg-hoverbg rounded-full p-2 px-3 transition-all">
                          隱私政策
                        </button>
                        <button className="hover:bg-hoverbg rounded-full p-2 px-3 transition-all">
                          服務條款
                        </button>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            {IsLoggedIn ? (
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await apiService.Logout(sessionId);
                  } catch (error) {
                    console.error("Logout failed:", error);
                  }
                }}
              >
                登出
              </DropdownMenuItem>
            ) : (
              <LoginPage>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  登入
                </DropdownMenuItem>
              </LoginPage>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
