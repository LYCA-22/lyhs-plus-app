"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAppSelector } from "@/store/hook";
import {
  ChartColumn,
  ChartPie,
  LogOut,
  MessageSquareText,
  Settings2,
  Soup,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const userMemberData = useAppSelector((state) => state.userData);
  const lysaAnnData = useAppSelector((state) => state.annData.lysaAnnDatas);

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">首頁</h1>
        <Link href={"/"} className="flex items-center gap-2">
          <LogOut size={18} />
        </Link>
      </div>
      <div className="p-4 rounded-3xl  bg-sky-100/50 dark:bg-sky-950 shadow-md border border-sky-100 dark:border-sky-900 dark:shadow-sky-800/50 flex flex-col gap-3">
        <User
          size={40}
          strokeWidth={2.5}
          className="p-2 rounded-xl dark:bg-sky-50 dark:text-sky-800 bg-sky-950 text-sky-200"
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
              className="bg-sky-200 dark:bg-sky-700 rounded-xl p-2 flex items-center ml-auto gap-2"
            >
              <Settings2 size={20} />
            </Link>
          </div>
        </div>
      </div>
      <p className="mt-2 font-medium text-lg">常用功能</p>
      <div className="text-[14px] flex items-center justify-center gap-4">
        <Link
          href={"/"}
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
      <div className="px-12">
        <Carousel>
          <CarouselContent>
            {lysaAnnData.map((item) => {
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
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
