import {
  Ellipsis,
  HandFist,
  House,
  LibraryBig,
  Megaphone,
  MessageSquareText,
} from "lucide-react";

interface AppSchema {
  name: string;
  path: string;
  icon: React.ReactNode;
  active_icon: React.ReactNode;
}

export const appSchema: AppSchema[] = [
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
    name: "智慧助理",
    icon: <MessageSquareText size={25} />,
    active_icon: <MessageSquareText size={25} fill="#00b4f5" />,
    path: "/chat",
  },
  {
    name: "學業",
    icon: <LibraryBig size={25} />,
    active_icon: <LibraryBig size={25} fill="#00b4f5" />,
    path: "/ksa",
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
