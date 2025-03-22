"use client";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import Image from "next/image";
import { updateSystemData } from "@/store/systemSlice";

export default function BetaAlert() {
  const systemStatus = useAppSelector((state) => state.systemData);
  const [start, setStart] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const html = document.querySelector("html");
    const observer = new MutationObserver(() => {
      if (html?.classList.contains("dark")) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    });

    observer.observe(html!, { attributes: true });

    if (html?.classList.contains("dark")) {
      setTheme("dark");
    } else {
      setTheme("light");
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!systemStatus.isLoading && !systemStatus.used) {
      setTimeout(() => {
        setStart(true);
      }, 900);
    } else {
      setStart(false);
    }
  }, [systemStatus]);

  const handleAccept = () => {
    localStorage.setItem("lyps_used", "true");
    dispatch(updateSystemData({ used: true }));
  };

  return (
    <>
      {!systemStatus.used ? (
        <div className="w-full fixed z-40 h-dvh bg-black/50 backdrop-blur-xl flex justify-center items-center px-10">
          <div
            className={`p-7 bg-background rounded-3xl flex flex-col justify-center items-center text-center max-w-[500px] transition-all ${start ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
          >
            <Image
              src={theme === "light" ? "/logo.svg" : "logo-light.svg"}
              width={50}
              height={50}
              alt="logo"
              priority
              loading="eager"
            />
            <h1 className="text-xl font-bold m-2">歡迎使用 LYHS+</h1>
            <p>
              非常感謝你願意支持我們的應用程式！提醒您此應用程式正處於測試階段，可能會發生一些錯誤和無效回應。
            </p>
            <button
              onClick={handleAccept}
              className="p-2 px-4 bg-foreground text-background rounded-full mt-4 font-medium hover:opacity-60 transition-all"
            >
              了解
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
