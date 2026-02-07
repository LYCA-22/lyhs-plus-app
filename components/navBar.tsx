"use client";
import { useAppSelector } from "@/store/hook";
import { Ellipsis, HandFist, House, Megaphone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AppSchema {
  name: string;
  path: string;
  icon: React.ReactNode;
  active_icon: React.ReactNode;
}

const appSchema: AppSchema[] = [
  {
    name: "首頁",
    icon: <House size={25} />,
    active_icon: <House size={25} fill="#00b4f5" />,
    path: "/",
  },
  {
    name: "公告",
    icon: <Megaphone size={25} />,
    active_icon: <Megaphone size={25} fill="#00b4f5" />,
    path: "/ann/school",
  },
  {
    name: "學生會",
    icon: <HandFist size={25} />,
    active_icon: <HandFist size={25} fill="#00b4f5" />,
    path: "/student",
  },
  {
    name: "更多",
    icon: <Ellipsis size={25} />,
    active_icon: <Ellipsis size={25} fill="#00b4f5" className="text-sky-600" />,
    path: "/more",
  },
];

export function NavBar() {
  const pathname = usePathname();
  const appData = useAppSelector((state) => state.appStatus);

  return (
    <div
      className={`z-30 bg-background border-t dark:border-zinc-600 flex justify-evenly items-center border-border w-full fixed bottom-0 ${appData.device_info.operate_type == "PWA" ? "pt-5 max-sm:pb-deviceBottom" : "pt-3 pb-2"}`}
    >
      {appSchema.map((app) => (
        <Link
          href={app.path}
          key={app.path}
          className="gap-1 flex flex-col items-center justify-center"
        >
          {(app.path === "/" && pathname === "/") ||
          (app.path !== "/" && pathname.startsWith(app.path))
            ? app.active_icon
            : app.icon}
          <p className={`text-xs font-medium`}>{app.name}</p>
        </Link>
      ))}
    </div>
  );
}
