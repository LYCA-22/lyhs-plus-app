"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAppSelector } from "../store/hook";

export function LoadingPage() {
  const [theme, setTheme] = useState("");
  const [imageOut, setImageOut] = useState(false);
  const userLoading = useAppSelector((state) => state.systemData.isLoading);
  const NewsLoading = useAppSelector((state) => state.newsData.isLoading);

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

  useEffect(() => {
    if (!userLoading && !NewsLoading) {
      setImageOut(true);
    }
  }, [userLoading, NewsLoading]);

  return (
    <>
      {!imageOut && (
        <div
          className={`fixed top-0 flex z-[10000] w-full h-dvh bg-background items-center justify-center opacity-100`}
        >
          <Image
            alt="logo"
            src={`${theme === "dark" ? "/logo-light.svg" : "/logo.svg"}`}
            width={70}
            height={70}
          />
        </div>
      )}
    </>
  );
}
