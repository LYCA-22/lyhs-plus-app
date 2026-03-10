import { HomeAlt3, Megaphone, Reading, Sparkle } from "@boxicons/react";
interface AppSchema {
  name: string;
  path: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

export const appSchema: AppSchema[] = [
  {
    name: "首頁",
    icon: <HomeAlt3 />,
    activeIcon: <HomeAlt3 pack="filled" />,
    path: "/",
  },
  {
    name: "公告",
    icon: <Megaphone />,
    activeIcon: <Megaphone pack="filled" />,
    path: "/ann/school",
  },
  {
    name: "解答",
    icon: <Sparkle />,
    activeIcon: <Sparkle pack="filled" />,
    path: "/chat",
  },
  {
    name: "學業",
    icon: <Reading />,
    activeIcon: <Reading pack="filled" />,
    path: "/ksa",
  },
];
