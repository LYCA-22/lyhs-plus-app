"use client";
import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import {
  setKsaCookies,
  turnOffBackLink,
  updatePageLoadingStatus,
} from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { getCookie } from "@/utils/getCookie";
import {
  ChartColumn,
  ChartPie,
  ChevronRight,
  Grid2x2Check,
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
  const access_token = getCookie("lyps_access_token");

  useEffect(() => {
    dispatch(turnOffBackLink());
    if (!appData.ksa_cookies.session_key) {
      router.push("/ksa/login");
    } else {
      const fetchStuInfo = async () => {
        dispatch(updatePageLoadingStatus(true));
        try {
          if (
            !access_token ||
            !appData.ksa_cookies.session_key ||
            !appData.ksa_cookies.JSESSIONID ||
            !appData.ksa_cookies.SRV
          ) {
            return;
          }
          const stuInfoUrl = `${API_BASE_URL}/v1/lyps/school/basicInfo/${appData.ksa_cookies.JSESSIONID}/${appData.ksa_cookies.SRV}`;
          const stuInfo = new apiFetch(stuInfoUrl);
          const result = await stuInfo.GET(
            access_token as string,
            appData.ksa_cookies.session_key,
          );
          if (!result) {
            dispatch(
              setKsaCookies({ SRV: "", JSESSIONID: "", session_key: "" }),
            );
            return;
          }
          setStuData(result.stuInfo);
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
    <div className="flex flex-col bg-sky-50 dark:bg-background h-full gap-4">
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
            {stuData?.stuAuthNo}
          </p>
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
          學分查詢
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
          href={"/"}
          className="p-2 bg-hoverbg rounded-xl absolute top-5 right-5"
        >
          <ChevronRight />
        </Link>
        <h2 className="text-xl font-medium">{stuData?.zhName}</h2>
        <p className="opacity-50 mt-3">{stuData?.stuId}</p>
      </div>
    </div>
  );
}
