"use client";
import { useAppSelector } from "@/store/hook";
import { ArrowRight, ChartPie, Database, Hammer } from "lucide-react";
import Link from "next/link";
import { CountdownTimer } from "@/components/CountdownTimer";

export default function Home() {
  const AppData = useAppSelector((state) => state.systemData);
  const NewsData = useAppSelector((state) => state.newsData);
  const calendarData = useAppSelector((state) => state.calendarData);
  const collegeEntranceExamDate = new Date("2026-01-17T00:00:00");

  return (
    <div className={`relative`}>
      {/* Top gradient */}
      <div
        className={`w-full ${AppData.isPwa ? "pt-deviceTop" : "pt-5 pb-2"} bg-gradient-to-b from-orange-200 dark:from-orange-200/20 to-background`}
      ></div>

      {/* Hello Message */}
      <div className="px-5 flex items-center bg-transparent gap-3">
        <div className="w-7 h-7 rounded-full bg-gradient-to-t from-sky-300 to-orange-200"></div>
        <p className="font-sans font-medium text-[20px]">你好</p>
      </div>

      {/* Top Components */}
      <div className="p-5 relative">
        <div aria-label="home-title">
          <h1 className="font-medium text-3xl">今天過得怎麼樣呢？</h1>
          <p className="opacity-45 font-normal text-lg my-2">
            點擊下面的按鈕，開啟更多豐富體驗
          </p>
        </div>
        <div className="overflow-auto w-full scrollbar-hide my-8">
          <div className="flex gap-3 whitespace-nowrap min-w-min">
            <div className="flex rounded-3xl overflow-x-hidden bg-foreground bg-opacity-60 text-white">
              <Link
                href={"/school/login/openId?path=/school/score"}
                className="p-3 px-4 flex gap-2 items-center"
              >
                <ChartPie size={23} />
                成績查詢
              </Link>
              <div className="h-full w-[1px] bg-borderColor opacity-50"></div>
              <Link
                href={"/school/login/openId?path=/school/absence"}
                className="p-3 px-4 flex gap-2 items-center"
              >
                <Database size={23} />
                缺曠課查詢
              </Link>
            </div>
            {/*
            <Link
              href={"/repair"}
              className="bg-hoverbg rounded-full p-3 px-4 flex gap-2 items-center"
            >
              <Hammer size={23} />
              線上報修
            </Link>
            */}
          </div>
        </div>
      </div>

      <div className="px-5 pb-32 flex flex-col gap-3">
        <h2 className="font-light text-2xl">快速小工具</h2>
        <div className="relative grid grid-cols-2 gap-5 overflow-x-auto scroll-smooth scrollbar-hide pb-3">
          <div className="border border-borderColor rounded-[30px] p-4 relative w-full flex flex-col gap-2 shadow-sm dark:bg-zinc-800/40">
            <div>
              <h3 className="text-xl font-medium">校園公告</h3>
              <p className="opacity-50 text-xs">以下為最新的兩則公告</p>
            </div>

            {/* 使用2和3，是為了防止讀取到釘選的公告 */}
            {NewsData.announcements && NewsData.announcements[3] ? (
              <div className="flex flex-col gap-2">
                <div className="bg-hoverbg w-full overflow-hidden whitespace-nowrap rounded-full p-2">
                  <p className="text-sm">{NewsData.announcements[2].title}</p>
                </div>
                <div className="bg-hoverbg w-full overflow-hidden whitespace-nowrap rounded-full p-2">
                  <p className="text-sm">{NewsData.announcements[3].title}</p>
                </div>
              </div>
            ) : (
              <div>無最新公告</div>
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
              <h3 className="text-xl font-medium">今天的活動</h3>
              <p className="opacity-50 text-xs">以下為最新的兩則事項</p>
            </div>
            <div className="flex flex-col gap-2 bg-zinc-800 rounded-full">
              {(() => {
                const today = new Date().toISOString().split("T")[0];

                const todayEvents = calendarData.events.filter(
                  (event) => event.date === today,
                );

                return todayEvents.length > 0 ? (
                  todayEvents.slice(0, 2).map((event, index) => (
                    <div
                      key={index}
                      className="w-full overflow-hidden rounded-full p-2"
                    >
                      <p className="text-sm truncate">{event.title}</p>
                    </div>
                  ))
                ) : (
                  <div className="w-full overflow-hidden rounded-full p-2">
                    <p className="text-sm truncate">今天沒有活動</p>
                  </div>
                );
              })()}
            </div>
            <Link
              href={"/calendar"}
              className="bg-hoverbg p-2 px-3 rounded-full text-foreground ml-auto mt-auto flex gap-2 items-center"
            >
              <ArrowRight size={20} strokeWidth={3} />
            </Link>
          </div>
          <div className="relative border border-borderColor rounded-[30px] overflow-hidden p-3 pb-0 px-4 flex flex-col items-center justify-center gap-3 shadow-sm dark:bg-zinc-800/40">
            <CountdownTimer
              targetDate={collegeEntranceExamDate}
              title="115 學測倒數"
            />
          </div>
          <div className="border border-borderColor rounded-[30px] overflow-hidden p-3 px-4 flex flex-col gap-3 shadow-sm dark:bg-zinc-800/40">
            <div>
              <h3 className="text-[14px]">114-1</h3>
              <p className="text-xl">第一次段考</p>
              <p className="text-xs opacity-50">提供段考相關資訊</p>
            </div>
            <button
              onClick={() => {
                window.alert("尚未公布");
              }}
              className="bg-sky-200 rounded-full p-2 text-sky-950 dark:bg-sky-950 dark:text-sky-100"
            >
              段考考程
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
