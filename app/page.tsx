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
import { useAppSelector } from "@/store/hook";
import { homeApps } from "@/types";

interface App {
  name: string;
  icon: string;
  onclick?: string;
  link?: string;
  type: "btn" | "link";
}

const apps = {
  eSchool: {
    name: "校務系統",
    icon: "eschool",
    onclick: "eSchool",
    type: "btn",
  } as App,
  studyHistory: {
    name: "學習歷程",
    icon: "studyHistory",
    link: "https://epf.kh.edu.tw/openId.do",
    type: "link",
  } as App,
  schoolWeb: {
    name: "學校網站",
    icon: "schoolWebIcon",
    link: "https://www.ly.kh.edu.tw/view/index.php?WebID=336",
    type: "link",
  } as App,
  mailBox: {
    name: "學權信箱",
    icon: "mailboxIcon",
    link: "/mailbox/student",
    type: "link",
  } as App,
  mailSearch: {
    name: "信件查詢",
    icon: "searchMailIcon",
    link: "/mailbox/view",
    type: "link",
  } as App,
  calendar: {
    name: "行事曆",
    icon: "calendar",
    link: "/calendar",
    type: "link",
  } as App,
};

type AppKey = keyof typeof apps;

export default function Home() {
  const homeApps = useAppSelector(
    (state) => state.systemStatus.homeApps,
  ) as homeApps[];
  const sysLoad = useAppSelector(
    (state) => state.systemStatus.isLoading,
  ) as boolean;
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

  const eSchool = () => {
    const form = document.createElement("form");
    form.action = "https://highschool.kh.edu.tw/OpenIdLogin.action";
    form.method = "post";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "school";
    input.value = "124311D";

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  };

  const scrollToSlide = (index: number) => {
    api?.scrollTo(index);
    startProgress();
  };

  return (
    <div className="p-3 sm:p-0 max-sm:pt-5">
      <div className="relative max-sm:px-1">
        <Carousel
          plugins={[
            Autoplay({ delay: AUTO_PLAY_DELAY, stopOnInteraction: false }),
          ]}
          className="rounded-2xl sm:rounded-bl-none sm:rounded-br-none bg-gradient-to-br from-zinc-100 to-white p-5 dark:from-hoverbg dark:to-zinc-950 relative"
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
                    歡迎使用LYHS Plus
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
      <div className="relative my-2">
        <div className="flex items-center justify-between mx-4 mb-2 px-3">
          <h1 className="text-xl font-medium">快速捷徑</h1>
          <button className="border-b border-zinc-300 py-1">顯示更多</button>
        </div>
        <div className="flex overflow-x-auto px-2 relative scroll-smooth scrollbar-hide flex-wrap">
          {!sysLoad &&
            homeApps.map((app, index) => {
              const appData = apps[app as AppKey];
              return (
                <div key={index}>
                  {appData.type === "btn" ? (
                    <button
                      onClick={
                        appData.onclick === "eSchool" ? eSchool : () => {}
                      }
                      className="min-w-fit p-2 px-4 text-foreground hover:bg-hoverbg flex flex-col justify-center items-center rounded-2xl transition-all font-medium m-1 hover:opacity-70 active:scale-95"
                    >
                      <Image
                        alt="mailbox"
                        src={`./serviceIcon/${appData.icon}${theme === "dark" ? "-dark" : ""}.svg`}
                        width={60}
                        height={60}
                      />
                      <p className="text-sm">{appData.name}</p>
                    </button>
                  ) : (
                    <Link
                      href={appData.link || "/"}
                      className="min-w-fit p-2 px-4 text-foreground hover:bg-hoverbg flex flex-col justify-center items-center rounded-2xl transition-all font-medium m-1 hover:opacity-70 active:scale-95"
                    >
                      <Image
                        alt="mailbox"
                        src={`./serviceIcon/${appData.icon}${theme === "dark" ? "-dark" : ""}.svg`}
                        width={60}
                        height={60}
                      />
                      <p className="text-sm">{appData.name}</p>
                    </Link>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
