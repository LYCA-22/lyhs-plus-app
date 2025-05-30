"use client";
import Image from "next/image";
import { useAppSelector } from "@/store/hook";
import { useRouter } from "next/navigation";
import { ArrowRight, Bell, ChartColumn, Hammer } from "lucide-react";
import { App } from "@/types";
import Link from "next/link";

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
      <div className={`relative`}>
        <div
          className={`w-full ${AppData.isPwa ? "pt-deviceTop" : "pt-5 pb-2"} bg-gradient-to-b from-orange-200 dark:from-orange-200/20 to-background`}
        ></div>
        <div className="px-5 flex justify-between items-center bg-transparent">
          <div className="flex gap-3 items-center">
            <div className="w-7 h-7 rounded-full bg-gradient-to-t from-sky-300 to-orange-200"></div>
            <p className="font-sans font-medium text-[20px]">你好</p>
          </div>
        </div>
        <div className="p-5 relative">
          <div aria-label="home-title" className="mb-10">
            <h1 className="font-light text-3xl">今天需要什麼資訊呢？</h1>
            <p className="opacity-45 font-light text-lg my-2">
              點擊下面的按鈕，開啟更多豐富體驗
            </p>
          </div>
          <div className="overflow-auto w-full scrollbar-hide">
            <div className="flex gap-3 whitespace-nowrap min-w-min">
              <Link
                href={"/"}
                className="bg-foreground rounded-full p-3 px-4 text-background flex gap-2 items-center"
              >
                <ChartColumn size={23} />
                成績查詢
              </Link>
              <Link
                href={"/repair"}
                className="bg-background rounded-full p-3 px-4 flex gap-2 border border-borderColor items-center"
              >
                <Hammer size={23} />
                線上報修
              </Link>
              <Link
                href={"/news"}
                className="bg-background rounded-full p-3 px-4 flex gap-2 border border-borderColor items-center"
              >
                <Bell size={23} />
                查看今天最新的公告
              </Link>
            </div>
          </div>
        </div>
        <div className="pb-32 grid grid-cols-2 gap-5 p-5 overflow-x-auto relative scroll-smooth scrollbar-hide">
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
                  className={`bg-hoverbg relative rounded-3xl hover:opacity-80 transition-all`}
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
