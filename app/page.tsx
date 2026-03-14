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
import { ArrowFromLeftStroke } from "@boxicons/react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChartColumn, ChartPie, Soup, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
  const AppData = useAppSelector((state) => state.appStatus);
  const userMemberData = useAppSelector((state) => state.userData);
  const lysaAnnData = useAppSelector((state) => state.annData.lysaAnnDatas);
  const refresh_token = getCookie("lyps_refresh_token");
  const dispatch = useDispatch();
  const autoplay = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
    }),
  );

  useEffect(() => {
    dispatch(turnOffBackLink());
  });

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

  return (
    <div
      className={`p-5 space-y-4 pb-36 ${AppData.device_info.operate_type === "PWA" ? "pt-10" : ""}`}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">首頁</h1>
        <button
          onClick={() => handleUserLogout()}
          className="ml-auto bg-buttonBg rounded-2xl p-2 active:scale-95 transition-all"
        >
          <ArrowFromLeftStroke />
        </button>
      </div>
      <div className="relative rounded-3xl flex flex-col overflow-hidden m-4">
        <div className="w-full p-4 bg-gradient-to-br from-sky-900/20 dark:from-sky-900 to-background flex justify-between items-center">
          <Image
            src={"/assets/logo.svg"}
            alt="logo"
            width={35}
            height={35}
            className="dark:invert"
          />
          <p className="font-medium text-xl pr-2 font-custom text-sky-900 dark:text-sky-200">
            LYPS {userMemberData.role === "studentMember" ? "STUDENT" : "STAFF"}
          </p>
        </div>
        <div className="p-5 bg-gradient-to-tl from-sky-900/20  dark:from-sky-900 to-background pt-10">
          <p className="text-2xl font-medium">
            {userMemberData.display_name} <span className="opacity-50"></span>
          </p>
          <p className="text-lg">
            {userMemberData.grade}
            {userMemberData.class_name} {userMemberData.number}號
          </p>
        </div>
      </div>
      <div className="p-2 space-y-2">
        <p className="mt-2 font-medium text-lg">常用功能</p>
        <div className="text-[14px] flex items-center justify-evenly">
          <Link
            href={"/"}
            className="flex flex-col justify-center p-2 items-center gap-2"
          >
            <ChartColumn size={30} className="text-sky-600" />
            成績查詢
          </Link>
          <Link
            href={"/"}
            className="flex flex-col justify-center p-2 items-center gap-2"
          >
            <ChartPie size={30} className="text-sky-600" />
            學分查詢
          </Link>
          <Link
            href={"/"}
            className="flex flex-col justify-center p-2 items-center gap-2"
          >
            <Soup size={30} className="text-sky-600" />
            午餐查詢
          </Link>
          <Link
            href={"/"}
            className="flex flex-col justify-center p-2 items-center gap-2"
          >
            <Store size={30} className="text-sky-600" />
            特約商店
          </Link>
        </div>
      </div>

      <div className="p-4 py-2 space-y-2">
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
