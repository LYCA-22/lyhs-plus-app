"use client";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import { turnOnBackLink } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface lunchData {
  bucket_count: number;
  calories: number;
  created_at: string;
  id: number;
  is_vegetarian_day: boolean;
  lunch_date: string;
  main_dish: string;
  note: null | string;
  other: string;
  side_dish: string;
  soup: string;
  special_mark: boolean;
  staple_food: string;
  vegetable: string;
}

export default function LunchPage() {
  const [lunchData, setLunchData] = useState<lunchData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const AppData = useAppSelector((state) => state.appStatus);
  const dispatch = useDispatch();

  // 取得今天的日期字串，格式轉為 YYYY-MM-DD
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    dispatch(turnOnBackLink("/"));
  }, [dispatch]);

  useEffect(() => {
    const fetchLunchData = async () => {
      try {
        const lunchUrl = `${API_BASE_URL}/v1/lyps/lunch/list`;
        const lunch = new apiFetch(lunchUrl);
        const data = await lunch.GET();

        if (data && data.data) {
          setLunchData(data.data);

          // 在取得的資料中尋找今天的日期
          const todayIndex = data.data.findIndex(
            (item: lunchData) => item.lunch_date === formattedToday,
          );

          // 如果有找到今天的資料，就自動跳到今天的索引；如果沒有就維持 0
          if (todayIndex !== -1) {
            setSelectedIndex(todayIndex);
          }
        }
      } catch (error) {
        console.error("Failed to fetch lunch data:", error);
      }
    };

    fetchLunchData();
  }, [formattedToday]);

  // 判斷當前顯示的日期是否為今天，如果是就顯示「今天」
  const currentDate = lunchData[selectedIndex]?.lunch_date;
  const displayDate = currentDate === formattedToday ? "今天" : currentDate;

  return (
    <div
      className={`w-full min-h-dvh flex flex-col bg-hoverbg dark:bg-background ${AppData.device_info.operate_type === "PWA" ? "pt-24" : "pt-16"}`}
    >
      <div className="px-5">
        <h1 className="text-2xl">午餐查詢</h1>
        <p className="text-sm opacity-50">
          網站資料皆來自
          <Link
            href={"https://affairs.kh.edu.tw/5600"}
            className="mx-2 border-b pb-0.5 border-zinc-500"
            target="_blank"
          >
            午餐部
          </Link>
          網站。
        </p>
      </div>
      <div className="p-5 bg-background dark:bg-blue-300/10 mt-5 rounded-t-3xl grow pb-32">
        <div className="flex items-center gap-2 justify-between border-b pb-4 dark:border-zinc-700/50">
          <button
            disabled={selectedIndex === 0 || lunchData.length === 0}
            onClick={() => setSelectedIndex((prev) => prev - 1)}
            className="bg-buttonBg dark:bg-zinc-700/50 rounded-2xl p-2 active:scale-95 transition-all"
          >
            <ArrowLeft />
          </button>
          <Popover>
            <PopoverTrigger asChild>
              <button className="font-medium flex items-center gap-1 bg-buttonBg dark:bg-zinc-700/50 rounded-2xl p-2 px-3 active:scale-95 transition-all">
                {displayDate ? displayDate : <span>Pick a date</span>}
                <ChevronDown />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-3xl">
              <Calendar
                mode="single"
                className="rounded-3xl"
                selected={currentDate ? new Date(currentDate) : undefined}
                onSelect={(date) => {
                  if (date) {
                    const dateString = formatDate(date);
                    const index = lunchData.findIndex(
                      (item) => item.lunch_date === dateString,
                    );
                    if (index !== -1) {
                      setSelectedIndex(index);
                    }
                  }
                }}
                disabled={(date) => {
                  const dateString = formatDate(date);
                  return !lunchData.some(
                    (item) => item.lunch_date === dateString,
                  );
                }}
              />
            </PopoverContent>
          </Popover>
          <button
            disabled={
              selectedIndex === lunchData.length - 1 || lunchData.length === 0
            }
            onClick={() => setSelectedIndex((prev) => prev + 1)}
            className="bg-buttonBg dark:bg-zinc-700/50 rounded-2xl p-2 active:scale-95 transition-all"
          >
            <ArrowRight />
          </button>
        </div>
        {lunchData[selectedIndex]?.main_dish && (
          <ul key={lunchData[selectedIndex]?.id} className="space-y-2 text-xl">
            <div className="flex mb-4 bg-buttonBg dark:bg-zinc-700/50 rounded-2xl mt-5">
              <div className="flex-1 p-3 flex flex-col items-center justify-center border-r border-zinc-400 dark:border-zinc-700">
                <span className="text-xs font-medium mb-1">餐桶數量</span>
                <span className="text-2xl font-bold font-poppins">
                  {lunchData[selectedIndex]?.bucket_count}{" "}
                  <span className="text-xs font-normal opacity-70">桶</span>
                </span>
              </div>
              <div className="flex-1 p-3 flex flex-col items-center justify-center">
                <span className="text-xs font-medium mb-1">熱量</span>
                <span className="text-2xl font-bold font-poppins">
                  {lunchData[selectedIndex]?.calories}{" "}
                  <span className="text-xs font-normal opacity-70">大卡</span>
                </span>
              </div>
            </div>
            <li className="border-b dark:border-zinc-500/50 pb-2">
              <p className="text-base">主食</p>
              <p className="font-medium">
                {lunchData[selectedIndex]?.staple_food}
              </p>
            </li>
            <li className="border-b dark:border-zinc-500/50 pb-2">
              <p className="text-base">主菜</p>
              <p className="font-medium">
                {lunchData[selectedIndex]?.main_dish}
              </p>
            </li>
            <li className="border-b dark:border-zinc-500/50 pb-2">
              <p className="text-base">副菜</p>
              <p className="font-medium">
                {lunchData[selectedIndex]?.side_dish}
              </p>
            </li>
            <li className="border-b dark:border-zinc-500/50 pb-2">
              <p className="text-base">青菜</p>
              <p className="font-medium">
                {lunchData[selectedIndex]?.vegetable}
              </p>
            </li>
            <li className="border-b dark:border-zinc-500/50 pb-2">
              <p className="text-base">湯</p>
              <p className="font-medium">{lunchData[selectedIndex]?.soup}</p>
            </li>
            <li className="border-b dark:border-zinc-500/50 pb-2">
              <p className="text-base">其他</p>
              <p className="font-medium">{lunchData[selectedIndex]?.other}</p>
            </li>
            <li>
              <p className="text-base opacity-50">
                *含有麩質、甲殼類、芒果、花生、堅果、芝麻、大豆、奶、蛋、魚類及其製品，若有對其過敏者不適合食用。
              </p>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
