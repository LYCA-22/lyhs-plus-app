"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAppSelector } from "../store/hook";

export function LoadingPage() {
  const [imageOut, setImageOut] = useState(false);
  const userLoading = useAppSelector((state) => state.systemData.isLoading);
  const NewsLoading = useAppSelector((state) => state.newsData.isLoading);

  useEffect(() => {
    if (!userLoading && !NewsLoading) {
      setImageOut(true);
    }
  }, [userLoading, NewsLoading]);

  return (
    <>
      {!imageOut && (
        <div
          className={`fixed top-0 flex z-[10000] w-full h-dvh bg-white items-center justify-center opacity-100`}
        >
          <Image
            alt="logo"
            src="/icon_with_text.svg"
            width={200}
            height={100}
            className="mb-40"
          />
        </div>
      )}
    </>
  );
}
