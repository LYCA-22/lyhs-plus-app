"use client";

import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import { useAppSelector } from "@/store/hook";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

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

  // 取得今天的日期字串，格式轉為 YYYY-MM-DD
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

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
  const displayDate =
    currentDate === formattedToday ? "今天 TODAY" : currentDate;

  return (
    <div>
      <div
        className={`w-full p-5 shadow-md shadow-zinc-200 dark:shadow-zinc-800 border-b ${AppData.device_info.operate_type === "PWA" ? "pt-10" : ""}`}
      >
        <div className="text-center">
          <h1>午餐查詢</h1>
        </div>
        <div className="flex items-center justify-between">
          <button
            disabled={selectedIndex === 0 || lunchData.length === 0}
            onClick={() => setSelectedIndex((prev) => prev - 1)}
          >
            <ArrowLeft />
          </button>
          <p className="text-lg font-bold">{displayDate}</p>
          <button
            disabled={
              selectedIndex === lunchData.length - 1 || lunchData.length === 0
            }
            onClick={() => setSelectedIndex((prev) => prev + 1)}
          >
            <ArrowRight />
          </button>
        </div>
      </div>
      <div className="p-5">
        {lunchData[selectedIndex]?.main_dish && (
          <ul key={lunchData[selectedIndex]?.id} className="space-y-2 text-xl">
            <div className="flex mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
              <div className="flex-1 p-3 flex flex-col items-center justify-center border-r dark:border-zinc-700">
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
            <li className="border-b pb-2">
              <p className="text-base">主食</p>
              <p className="font-medium">
                {lunchData[selectedIndex]?.staple_food}
              </p>
            </li>
            <li className="border-b pb-2">
              <p className="text-base">主菜</p>
              <p className="font-medium">
                {lunchData[selectedIndex]?.main_dish}
              </p>
            </li>
            <li className="border-b pb-2">
              <p className="text-base">副菜</p>
              <p className="font-medium">
                {lunchData[selectedIndex]?.side_dish}
              </p>
            </li>
            <li className="border-b pb-2">
              <p className="text-base">青菜</p>
              <p className="font-medium">
                {lunchData[selectedIndex]?.vegetable}
              </p>
            </li>
            <li className="border-b pb-2">
              <p className="text-base">湯</p>
              <p className="font-medium">{lunchData[selectedIndex]?.soup}</p>
            </li>
            <li className="border-b pb-2">
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
