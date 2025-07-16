"use client";

import { ChevronRight, Database } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="relative w-full px-5">
      <p className="p-3 opacity-50">校務行政系統</p>
      <ul className="border-t border-t-borderColor py-4">
        <li className="py-3 px-4 rounded-full hover:bg-hoverbg transition-all">
          <Link
            href={"/school/absence"}
            className="flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <Database></Database>
              <p className="text-lg">缺曠課查詢</p>
            </div>
            <ChevronRight size={22} strokeWidth={2} className="opacity-40" />
          </Link>
        </li>
      </ul>
    </div>
  );
}
