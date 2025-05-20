"use client";
import { useAppSelector } from "@/store/hook";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function DynamicBack() {
  const AppData = useAppSelector((state) => state.systemData);

  if (AppData.isBack) {
    return (
      <div className="absolute left-3">
        <Link href={AppData.BackLink}>
          <ChevronLeft
            size={25}
            strokeWidth={2}
            className="text-zinc-600 dark:text-zinc-500"
          />
        </Link>
      </div>
    );
  }
}
