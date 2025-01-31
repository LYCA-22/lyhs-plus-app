"use client";
import { useState, useEffect, useRef } from "react";
import { icons } from "@/components/icons";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [progress, setProgress] = useState(0);
  const AUTO_PLAY_DELAY = 7000;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [theme, setTheme] = useState<string>("");
  const startProgress = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setProgress(0);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const nextVal = prev + (50 / AUTO_PLAY_DELAY) * 100;
        return nextVal >= 100 ? 100 : nextVal;
      });
    }, 50);
  };

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
    if (progress >= 100 && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [progress]);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
      startProgress();
    });

    startProgress();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [api]);

  const scrollToSlide = (index: number) => {
    api?.scrollTo(index);
    startProgress();
  };

  return (
    <div className="p-3 sm:p-0">
      <div className="p-3 relative sm:p-0">
        <Carousel
          plugins={[
            Autoplay({ delay: AUTO_PLAY_DELAY, stopOnInteraction: false }),
          ]}
          className="rounded-2xl sm:rounded-bl-none sm:rounded-br-none bg-gradient-to-br from-hoverbg to-white p-5 dark:to-zinc-950 relative"
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={(emblaApi) => {
            setApi(emblaApi);
          }}
        >
          <CarouselContent>
            <CarouselItem className="flex flex-col items-center relative">
              <Image
                className="w-1/2"
                alt="post1"
                src={`./postImage/welcome/post-photo-1-${theme === "light" ? "light" : "dark"}.svg`}
                width={20}
                height={20}
                priority
              />
              <div className="w-full flex items-center justify-between absolute bottom-0 px-2">
                <div>
                  <h1 className="font-bold text-lg max-sm:text-medium">
                    歡迎使用LYHS+
                  </h1>
                  <p className="text-sm opacity-50  max-sm:text-xs">
                    盡情探索LYHS+的功能吧！
                  </p>
                </div>
                <div>
                  <Link
                    href="/"
                    className="bg-primary text-background max-sm:text-xs font-medium p-2 px-4 max-sm:px-3 rounded-full hover:opacity-70 transition-all"
                  >
                    探索
                  </Link>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem className="flex flex-col items-center">
              <Image
                className="w-1/2"
                alt="post1"
                src={`./postImage/dev/post-photo-2-${theme === "light" ? "light" : "dark"}.svg`}
                width={20}
                height={20}
                priority
              />
              <div className="w-full flex items-center justify-between">
                <div>
                  <h1 className="font-bold text-lg max-sm:text-medium">
                    我們正在招募團隊成員
                  </h1>
                  <p className="text-sm opacity-50  max-sm:text-xs">
                    加入我們一起成為校園資訊發展的推手！
                  </p>
                </div>
                <div>
                  <Link
                    href="/"
                    className="bg-primary text-medium max-sm:text-xs text-background font-medium p-2 px-4 max-sm:px-3 rounded-full hover:opacity-70 transition-all"
                  >
                    申請
                  </Link>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        <div className="p-3 sm:px-7">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {[0, 1].map((index) => (
                <div
                  key={index}
                  onClick={() => scrollToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer overflow-y-auto ${
                    currentSlide === index
                      ? "w-6 bg-gray-300 dark:bg-zinc-600"
                      : "w-2 bg-gray-300 dark:bg-zinc-600"
                  }`}
                >
                  {currentSlide === index && (
                    <div
                      className="h-2 bg-gradient-to-br from-primary/10 to-primary dark:to-primary/50"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-center justify-center">
              <button
                onClick={() => {
                  scrollToSlide(currentSlide - 1);
                }}
                className="bg-hoverbg p-2 rounded-full hover:bg-buttonBg transition-all active:scale-95"
              >
                {icons["BarArrowLeft"]()}
              </button>
              <button
                onClick={() => {
                  scrollToSlide(currentSlide + 1);
                }}
                className="bg-hoverbg p-2 rounded-full hover:bg-buttonBg transition-all active:scale-95"
              >
                {icons["BarArrowRight"]()}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <h1 className="mx-4 mb-2 text-xl font-medium">快速捷徑</h1>
        <div className="flex overflow-x-auto px-2 relative scroll-smooth scrollbar-hide">
          <Link
            href={"/mailbox/student"}
            className="min-w-fit p-2 px-4 text-foreground hover:bg-hoverbg flex flex-col justify-center items-center rounded-2xl transition-all font-medium m-1 hover:opacity-70 active:scale-95"
          >
            <Image
              alt="mailbox"
              src={`./serviceIcon/mailboxIcon${theme === "dark" ? "-dark" : ""}.svg`}
              width={60}
              height={60}
            />
            <p className="text-sm">學權信箱</p>
          </Link>
          <Link
            href={"/mailbox/student"}
            className="min-w-fit p-2 px-4 text-foreground hover:bg-hoverbg flex flex-col justify-center items-center rounded-2xl transition-all font-medium m-1 hover:opacity-70 active:scale-95"
          >
            <Image
              alt="mailbox"
              src={`./serviceIcon/schoolWebIcon${theme === "dark" ? "-dark" : ""}.svg`}
              width={60}
              height={60}
            />
            <p className="text-sm">學校網站</p>
          </Link>
          <Link
            href={"/mailbox/view"}
            className="min-w-fit p-2 px-4 text-foreground hover:bg-hoverbg flex flex-col justify-center items-center rounded-2xl transition-all font-medium m-1 hover:opacity-70 active:scale-95"
          >
            <Image
              alt="mailbox"
              src={`./serviceIcon/searchMailIcon${theme === "dark" ? "-dark" : ""}.svg`}
              width={60}
              height={60}
            />
            <p className="text-sm">信件查詢</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
