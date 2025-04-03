"use client";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import { Switch } from "@/components/ui/switch";
import { updateHomeApps } from "@/store/systemSlice";
import Image from "next/image";
import { homeApps } from "@/types";

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

  const handleToggle = (appKey: homeApps) => {
    const newApps = homeApps.includes(appKey)
      ? homeApps.filter((app: homeApps) => app !== appKey)
      : [...homeApps, appKey];

    dispatch(updateHomeApps(newApps as homeApps[]));
    localStorage.setItem("lyps_homeApps", JSON.stringify(newApps));
  };

  return (
    <div className="px-7 pb-20">
      <div className="px-2">
        {(Object.keys(apps) as Array<keyof typeof apps>).map((key) => (
          <div key={key} className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-lg">
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
            <div className="w-full bg-border h-[2px] rounded-full dark:bg-zinc-700 opacity-50 mt-4"></div>
          </div>
        ))}
      </div>
      <div className="text-center mt-5">
        <h1 className="opacity-40 font-medium">
          你可以在這裡依據你的使用頻率設定首頁的捷徑
        </h1>
      </div>
    </div>
  );
}
