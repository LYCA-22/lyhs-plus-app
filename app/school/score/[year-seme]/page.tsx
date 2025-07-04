"use client";

import { apiService } from "@/services/api";
import { useAppSelector } from "@/store/hook";
import { updateSystemData } from "@/store/systemSlice";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const runtime = "edge";

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

export default function ScoreDetailContent() {
  const params = useParams();
  const text = params["year-seme"] as string;
  const [year, seme] = text.split("-");

  const router = useRouter();

  const dispatch = useDispatch();
  const userData = useAppSelector((state) => state.userData);
  const [data, setData] = useState<scoreData[]>([]);

  useEffect(() => {
    if (!seme || !year) return;

    const getData = async () => {
      if (!userData.school_session) {
        router.push("/school");
        return;
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
  }, [
    dispatch,
    seme,
    year,
    userData.school_session,
    userData.JSESSIONID,
    userData.SRV,
    router,
  ]);

  return (
    <div className="w-full flex flex-col bg-background relative pt-5 min-h-dvh">
      <div className="flex flex-col gap-2 items-center justify-center">
        <p className="text-foreground font-medium text-2xl">
          {year}學年度 第{seme}學期
        </p>
        <h1 className="text-lg font-medium text-inputPrimary">
          請在下方選擇要查詢的項目
        </h1>
      </div>
      <div className="relative p-5 w-full">
        <ul className="rounded-[30px] bg-zinc-100 dark:bg-zinc-900 flex flex-col w-full overflow-hidden">
          {data.map((item, index) => (
            <li
              key={index}
              aria-label={`${index}-1`}
              className="py-3 px-5 hover:bg-zinc-300  transition-all dark:hover:bg-zinc-600 border-b border-zinc-200 dark:border-borderColor flex justify-between items-center last:border-0"
            >
              <Link
                href={`/school/score/${year}-${seme}/${item.id}`}
                className="flex justify-between items-center w-full"
              >
                <p>{item.name}</p>
                <ChevronRight
                  size={25}
                  strokeWidth={2}
                  className="text-zinc-600 dark:text-zinc-500"
                />
              </Link>
            </li>
          ))}
        </ul>
        <ul className="rounded-[30px] bg-zinc-100 dark:bg-zinc-900 flex flex-col w-full overflow-hidden mt-5">
          <li className="py-3 border-b  px-5  transition-all hover:bg-zinc-300 dark:hover:bg-zinc-600 border-borderColor flex justify-between items-center last:border-0">
            <Link
              href={`/`}
              className="flex justify-between items-center w-full"
            >
              <p>學期總成績</p>
              <ChevronRight
                size={25}
                strokeWidth={2}
                className="text-zinc-600 dark:text-zinc-500"
              />
            </Link>
          </li>
          <li className="py-3 border-b  px-5  transition-all hover:bg-zinc-300 dark:hover:bg-zinc-600 border-borderColor flex justify-between items-center last:border-0">
            <Link
              href={`/`}
              className="flex justify-between items-center w-full"
            >
              <p>各科學期成績分析</p>
              <ChevronRight
                size={25}
                strokeWidth={2}
                className="text-zinc-600 dark:text-zinc-500"
              />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
