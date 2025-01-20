"use client";
import { useState, useEffect, useRef } from "react";
import { SchoolSystem } from "../components/SchoolSystem";
import { icons } from "@/components/icons";

export default function Home() {
  const [word, setWord] = useState("");
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainer.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainer.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
      }
    };

    const container = scrollContainer.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      // 初始檢查
      checkScroll();

      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: string) => {
    if (scrollContainer.current) {
      if (direction === "right") {
        scrollContainer.current.scrollLeft += 100; // 每次移動 100px
      } else {
        scrollContainer.current.scrollLeft -= 100;
      }
    }
  };

  // 根據時間決定顯示的詞語
  const updateWord = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setWord("早安");
    } else if (hour >= 12 && hour < 18) {
      setWord("下午好");
    } else {
      setWord("晚安");
    }
  };

  useEffect(() => {
    updateWord();
    const interval = setInterval(updateWord, 1000 * 60);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="px-3">
      <h1 className="text-2xl font-medium m-3 mb-2">
        {word}，今天在想要做什麼呢？
      </h1>
      <div className="relative mt-4">
        <div
          className="flex overflow-x-auto px-2 relative scroll-smooth scrollbar-hide"
          ref={scrollContainer}
        >
          <SchoolSystem />
          <button className="min-w-fit p-2 px-3 bg-background text-foreground border border-borderColor flex justify-center items-center rounded-full transition-all m-1 hover:opacity-70 active:scale-95">
            學校網站
          </button>
          <button className="min-w-fit p-2 px-3 bg-background text-foreground border border-borderColor flex justify-center items-center rounded-full transition-all m-1 hover:opacity-70 active:scale-95">
            學校網站
          </button>
          <button className="min-w-fit p-2 px-3 bg-background text-foreground border border-borderColor flex justify-center items-center rounded-full transition-all m-1 hover:opacity-70 active:scale-95">
            學校網站
          </button>
          <button className="min-w-fit p-2 px-3 bg-background text-foreground border border-borderColor flex justify-center items-center rounded-full transition-all m-1 hover:opacity-70 active:scale-95">
            學校網站
          </button>
        </div>
        {/* 滾動按鈕 */}
        {canScrollLeft && (
          <div className="absolute top-0 left-0 bg-gradient-to-l w-[80px] h-full to-white from-white/0 dark:to-background dark:from-black/0"></div>
        )}
        {canScrollRight && (
          <div className="absolute top-0 right-0 bg-gradient-to-l w-[80px] h-full to-white/0 from-white dark:from-background dark:to-black/0"></div>
        )}
        <div className="flex gap-3 m-2 absolute">
          <button
            onClick={() => scroll("left")}
            className="bg-hoverbg p-2 rounded-full mt-2"
          >
            {icons["BarArrowLeft"]()}
          </button>
          <button
            onClick={() => scroll("right")}
            className="bg-hoverbg p-2 rounded-full mt-2"
          >
            {icons["BarArrowRight"]()}
          </button>
        </div>
      </div>
    </div>
  );
}
