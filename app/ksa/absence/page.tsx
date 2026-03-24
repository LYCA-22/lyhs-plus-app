"use client";
import { Spinner } from "@/components/ui/spinner";
import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import { turnOnBackLink } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { getCookie } from "@/utils/getCookie";
import { CalendarAlt } from "@boxicons/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export interface AbsenceRecord {
  id: number;
  absenceDt: string;
  syear: number;
  seme: number;
  stdCname: string;
  clsNo: string;
  seat: string;
  stdSemeId: number;
  clsCname: string;
  empId: string | null;
  stdNo: string;
  raiseFlag: string | null;
  morn: string | number | null;
  rest: string | number | null;
  lesson1: string | number | null;
  lesson2: string | number | null;
  lesson3: string | number | null;
  lesson4: string | number | null;
  lesson5: string | number | null;
  lesson6: string | number | null;
  lesson7: string | number | null;
  lesson8: string | number | null;
  lesson9: string | number | null;
  [key: string]: string | number | null | undefined;
}

type PeriodKey =
  | "morn"
  | "lesson1"
  | "lesson2"
  | "lesson3"
  | "lesson4"
  | "rest"
  | "lesson5"
  | "lesson6"
  | "lesson7"
  | "lesson8"
  | "lesson9";

const absenceCodeMap: Record<string, string> = {
  "1": "曠課",
  "2": "事假",
  "3": "病假",
  "4": "喪假",
  "5": "公假",
  "7": "遲到",
  E: "早退",
  B: "補假",
  C: "減",
  N: "抵",
  O: "空",
  J: "婚假",
  X: "產前假",
  M: "娩假",
  K: "陪產假",
  Y: "流產假",
  Z: "育嬰假",
  W: "生理假",
  "9": "其他",
  F: "新冠假",
  I: "身心假",
  A: "跨",
};

const periods: { key: PeriodKey; label: string }[] = [
  { key: "morn", label: "早修" },
  { key: "lesson1", label: "第一節" },
  { key: "lesson2", label: "第二節" },
  { key: "lesson3", label: "第三節" },
  { key: "lesson4", label: "第四節" },
  { key: "rest", label: "午休" },
  { key: "lesson5", label: "第五節" },
  { key: "lesson6", label: "第六節" },
  { key: "lesson7", label: "第七節" },
  { key: "lesson8", label: "第八節" },
  { key: "lesson9", label: "第九節" },
];

const getAbsenceColor = (code: string) => {
  switch (code) {
    case "1": // 曠
      return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-800/50";
    case "2": // 事
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50";
    case "3": // 病
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50";
    case "5": // 公
      return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-800/50";
    case "7": // 遲到
    case "E": // 早退
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800/50";
    case "F": // 新冠
    case "4": // 喪
    case "W": // 生理
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50";
    default:
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700";
  }
};

export default function AbsencePage() {
  const dispatch = useDispatch();
  const appData = useAppSelector((state) => state.appStatus);
  const [selectIndex, setSelectIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allAbsenceData, setAllAbsenceData] = useState<AbsenceRecord[]>([]);
  const access_token = getCookie("lyps_access_token");

  if (!appData.ksa_data.stu_info.length) {
    redirect("/ksa");
  }

  useEffect(() => {
    dispatch(turnOnBackLink("/ksa"));
  }, [dispatch]);

  const handleFetchAbsence = async () => {
    try {
      setIsLoading(true);
      // 保持原始的 API 呼叫路徑
      const absenceUrl = `${API_BASE_URL}/v1/lyps/school/absence/${appData.ksa_data.JSESSIONID}/${appData.ksa_data.SRV}`;
      const absenceFetch = new apiFetch(absenceUrl);
      const res = await absenceFetch.GET(
        access_token as string,
        appData.ksa_data.session_key,
      );

      setAllAbsenceData(res.result?.dataRows || []);
    } catch (e) {
      console.error(e);
      setAllAbsenceData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchAbsence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 取得目前選中學期的資訊
  const currentSemester = appData.ksa_data.stu_credit[selectIndex];

  // 在前端過濾出符合當前選中學期的出缺席資料
  const filteredAbsenceData = allAbsenceData.filter(
    (record) =>
      record.syear === currentSemester?.syear &&
      record.seme === currentSemester?.seme,
  );

  // 計算選中學期的統計資料 (病假=3, 事假=2, 曠課=1)
  let totalSick = 0;
  let totalPersonal = 0;
  let totalTruancy = 0;
  let totalWork = 0;

  filteredAbsenceData.forEach((record) => {
    periods.forEach((p) => {
      const codeVal = record[p.key];
      if (codeVal !== null && codeVal !== 0 && codeVal !== "0") {
        const codeStr = String(codeVal);
        if (codeStr === "3") totalSick++;
        if (codeStr === "2") totalPersonal++;
        if (codeStr === "1") totalTruancy++;
        if (codeStr === "5") totalWork++;
      }
    });
  });

  return (
    <div className="flex flex-col bg-hoverbg dark:bg-background h-full pt-10 gap-4">
      <div className="p-5 pt-7 pb-0 space-y-2">
        <h1 className="font-medium text-2xl">出缺席紀錄</h1>
        <p className="text-sm opacity-70">查看各學期詳細出缺席與請假狀況</p>
      </div>

      <div className="grow bg-background dark:bg-blue-300/10 rounded-t-3xl pb-36 p-5">
        <h3 className="font-medium text-lg m-2">各學期紀錄</h3>

        <div className="z-20 sticky top-11 bg-background dark:bg-[#21262E] flex items-center border-b border-zinc-300 dark:border-zinc-600 overflow-x-auto mb-4 scrollbar-hide">
          {appData.ksa_data.stu_credit.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectIndex(index)}
              disabled={isLoading}
              className={`flex items-center justify-center relative p-3 px-4 rounded-xl whitespace-nowrap transition-all ${selectIndex === index ? "font-bold text-foreground" : "font-normal text-muted-foreground"}`}
            >
              {item.syear}-{item.seme}
              {selectIndex === index && (
                <div className="absolute bottom-0 w-10/12 h-[3px] bg-foreground rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        <div className="relative min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full pt-20 gap-3">
              <Spinner className="size-6" />
              <div className="text-center">
                <p>請稍候</p>
                <p className="opacity-50 text-sm">正在獲取您的出缺席資料...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col mt-2">
              <div className="flex mb-2 bg-zinc-100  dark:bg-sky-50/5 rounded-xl">
                <div className="flex-1 p-3 flex flex-col items-center justify-center border-r  dark:border-zinc-700">
                  <span className="text-xs font-medium mb-1">病假</span>
                  <span className="text-2xl font-bold font-poppins">
                    {totalSick}{" "}
                    <span className="text-xs font-normal opacity-70">節</span>
                  </span>
                </div>
                <div className="flex-1 p-3 flex flex-col items-center justify-center border-r dark:border-zinc-700">
                  <span className="text-xs font-medium mb-1">事假</span>
                  <span className="text-2xl font-bold font-poppins">
                    {totalPersonal}{" "}
                    <span className="text-xs font-normal opacity-70">節</span>
                  </span>
                </div>
                <div className="flex-1 p-3 flex flex-col items-center justify-center border-r dark:border-zinc-700">
                  <span className="text-xs font-medium mb-1">曠課</span>
                  <span className="text-2xl font-bold font-poppins">
                    {totalTruancy}{" "}
                    <span className="text-xs font-normal opacity-70">節</span>
                  </span>
                </div>
                <div className="flex-1 p-3 flex flex-col items-center justify-center">
                  <span className="text-xs font-medium mb-1">公假</span>
                  <span className="text-2xl font-bold font-poppins">
                    {totalWork}{" "}
                    <span className="text-xs font-normal opacity-70">節</span>
                  </span>
                </div>
              </div>

              {/* 列表區塊 */}
              <div className="flex flex-col gap-4">
                {filteredAbsenceData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 opacity-50">
                    <CalendarAlt className="size-12 mb-3 opacity-30" />
                    <p>此學期尚無缺曠紀錄</p>
                  </div>
                ) : (
                  filteredAbsenceData.map((record, index) => {
                    // 檢查這天是否有任何缺曠紀錄 (0 為無紀錄)
                    const hasRecord = periods.some((p) => {
                      const val = record[p.key];
                      return val !== null && val !== 0 && val !== "0";
                    });
                    if (!hasRecord) return null;

                    return (
                      <div key={index} className="flex flex-col pb-5">
                        <div className="flex items-center gap-2 pb-3 mb-2 ">
                          <CalendarAlt className="size-5" />
                          <span className="font-semibold text-lg tracking-wide">
                            {record.absenceDt}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {periods.map((p) => {
                            const codeVal = record[p.key];
                            if (
                              codeVal === null ||
                              codeVal === 0 ||
                              codeVal === "0"
                            )
                              return null;

                            // 統一轉字串解決 TS 型別問題
                            const codeStr = String(codeVal);
                            const label =
                              absenceCodeMap[codeStr] || `未知(${codeStr})`;
                            const colorClass = getAbsenceColor(codeStr);

                            return (
                              <div
                                key={p.key}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${colorClass}`}
                              >
                                <span className="opacity-80 text-xs">
                                  {p.label}
                                </span>
                                <span>{label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
