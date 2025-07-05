"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { apiService } from "@/services/api";
import { useAppSelector } from "@/store/hook";
import { updateSystemData } from "@/store/systemSlice";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

interface ClassList {
  sco4: null;
  clsId: number;
  sco3: null;
  sco6: number;
  hourTot: number;
  sco5: null;
  sco2: null;
  sco1: number;
  stdCname: string;
  stdNo: string;
  hourSum: number;
  credSum: number;
  stdId: number;
  retainM: null;
  id: number;
  seme: number;
  upgrade: string;
  credTot: number;
  subjTot: number;
  subjSum: number;
  credMust: number;
  seat: string;
  stdSemeId: number;
  clsCname: string;
  grade: number;
  syear: number;
  stdSeme1Id: number;
}

export default function Page() {
  const userData = useAppSelector((state) => state.userData);
  const [classList, setClassList] = useState<ClassList[]>([]);
  const [stdName, setStdName] = useState("");
  const [stdNo, setStdNo] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const [credit, setCredit] = useState(0);

  const chartData = [
    {
      name: "學分",
      completed: credit,
      remaining: Math.max(0, 180 - credit),
    },
  ];

  const chartConfig = {
    completed: {
      label: "已完成學分",
      color: "#1E9BDE",
    },
    remaining: {
      label: "未完成學分",
      color: "var(--foreground)",
    },
  } satisfies ChartConfig;
  useEffect(() => {
    const getClassList = async () => {
      dispatch(
        updateSystemData({
          isLoading: true,
        }),
      );

      if (!userData.school_session) {
        router.push("/school");
        return;
      }

      try {
        const classList = await apiService.getSemeScore(
          userData.school_session,
          userData.JSESSIONID,
          userData.SRV,
        );

        const result = classList.result?.dataRows || [];
        setClassList(result);

        if (result.length > 0) {
          setStdName(result[0]?.stdCname || "");
          setStdNo(result[0]?.stdNo || "");

          // 尋找包含 credAdd 屬性的最後一個元素
          const lastItemWithCredAdd = [...result]
            .reverse()
            .find((item) => item && typeof item.credAdd === "number");
          setCredit(lastItemWithCredAdd?.credAdd || 0);
        } else {
          setStdName("");
          setStdNo("");
          setCredit(0);
        }

        dispatch(
          updateSystemData({
            isBack: false,
            isLoading: false,
          }),
        );
      } catch (error) {
        console.error("獲取學期成績時出錯:", error);
        window.alert("獲取成績資料時發生錯誤");

        dispatch(
          updateSystemData({
            isLoading: false,
          }),
        );
      }
    };

    getClassList();
  }, [
    dispatch,
    userData.school_session,
    userData.JSESSIONID,
    userData.SRV,
    router,
  ]);

  return (
    <div className="w-full flex flex-col items-center justify-center relative pb-36">
      <div className="flex flex-col gap-2 justify-center w-full px-5 pt-2">
        <h1 className="text-2xl font-medium">歡迎，{stdName}同學</h1>
        <h2 className="text-sm font-medium w-fit bg-inputPrimary rounded-r-[30px] rounded-l-xl p-2 px-3 text-background">
          學號 {stdNo}
        </h2>
      </div>
      <div className="flex justify-center items-start p-5 h-[150px] overflow-hidden mt-5">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-[250px] h-[200px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <RadialBar
              dataKey="remaining"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-remaining)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="completed"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-completed)"
              className="stroke-transparent stroke-2"
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {credit.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          / {180} 學分
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </div>
      <div className="p-5 w-full flex flex-col gap-2">
        <div className="flex items-center justify-between px-5 pb-2 border-b border-zinc-200 dark:border-borderColor">
          <h2>目前已得到的學分</h2>
          <p className="font-medium text-2xl italic text-inputPrimary">
            {credit}
          </p>
        </div>
        <div className="flex items-center justify-between px-5">
          <h2>還未拿到的學分</h2>
          <p className="font-medium text-2xl italic text-inputPrimary">
            {180 - credit}
          </p>
        </div>
      </div>
      <div className="relative p-5 w-full">
        <p className="font-medium opacity-50 p-3 text-sm">各學期成績查詢</p>
        <ul className="rounded-[30px] bg-zinc-100 dark:bg-zinc-900 flex flex-col w-full overflow-hidden">
          {classList.length > 0 ? (
            classList.map((item, index) => (
              <li
                key={index}
                className="py-3 px-5 hover:bg-buttonBg transition-all border-b border-zinc-200 dark:border-borderColor flex justify-between items-center last:border-0"
              >
                <Link
                  href={`/school/score/${item.syear}-${item.seme}`}
                  className="flex justify-between items-center w-full"
                >
                  <p>
                    {item.clsCname} 第{item.seme}學期
                  </p>
                  <ChevronRight
                    size={25}
                    strokeWidth={2}
                    className="text-zinc-600 dark:text-zinc-500"
                  />
                </Link>
              </li>
            ))
          ) : (
            <div className="py-4 px-5 text-center text-gray-500">
              無成績資料可顯示
            </div>
          )}
        </ul>
        <p className="font-medium opacity-50 p-3 text-sm">其他功能</p>
        <button
          onClick={() => {
            window.alert("功能未開放");
          }}
          className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-900 rounded-[30px] w-full px-5 py-3"
        >
          <p>高中總成績</p>
          <ChevronRight
            size={25}
            strokeWidth={2}
            className="text-zinc-600 dark:text-zinc-500"
          />
        </button>
        <button
          onClick={() => {
            window.alert("功能未開放");
          }}
          className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-900 rounded-[30px] w-full px-5 py-3 mt-3"
        >
          <p>學分詳細資料</p>
          <ChevronRight
            size={25}
            strokeWidth={2}
            className="text-zinc-600 dark:text-zinc-500"
          />
        </button>
      </div>
      <div className="flex items-center justify-center px-10 mt-3">
        <p className="text-sm opacity-50 text-center">
          所有成績資料皆來自於高雄市教育局校務行政系統，如有任何問題請向教務處反應。
        </p>
      </div>
    </div>
  );
}
