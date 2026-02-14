"use client";
import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import {
  setKsaCookies,
  turnOffBackLink,
  updatePageLoadingStatus,
} from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { creditData } from "@/types";
import { getCookie } from "@/utils/getCookie";
import {
  BookOpen,
  ChartColumn,
  ChartPie,
  ChevronRight,
  Frown,
  Grid2x2Check,
  Smile,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export interface stuData {
  uuid: number;
  stuId: string;
  zhName: string;
  year: number;
  seme: number;
  className: string;
  number: string;
  birthDate: string;
  idCardNumber: number;
  stuPhoneNumber: number;
  autobiography: string;
  address: string;
  regionZip: number;
  stuAuthNo: string;
  created_at: string;
  updated_at: string;
}

export default function KSA() {
  const appData = useAppSelector((state) => state.appStatus);
  const router = useRouter();
  const dispatch = useDispatch();
  const [stuData, setStuData] = useState<stuData>();
  const [creditData, setCreditData] = useState<creditData[]>([]);
  const [displayCredit, setDisplayCredit] = useState<creditData>();
  const [canGraduate, setCanGraduate] = useState<boolean>(false);
  const access_token = getCookie("lyps_access_token");

  console.log(creditData);
  useEffect(() => {
    dispatch(turnOffBackLink());

    if (!appData.ksa_cookies.session_key) {
      router.push("/ksa/login");
    } else {
      const fetchStuInfo = async () => {
        dispatch(updatePageLoadingStatus(true));
        try {
          // 先獲取學生基本資料
          const stuInfoUrl = `${API_BASE_URL}/v1/lyps/school/basicInfo/${appData.ksa_cookies.JSESSIONID}/${appData.ksa_cookies.SRV}`;
          const stuInfo = new apiFetch(stuInfoUrl);
          const result = await stuInfo.GET(
            access_token as string,
            appData.ksa_cookies.session_key,
          );

          // 獲取得到資料，就更新 uuid
          dispatch(setKsaCookies({ uuid: result.stuInfo.uuid }));
          setStuData(result.stuInfo);

          // 再來獲取學分資料
          const creditUrl = `${API_BASE_URL}/v1/lyps/school/allSemeData/${appData.ksa_cookies.JSESSIONID}/${appData.ksa_cookies.SRV}/${result.stuInfo.uuid}`;
          const credit = new apiFetch(creditUrl);
          const creditData = (await credit.GET(
            access_token as string,
            appData.ksa_cookies.session_key,
          )) as creditData[];

          setCreditData(creditData);

          // 選擇要作為顯示學分數的陣列
          let displayItem = null;
          if (creditData.length == 1) {
            displayItem = creditData[0];
          } else if (creditData[creditData.length - 1].credAdd) {
            displayItem = creditData[creditData.length - 1];
          } else {
            displayItem = creditData[creditData.length - 2];
          }

          setDisplayCredit(displayItem);
          if (
            (displayItem.credAdd as number) >= 150 &&
            (displayItem.credAddElect as number) >= 40 &&
            (displayItem.credAddMust as number) >= 102
          ) {
            setCanGraduate(true);
          }
        } catch (e) {
          console.error(e);
          dispatch(setKsaCookies({ SRV: "", JSESSIONID: "", session_key: "" }));
        }
        dispatch(updatePageLoadingStatus(false));
      };
      fetchStuInfo();
    }
  }, [appData.ksa_cookies, router, dispatch, access_token]);

  return (
    <div className="flex flex-col bg-sky-50 dark:bg-background gap-4 pb-36">
      <div className="p-5 pt-7 pb-0 text-sky-900 dark:text-sky-100 space-y-2">
        <h1 className="font-medium text-2xl">KSA 服務</h1>
      </div>
      <div className="mx-5 relative space-y-2 pt-3">
        <h2 className="text-xl">{stuData?.zhName}</h2>
        <p className="text-2xl font-medium">
          {stuData?.year}學年度 第{stuData?.seme}學期
        </p>
        <p className="opacity-50">
          高雄市立林園高中 {stuData?.className} {stuData?.number}號
        </p>
        <div className="flex items-center justify-between">
          <p className="opacity-50 p-1 rounded-xl border border-zinc-400 dark:border-zinc-400 px-4 w-fit">
            {stuData?.uuid}
          </p>
        </div>
      </div>
      <div className="text-[14px] flex items-center gap-2 px-5 justify-between">
        <Link
          href={"/"}
          className="flex flex-col justify-center p-3 py-3 items-center gap-2 bg-background dark:bg-blue-300/10 rounded-2xl"
        >
          <ChartColumn size={25} strokeWidth={2.5} className="text-sky-600" />
          成績查詢
        </Link>
        <Link
          href={"/"}
          className="flex flex-col justify-center p-3 py-3 items-center gap-2 bg-background dark:bg-blue-300/10 rounded-2xl"
        >
          <ChartPie size={25} strokeWidth={2.5} className="text-sky-600" />
          學分資料
        </Link>
        <Link
          href={"/"}
          className="flex flex-col justify-center p-3 py-3 items-center gap-2 bg-background dark:bg-blue-300/10 rounded-2xl"
        >
          <Grid2x2Check size={25} strokeWidth={2.5} className="text-sky-600" />
          曠課查詢
        </Link>
        <Link
          href={"/"}
          className="flex flex-col justify-center p-3 py-3 items-center gap-2 bg-background dark:bg-blue-300/10 rounded-2xl"
        >
          <User size={25} strokeWidth={2.5} className="text-sky-600" />
          個人資料
        </Link>
      </div>
      <h3 className="mx-5 font-medium text-lg mt-5">學分資料</h3>
      <div className="bg-background dark:bg-blue-300/10 p-5 rounded-2xl mx-5 relative">
        <Link
          href={"/ksa/credit"}
          className="p-2 bg-hoverbg dark:bg-sky-300/10 rounded-xl absolute top-5 right-5"
        >
          <ChevronRight />
        </Link>
        <div className="space-y-2">
          <h2 className="text-xl font-medium">{stuData?.zhName}</h2>
          <div className="flex items-center gap-2">
            <BookOpen />
            <p className="font-medium text-3xl">{displayCredit?.credAdd}</p>
          </div>
          <p className="opacity-50">
            總學分數 182，您已拿到 {displayCredit?.credAdd} 個學分
          </p>
        </div>
      </div>
      <h3 className="mx-5 font-medium text-lg mt-5">畢業標準檢測</h3>
      <div className="mx-5 relative">
        {canGraduate ? (
          <div className="flex items-center gap-3 bg-sky-800 text-white dark:bg-sky-200 dark:text-sky-800 rounded-2xl p-3">
            <Smile />
            <p className="font-medium text-xl">恭喜，您可以畢業了！</p>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-sky-800 text-white dark:bg-sky-200 dark:text-sky-800 rounded-2xl p-3">
            <Frown />
            <p className="font-medium text-xl">非常遺憾，您目前還不能畢業</p>
          </div>
        )}

        <div className="flex items-center overflow-x-auto w-full gap-4 py-4">
          <div className="bg-background dark:bg-sky-300/10 rounded-2xl p-5 whitespace-nowrap">
            <h3>總學分數</h3>
            <p className="font-medium text-3xl space-x-2">
              <span className="text-sky-600 dark:text-sky-400">
                {displayCredit?.credAdd}
              </span>
              <span className="text-lg">/ 150</span>
            </p>
            {(displayCredit?.credAdd as number) >= 150 ? (
              <p className="text-green-600 font-medium">已達標</p>
            ) : (
              <p className="text-red-600 font-medium">
                未達標，還缺 {150 - ((displayCredit?.credAdd as number) || 0)}{" "}
                學分
              </p>
            )}
          </div>
          <div className="bg-background dark:bg-sky-300/10 rounded-2xl p-5 whitespace-nowrap">
            <h3>必修學分</h3>
            <p className="font-medium text-3xl space-x-2">
              <span className="text-sky-600 dark:text-sky-400">
                {displayCredit?.credAddMust}
              </span>
              <span className="text-lg">/ 102</span>
            </p>
            {(displayCredit?.credAddMust as number) >= 102 ? (
              <p className="text-green-600 font-medium">已達標</p>
            ) : (
              <p className="text-red-600 font-medium">
                未達標，還缺{" "}
                {102 - ((displayCredit?.credAddMust as number) || 0)} 學分
              </p>
            )}
          </div>
          <div className="bg-background dark:bg-sky-300/10 rounded-2xl p-5 whitespace-nowrap">
            <h3>選修學分</h3>
            <p className="font-medium text-3xl space-x-2">
              <span className="text-sky-600 dark:text-sky-400">
                {displayCredit?.credAddElect}
              </span>
              <span className="text-lg">/ 40</span>
            </p>
            {(displayCredit?.credAddElect as number) >= 40 ? (
              <p className="text-green-600 font-medium">已達標</p>
            ) : (
              <p className="text-red-600 font-medium">
                未達標，還缺{" "}
                {40 - ((displayCredit?.credAddElect as number) || 0)} 學分
              </p>
            )}
          </div>
        </div>
        <p className="text-sm opacity-50">往左滑看更多</p>
      </div>
    </div>
  );
}
