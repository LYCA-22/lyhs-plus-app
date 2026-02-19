"use client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import {
  setAppError,
  turnOnBackLink,
  updatePageLoadingStatus,
} from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { getCookie } from "@/utils/getCookie";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

export const runtime = "edge";

interface scoreData {
  clsId: string;
  credits: number;
  id: string;
  itemId: string;
  noExamMark: string;
  passRate: number;
  scA: number;
  scN: number;
  scS: number;
  score: number;
  sd: number;
  seat: number | string | null;
  seme: number;
  stdCname: string;
  stdNo: string;
  subjId: string;
  syear: number;
  t0: number;
  t20: number;
  t25: number;
  t30: number;
  t35: number;
  t40: number;
  t45: number;
  t50: number;
  t55: number;
  t60: number;
  t65: number;
  t70: number;
  t75: number;
  t80: number;
  t85: number;
  t90: number;
  t95: number;
  yh: number;
  yl: number;
}

export default function CreditPage() {
  const params = useParams();
  const id = params.itemId as string;
  const dispatch = useDispatch();
  const appData = useAppSelector((state) => state.appStatus);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scoreData, setScoreData] = useState<scoreData[]>([]);
  const [viewSub, setViewSub] = useState<number>(0);
  const access_token = getCookie("lyps_access_token");
  const router = useRouter();

  if (!appData.ksa_data.stu_info.length) {
    redirect("/ksa");
  }

  useEffect(() => {
    dispatch(turnOnBackLink("/ksa/score"));
  }, [dispatch]);

  useEffect(() => {
    const fetchSemeData = async () => {
      try {
        dispatch(updatePageLoadingStatus(true));
        setIsLoading(true);
        const scoreDataUrl = `${API_BASE_URL}/v1/lyps/school/examDetail/${appData.ksa_data.JSESSIONID}/${appData.ksa_data.SRV}/${id}`;
        const scoreDataApi = new apiFetch(scoreDataUrl);
        const result = await scoreDataApi.GET(
          access_token as string,
          appData.ksa_data.session_key,
        );

        if (result.itemInfo.length == 0) {
          dispatch(updatePageLoadingStatus(false));
          dispatch(
            setAppError({
              type: "client",
              message: "此段考項目暫未開放查詢。",
              code: "LC001",
              status: 404,
            }),
          );
          router.push("/ksa/score");
        }

        setScoreData(result.subScoreDetail);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        dispatch(updatePageLoadingStatus(false));
      }
    };
    fetchSemeData();
  }, []);

  const chartConfig = {
    score: {
      label: "分數",
      color: "#0084C7",
    },
    yl: {
      label: "平均",
      color: "#0084C7",
    },
  };

  return (
    <div className="flex flex-col bg-sky-50 dark:bg-background pt-10 gap-4 relative">
      <div className="p-5 pt-7 pb-0 text-sky-900 dark:text-sky-100 space-y-2">
        <h1 className="font-medium text-2xl">成績分項資料</h1>
      </div>
      <div className="bg-background dark:bg-sky-300/10 mx-5 rounded-2xl p-4 overflow-x-auto">
        <div>
          <h3 className="text-lg font-medium">成績總覽</h3>
          <p className="opacity-50">往右滑可以看更多</p>
        </div>
        <div className="bg-zinc-200 rounded-xl dark:bg-sky-300/10 mt-2 px-2">
          <Table className="w-fit whitespace-nowrap">
            <TableHeader>
              <TableRow className="border-zinc-400 dark:border-zinc-700 dark:hover:bg-sky-300/10">
                <TableHead>科目</TableHead>
                {scoreData.map((item, index) => (
                  <TableHead
                    key={index}
                    className="font-medium overflow-x-auto"
                  >
                    {item.subjId}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-zinc-400 dark:border-zinc-700 dark:hover:bg-sky-300/10">
                <TableCell className="font-medium overflow-x-auto">
                  分數
                </TableCell>
                {scoreData.map((item, index) => (
                  <TableCell
                    key={index}
                    className="font-medium overflow-x-auto"
                  >
                    {item.score}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="bg-background dark:bg-sky-300/10 mx-5 rounded-2xl p-4">
        <div>
          <h3 className="text-lg font-medium">成績雷達圖</h3>
          <p className="opacity-50">這裡會顯示您的分數與班平均</p>
        </div>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={scoreData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey="subjId" />
            <PolarGrid />
            <Radar dataKey="score" fill="#FF7444" fillOpacity={0.8} />
            <Radar dataKey="yl" fill="#576A8F" fillOpacity={0.5} />
          </RadarChart>
        </ChartContainer>
      </div>
      <div className="grow bg-background dark:bg-blue-300/10 rounded-t-3xl pb-36 p-5">
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
            <h3 className="font-medium text-lg mx-2">各科詳細資料</h3>
            <div className="z-20 sticky top-11 bg-background dark:bg-[#21262E] flex items-center border-b border-zinc-300 dark:border-zinc-600 overflow-x-auto">
              {scoreData.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setViewSub(index)}
                  disabled={isLoading}
                  className={`flex items-center justify-center relative p-3 rounded-xl whitespace-nowrap transition-all ${viewSub === index ? "font-bold" : "font-normal"}`}
                >
                  {item.subjId}
                  {viewSub === index && (
                    <div className="absolute bottom-0 w-10/12 h-[3px] bg-foreground rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
