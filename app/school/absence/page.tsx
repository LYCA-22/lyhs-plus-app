"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import * as Sentry from "@sentry/react";
import { apiService } from "@/services/api";
import { useAppSelector } from "@/store/hook";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateSystemData } from "@/store/systemSlice";

interface AbsenceData {
  absence1: number;
  absence2: number;
  absence3: number;
  absence4: number;
  absence5: number;
  absence6: number;
  absence7: number;
  absence8: number;
  absence9: number;
  absence10: number;
  absence11: number;
  absence12: number;
  absence13: number;
  absence14: number;
  absence15: number;
  absence16: number;
  absence17: number;
  absence18: number;
  absence19: number;
  absence20: number;
  absence21: number;
  absence22: number;
  absence23: number;
  absence24: number;
  absence25: number;
  absenceDt: string;
  clsCname: string;
  clsNo: string;
  empId: string | null;
  id: number;
  lesson1: string | null;
  lesson2: string | null;
  lesson3: string | null;
  lesson4: string | null;
  lesson5: string | null;
  lesson6: string | null;
  lesson7: string | null;
  lesson8: string | null;
  lesson9: string | null;
  markM: string | null;
  morn: string | null;
  raiseFlag: string | null;
  rest: string | null;
  seat: string;
  seme: number;
  stdCname: string;
  stdNo: string;
  stdSemeId: number;
  syear: string | number;
}

export default function Page() {
  const userData = useAppSelector((state) => state.userData);
  const [data, setData] = useState<AbsenceData[]>([]);
  const router = useRouter();
  const [sum2, setSum2] = useState<number>(0);
  const [sum3, setSum3] = useState<number>(0);
  const [sum4, setSum4] = useState<number>(0);
  const dispatch = useDispatch();

  const getAbsence = useCallback(() => {
    Sentry.startSpan(
      {
        name: "getAbsence",
        op: "http",
      },
      async () => {
        try {
          dispatch(
            updateSystemData({
              isLoading: true,
            }),
          );
          const data = await apiService.getAbsence(
            userData.school_session,
            userData.JSESSIONID,
            userData.SRV,
          );

          setData(data);
        } catch (error) {
          console.error(error);
          if (error instanceof Error) {
            Sentry.captureException(`Error in getAbsence: ${error.message}`);
          } else {
            Sentry.captureException(`Unknown error in getAbsence`);
          }
        } finally {
          dispatch(
            updateSystemData({
              isLoading: false,
            }),
          );
        }
      },
    );
  }, [userData, dispatch]);

  useEffect(() => {
    if (userData.JSESSIONID) {
      getAbsence();
    } else {
      router.push("./");
    }
  }, [getAbsence, userData.JSESSIONID, router]);

  const alllesson = useMemo(
    () => [
      "lesson1",
      "lesson2",
      "lesson3",
      "lesson4",
      "lesson5",
      "lesson6",
      "lesson7",
      "lesson8",
      "lesson9",
    ],
    [],
  );

  useEffect(() => {
    if (data.length > 0) {
      let count2 = 0;
      let count3 = 0;
      let count4 = 0;
      for (let i = 0; i < data.length; i++) {
        for (const lesson of alllesson) {
          const value = data[i][lesson as keyof AbsenceData];
          if (value === "2") {
            count2++;
          } else if (value === "3") {
            count3++;
          } else if (value === "4") {
            count4++;
          }
        }
      }
      setSum2(count2);
      setSum3(count3);
      setSum4(count4);
    }
  }, [data, userData, alllesson]);

  return (
    <div className="relative font-custom">
      {data[0] && (
        <div className="shadow-xl shadow-hoverbg dark:shadow-zinc-800/50 border-b border-border  dark:border-borderColor bg-background flex items-center p-3 px-5 mb-3 justify-between">
          <div>
            <h2 className="text-sm">林園高中 {data[0].stdNo}</h2>
            <h2 className="text-lg font-medium">{data[0].stdCname} 同學</h2>
          </div>
          <button
            onClick={() => window.alert("功能未開放")}
            className="rounded-xl bg-zinc-100 dark:bg-zinc-900 border-2 border-border p-2 px-3"
          >
            資料錯誤
          </button>
        </div>
      )}
      <div className="shadow-xl shadow-hoverbg dark:shadow-zinc-800/50 border-b border-border dark:border-borderColor bg-background flex justify-between py-5 px-7">
        <div className="flex flex-col items-center justify-center font-medium border-r border-border pr-5">
          <h1>請假</h1>
          <h1>統計</h1>
        </div>
        <div className="flex flex-col justify-center items-center gap-1">
          <h2>事假</h2>
          <p className="text-xl text-inputPrimary">{sum2}</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-1">
          <h2>病假</h2>
          <p className="text-xl text-inputPrimary">{sum3}</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-1">
          <h2>公假</h2>
          <p className="text-xl text-inputPrimary">{sum4}</p>
        </div>
      </div>
    </div>
  );
}
