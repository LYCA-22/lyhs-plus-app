"use client";
import { Tabs, Tab } from "@heroui/tabs";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const runtime = "edge";
export default function Home({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <section
      className={`flex flex-col items-center bg-background px-5 max-sm:pt-2`}
    >
      <div
        aria-label={"mainContent"}
        className={"relative flex items-center flex-col w-full pt-3"}
      >
        <Tabs
          aria-label="Options"
          className={"font-medium p-2 block"}
          fullWidth={true}
          selectedKey={pathname}
          size={"lg"}
        >
          <Tab
            key={"/mailbox/student"}
            as={Link}
            href={"/mailbox/student"}
            title="學權信箱"
          />
          <Tab
            key={"/mailbox/view"}
            as={Link}
            href={"/mailbox/view"}
            title="信件查詢"
          />
        </Tabs>
        <main className="w-full">{children}</main>
      </div>
    </section>
  );
}
