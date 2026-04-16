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
  Bolt,
  DiscordAlt,
  InstagramAlt,
  Moon,
  Motorcycle,
  Sun,
} from "@boxicons/react";
import {
  IconChartBar,
  IconCircleChartLine,
  IconCodeEditor,
  IconShopping,
} from "nucleo-glass";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Info } from "lucide-react";
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
      className={`p-5 space-y-4 pb-36 ${AppData.device_info.operate_type === "PWA" ? "pt-12" : ""}`}
    >
      <div className="flex items-center justify-between">
        <Image
          alt="logo"
          src="/assets/icon-128x128.png"
          width={40}
          height={40}
          className="rounded-xl"
        />
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
      <div className="rounded-3xl p-4 pl-5 bg-gradient-to-br from-hoverbg to-background">
        <h3 className="text-2xl font-medium">{userMemberData.display_name}</h3>

        <div className="flex items-center justify-between mt-2 pt-2">
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
        <div className="flex justify-between items-center w-full space-y-2">
          <p>UUID</p>
          <p className="opacity-50 text-right">{userMemberData.uuid}</p>
        </div>
        <div className="rounded-xl bg-zinc-200 dark:bg-blue-400/20 flex gap-2 text-sm items-center mt-4 p-2 pr-2.5">
          <Info size={18} className="w-8" />
          <p className="text-[16px]">目前不開放更改帳號資訊。</p>
        </div>
      </div>
      <div className="space-y-2">
        <p className="mt-2 font-medium text-lg">常用功能</p>
        <div className="text-[14px] flex items-center justify-between py-4">
          <Link
            href={"/ksa/score"}
            className="flex flex-col justify-center p-1 items-center gap-2 font-medium px-3"
          >
            <IconChartBar
              size={35}
              className="[--nc-gradient-1-color-1:#0087FF]"
            />
            成績查詢
          </Link>
          <Link
            href={"/ksa/credit"}
            className="flex flex-col justify-center p-1 items-center gap-2 font-medium px-3"
          >
            <IconCircleChartLine
              size={35}
              className="[--nc-gradient-1-color-1:#0087FF]"
            />
            學分查詢
          </Link>
          <Link
            href={"/lunch"}
            className="flex flex-col justify-center p-1 items-center gap-2 font-medium px-3"
          >
            <IconCodeEditor
              size={35}
              className="[--nc-gradient-1-color-1:#0087FF]"
            />
            午餐查詢
          </Link>
          <Link
            href={"/"}
            className="flex flex-col justify-center p-1 items-center gap-2 font-medium px-3"
          >
            <IconShopping
              size={35}
              className="[--nc-gradient-1-color-1:#0087FF]"
            />
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
  );
}
