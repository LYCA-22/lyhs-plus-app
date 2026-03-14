"use client";

import { useAppSelector } from "@/store/hook";

export default function KsaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const AppData = useAppSelector((state) => state.appStatus);

  return (
    <div
      className={`${AppData.device_info.operate_type === "PWA" ? "pt-10" : ""} bg-hoverbg dark:bg-background`}
    >
      {children}
    </div>
  );
}
