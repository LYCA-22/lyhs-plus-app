"use client";

import { apiService } from "@/services/api";
import { useAppSelector } from "@/store/hook";
import { updateSystemData } from "@/store/systemSlice";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface ScoreData {
  clsId: string;
  scS: number;
  stdCname: string;
  t90: number;
  t70: number;
  stdNo: string;
  t50: number;
  yh: number;
  t30: number;
  score: number;
  sd: number;
  t95: number;
  yl: number;
  t75: number;
  credits: number;
  t55: number;
  t35: number;
  id: string;
  seme: number;
  passRate: number;
  t80: number;
  noExamMark: string;
  t60: number;
  seat: null;
  scA: number;
  t85: number;
  itemId: string;
  t40: number;
  t65: number;
  t20: number;
  t45: number;
  t25: number;
  subjId: string;
  t0: number;
  syear: number;
  scN: number;
}

interface StateData {
  pnmC: number;
  pnmD: null;
  scorePg: number;
  passM: string;
  scorePc: null;
  stdCname: string;
  scorePd: null;
  pnmG: number;
  stdNo: string;
  orderRc: null;
  nopass: number;
  scorePs: number;
  orderS: number;
  id: number;
  scoreRv: null;
  seme: number;
  scoreV: number;
  orderRs: null;
  scoreT: number;
  orderG: number;
  orderD: null;
  orderC: number;
  orderRd: null;
  passYn: string;
  clsNo: string;
  orderRg: null;
  pnmS: number;
  seat: string;
  itemId: string;
  stdSemeId: number;
  clsCname: string;
  rankYn: null;
  syear: number;
  orderRv: null;
}

export default function Page() {
  const params = useParams();
  const itemId = params.itemId as string;
  const [data, setData] = useState<ScoreData[]>([]);
  const [state, setstate] = useState<StateData[]>([]);
  const userData = useAppSelector((state) => state.userData);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const getScore = async () => {
      if (itemId && userData.school_session) {
        dispatch(
          updateSystemData({
            isLoading: true,
            isBack: true,
            BackLink: "/school/score",
          }),
        );

        const res = await apiService.getScore(
          userData.school_session,
          userData.JSESSIONID,
          userData.SRV,
          itemId,
        );

        setData(res.result.dataRows);
        setstate(res.state.dataRows);

        dispatch(
          updateSystemData({
            isLoading: false,
          }),
        );
      } else if (!userData.school_session) {
        router.push("/school");
      }
    };

    getScore();
  }, [dispatch, userData, itemId, router]);

  return (
    <div className="w-full h-full relative flex flex-col">
      <div className="p-5 font-custom">
        <div className="flex items-center gap-2">
          <p className="p-2 text-sm px-3 w-fit font-medium bg-hoverbg rounded-full">
            {data[0] ? `${data[0].syear}-${data[0].seme}` : "N/A"}
          </p>
          <h1 className="text-xl">{data[0] ? `${data[0].itemId}` : "N/A"}</h1>
        </div>
        <div className="flex gap-2 justify-between items-center px-3 pt-5 relative">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm">班排名</p>
            <p className="text-xl text-inputPrimary">
              {state[0] ? `${state[0].orderC}` : "N/A"}
            </p>
          </div>
          <div className="w-[1px] h-10 bg-borderColor"></div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm">平均</p>
            <p className="text-xl text-inputPrimary">
              {state[0] ? `${state[0].scoreV.toFixed(1)}` : "N/A"}
            </p>
          </div>
          <div className="w-[1px] h-10 bg-borderColor"></div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm">總分</p>
            <p className="text-xl text-inputPrimary">
              {state[0] ? `${state[0].scoreT}` : "N/A"}
            </p>
          </div>
        </div>
      </div>
      <ul className="p-6 flex flex-col gap-2 bg-hoverbg grow pb-36">
        <div className="bg-background rounded-2xl pl-5">
          {data.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between font-custom border-b border-borderColor last:border-0 py-4 pr-5"
            >
              <p>{item.subjId}</p>
              <p className="text-inputPrimary font-bold">{item.score}</p>
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
}
