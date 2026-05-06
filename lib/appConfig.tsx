import { Home05, Announcement03, Atom02, BookOpen01 } from "@untitledui/icons";
interface AppSchema {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export const appSchema: AppSchema[] = [
  {
    name: "首頁",
    icon: <Home05 />,
    path: "/",
  },
  {
    name: "公告",
    icon: <Announcement03 />,
    path: "/ann/school",
  },
  {
    name: "解答",
    icon: <Atom02 />,
    path: "/chat",
  },
  {
    name: "學業",
    icon: <BookOpen01 />,
    path: "/ksa",
  },
];
