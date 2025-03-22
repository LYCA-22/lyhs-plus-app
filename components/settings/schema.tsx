"use client";
import { useTheme } from "next-themes";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { SchemaGroup } from "@/types/index";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Select defaultValue={theme} onValueChange={setTheme}>
      <SelectTrigger className="w-[110px] bg-hoverbg rounded-full shadow-none">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent className="p-[6px] rounded-2xl gap-2 flex flex-col">
        <SelectItem value="light" className="rounded-[10px] p-2 px-3">
          亮色模式
        </SelectItem>
        <SelectItem value="dark" className="rounded-[10px] p-2 px-3">
          暗色模式
        </SelectItem>
        <SelectItem value="system" className="rounded-[10px] p-2 px-3">
          跟隨系統
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

export const appSchema: SchemaGroup[] = [
  {
    groupTitle: "應用程式設定",
    items: [
      {
        title: "系統主題",
        isOutLink: false,
        type: "component",
        access_manage: false,
        component: <ThemeToggle />,
      },
      {
        title: "快速捷徑",
        type: "btn",
        isOutLink: false,
        access_manage: false,
        btnfunction: "apps",
        icon: <ChevronRight className="w-4 h-4" />,
      },
      {
        title: "校園無聲廣播",
        type: "btn",
        isOutLink: false,
        access_manage: false,
        btnfunction: "notification",
        icon: <ChevronRight className="w-4 h-4" />,
      },
    ],
  },
  {
    groupTitle: "關於",
    items: [
      {
        title: "更多介紹",
        type: "link",
        isOutLink: true,
        href: "https://plus.lyhsca.org/",
        access_manage: false,
        icon: <ArrowUpRight className="w-4 h-4" />, // 修正了這裡，移除了不存在的 weight 屬性
      },
      {
        title: "使用者條款",
        type: "link",
        isOutLink: true,
        href: "/terms",
        access_manage: false,
        icon: <ChevronRight className="w-4 h-4" />,
      },
      {
        title: "隱私權政策",
        type: "link",
        isOutLink: true,
        href: "/privacy",
        access_manage: false,
        icon: <ChevronRight className="w-4 h-4" />,
      },
    ],
  },
];
