"use client";

import { apiService } from "@/services/api";
import { useAppSelector } from "@/store/hook";
import { updateSystemData } from "@/store/systemSlice";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const runtime = "edge";

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
  const [chartData, setChartData] = useState<
    { subject: string; score: number }[]
  >([]);

  useEffect(() => {
    const getScore = async () => {
      if (itemId && userData.school_session && !data[0]) {
        dispatch(
          updateSystemData({
            isLoading: true,
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

        const newChartData: { subject: string; score: number }[] = [];
        for (let i = 0; i < res.result.dataRows.length; i++) {
          newChartData.push({
            subject: res.result.dataRows[i].subjId,
            score: res.result.dataRows[i].score,
          });
        }
        setChartData(newChartData);

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
  }, [dispatch, userData, itemId, router, data]);

  useEffect(() => {
    if (data[0]) {
      dispatch(
        updateSystemData({
          isBack: true,
          BackLink: `/school/score/${data[0].syear}-${data[0].seme}`,
        }),
      );
    }
  });

  const chartConfig = {
    score: {
      label: data[0] ? data[0].itemId : "N/A",
      color: "#4f46e5",
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full min-h-dvh relative flex flex-col bg-background pb-28">
      <div className="p-5 pb-0 font-custom">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-medium">
            {data[0] ? `${data[0].itemId}` : "N/A"}
          </h1>
        </div>
        <div className="flex p-4 rounded-b-[30px] rounded-t-[10px] bg-inputPrimary text-background items-center justify-between my-5">
          <div>
            <h1 className="italic font-medium">班排名</h1>
            {state[0] && (
              <p className="text-sm">
                {state[0].orderC !== null && Number(state[0].orderC) < 10
                  ? `太強了吧！居然考進前十名`
                  : "沒有前十名的你也很棒！繼續加油～"}
              </p>
            )}
          </div>
          <p className="text-3xl font-bold font-custom italic mr-3">
            {state[0] ? `${state[0].orderC}` : "N/A"}
          </p>
        </div>
        <div className="flex gap-2 justify-between items-center px-5 pt-2 relative">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm">類組排名</p>
            <p className="text-2xl text-inputPrimary">
              {state[0] ? `${state[0].orderS}` : "N/A"}
            </p>
          </div>
          <div className="w-[1px] h-10 bg-borderColor"></div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm">平均</p>
            <p className="text-2xl text-inputPrimary">
              {state[0] ? `${state[0].scoreV.toFixed(1)}` : "N/A"}
            </p>
          </div>
          <div className="w-[1px] h-10 bg-borderColor"></div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm">總分</p>
            <p className="text-2xl text-inputPrimary">
              {state[0] ? `${state[0].scoreT}` : "N/A"}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="subject"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E9BDE" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#1E9BDE" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="score"
              type="natural"
              fill="url(#fillScore)"
              fillOpacity={0.4}
              stroke="#0E7BBF"
            />
          </AreaChart>
        </ChartContainer>
      </div>
      <ul className="p-6 flex flex-col gap-2 grow">
        <Table className="bg-zinc-100 dark:bg-zinc-900 rounded-[30px] pl-5 overflow-hidden">
          <TableHeader>
            <TableRow>
              <TableHead className="p-4 w-fit">科目</TableHead>
              <TableHead className="p-4 w-fit">分數</TableHead>
              <TableHead className="p-4 w-fit">班平均</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="p-4">{item.subjId}</TableCell>
                <TableCell className="p-4">{item.score}</TableCell>
                <TableCell className="p-4">{item.yl}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ul>
      <div className="flex items-center justify-center px-10">
        <p className="text-sm opacity-50 text-center">
          所有成績資料皆來自於高雄市教育局校務行政系統，如有任何問題請向教務處反應。
        </p>
      </div>
    </div>
  );
}
