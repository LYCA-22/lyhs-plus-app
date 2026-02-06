// LYHS Plus 全新首頁
"use client";
import LatestNews from "@/components/widget/latestNews";
import Calendar from "@/components/widget/calendar";
import { CountdownTimer } from "@/components/widget/CountdownTimer";
import HRegularExam from "@/components/widget/HRegularExam";
import Link from "next/link";

export default function Page() {
  const college115 = new Date("2026-01-17T08:00:00");

  return (
    <div className="pb-36">
      <div className="flex flex-col gap-1 items-center justify-center p-5 pt-16 bg-gradient-to-b from-orange-100 dark:from-orange-950 to-background">
        <h1 className="text-lg opacity-50">歡迎使用 LYHS Plus</h1>
        <h2 className="text-[30px] text-orange-600">今天需要什麼呢？</h2>
        <div className="flex m-2 gap-3 items-center">
          <Link
            href={"/school/login/openId?path=/school/score"}
            className="bg-orange-800 p-2 px-4 text-lg rounded-full text-orange-200 shadow-xl"
          >
            查詢成績
          </Link>
          <Link
            href={"/school/login/openId?path=/school/absence"}
            className="bg-orange-800 p-2 px-4 text-lg rounded-full text-orange-200 shadow-xl"
          >
            缺曠課查詢
          </Link>
        </div>
      </div>
      <div aria-label="widgets" className="p-2">
        <HRegularExam />
        <LatestNews />
        <div className="grid grid-cols-2">
          <Calendar />
          <CountdownTimer
            targetDate={college115}
            description="115 年 1 月 17~19 日"
            title="115 學測倒數"
          />
        </div>
      </div>
    </div>
  );
}
