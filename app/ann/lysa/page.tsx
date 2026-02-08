"use client";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { SearchBox } from "@/components/news/module";
import { turnOffBackLink } from "@/store/appSlice";
import Link from "next/link";
import { Plus, Settings2 } from "lucide-react";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const userData = useAppSelector((state) => state.userData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(turnOffBackLink());
  }, [dispatch]);

  return (
    <div
      className={`bg-sky-50 dark:bg-background flex flex-col justify-between min-h-dvh`}
    >
      <div className="p-5 flex flex-col px-5 justify-between">
        <div className="flex items-center gap-3">
          <div className="relative pb-2">
            <Link
              href={"./school"}
              className={`text-2xl font-medium opacity-50`}
            >
              校園公告
            </Link>
          </div>
          <div className="relative pb-2">
            <h1 className={`text-2xl font-medium`}>
              學生會公告
              <div className="bg-sky-600 rounded-full absolute bottom-0 w-full h-1"></div>
            </h1>
          </div>
        </div>
        {userData.role === "lysaStaff" && (
          <div className="flex items-center w-full justify-between pt-5 gap-4 text-lg font-medium">
            <Link
              href={"/ann/lysa/add"}
              className="flex items-center justify-center gap-2 dark:bg-sky-900 bg-sky-200 rounded-xl p-2 w-full"
            >
              <Plus />
              新增公告
            </Link>
            <Link
              href={"/"}
              className="flex items-center justify-center gap-2 dark:bg-sky-900 bg-sky-200 rounded-xl p-2 w-full"
            >
              <Settings2 />
              編輯公告
            </Link>
          </div>
        )}
      </div>
      <div className="bg-background dark:bg-blue-300/10 border-t border-border grow">
        <SearchBox searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <div className="relative w-full"></div>
      </div>
    </div>
  );
}
