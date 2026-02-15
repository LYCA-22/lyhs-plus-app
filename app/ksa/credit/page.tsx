"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import { turnOnBackLink } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { SubData } from "@/types";
import { getCookie } from "@/utils/getCookie";
import { BookOpen, CircleCheck, CircleX, Sparkle } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Pie, PieChart } from "recharts";

export default function CreditPage() {
  const dispatch = useDispatch();
  const appData = useAppSelector((state) => state.appStatus);
  const [selectIndex, setSelectIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [semeScoreData, setSemeScoreData] = useState<SubData[]>([]);
  const access_token = getCookie("lyps_access_token");

  if (!appData.ksa_data.stu_info.length) {
    redirect("/ksa");
  }

  const credit_final = appData.ksa_data.stu_credit_final[0];
  const stu_info = appData.ksa_data.stu_info[0];

  useEffect(() => {
    dispatch(turnOnBackLink("/ksa"));
  }, [dispatch]);

  // 計算目前正常會得到的學分總數
  const allCredit = appData.ksa_data.stu_credit.reduce((acc, item) => {
    if (!item.credSum) return acc;
    return acc + (item.credSum as number);
  }, 0);

  const failedCredit = allCredit - (credit_final.credAdd as number);

  const scoreData = [
    {
      title: "必修學分",
      num: credit_final.credAddMust,
      fill: "#30364F",
    },
    {
      title: "選修學分",
      num: credit_final.credAddElect,
      fill: "#ACBAC4",
    },
    {
      title: "被當學分",
      num: failedCredit,
      fill: "#E1D9BC",
    },
    {
      title: "未得學分",
      num:
        182 -
        failedCredit -
        (credit_final.credAddElect as number) -
        (credit_final.credAddMust as number),
      fill: "#F0F0DB",
    },
  ];

  const chartConfig = {
    必修學分: {
      label: "必修學分",
      color: "hsl(var(--chart-1))",
    },
    選修學分: {
      label: "選修學分",
      color: "hsl(var(--chart-2))",
    },
    被當學分: {
      label: "被當學分",
      color: "hsl(var(--chart-3))",
    },
    未得學分: {
      label: "未得學分",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;

  const handleFetchSemeScore = async () => {
    try {
      setIsLoading(true);
      const semeSubScoreUrl = `${API_BASE_URL}/v1/lyps/school/semeSubScore/${appData.ksa_data.JSESSIONID}/${appData.ksa_data.SRV}/${appData.ksa_data.stu_credit[selectIndex].id}`;
      const semeSubScore = new apiFetch(semeSubScoreUrl);
      const res = await semeSubScore.GET(
        access_token as string,
        appData.ksa_data.session_key,
      );

      setSemeScoreData(res.result.dataRows as SubData[]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchSemeScore();
  }, [selectIndex]);

  return (
    <div className="flex flex-col bg-sky-50 dark:bg-background h-full pt-10 gap-4">
      <div className="p-5 pt-7 pb-0 text-sky-900 dark:text-sky-100 space-y-2">
        <h1 className="font-medium text-2xl">學分資料</h1>
      </div>
      <div className="flex items-center bg-background dark:bg-blue-300/10 rounded-3xl mx-5 p-3 mb-2 gap-3">
        <Sparkle />
        <p className="text-lg font-medium">
          在 {appData.ksa_data.stu_credit.length - 1} 個學期中，您總共被當了
          <span className="text-red-500 underline underline-offset-4 mx-2">
            {failedCredit}
          </span>
          個學分。
        </p>
      </div>
      <div className="flex items-center justify-between bg-background dark:bg-blue-300/10 rounded-3xl mx-5 p-5 mb-2">
        <div className="space-y-2">
          <p className="text-xl font-medium">{stu_info.zhName || ""}</p>
          <div className="text-xl font-medium flex items-center flex-wrap gap-2">
            <BookOpen />
            <p>
              <span className="text-sky-600 dark:text-sky-400">
                {credit_final.credAdd}
              </span>
              <span> / 182</span>
            </p>
          </div>
          <div className="flex flex-col pt-5">
            <p className="text-lg flex items-center gap-2">
              <span>必修學分</span>
              <span className="text-sky-600 dark:text-sky-400">
                {credit_final.credAddMust}
              </span>
            </p>
            <p className="text-lg flex items-center gap-2">
              <span>選修學分</span>
              <span className="text-sky-600 dark:text-sky-400">
                {credit_final.credAddElect}
              </span>
            </p>
            <p className="text-lg flex items-center gap-2">
              <span>被當學分</span>
              <span className="text-sky-600 dark:text-sky-400">
                {failedCredit}
              </span>
            </p>
          </div>
        </div>
        <div>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-[150px] scale-90"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={scoreData} dataKey="num" nameKey="title" />
            </PieChart>
          </ChartContainer>
        </div>
      </div>
      <div className="grow bg-background dark:bg-blue-300/10 rounded-t-3xl pb-36 p-5">
        <h3 className="font-medium text-lg m-2">各學期學業資訊</h3>
        <div className="my-4 text-lg rounded-3xl border border-border overflow-hidden dark:border-zinc-700 px-2">
          <Table>
            <TableHeader>
              <TableRow className=" dark:hover:bg-sky-300/10">
                <TableHead>學期</TableHead>
                <TableHead>平均</TableHead>
                <TableHead>總分</TableHead>
                <TableHead className="text-right">所得 / 全部學分</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appData.ksa_data.stu_credit.map((item, index) => (
                <TableRow
                  key={index}
                  className="dark:border-zinc-700  dark:hover:bg-sky-300/10"
                >
                  <TableCell className="font-medium">
                    {item["syear"]}-{item["seme"]}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item["sco1"] === null ? (
                      <span className="text-gray-500">N/A</span>
                    ) : (
                      item["sco1"]?.toString().slice(0, 4)
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item["scoreT"] === "" ? (
                      <span className="text-gray-500">N/A</span>
                    ) : (
                      item["scoreT"]
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-right">
                    {item["credTot"] === "" ? (
                      <span className="text-gray-500">N/A</span>
                    ) : (
                      <p>
                        {item["credTot"]}
                        <span className="text-xs opacity-50">
                          /{item["credSum"]}
                        </span>
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-transparent dark:border-zinc-700">
              <TableRow className=" dark:hover:bg-sky-300/10">
                <TableCell colSpan={3}>學分加總</TableCell>
                <TableCell className="text-right text-2xl">
                  {credit_final.credAdd}
                  <span className="text-xs opacity-50"> /182</span>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <h3 className="font-medium text-lg m-2 mt-8">各學期各科詳細狀態</h3>
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
        <div className="mt-2">
          <div className="flex w-full justify-between px-5 py-2">
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm">班級排名</p>
              <p className="font-poppins text-xl font-medium">
                {semeScoreData[0]
                  ? semeScoreData[0]["orderCQ"] || "N/A"
                  : "N/A"}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm">全校排名</p>
              <p className="font-poppins text-xl font-medium">
                {semeScoreData[0]
                  ? semeScoreData[0]["orderSQ"] || "N/A"
                  : "N/A"}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm">年級排名</p>
              <p className="font-poppins text-xl font-medium">
                {semeScoreData[0]
                  ? semeScoreData[0]["orderGQ"] || "N/A"
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="text-xs pt-2 border-t border-border dark:border-zinc-700 mt-2 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/70 font-medium">
                部必
              </div>
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/70 font-medium">
                校必
              </div>
              <p className="text-sm">學分會列入「必修」計算。</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-sky-100 dark:bg-sky-900/70 font-medium">
                校選
              </div>
              <p className="text-sm">學分會列入「選修」計算。</p>
            </div>
          </div>
        </div>

        <div className="relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full pt-10 gap-3">
              <Spinner className="size-5" />
              <div className="text-center">
                <p>請稍候</p>
                <p className="opacity-50 text-sm">正在獲取您的成績資料...</p>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-zinc-700 dark:hover:bg-sky-300/10">
                    <TableHead>科目</TableHead>
                    <TableHead>類別</TableHead>
                    <TableHead>分數</TableHead>
                    <TableHead>學分</TableHead>
                    <TableHead>通過</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {semeScoreData.map((item, index) => (
                    <TableRow
                      key={index}
                      className="dark:border-zinc-700 dark:hover:bg-sky-300/10"
                    >
                      <TableCell className="font-medium max-w-[150px] overflow-x-auto">
                        {item["subjId"]}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item["courseType"] && (
                          <p
                            className={`text-xs w-fit p-2 rounded-full bg-border ${item["courseType"] === "校選" ? "bg-sky-100 dark:bg-sky-900/70" : "bg-green-100 dark:bg-green-900/70"}`}
                          >
                            {item["courseType"]}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <p
                          className={`${item["score"] < 60 ? "text-red-600 font-bold" : "text-foreground"}`}
                        >
                          {item["score"] || "N/A"}
                        </p>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item["credits"]}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item["score"] !== null && (
                          <>
                            {item["passYn"] === "是" ? (
                              <CircleCheck
                                className="text-green-600"
                                size={20}
                              />
                            ) : (
                              <CircleX className="text-red-500" size={20} />
                            )}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
