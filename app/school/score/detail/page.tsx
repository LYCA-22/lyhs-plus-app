"use client";

import { apiService } from "@/services/api";
import { useAppSelector } from "@/store/hook";
import { updateSystemData } from "@/store/systemSlice";
import { ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface scoreData {
  deanYn: null;
  id: number;
  itemM: string;
  itemNo: string;
  name: string;
  phase: null;
  ratio: number;
  seme: number;
  syear: number;
}

function ScoreDetailContent() {
  const searchParams = useSearchParams();
  const year = searchParams.get("year") as string;
  const seme = searchParams.get("seme") as string;
  const router = useRouter();

  const dispatch = useDispatch();
  const userData = useAppSelector((state) => state.userData);
  const [data, setData] = useState<scoreData[]>([]);

  useEffect(() => {
    const getData = async () => {
      if (!userData.school_session) {
        router.push("/school");
      }

      dispatch(
        updateSystemData({
          isLoading: true,
          isBack: true,
          BackLink: "/school/score",
        }),
      );

      const res = await apiService.getYearData(
        userData.school_session,
        userData.JSESSIONID,
        userData.SRV,
        year,
        seme,
      );

      setData(res);
      dispatch(
        updateSystemData({
          isLoading: false,
        }),
      );
    };

    getData();
  }, [dispatch, seme, year, userData, router]);

  return (
    <div className="w-full flex flex-col items-center justify-center relative pt-5">
      <div className="flex flex-col gap-2 items-center justify-center">
        <h1 className="text-xl font-medium">請在下方選擇要查詢的項目</h1>
      </div>
      <div className="relative p-5 w-full">
        <ul className="px-5 rounded-2xl bg-hoverbg flex flex-col w-full">
          {data.map((item, index) => (
            <li
              key={index}
              aria-label={`${index}-1`}
              className="py-3 border-b border-borderColor flex justify-between items-center last:border-0"
            >
              <button
                onClick={() => {
                  window.alert("開發中");
                }}
                className="flex justify-between items-center w-full"
              >
                <p>{item.name}</p>
                <ChevronRight
                  size={25}
                  strokeWidth={2}
                  className="text-zinc-600 dark:text-zinc-500"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div></div>}>
      <ScoreDetailContent />
    </Suspense>
  );
}
