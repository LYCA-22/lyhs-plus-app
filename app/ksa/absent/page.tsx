"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ksaApi } from "@/services/api/ksa";
import { turnOnBackLink } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export interface AbsentRecord {
  addAccountId: null;
  addTm: null;
  classStdYn: string;
  clsId: string;
  clsSeat: string;
  coGrade: null;
  coSeme: null;
  courseM: null;
  credits: null;
  cutHours: number;
  cutHours4: null;
  desEmpId: null;
  describe: null;
  examP: null;
  id: number;
  lockYn: null;
  modAccountId: null;
  modTm: null;
  mustM: string;
  noExamYn: null;
  noScoreYn: null;
  openCourseM: string;
  openCredits: number;
  openId: number;
  openMustM: string;
  openSubjId: number;
  orderC: null;
  orderG: null;
  orderNowC: null;
  orderNowG: null;
  orderNowS: null;
  orderS: null;
  passM: null;
  passOldYn: null;
  passSrcYn: null;
  passYn: null;
  pnmC: null;
  pnmG: null;
  pnmS: null;
  reSeme: null;
  reSyear: null;
  retakeM: null;
  retakeYn: null;
  scoTypeM: string;
  score: null;
  scoreExam: null;
  scoreItem: null;
  scoreNowPg: null;
  scoreNowPs: null;
  scoreOld: null;
  scoreP: null;
  scorePc: null;
  scorePg: null;
  scorePs: null;
  scoreRem: null;
  scoreSrc: null;
  seat: string;
  seme: number;
  statusM: string;
  stdClsId: string;
  stdCname: string;
  stdDeptId: number;
  stdDivsId: null;
  stdId: number;
  stdNo: string;
  stdSeat: string;
  stdSemeId: number;
  subjBd: null;
  subjId: string;
  subjOd: null;
  syear: number;
  theCredits: number;
  theMustM: string;
  totalHours: number;
}

export default function AbsencePage() {
  const dispatch = useDispatch();
  const appData = useAppSelector((state) => state.appStatus);
  const [absentData, setAbsentData] = useState<AbsentRecord[]>([]);

  if (!appData.ksa_data.stu_info.length) {
    redirect("/ksa");
  }

  useEffect(() => {
    dispatch(turnOnBackLink("/ksa"));
  }, [dispatch]);

  useEffect(() => {
    const handleFetchAbsence = async () => {
      if (
        !appData.ksa_data.session_key ||
        !appData.ksa_data.JSESSIONID ||
        !appData.ksa_data.SRV
      ) {
        return;
      }
      try {
        const res = await ksaApi.getAbsent<AbsentRecord>(appData.ksa_data);

        setAbsentData(res.result?.dataRows || []);
      } catch (e) {
        console.error(e);
        setAbsentData([]);
      }
    };

    handleFetchAbsence();
  }, [
    appData.ksa_data.session_key,
    appData.ksa_data.JSESSIONID,
    appData.ksa_data.SRV,
  ]);

  // 後面的程式邏輯
  //

  return (
    <div className="flex flex-col bg-hoverbg dark:bg-background h-full pt-10 gap-4">
      <div className="p-5 pt-7 pb-0 space-y-2">
        <h1 className="font-medium text-2xl">請假模擬</h1>
        <p className="text-sm opacity-70">目前仍在測試中</p>
      </div>
      <div className="grow bg-background dark:bg-blue-300/10 rounded-t-3xl pb-36 p-5">
        <h3 className="font-medium mb-2">目前缺課狀態</h3>
        <div className="border rounded-2xl p-1">
          <Table>
            <TableHeader>
              <TableRow className=" dark:hover:bg-sky-300/10">
                <TableHead className="whitespace-nowrap">課程名稱</TableHead>
                <TableHead className="whitespace-nowrap">缺課時數</TableHead>
                <TableHead className="whitespace-nowrap">總時數</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {absentData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.subjId.split(".")[1]}</TableCell>
                  <TableCell>{item.cutHours}</TableCell>
                  <TableCell>{item.totalHours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
