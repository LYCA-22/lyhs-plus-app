"use client";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useRouter } from "next/navigation";
import { ArrowRight, Settings2 } from "lucide-react";
import { updateSystemData } from "@/store/systemSlice";

interface App {
  name: string;
  icon: string;
  onclick?: string;
  link?: string;
  type: "btn" | "link";
  color: string;
  description: string;
}

const apps = {
  eSchool: {
    name: "校務系統",
    icon: "eschool",
    onclick: "eschool",
    type: "btn",
    color: "bg-purple-100 dark:bg-purple-900/50",
    description: "直接透過 OpenID 快速登入，查閱個人學業資料",
  } as App,
  studyHistory: {
    name: "學習歷程",
    icon: "studyhistory",
    link: "https://epf.kh.edu.tw/openId.do",
    type: "link",
    color: "bg-red-50 dark:bg-red-900/50",
    description: "直接透過 OpenID 快速登入，修改或新增學習歷程項目",
  } as App,
  schoolWeb: {
    name: "學校網站",
    icon: "schoolWebIcon",
    link: "https://www.ly.kh.edu.tw/view/index.php?WebID=336",
    type: "link",
    color: "bg-sky-50 dark:bg-sky-900/50",
    description: "此按鈕會開啟林園高中官方網站，可以查閱更多資訊",
  } as App,
  mailBox: {
    name: "學權信箱",
    icon: "mailboxIcon",
    link: "/mail/stu",
    type: "link",
    color: "bg-green-50 dark:bg-green-900/50",
    description:
      "若權利受損時，可以使用此管道讓我們知道，我們將盡快處理您的問題",
  } as App,
  mailSearch: {
    name: "信件查詢",
    icon: "searchmail",
    link: "/mail/view",
    type: "link",
    color: "bg-yellow-50 dark:bg-yellow-900/50",
    description: "查詢學權信箱信件進度與詳細資訊",
  } as App,
  calendar: {
    name: "行事曆",
    icon: "calendar",
    link: "/calendar",
    type: "link",
    color: "bg-orange-50 dark:bg-orange-900/50",
    description: "查詢校園行事曆、各項活動日期",
  } as App,
  repair: {
    name: "線上報修",
    icon: "repair",
    link: "/repair",
    type: "link",
    color: "bg-green-50 dark:bg-green-900/50",
    description: "線上化報修系統，提供快速、方便的報修服務",
  } as App,
};

type AppKey = keyof typeof apps;

export default function Home() {
  const AppData = useAppSelector((state) => state.systemData);
  const router = useRouter();
  const dispatch = useAppDispatch();

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

  return (
    <div id="home-main">
      {/*
      <div className="relative">
        <Carousel
          plugins={[
            Autoplay({ delay: AUTO_PLAY_DELAY, stopOnInteraction: false }),
          ]}
          className="bg-gradient-to-br from-zinc-100 to-white p-4 pt-deviceTop dark:from-hoverbg dark:to-zinc-950 relative"
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
                loading="eager"
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
                    className="bg-primary text-background font-medium p-2 px-4 max-sm:px-3 rounded-full hover:opacity-70 transition-all"
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
                loading="eager"
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
                    className="bg-primary text-medium text-background font-medium p-2 px-4 max-sm:px-3 rounded-full hover:opacity-70 transition-all"
                  >
                    申請
                  </Link>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        <div className="p-4 pl-6">
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
                className="bg-gradient-to-br from-buttonBg to-background p-2 border-border border rounded-full transition-all active:scale-85"
              >
                {icons["BarArrowLeft"]()}
              </button>
              <button
                onClick={() => {
                  scrollToSlide(currentSlide + 1);
                }}
                className="bg-gradient-to-br from-buttonBg to-background p-2 border-border border rounded-full transition-all active:scale-85"
              >
                {icons["BarArrowRight"]()}
              </button>
            </div>
          </div>
        </div>
      </div>
      */}
      <div className="relative bg-zinc-100">
        <div className="px-5 pt-5 flex justify-between items-center">
          <h1 className="text-2xl font-medium">總覽</h1>
          <button
            onClick={() => dispatch(updateSystemData({ isSetOpen: true }))}
          >
            <Settings2 size={22} className="opacity-50" />
          </button>
        </div>
        <div className="bg-sky-500 rounded-b-3xl rounded-t-lg mx-5 mt-4 p-3 px-4 text-white">
          <h1 className="text-[16px] font-medium">您正在使用新版介面</h1>
          <p className="text-sky-800 text-sm">
            此介面目前仍為測試版，使用請注意！
          </p>
        </div>
        <div className="flex items-center justify-center w-full mt-3">
          <div className="h-[6px] w-10 bg-zinc-300 dark:bg-zinc-600 rounded-full"></div>
        </div>
        <div className="bg-background mt-5 rounded-t-3xl pb-32 shadow-[0_0px_12px_0_rgba(0,0,0,0.15)] grid grid-cols-2 gap-5 p-5 pt-6 overflow-x-auto relative scroll-smooth scrollbar-hide">
          {!AppData.isLoading &&
            AppData.homeApps.map((app, index) => {
              const appData = apps[app as AppKey];
              return (
                <button
                  key={index}
                  onClick={
                    appData.type === "btn"
                      ? appData.icon == "eschool"
                        ? eSchool
                        : () => {}
                      : () => router.push(appData.link || "/")
                  }
                  className={`bg-zinc-100 relative rounded-3xl hover:scale-105 transition-all`}
                >
                  <div className="h-full relative p-4 flex flex-col justify-center items-start gap-3 transition-all font-medium">
                    <Image
                      alt="mailbox"
                      src={`./serviceIcon/${appData.icon}.svg`}
                      width={28}
                      height={28}
                      priority
                    />
                    <div className="text-left flex flex-col gap-2">
                      <h1 className="text-[16px] opacity-80 font-medium">
                        {appData.name}
                      </h1>
                      <p className="opacity-50 text-sm text-left">
                        {appData.description}
                      </p>
                    </div>
                    <div className="w-full mt-auto">
                      <ArrowRight className="opacity-50" />
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}
