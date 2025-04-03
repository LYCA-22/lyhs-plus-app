"use client";
import { useTheme } from "next-themes";
import {
  ChevronRight,
  ArrowUpRight,
  Palette,
  Layers2,
  Radio,
  CircleEllipsis,
  ScrollText,
  Scroll,
} from "lucide-react";
import { schemaItem } from "@/types/index";
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
      <SelectTrigger className="w-fit shadow-none border-0 p-0 text-lg gap-2 focus:ring-0">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">亮色模式</SelectItem>
        <SelectItem value="dark">暗色模式</SelectItem>
        <SelectItem value="system">跟隨系統</SelectItem>
      </SelectContent>
    </Select>
  );
}

export const appSchema: schemaItem[] = [
  {
    itemIcon: <Palette size={24} strokeWidth={2.5} />,
    title: "系統主題",
    isOutLink: false,
    type: "component",
    access_manage: false,
    component: <ThemeToggle />,
  },
  {
    itemIcon: <Layers2 size={24} strokeWidth={2.5} />,
    title: "快速捷徑",
    type: "btn",
    isOutLink: false,
    access_manage: false,
    btnfunction: "apps",
    icon: <ChevronRight size={22} strokeWidth={2.5} />,
  },
  {
    itemIcon: <Radio size={24} strokeWidth={2.5} />,
    title: "校園無聲廣播 BETA",
    type: "btn",
    isOutLink: false,
    access_manage: false,
    btnfunction: "notification",
    icon: <ChevronRight size={22} strokeWidth={2.5} />,
  },
  {
    itemIcon: <CircleEllipsis size={24} strokeWidth={2.5} />,
    title: "更多介紹",
    type: "link",
    isOutLink: true,
    href: "https://plus.lyhsca.org/",
    access_manage: false,
    icon: <ArrowUpRight size={22} strokeWidth={2.5} />,
  },
  {
    itemIcon: <ScrollText size={24} strokeWidth={2.5} />,
    title: "使用者條款",
    type: "link",
    isOutLink: true,
    href: "/terms",
    access_manage: false,
    icon: <ChevronRight size={22} strokeWidth={2.5} />,
  },
  {
    itemIcon: <Scroll size={24} strokeWidth={2.5} />,
    title: "隱私權政策",
    type: "link",
    isOutLink: true,
    href: "/privacy",
    access_manage: false,
    icon: <ChevronRight size={22} strokeWidth={2.5} />,
  },
];
