"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import * as Sentry from "@sentry/react";
import { apiService } from "@/services/api";
import { useAppSelector } from "@/store/hook";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateSystemData } from "@/store/systemSlice";
import { CircleUser } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
              isBack: true,
              BackLink: "/school",
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
      router.push("/school");
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
          } else if (value === "5") {
            count4++;
          }
        }
      }
      setSum2(count2);
      setSum3(count3);
      setSum4(count4);
    }
  }, [data, userData, alllesson]);

  const changeName = (name: string) => {
    if (name == "2") {
      return "事";
    } else if (name == "3") {
      return "病";
    } else if (name == "5") {
      return "公";
    } else if (name == "1") {
      return "曠";
    } else {
      return "";
    }
  };

  return (
    <div className="relative font-custom">
      {data[0] && (
        <div className="shadow-xl shadow-hoverbg  dark:shadow-zinc-800/50 bg-background flex items-center p-5 px-8 mb-3 justify-between">
          <div className="flex items-center gap-4">
            <CircleUser></CircleUser>
            <div>
              <h2 className="text-sm">林園高中 {data[0].stdNo}</h2>
              <h2 className="text-xl font-medium">{data[0].stdCname} 同學</h2>
            </div>
          </div>
          <button
            onClick={() => window.alert("功能未開放")}
            className="rounded-xl border border-inputPrimary font-medium p-2 px-3 hover:bg-inputPrimary hover:text-white transition-all"
          >
            資料錯誤
          </button>
        </div>
      )}
      <div className="shadow-xl shadow-hoverbg dark:shadow-zinc-800/50 border-b border-border dark:border-borderColor bg-background flex justify-between py-5 px-9">
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
      <div className="w-full overflow-y-auto p-5 pb-32">
        <h1 className="m-2 font-medium text-xl">詳細資料</h1>
        <Table className="overflow-hidden">
          <TableHeader>
            <TableRow>
              <TableHead className="w-fit">日期</TableHead>
              <TableHead className="w-fit">1</TableHead>
              <TableHead className="w-fit">2</TableHead>
              <TableHead className="w-fit">3</TableHead>
              <TableHead className="w-fit">4</TableHead>
              <TableHead className="w-fit">5</TableHead>
              <TableHead className="w-fit">6</TableHead>
              <TableHead className="w-fit">7</TableHead>
              <TableHead className="w-fit">8</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="py-4">{item.absenceDt}</TableCell>
                <TableCell>{changeName(item.lesson1 || "")}</TableCell>
                <TableCell>{changeName(item.lesson2 || "")}</TableCell>
                <TableCell>{changeName(item.lesson3 || "")}</TableCell>
                <TableCell>{changeName(item.lesson4 || "")}</TableCell>
                <TableCell>{changeName(item.lesson5 || "")}</TableCell>
                <TableCell>{changeName(item.lesson6 || "")}</TableCell>
                <TableCell>{changeName(item.lesson7 || "")}</TableCell>
                <TableCell>{changeName(item.lesson8 || "")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-center mt-5">
          <p className="text-sm opacity-50 text-center">
            所有缺曠課資料皆來自於高雄市教育局校務行政系統，如有任何問題請向學務處反應。
          </p>
        </div>
      </div>
    </div>
  );
}
