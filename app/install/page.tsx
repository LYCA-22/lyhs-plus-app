"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import Link from "next/link";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function Page() {
  // 儲存安裝提示事件
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // 監聽 beforeinstallprompt 事件
    const handleBeforeInstallPrompt = (e: Event) => {
      // 防止 Chrome 67 及更早版本自動顯示安裝提示
      e.preventDefault();

      const promptEvent = e as unknown as BeforeInstallPromptEvent;
      if ("prompt" in promptEvent && "userChoice" in promptEvent) {
        // 保存事件，以便稍後觸發
        setDeferredPrompt(promptEvent);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  // 處理安裝按鈕點擊
  const handleInstall = async () => {
    if (deferredPrompt) {
      // 顯示安裝提示
      deferredPrompt.prompt();

      // 等待用戶回應
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`用戶安裝結果: ${outcome}`);

      // 已使用過該提示，清空它
      setDeferredPrompt(null);
    } else {
      // 針對 iOS 設備提供說明，或是提示用戶手動安裝
      alert("請使用瀏覽器的「加入主畫面」功能來安裝此應用");
    }
  };

  return (
    <div className="fixed z-[1000] top-0 w-full h-dvh bg-white text-black flex flex-col items-center justify-center p-4 gap-6">
      <Image
        src={"/postImage/welcome/post-photo-1-light.svg"}
        width={100}
        height={100}
        alt="logo"
        priority
        loading="eager"
      />
      <h1 className="text-2xl font-medium">安裝 LYHS+ 應用程式</h1>
      <div className="flex flex-col items-center px-5 gap-2 relative mb-10">
        <button
          onClick={handleInstall}
          className="w-full justify-center bg-inputPrimary hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-full flex items-center gap-2 transition-colors"
        >
          <Download size={20} />
          安裝（加入主畫面）
        </button>
        <Link
          href={"https://plus.lyhsca.org"}
          className="w-full justify-center items-center gap-2 mt-2 flex bg-zinc-200 py-3 px-6 rounded-full"
        >
          <ArrowUpRight size={20} />
          瞭解更多
        </Link>
        <p className="text-sm text-gray-600 max-w-xs text-center mt-2">
          安裝後可像原生 App 一樣從主畫面快速啟動，開啟便利生活。
        </p>
      </div>
      <div className="absolute bottom-10 flex gap-2 items-center justify-center font-medium rounded-full border border-zinc-200 bg-zinc-50 shadow-2xl pl-3 p-1 mx-5">
        <Image
          alt="LycaLogo"
          src="/lyca/lyca-logo.svg"
          width={16}
          height={16}
        />
        <p className="text-[14px]">此系統由林園高中班聯會建置與維護</p>
        <Link
          href={"https://www.instagram.com/lyca_22nd"}
          className="bg-zinc-200 hover:bg-black hover:text-white p-1 rounded-full px-2 text-sm"
        >
          聯絡我們
        </Link>
      </div>
    </div>
  );
}
