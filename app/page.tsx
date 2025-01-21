"use client";
import { useState, useEffect, useRef } from "react";
import { SchoolSystem } from "../components/SchoolSystem";
import { icons } from "@/components/icons";
import { motion } from "framer-motion";

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
        {word}，今天過得怎麼樣？
      </h1>
      <div className="relative mt-4">
        <div
          className="flex overflow-x-auto px-2 relative scroll-smooth scrollbar-hide"
          ref={scrollContainer}
        >
          <SchoolSystem />
          <button className="min-w-fit p-2 px-3 bg-background text-foreground border border-borderColor flex justify-center items-center rounded-full transition-all m-1 hover:opacity-70 active:scale-95 hover:bg-hoverbg">
            學校網站
          </button>
          <button className="min-w-fit p-2 px-3 bg-background text-foreground border border-borderColor flex justify-center items-center rounded-full transition-all m-1 hover:opacity-70 active:scale-95 hover:bg-hoverbg">
            學校網站
          </button>
          <button className="min-w-fit p-2 px-3 bg-background text-foreground border border-borderColor flex justify-center items-center rounded-full transition-all m-1 hover:opacity-70 active:scale-95 hover:bg-hoverbg">
            學校網站
          </button>
          <button className="min-w-fit p-2 px-3 bg-background text-foreground border border-borderColor flex justify-center items-center rounded-full transition-all m-1 hover:opacity-70 active:scale-95 hover:bg-hoverbg">
            學校網站
          </button>
        </div>
        {canScrollLeft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 left-0 bg-gradient-to-l w-[80px] h-full to-white from-white/0 dark:to-background dark:from-black/0"
          ></motion.div>
        )}
        {canScrollRight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 right-0 bg-gradient-to-l w-[80px] h-full to-white/0 from-white dark:from-background dark:to-black/0"
          ></motion.div>
        )}
        <div className="flex gap-3 m-2 relative">
          <button
            onClick={() => scroll("left")}
            className="bg-hoverbg p-2 rounded-full mt-2 hover:bg-buttonBg transition-all active:scale-95"
          >
            {icons["BarArrowLeft"]()}
          </button>
          <button
            onClick={() => scroll("right")}
            className="bg-hoverbg p-2 rounded-full mt-2 hover:bg-buttonBg transition-all active:scale-95"
          >
            {icons["BarArrowRight"]()}
          </button>
          <div className="h-[1px] w-10/12 bg-borderColor mt-7 mx-2"></div>
        </div>
      </div>
    </div>
  );
}
