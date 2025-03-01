"use client";
import { ThemeToggle } from "@/components/sidebar/themeToggle";
import { useAppSelector } from "@/store/hook";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

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
}

interface SchemaGroup {
  groupTitle: string;
  items: schemaItem[];
}

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
    ],
  },
];

export default function Page() {
  const userData = useAppSelector((state) => state.userData);

  const renderLinkItem = (item: schemaItem, index: number) => {
    if (item.access_manage && userData.type !== "staff") {
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

    return (
      <Link
        key={index}
        href={href || ""}
        target={item.isOutLink ? "_blank" : "_self"}
        className="flex items-center justify-between border-b border-borderColor py-3 last:border-none hover:opacity-60 transition-all"
      >
        <p>{title}</p>
        {item.icon && item.icon}
      </Link>
    );
  };

  return (
    <div className="p-5">
      <ul className="list-none flex flex-col gap-5">
        {appSchema.map((group, groupIndex) => (
          <li
            key={groupIndex}
            className="flex flex-col rounded-2xl border border-borderColor p-4 bg-background transition-all hover:shadow-md"
          >
            <h3 className="text-lg font-medium mb-2">{group.groupTitle}</h3>
            <div className="flex flex-col">
              {group.items.map((item, itemIndex) => (
                <div key={`${groupIndex}-${itemIndex}`}>
                  {item.type === "component" ? (
                    <div className="flex items-center justify-between border-b border-borderColor last:border-none">
                      <p>{item.title}</p>
                      {item.component}
                    </div>
                  ) : (
                    renderLinkItem(item, itemIndex)
                  )}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
