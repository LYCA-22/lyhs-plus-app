"use client";

import { useAppSelector } from "@/store/hook";
import Link from "next/link";
import { lycaService } from "./schema";
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Plus } from "lucide-react";

ChartJS.register(ArcElement, Tooltip);

export default function Page() {
  const AppData = useAppSelector((state) => state.systemData);
  const [chartLoaded, setChartLoaded] = useState(false);

  const completionRate = 0;
  const remainingRate = 100 - completionRate;

  const chartData = {
    datasets: [
      {
        data: [completionRate, remainingRate],
        backgroundColor: ["rgba(30, 155, 222, 1)", "rgba(220, 220, 220, 0.3)"],
        borderWidth: 0,
        cutout: "60%",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
    },
    rotation: -90,
    circumference: 360,
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  return (
    <div className="relative w-full">
      <div className={`w-full px-5 ${AppData.isPwa ? "mt-deviceTop" : "mt-5"}`}>
        <h1 className={`text-2xl font-medium`}>班聯會</h1>
        <div className="h-36 flex items-center gap-7 backdrop-blur-sm rounded-3xl py-5 px-3 mt-5">
          <div className="w-28 h-28">
            {chartLoaded && (
              <Doughnut data={chartData} options={chartOptions} />
            )}
          </div>
          <div>
            <h1 className="text-lg">政見完成度</h1>
            <h1 className="text-5xl font-bold">N/A %</h1>
            <Link
              href={"/"}
              className="my-1 flex gap-2 items-center rounded-3xl bg-inputPrimary absolute bottom-3 right-3 text-background p-2"
            >
              <Plus size={20} strokeWidth={3} />
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto w-full scrollbar-hide my-5">
          <div className="w-fit flex items-center gap-4">
            {lycaService.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="hover:opacity-50 flex flex-col justify-between rounded-3xl w-36 h-36 border border-hoverbg bg-gradient-to-br from-hoverbg to-white/0 p-5 dark:shadow-2xl dark:shadow-zinc-800/50"
              >
                <h1 className="text-xl font-bold">{item.name}</h1>
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
