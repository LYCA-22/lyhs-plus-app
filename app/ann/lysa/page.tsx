"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { turnOffBackLink } from "@/store/appSlice";
import Link from "next/link";
import { Plus, Settings2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function Page() {
  const userData = useAppSelector((state) => state.userData);
  const lysaAnnData = useAppSelector((state) => state.annData.lysaAnnDatas);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(turnOffBackLink());
  }, [dispatch]);

  return (
    <div
      className={`bg-sky-50 dark:bg-background flex flex-col justify-between min-h-dvh`}
    >
      <div className="p-5 flex flex-col px-5 justify-between">
        <div className="flex items-center gap-3">
          <div className="relative pb-2">
            <Link
              href={"./school"}
              className={`text-2xl font-medium opacity-50`}
            >
              校園公告
            </Link>
          </div>
          <div className="relative pb-2">
            <h1 className={`text-2xl font-medium`}>
              學生會公告
              <div className="bg-sky-600 rounded-full absolute bottom-0 w-full h-1"></div>
            </h1>
          </div>
        </div>
        <div className="px-12 mt-4">
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
        {userData.role === "lysaStaff" && (
          <div className="flex items-center w-full justify-between pt-5 gap-4 text-lg font-medium">
            <Link
              href={"/ann/lysa/add"}
              className="flex items-center justify-center gap-2 dark:bg-sky-900 bg-sky-200 rounded-xl p-2 w-full"
            >
              <Plus />
              新增公告
            </Link>
            <Link
              href={"/"}
              className="flex items-center justify-center gap-2 dark:bg-sky-900 bg-sky-200 rounded-xl p-2 w-full"
            >
              <Settings2 />
              編輯公告
            </Link>
          </div>
        )}
      </div>
      <div className="bg-background dark:bg-blue-300/10 border-t border-border grow">
        <div className="relative w-full"></div>
      </div>
    </div>
  );
}
