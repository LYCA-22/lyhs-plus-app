"use client";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import { Switch } from "@/components/ui/switch";
import { updateHomeApps } from "@/store/systemSlice";
import Image from "next/image";

const apps = {
  eSchool: {
    name: "校務系統",
    icon: "eschool",
  },
  studyHistory: {
    name: "學習歷程",
    icon: "studyHistory",
  },
  schoolWeb: {
    name: "學校網站",
    icon: "schoolWebIcon",
  },
  mailBox: {
    name: "學權信箱",
    icon: "mailboxIcon",
  },
  mailSearch: {
    name: "信件查詢",
    icon: "searchMailIcon",
  },
};

export default function ShortcutsPage() {
  const dispatch = useAppDispatch();
  const homeApps = useAppSelector((state) => state.systemStatus.homeApps);

  const handleToggle = (appKey: string) => {
    const newApps = homeApps.includes(appKey)
      ? homeApps.filter((app) => app !== appKey)
      : [...homeApps, appKey];

    dispatch(updateHomeApps(newApps));
  };

  return (
    <div className="p-5">
      <div className="rounded-2xl border border-borderColor p-4">
        <h2 className="text-lg font-medium mb-4">管理快速捷徑</h2>
        <div className="space-y-4">
          {Object.entries(apps).map(([key, app]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Image
                  src={`/serviceIcon/${app.icon}.svg`}
                  alt={app.name}
                  width={32}
                  height={32}
                />
                <span>{app.name}</span>
              </div>
              <Switch
                checked={homeApps.includes(key)}
                onCheckedChange={() => handleToggle(key)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
