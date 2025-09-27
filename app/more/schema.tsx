"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  ChevronRight,
  ArrowUpRight,
  Palette,
  CircleEllipsis,
  ScrollText,
  Scroll,
  Radio,
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Select disabled>
        <SelectTrigger className="w-fit shadow-none border-0 p-0 gap-2 text-lg focus:ring-0">
          <SelectValue placeholder="載入中..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">亮色模式</SelectItem>
          <SelectItem value="dark">暗色模式</SelectItem>
          <SelectItem value="system">跟隨系統</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger className="w-fit shadow-none border-0 p-0 gap-2 text-lg focus:ring-0">
        <SelectValue placeholder="選擇主題" />
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
    itemIcon: <Palette size={24} strokeWidth={2} />,
    title: "系統主題",
    isOutLink: false,
    type: "component",
    access_manage: false,
    component: <ThemeToggle />,
  },
  /*
  {
    itemIcon: <Layers2 size={24} strokeWidth={2} />,
    title: "快速捷徑",
    type: "btn",
    isOutLink: false,
    access_manage: false,
    btnfunction: "apps",
    icon: <ChevronRight size={22} strokeWidth={2} />,
  },
  */
  {
    itemIcon: <Radio size={24} strokeWidth={2} />,
    title: "應用程式通知 BETA",
    type: "link",
    isOutLink: false,
    href: "/more/notification",
    access_manage: false,
    btnfunction: "notification",
    icon: <ChevronRight size={22} strokeWidth={2} />,
  },

  {
    itemIcon: <CircleEllipsis size={24} strokeWidth={2} />,
    title: "更多介紹",
    type: "link",
    isOutLink: true,
    href: "https://plus.lyhsca.org/",
    access_manage: false,
    icon: <ArrowUpRight size={22} strokeWidth={2} />,
  },
  {
    itemIcon: <ScrollText size={24} strokeWidth={2} />,
    title: "使用者條款",
    type: "link",
    isOutLink: true,
    href: "/terms",
    access_manage: false,
    icon: <ChevronRight size={22} strokeWidth={2} />,
  },
  {
    itemIcon: <Scroll size={24} strokeWidth={2} />,
    title: "隱私權政策",
    type: "link",
    isOutLink: true,
    href: "/privacy",
    access_manage: false,
    icon: <ChevronRight size={22} strokeWidth={2} />,
  },
];
