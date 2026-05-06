"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { turnOffBackLink } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { Bolt, DiscordAlt, InstagramAlt, Motorcycle } from "@boxicons/react";
import {
  Sun,
  Moon01,
  LineChartUp01,
  PieChart03,
  Menu03,
  ShoppingBag02,
  LogOut01,
} from "@untitledui/icons";
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
  const [ubikeData, setUbikeData] = useState<UbikeSchema[]>([]);
  const { theme, setTheme } = useTheme();
  const version = process.env.NEXT_PUBLIC_APP_VERSION;
  const ubikeStep = [
    "YouBike2.0_林園行政中心",
    "YouBike2.0_幸福公園",
    "YouBike2.0_林園區衛生所",
  ];
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
      await fetch("/api/auth/logout", {
        method: "POST",
      });
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
        const displayArray = data.data.data.retVal.filter((item: UbikeSchema) =>
          ubikeStep.includes(item.sna),
        );
        setUbikeData(displayArray);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUbikeData();
  }, []);

  return (
    <div
      className={`${AppData.device_info.operate_type === "PWA" ? "pt-12" : ""} bg-zinc-100 dark:bg-zinc-800`}
    >
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium">
            歡迎，{userMemberData.display_name}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="ml-auto bg-background border rounded-[18px] p-2 active:scale-95 transition-all"
            >
              {theme === "light" ? (
                <Sun className="opacity-60" />
              ) : (
                <Moon01 className="opacity-60" />
              )}
            </button>
            <button
              onClick={() => handleUserLogout()}
              className="ml-auto bg-background border rounded-[18px] p-2 active:scale-95 transition-all"
            >
              <LogOut01 className="opacity-60" />
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl p-4 pl-5 bg-background shadow-lg shadow-zinc-200/50 dark:shadow-zinc-800/50">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p>身份</p>
                <p className="font-medium">
                  {userMemberData.role === "studentMember" ? "學生" : "管理員"}
                </p>
              </div>
              <div className="space-y-0.5">
                <p>班級</p>
                <p className="font-medium">
                  {userMemberData.grade}
                  {userMemberData.class_name}
                </p>
              </div>
              <div className="space-y-0.5">
                <p>座號</p>
                <p className="font-medium">{userMemberData.number}號</p>
              </div>
            </div>
            <div className="flex justify-between items-center w-full space-y-2 mt-2 border-t pt-2">
              <p>學號</p>
              <p className="opacity-50 text-right">{userMemberData.stu_id}</p>
            </div>
          </div>
          <div className="text-[14px] flex items-center justify-between p-2 px-0 text-center whitespace-nowrap overflow-x-auto opacity-70">
            <Link
              href={"/ksa/score"}
              className="flex flex-col justify-center p-1 items-center gap-2 font-medium px-3"
            >
              <LineChartUp01 size={28} />
              成績查詢
            </Link>
            <Link
              href={"/ksa/credit"}
              className="flex flex-col justify-center p-1 items-center gap-2 font-medium px-3"
            >
              <PieChart03 size={28} />
              學分查詢
            </Link>
            <Link
              href={"/lunch"}
              className="flex flex-col justify-center p-1 items-center gap-2 font-medium px-3"
            >
              <Menu03 size={28} />
              午餐查詢
            </Link>
            <Link
              href={"/"}
              className="flex flex-col justify-center p-1 items-center gap-2 font-medium px-3"
            >
              <ShoppingBag02 size={28} />
              特約商店
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-background p-5 pb-36 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
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

        <div className="space-y-4">
          <h2 className="text-lg font-medium">UBike 資訊</h2>
          <div className="flex w-full overflow-x-auto gap-5">
            {ubikeData.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-sky-50 dark:from-sky-900 to-background rounded-t-3xl p-5"
              >
                <p className="text-xl font-medium opacity-70">
                  {item.sna.split("_")[1]}
                </p>

                <div className="flex items-center justify-evenly mt-4 whitespace-nowrap gap-7">
                  <div className="text-center space-y-2">
                    <div className="flex items-center gap-2">
                      <Motorcycle />
                      <p>一般</p>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <p className="text-3xl font-custom2 font-bold text-sky-500">
                        {item.sbi_detail.yb2}
                      </p>
                      <p>台</p>
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="flex items-center gap-2">
                      <Bolt />
                      <p>電動</p>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <p className="text-3xl font-custom2 font-bold  text-green-500">
                        {item.sbi_detail.eyb}
                      </p>
                      <p>台</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center opacity-50 space-y-2 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 rounded-full">
            <p>網頁應用程式版本</p>
            <p>{version}</p>
          </div>
          <h3 className="font-medium text-lg">
            學生會製作，旨在建立便利校園生活
          </h3>
          <p className="text-sm">Copyright © 2026 LYSA. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 p-2">
            <Link href={"https://www.instagram.com/lysa_23rd/"} target="_blank">
              <InstagramAlt />
            </Link>
            <Link href={"https://discord.gg/5Q5NpUsQBb"} target="_blank">
              <DiscordAlt />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
