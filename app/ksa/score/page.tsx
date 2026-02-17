"use client";
import { Spinner } from "@/components/ui/spinner";
import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import { turnOnBackLink } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { getCookie } from "@/utils/getCookie";
import { ArrowRight, ChartColumnBig, PencilLine } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface semeData {
  deanYn: string | null;
  id: number;
  itemM: string;
  itemNo: string;
  name: string;
  phase: string;
  ratio: number;
  seme: number;
  syear: number;
}

export default function CreditPage() {
  const dispatch = useDispatch();
  const appData = useAppSelector((state) => state.appStatus);
  const [selectIndex, setSelectIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [semeData, setSemeData] = useState<semeData[]>([]);
  const access_token = getCookie("lyps_access_token");

  if (!appData.ksa_data.stu_info.length) {
    redirect("/ksa");
  }

  useEffect(() => {
    dispatch(turnOnBackLink("/ksa"));
  }, [dispatch]);

  useEffect(() => {
    const fetchSemeData = async () => {
      try {
        setIsLoading(true);
        const semeDataUrl = `${API_BASE_URL}/v1/lyps/school/semeDetail/${appData.ksa_data.JSESSIONID}/${appData.ksa_data.SRV}/${appData.ksa_data.stu_credit[selectIndex].syear}/${appData.ksa_data.stu_credit[selectIndex].seme}`;
        const semeData = new apiFetch(semeDataUrl);
        const result = await semeData.GET(
          access_token as string,
          appData.ksa_data.session_key,
        );
        setSemeData(result.result.dataRows);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSemeData();
  }, [selectIndex]);

  return (
    <div className="flex flex-col bg-sky-50 dark:bg-background h-full pt-10 gap-4">
      <div className="p-5 pt-7 pb-0 text-sky-900 dark:text-sky-100 space-y-2">
        <h1 className="font-medium text-2xl">各項成績查詢</h1>
      </div>
      <div className="grow bg-background dark:bg-blue-300/10 rounded-t-3xl pb-36 p-5">
        <h3 className="font-medium text-lg mx-2">成績資料</h3>
        <div className="z-20 sticky top-11 bg-background dark:bg-[#21262E] flex items-center border-b border-zinc-300 dark:border-zinc-600 overflow-x-auto">
          {appData.ksa_data.stu_credit.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectIndex(index)}
              disabled={isLoading}
              className={`flex items-center justify-center relative p-3 rounded-xl whitespace-nowrap transition-all ${selectIndex === index ? "font-bold" : "font-normal"}`}
            >
              {item.syear}-{item.seme}
              {selectIndex === index && (
                <div className="absolute bottom-0 w-10/12 h-[3px] bg-foreground rounded-full"></div>
              )}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full pt-10 gap-3">
            <Spinner className="size-5" />
            <div className="text-center">
              <p>請稍候</p>
              <p className="opacity-50 text-sm">正在獲取您的成績資料...</p>
            </div>
          </div>
        ) : (
          <div>
            {semeData.map((item, index) => (
              <Link
                href={`/ksa/score/${item.id}`}
                key={index}
                className="relative flex items-center gap-4 border-b border-border dark:border-zinc-600 last:border-b-0 p-3 py-5"
              >
                <div className="text-sky-700 bg-sky-100 dark:bg-sky-900 dark:text-sky-200 rounded-xl p-3">
                  {item.name === "平時成績" ||
                  item.name === "比例為1之平時成績" ? (
                    <ChartColumnBig />
                  ) : (
                    <PencilLine />
                  )}
                </div>
                <div>
                  <p className="opacity-50 text-sm">#{item.id}</p>
                  <p className="font-medium text-lg">
                    {item.syear}-{item.seme} {item.name}
                  </p>
                </div>
                <div className="ml-auto h-full flex items-center justify-center text-sky-700 dark:text-sky-200">
                  <ArrowRight />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
