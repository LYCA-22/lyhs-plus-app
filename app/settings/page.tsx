"use client";
import { useAppSelector } from "@/store/hook";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";

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
  const version = process.env.NEXT_PUBLIC_APP_VERSION;

  const appSchema: SchemaGroup[] = [
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
          type: "link",
          isOutLink: false,
          href: "/settings/shortcuts",
          access_manage: false,
          icon: <ChevronRight className="w-4 h-4" />,
        },
        {
          title: "校園無聲廣播",
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
  };

  return (
    <div className="relative">
      <div className="w-full bg-hoverbg mb-4 p-5 px-6 flex flex-col">
        <p className="text-3xl font-medium">
          {userData.name ? <>{userData.name}</> : <>登入享用完整服務</>}
        </p>
        {userData && (
          <Link
            href="https://auth.lyhsca.org/account/login?redirect_url=https://beta.plus.lyhsca.org"
            className="p-3 bg-primary text-background rounded-full active:scale-90 transition-all flex items-center justify-center font-medium my-3 mt-6"
          >
            登入或註冊
          </Link>
        )}
      </div>
      <ul className="list-none flex flex-col gap-2">
        {appSchema.map((group, groupIndex) => (
          <li
            key={groupIndex}
            className="flex flex-col px-5 bg-background transition-all"
          >
            <h3 className="text-lg font-medium">{group.groupTitle}</h3>
            <div className="flex flex-col">
              {group.items.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-borderColor last:border-b-0"
                >
                  {renderItem(item)}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-center p-2 font-mono text-sm opacity-40">
        Version {version}
      </div>
    </div>
  );
}
