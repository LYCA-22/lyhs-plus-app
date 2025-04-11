"use client";

import { useAppSelector } from "@/store/hook";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const AppData = useAppSelector((state) => state.systemData);

  return (
    <div className="relative w-full">
      <div className={`w-full px-5 ${AppData.isPwa ? "mt-deviceTop" : "mt-5"}`}>
        <h1 className={`text-2xl font-medium`}>班聯會</h1>
        <div className="flex items-center gap-2 my-5">
          <Link
            href={"/mail/stu"}
            className="rounded-3xl w-44 bg-gradient-to-br from-hoverbg to-white/0 p-5 shadow-2xl shadow-zinc-800/50"
          >
            <div>
              <h1 className="text-xl font-bold">學權信箱</h1>
              <p className="text-sm mt-1 opacity-60">
                透過學權信箱，將會有專人處理您的案件。
              </p>
            </div>
            <div className="mt-2">
              <ArrowUpRightIcon className="ml-auto opacity-25" size={40} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
