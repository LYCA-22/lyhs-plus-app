"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAppSelector } from "../store/hook";

export function LoadingPage() {
  const [theme, setTheme] = useState("");
  const [imageOut, setImageOut] = useState(false);
  const userLoading = useAppSelector((state) => state.systemStatus.isLoading);
  const NewsLoading = useAppSelector((state) => state.newsData.isLoading);
  const [outing, setOuting] = useState(false);

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

  if (!userLoading && !NewsLoading) {
    setTimeout(() => {
      setOuting(true);
    }, 400);
    setTimeout(() => {
      setImageOut(true);
    }, 600);
  }

  return (
    <>
      {!imageOut && (
        <div
          className={`transition-all delay-75 fixed top-0 flex z-50 w-full h-dvh bg-background items-center justify-center ${outing ? "opacity-0" : "opacity-100"} `}
        >
          <Image
            alt="logo"
            src={`${theme === "dark" ? "/logo-light.svg" : "/logo.svg"}`}
            width={70}
            height={70}
            className={`${outing ? "scale-150 opacity-10" : "opacity-1 scale-100"} transition-all`}
          />
        </div>
      )}
    </>
  );
}
