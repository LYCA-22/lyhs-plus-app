"use client";
import { useAppSelector } from "@/store/hook";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function DynamicBack() {
  const AppData = useAppSelector((state) => state.appStatus);

  if (AppData.service_status.isBack) {
    return (
      <div className="absolute left-5 flex items-center justify-center">
        <Link href={AppData.service_status.backLink}>
          <ChevronLeft
            size={30}
            strokeWidth={2}
            className="text-zinc-600 dark:text-zinc-500 bg-hoverbg rounded-full p-1"
          />
        </Link>
      </div>
    );
  }
}
