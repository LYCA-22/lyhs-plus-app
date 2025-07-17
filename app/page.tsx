"use client";
import { useAppSelector } from "@/store/hook";
import {
  ArrowRight,
  Bell,
  ChartColumn,
  GraduationCap,
  Hammer,
} from "lucide-react";
import Link from "next/link";
import { CountdownTimer } from "@/components/CountdownTimer";

export default function Home() {
  const AppData = useAppSelector((state) => state.systemData);
  const NewsData = useAppSelector((state) => state.newsData);
  const calendarData = useAppSelector((state) => state.calendarData);
  const collegeEntranceExamDate = new Date("2026-01-16T00:00:00");
  const collegeEntranceExamDate2 = new Date("2025-07-11T00:00:00");

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
            <h1 className="font-medium text-3xl">今天需要什麼資訊呢？</h1>
            <p className="opacity-45 font-normal text-lg my-2">
              點擊下面的按鈕，開啟更多豐富體驗
            </p>
          </div>
          <div className="overflow-auto w-full scrollbar-hide">
            <div className="flex gap-3 whitespace-nowrap min-w-min">
              <Link
                href={"/school/login/openId?path=/school/score"}
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
              <button
                onClick={() => eSchool}
                className="bg-background rounded-full p-3 px-4 flex gap-2 border border-borderColor items-center"
              >
                <GraduationCap size={23} />
                校務行政系統
              </button>
            </div>
          </div>
        </div>
        <div className="p-5 pb-32 flex flex-col gap-3">
          <h1 className="font-light text-2xl">快速小工具</h1>
          <div className="relative grid grid-cols-2 gap-5 overflow-x-auto scroll-smooth scrollbar-hide pb-3">
            <div className="border border-borderColor rounded-[30px] p-4 relative w-full flex flex-col gap-2 shadow-sm dark:bg-zinc-800/40">
              <div>
                <h1 className="text-xl font-medium">校園公告</h1>
                <p className="opacity-50 text-xs">以下為最新的兩則公告</p>
              </div>
              {NewsData.announcements[3] ? (
                <div className="flex flex-col gap-2">
                  <div className="bg-hoverbg w-full overflow-hidden whitespace-nowrap rounded-full p-2">
                    <p className="text-sm">{NewsData.announcements[2].title}</p>
                  </div>
                  <div className="bg-hoverbg w-full overflow-hidden whitespace-nowrap rounded-full p-2">
                    <p className="text-sm">{NewsData.announcements[3].title}</p>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
              <Link
                href={"/news"}
                className="bg-inputPrimary p-2 px-3 rounded-full text-white ml-auto flex gap-2 items-center"
              >
                <ArrowRight size={20} strokeWidth={3} />
              </Link>
            </div>
            <div className="bg-inputPrimary text-white border rounded-[30px] p-4 relative w-full flex flex-col gap-2 shadow-sm">
              <div>
                <h1 className="text-xl font-medium">今天的活動</h1>
                <p className="opacity-50 text-xs">以下為最新的兩則事項</p>
              </div>
              {calendarData.events && calendarData.events.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {(() => {
                    const today = new Date().toISOString().split("T")[0];

                    const todayEvents = calendarData.events.filter(
                      (event) => event.date === today,
                    );

                    return todayEvents.length > 0 ? (
                      todayEvents.slice(0, 2).map((event, index) => (
                        <div
                          key={index}
                          className="bg-zinc-800 w-full overflow-hidden rounded-full p-2"
                        >
                          <p className="text-sm truncate">{event.title}</p>
                        </div>
                      ))
                    ) : (
                      <div className="bg-zinc-800 w-full overflow-hidden rounded-full p-2">
                        <p className="text-sm truncate">今天沒有活動</p>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-hoverbg w-full overflow-hidden rounded-full p-2">
                  <p className="text-sm truncate">載入中...</p>
                </div>
              )}
              <Link
                href={"/calendar"}
                className="bg-hoverbg p-2 px-3 rounded-full text-foreground ml-auto mt-auto flex gap-2 items-center"
              >
                <ArrowRight size={20} strokeWidth={3} />
              </Link>
            </div>
            <div className="relative border border-borderColor rounded-[30px] overflow-hidden p-3 px-4 flex flex-col items-stretch shadow-sm dark:bg-zinc-800/40">
              <CountdownTimer
                targetDate={new Date("2025-06-25T00:00:00")}
                title="第三次段考倒數"
              />
              <Link
                href={
                  "https://schoolmgn.kh.edu.tw/upload/336/104_64614/113-2期末考公告%20網.pdf"
                }
                className="mt-auto text-sm rounded-full w-full bg-sky-100 text-inputPrimary dark:bg-sky-900/50 p-2 flex items-center justify-center"
              >
                點我查看
              </Link>
            </div>
            <div className="border border-borderColor rounded-[30px] overflow-hidden p-3 px-4 flex flex-col items-center justify-center gap-3 shadow-sm dark:bg-zinc-800/40">
              <CountdownTimer
                targetDate={collegeEntranceExamDate}
                title="115 學測倒數"
              />
              <div className="w-full h-[1px] bg-zinc-200"></div>
              <CountdownTimer
                targetDate={collegeEntranceExamDate2}
                title="114 分科倒數"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
