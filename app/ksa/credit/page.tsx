"use client";

import { turnOnBackLink } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { BookOpen } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function CreditPage() {
  const dispatch = useDispatch();
  const appData = useAppSelector((state) => state.appStatus);
  if (!appData.ksa_data.stu_info.length) {
    redirect("/ksa");
  }

  useEffect(() => {
    dispatch(turnOnBackLink("/ksa"));
  }, [dispatch]);

  return (
    <div className="flex flex-col bg-sky-50 dark:bg-background h-full pt-10 gap-4">
      <div className="p-5 pt-7 pb-0 text-sky-900 dark:text-sky-100 space-y-2">
        <h1 className="font-medium text-2xl">學分資料</h1>
        <p className="opacity-50">此頁面會顯示您各學期的學分獲得情況。</p>
      </div>
      <div className="space-y-2 bg-background dark:bg-blue-300/10 rounded-2xl mx-5 p-5 mb-2">
        <p className="text-xl opacity-60">
          {appData.ksa_data.stu_info[0].zhName || ""}
        </p>
        <p className="text-2xl font-medium flex items-center gap-2">
          <span>總學分</span>
          <span className="text-sky-600 dark:text-sky-400">
            {appData.ksa_data.stu_credit[0].credAdd}
          </span>
          <span>/ 182</span>
        </p>
        <div className="flex items-center gap-3">
          <p className="text-lg flex items-center gap-2">
            <span>必修學分</span>
            <span className="text-sky-600 dark:text-sky-400">
              {appData.ksa_data.stu_credit[0].credAddMust}
            </span>
          </p>
          <p className="text-lg flex items-center gap-2">
            <span>選修學分</span>
            <span className="text-sky-600 dark:text-sky-400">
              {appData.ksa_data.stu_credit[0].credAddElect}
            </span>
          </p>
        </div>
      </div>
      <div className="grow bg-background dark:bg-blue-300/10 rounded-t-3xl pb-36 p-5"></div>
    </div>
  );
}
