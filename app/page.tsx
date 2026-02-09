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
  ChartColumn,
  ChartPie,
  Database,
  LogOut,
  MessageSquareText,
  Plus,
  Settings2,
  Soup,
  User,
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
    <div className="p-5 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">首頁</h1>
        <Link href={"/"} className="flex items-center gap-2">
          <LogOut size={18} />
        </Link>
      </div>
      <div className="relative p-4 rounded-3xl rounded-tr-[45px]  bg-sky-100/50 dark:bg-sky-950 shadow-md border border-sky-100 dark:border-sky-900 dark:shadow-sky-800/50 flex gap-4">
        <User
          size={45}
          strokeWidth={2.5}
          className="p-2.5 rounded-xl dark:bg-sky-50 dark:text-sky-800 bg-sky-950 text-sky-200"
        />
        <div className="text-sky-900 dark:text-sky-200 flex flex-col gap-1 relative grow">
          <p className="text-xl font-medium">
            {userMemberData.display_name}{" "}
            <span className="opacity-50">
              {userMemberData.role === "studentMember" ? "學生" : "管理員"}
              帳號
            </span>
          </p>
          <p className="text-[15px]">
            高市林園高中 {userMemberData.grade}
            {userMemberData.class_name} {userMemberData.number}號
          </p>
          <div className="flex items-center w-full gap-3 mt-2 text-sm font-medium">
            <Link
              href={"/"}
              className="bg-sky-200 dark:bg-sky-700 rounded-2xl p-3 flex items-center ml-auto gap-2"
            >
              <Settings2 size={25} />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 p-3 px-5 text-lg opacity-40 text-sky-600 dark:text-sky-200 font-custom font-bold">
          <p>LYHS Plus 會員</p>
        </div>
      </div>
      <p className="mt-2 font-medium text-lg">常用功能</p>
      <div className="text-[14px] flex items-center justify-center gap-4">
        <Link
          href={"/chat"}
          className="flex flex-col justify-center p-2 items-center gap-2"
        >
          <MessageSquareText size={30} className="text-sky-600" />
          AI 對話
        </Link>
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
      <p className="mt-2 font-medium text-lg">最新資訊</p>
      <div className="relative px-5">
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
  );
}
