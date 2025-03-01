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
};

export default function ShortcutsPage() {
  const dispatch = useAppDispatch();
  const homeApps = useAppSelector((state) => state.systemStatus.homeApps);

  const handleToggle = (appKey: homeApps) => {
    const newApps = homeApps.includes(appKey)
      ? homeApps.filter((app: homeApps) => app !== appKey)
      : [...homeApps, appKey];

    dispatch(updateHomeApps(newApps as homeApps[]));
  };

  return (
    <div className="p-5">
      <div className="rounded-2xl border border-borderColor p-4">
        <h2 className="text-lg font-medium mb-4">管理快速捷徑</h2>
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
      </div>
    </div>
  );
}
