"use client";
import { useAppSelector } from "@/store/hook";
import { ChevronRight, ArrowUpRight, LogOut } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { apiService } from "@/services/api";

interface schemaItem {
  title: string;
  title2?: string;
  description?: string;
  type: "link" | "btn" | "component";
  isOutLink?: boolean;
  href?: string;
  href2?: string;
  access_manage: boolean;
  userCheck?: boolean;
  component?: React.ReactNode;
  icon?: React.ReactNode;
  btnfunction?: () => void;
}

interface SchemaGroup {
  groupTitle: string;
  items: schemaItem[];
}

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

export default function Page() {
  const userData = useAppSelector((state) => state.userData);
  const { sessionId } = userData;

  const appSchema: SchemaGroup[] = [
    {
      groupTitle: "帳號管理",
      items: [
        {
          title: "管理我的帳號",
          title2: "登入帳號",
          type: "link",
          isOutLink: false,
          href: "/account",
          href2:
            "https://auth.lyhsca.org/account/login?redirect_url=https://beta.plus.lyhsca.org",
          access_manage: false,
          userCheck: true,
          icon: <ChevronRight className="w-4 h-4" />,
        },
        {
          title: "登出帳號",
          type: "btn",
          access_manage: false,
          userCheck: true,
          btnfunction: async () => {
            await apiService.Logout(sessionId);
          },
          icon: <LogOut className="w-4 h-4" />,
        },
        {
          title: "管理中心",
          type: "link",
          isOutLink: true,
          href: "https://admin.lyhsca.org/",
          access_manage: true,
          icon: <ArrowUpRight className="w-4 h-4" />,
        },
      ],
    },
    {
      groupTitle: "設定",
      items: [
        {
          title: "系統主題",
          isOutLink: false,
          type: "component",
          access_manage: false,
          component: <ThemeToggle />,
        },
        {
          title: "管理快速捷徑",
          type: "link",
          isOutLink: false,
          href: "/settings/shortcuts",
          access_manage: false,
          icon: <ChevronRight className="w-4 h-4" />,
        },
        {
          title: "管理無聲廣播",
          type: "link",
          isOutLink: false,
          href: "/settings/notification",
          access_manage: false,
          icon: <ChevronRight className="w-4 h-4" />,
        },
      ],
    },
  ];

  const renderItem = (item: schemaItem) => {
    if (item.access_manage && userData.type !== "staff") {
      return null;
    }

    if (item.userCheck && !userData.isLoggedIn && item.type === "btn") {
      return null;
    }

    const title = item.userCheck
      ? userData.isLoggedIn
        ? item.title
        : item.title2
      : item.title;

    const href = item.userCheck
      ? userData.isLoggedIn
        ? item.href
        : item.href2
      : item.href;

    const commonClasses =
      "flex items-center justify-between py-3 hover:opacity-60 transition-all";

    return (
      <div className="border-b border-borderColor last:border-b-0">
        {(() => {
          switch (item.type) {
            case "component":
              return (
                <div className={commonClasses}>
                  <p>{item.title}</p>
                  {item.component}
                </div>
              );
            case "btn":
              return (
                <button
                  onClick={item.btnfunction}
                  className={`${commonClasses} w-full text-left`}
                >
                  <p>{title}</p>
                  {item.icon && item.icon}
                </button>
              );
            case "link":
              return (
                <Link
                  href={href || ""}
                  target={item.isOutLink ? "_blank" : "_self"}
                  className={commonClasses}
                >
                  <p>{title}</p>
                  {item.icon && item.icon}
                </Link>
              );
          }
        })()}
      </div>
    );
  };

  return (
    <div className="p-5">
      <ul className="list-none flex flex-col gap-5">
        {appSchema.map((group, groupIndex) => (
          <li
            key={groupIndex}
            className="flex flex-col rounded-2xl border border-borderColor p-4 pb-1 bg-background transition-all sm:border-x-0 sm:border-t-0 sm:rounded-none sm:px-0"
          >
            <h3 className="text-lg font-medium mb-2">{group.groupTitle}</h3>
            <div className="flex flex-col">
              {group.items.map((item) => (
                <>{renderItem(item)}</>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
