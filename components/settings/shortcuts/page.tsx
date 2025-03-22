"use client";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import { Switch } from "@/components/ui/switch";
import { updateHomeApps } from "@/store/systemSlice";
import Image from "next/image";
import { homeApps } from "@/types";
import { useEffect } from "react";

const apps: Record<homeApps, { name: string; icon: string }> = {
  [homeApps.eSchool]: {
    name: "校務系統",
    icon: "eschool",
  },
  [homeApps.studyHistory]: {
    name: "學習歷程",
    icon: "studyHistory",
  },
  [homeApps.schoolWeb]: {
    name: "學校網站",
    icon: "schoolWebIcon",
  },
  [homeApps.mailBox]: {
    name: "學權信箱",
    icon: "mailboxIcon",
  },
  [homeApps.mailSearch]: {
    name: "信件查詢",
    icon: "searchMailIcon",
  },
  [homeApps.calendar]: {
    name: "行事曆",
    icon: "calendar",
  },
};

export default function ShortcutsPage() {
  const dispatch = useAppDispatch();
  const homeApps = useAppSelector((state) => state.systemData.homeApps);

  useEffect(() => {
    const savedApps = localStorage.getItem("lyps_homeApps");
    if (savedApps) {
      try {
        const parsedApps = JSON.parse(savedApps);
        // 檢查是否與當前狀態不同，只在不同時才更新
        if (
          Array.isArray(parsedApps) &&
          parsedApps.length > 0 &&
          JSON.stringify(parsedApps) !== JSON.stringify(homeApps)
        ) {
          dispatch(updateHomeApps(parsedApps));
        }
      } catch (error) {
        console.error("Failed to parse homeApps from localStorage:", error);
      }
    }
  }, [dispatch, homeApps]);

  useEffect(() => {
    localStorage.setItem("lyps_homeApps", JSON.stringify(homeApps));
  }, [homeApps]);

  const handleToggle = (appKey: homeApps) => {
    const newApps = homeApps.includes(appKey)
      ? homeApps.filter((app: homeApps) => app !== appKey)
      : [...homeApps, appKey];

    dispatch(updateHomeApps(newApps as homeApps[]));
  };

  return (
    <div className="p-7">
      <div className="space-y-4">
        {(Object.keys(apps) as Array<keyof typeof apps>).map((key) => (
          <div key={key} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Image
                src={`/serviceIcon/${apps[key as homeApps].icon}.svg`}
                alt={apps[key as homeApps].name}
                width={32}
                height={32}
              />
              <span>{apps[key as homeApps].name}</span>
            </div>
            <Switch
              checked={homeApps.includes(key as homeApps)}
              onCheckedChange={() => handleToggle(key as homeApps)}
            />
          </div>
        ))}
      </div>
      <div className="border-t border-border my-4 p-3">
        <p className="text-center text-sm text-muted-foreground">
          你可以在這裡依據你的使用頻率和個性設定要顯示在首頁的捷徑。
        </p>
      </div>
    </div>
  );
}
