import { Bell, MailSearch, SendHorizontal } from "lucide-react";

interface serviceItem {
  name: string;
  icon: React.ReactNode;
  href: string;
}

export const lycaService: serviceItem[] = [
  {
    name: "學權信箱",
    icon: <SendHorizontal size={30} />,
    href: "/mail/stu",
  },
  {
    name: "查詢案件進度",
    icon: <MailSearch size={30} />,
    href: "/mail/view",
  },
  {
    name: "班聯會公告",
    icon: <Bell size={30} />,
    href: "/mail/view",
  },
];
