"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { turnOffBackLink } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import Autoplay from "embla-carousel-autoplay";
import {
  ArrowRight,
  ChartColumn,
  ChartPie,
  Database,
  LogOut,
  Plus,
  Soup,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
  const userMemberData = useAppSelector((state) => state.userData);
  const lysaAnnData = useAppSelector((state) => state.annData.lysaAnnDatas);
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

  return (
    <div className="p-5 space-y-4 pb-36">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">首頁</h1>
        <Link href={"/"} className="flex items-center gap-2">
          <LogOut size={18} />
        </Link>
      </div>
      <div className="relative rounded-3xl flex flex-col overflow-hidden m-4">
        <div className="w-full p-4 bg-gradient-to-br from-sky-900/20 dark:from-sky-900 to-background flex justify-between items-center">
          <Image
            src={"/logo.svg"}
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
      <div className="p-4 py-2 space-y-2">
        <p className="mt-2 font-medium text-lg">常用功能</p>
        <div className="text-[14px] flex items-center justify-start gap-4">
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
        </div>
      </div>
      <div className="bg-sky-100 dark:bg-sky-900 rounded-3xl m-4 p-4 flex items-end gap-4">
        <div>
          <h3 className="font-medium text-lg">全新智慧助理登場！</h3>
          <p>現在可以透過對話的方式找到您需要的資訊。</p>
        </div>
        <Link
          href={"/chat"}
          className="flex flex-col justify-center p-2 items-center gap-2 bg-sky-600 rounded-xl text-white w-fit ml-auto"
        >
          <ArrowRight />
        </Link>
      </div>
      <div className="p-4 py-2 space-y-2">
        <p className="mb-4 font-medium text-lg">最新資訊</p>
        <div className="relative px-5 w-full">
          <Carousel plugins={[autoplay.current]} opts={{ loop: true }}>
            <CarouselContent className="h-44">
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
                        className="rounded-xl"
                      />
                    </CarouselItem>
                  );
                }
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
      <div className="p-4 py-2 space-y-2">
        {userMemberData.role === "lysaStaff" && (
          <>
            <p className="mt-2 font-medium text-lg">管理員專用</p>
            <div className="text-[14px] flex items-center justify-center gap-4">
              <Link
                href={"/admin/member"}
                className="flex flex-col justify-center p-2 items-center gap-2"
              >
                <Database size={30} className="text-sky-600" />
                管理會員
              </Link>
              <Link
                href={"/ann/lysa/add"}
                className="flex flex-col justify-center p-2 items-center gap-2 mr-auto"
              >
                <Plus size={30} className="text-sky-600" />
                新增公告
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
