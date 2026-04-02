"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import { turnOffBackLink } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { getCookie } from "@/utils/getCookie";
import {
  ArrowFromLeftStroke,
  BarChartBig,
  Bolt,
  Burger,
  Groceries,
  Moon,
  Motorcycle,
  PieChart,
  Sun,
  User,
} from "@boxicons/react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

interface UbikeSchema {
  act: number;
  ar: string;
  aren: string;
  bemp: string;
  lat: string;
  lng: string;
  mday: string;
  sarea: string;
  sareaen: string;
  sbi: string;
  sbi_detail: {
    eyb: string;
    yb2: string;
  };
  scity: string;
  scityen: string;
  sna: string;
  snaen: string;
  sno: string;
  tot: string;
}

export default function Home() {
  const AppData = useAppSelector((state) => state.appStatus);
  const userMemberData = useAppSelector((state) => state.userData);
  const lysaAnnData = useAppSelector((state) => state.annData.lysaAnnDatas);
  const refresh_token = getCookie("lyps_refresh_token");
  const [ubikeData, setUbikeData] = useState<UbikeSchema[]>([]);
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const autoplay = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
    }),
  );

  useEffect(() => {
    dispatch(turnOffBackLink());
  }, [dispatch]);

  const handleUserLogout = async () => {
    try {
      const logoutUrl = `${API_BASE_URL}/v1/auth/logout`;
      const logout = new apiFetch(logoutUrl);
      await logout.POST({ refresh_token: refresh_token });
      document.cookie = `lyps_access_token=; path=/; expires=; SameSite=Strict; Secure`;
      document.cookie = `lyps_refresh_token=; path=/; expires=; SameSite=Strict; Secure`;
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUbikeData = async () => {
      try {
        const response = await fetch(
          "https://api.kcg.gov.tw/api/service/Get/b4dd9c40-9027-4125-8666-06bef1756092",
        );
        const data = await response.json();
        const displayArray = [];
        displayArray.push(data.data.data.retVal[1181]);
        displayArray.push(data.data.data.retVal[1184]);
        displayArray.push(data.data.data.retVal[1182]);
        setUbikeData(displayArray);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUbikeData();
  }, []);

  return (
    <div
      className={`p-5 space-y-4 pb-36 ${AppData.device_info.operate_type === "PWA" ? "pt-12" : ""}`}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">首頁</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="ml-auto bg-buttonBg rounded-2xl p-2 active:scale-95 transition-all"
          >
            {theme === "light" ? <Sun /> : <Moon />}
          </button>
          <button
            onClick={() => handleUserLogout()}
            className="ml-auto bg-buttonBg rounded-2xl p-2 active:scale-95 transition-all"
          >
            <ArrowFromLeftStroke />
          </button>
        </div>
      </div>
      <div className="border rounded-3xl p-4 pl-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User />
            <p className="text-xl font-medium">{userMemberData.display_name}</p>
          </div>
          <p className="p-1 rounded-full bg-buttonBg px-3">
            {userMemberData.role === "studentMember"
              ? "學生帳號"
              : "管理員帳號"}
          </p>
        </div>
        <p>
          {userMemberData.grade}
          {userMemberData.class_name} {userMemberData.number}號
        </p>
      </div>
      <div className="space-y-2">
        <p className="mt-2 font-medium text-lg">常用功能</p>
        <div className="text-[14px] flex items-center justify-center bg-hoverbg rounded-3xl py-4">
          <Link
            href={"/ksa/score"}
            className="flex flex-col justify-center p-1 items-center gap-2 font-medium px-3 border-r border-zinc-300 dark:border-zinc-600"
          >
            <BarChartBig />
            成績查詢
          </Link>
          <Link
            href={"/ksa/credit"}
            className="flex flex-col justify-center p-1 items-center gap-2 font-medium px-3 border-r border-zinc-300 dark:border-zinc-600"
          >
            <PieChart />
            學分查詢
          </Link>
          <Link
            href={"/lunch"}
            className="flex flex-col justify-center p-1 items-center gap-2 font-medium px-3 border-r border-zinc-300 dark:border-zinc-600"
          >
            <Burger />
            午餐查詢
          </Link>
          <Link
            href={"/"}
            className="flex flex-col justify-center p-1 items-center gap-2 font-medium px-3"
          >
            <Groceries />
            特約商店
          </Link>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-lg font-medium">UBike 資訊</h2>
        {ubikeData.map((item, index) => (
          <div
            key={index}
            className="border bg-hoverbg rounded-3xl overflow-hidden shadow-md"
          >
            <div className="flex items-center justify-between p-3 bg-background border-b rounded-b-3xl font-custom">
              <div className="flex items-center gap-2">
                <p className="text-base font-medium">
                  {item.sna.split("_")[1]}
                </p>
              </div>
              <div className="flex items-center gap-2 pr-2">
                <Motorcycle />
                <p className="bg-hoverbg rounded-full p-1 text-xs px-1.5 font-medium">
                  一般
                </p>
                <p>{item.sbi_detail.yb2}</p>
                <Bolt />
                <p className="bg-hoverbg rounded-full p-1 text-xs px-1.5 font-medium">
                  電動
                </p>
                <p>{item.sbi_detail.eyb}</p>
              </div>
            </div>
            <p className="m-2 text-sm mx-3 opacity-50">{item.ar}</p>
          </div>
        ))}
      </div>

      <div className="py-2 space-y-2">
        <div className="flex items-center justify-between py-2">
          <p className="font-medium text-lg">最新資訊</p>
          <Link
            href={"/ann/lysa"}
            className="bg-zinc-200 dark:bg-zinc-600 rounded-3xl p-2"
          >
            <ArrowRight size={20} />
          </Link>
        </div>
        <div className="relative w-full">
          <Carousel plugins={[autoplay.current]} opts={{ loop: true }}>
            <CarouselContent>
              {lysaAnnData.map((item) => {
                // 只有廣告公告才要推播出來
                if (item.is_banner) {
                  return (
                    <CarouselItem key={item.id}>
                      <Image
                        src={item.img_url}
                        alt={item.title}
                        width={300}
                        height={200}
                        className="rounded-3xl w-full border border-border dark:border-zinc-600"
                      />
                    </CarouselItem>
                  );
                }
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
      <div className="text-center opacity-50 space-y-2">
        <h3 className="font-medium text-lg">
          學生會製作，旨在建立便利校園生活。
        </h3>
        <p className="text-sm">Copyright © 2026 LYSA. All rights reserved.</p>
      </div>
    </div>
  );
}
