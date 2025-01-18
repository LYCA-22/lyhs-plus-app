"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAppSelector } from "../store/hook";

export function LoadingPage() {
  const [theme, setTheme] = useState("");
  const [imageOut, setImageOut] = useState(false);
  const loading = useAppSelector((state) => state.systemStatus.isLoading);

  useEffect(() => {
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

  if (!loading) {
    setTimeout(() => {
      setImageOut(true);
    }, 150);
  }

  return (
    <>
      {!imageOut && (
        <div className="fixed top-0 flex z-50 w-full h-dvh bg-background items-center justify-center">
          <Image
            alt="logo"
            src={`${theme === "dark" ? "/logo-light.svg" : "/logo.svg"}`}
            width={70}
            height={70}
            className={`${!loading ? "scale-150 opacity-10" : "opacity-1 scale-100"} transition-all`}
          />
        </div>
      )}
    </>
  );
}
