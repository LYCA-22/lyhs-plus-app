"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { turnOffBackLink, updatePageLoadingStatus } from "@/store/appSlice";
import Link from "next/link";
import {
  Balloon,
  ChevronRight,
  Pin,
  Plus,
  Settings2,
  SquareChartGantt,
  Trash2,
  TvMinimal,
  X,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import { getCookie } from "@/utils/getCookie";
import { loadLysaAnns } from "@/store/newsSlice";
import { useRouter } from "next/navigation";

export default function Page() {
  const userData = useAppSelector((state) => state.userData);
  const lysaAnnData = useAppSelector((state) => state.annData.lysaAnnDatas);
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handleViewAnn = async (id: string) => {
    // 先更新觀看數
    dispatch(updatePageLoadingStatus(true));
    try {
      const UpdateViewCountUrl = `${API_BASE_URL}/v1/lyps/ann/view/${id}`;
      const updateViewCountApi = new apiFetch(UpdateViewCountUrl);
      await updateViewCountApi.PUT();
      dispatch(updatePageLoadingStatus(false));
      router.push(`/ann/lysa/${id}`);
    } catch (e) {
      dispatch(updatePageLoadingStatus(false));
      console.error(e);
    }
  };

  const handleDeleteAnn = async (id: string) => {
    try {
      dispatch(updatePageLoadingStatus(true));
      const access_token = getCookie("lyps_access_token");
      const deleteUrl = `${API_BASE_URL}/v1/lyps/ann/delete/${id}`;
      const deleteApi = new apiFetch(deleteUrl);
      await deleteApi.DELETE(access_token as string);

      // 載入新資料
      const getLysaAnnsUrl = `${API_BASE_URL}/v1/lyps/ann/list`;
      const getLysaAnns = new apiFetch(getLysaAnnsUrl);
      const lysaAnnData = await getLysaAnns.GET();
      dispatch(loadLysaAnns(lysaAnnData.data));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(updatePageLoadingStatus(false));
    }
  };

  useEffect(() => {
    dispatch(turnOffBackLink());
  }, [dispatch]);

  const sortedLysaAnnData = useMemo(
    () => [...lysaAnnData].sort((a, b) => Number(b.is_top) - Number(a.is_top)),
    [lysaAnnData],
  );

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
              className="flex items-center justify-center gap-2 dark:bg-sky-900 bg-sky-200 rounded-xl p-2 w-full hover:opacity-50 transition-all"
            >
              <Plus />
              新增公告
            </Link>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center justify-center gap-2  rounded-xl p-2 w-full ${isEditing ? "bg-sky-900 dark:bg-sky-200 text-white dark:text-sky-900" : "dark:bg-sky-900 bg-sky-200"} transition-all`}
            >
              {isEditing ? (
                <>
                  <X></X>關閉編輯
                </>
              ) : (
                <>
                  <Settings2 />
                  編輯公告
                </>
              )}
            </button>
          </div>
        )}
      </div>
      <div className="bg-background dark:bg-blue-300/10 border-t border-border grow p-2 px-4">
        {sortedLysaAnnData.filter((item) => !item.is_banner).length === 0 && (
          <div className="flex items-center justify-center text-center pt-20">
            <p className="text-gray-500 dark:text-gray-400">目前沒有公告</p>
          </div>
        )}
        {sortedLysaAnnData
          .filter((item) => !item.is_banner)
          .map((item) => {
            return (
              <button
                onClick={() => handleViewAnn(item.id.toString())}
                key={item.id}
                className="w-full text-left p-4 last:border-b-0 border-b border-border dark:border-zinc-700 flex gap-4 items-center"
              >
                <div className="bg-sky-50 dark:bg-sky-700 rounded-xl p-2 text-sky-600 dark:text-sky-200">
                  {item.category === "活動資訊" && (
                    <Balloon size={25} strokeWidth={2.5} />
                  )}
                  {item.category === "其他" && (
                    <SquareChartGantt size={25} strokeWidth={2.5} />
                  )}
                  {item.category === "數位服務" && (
                    <TvMinimal size={25} strokeWidth={2.5} />
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-lg">{item.category}</p>
                    <span>
                      {item.is_top ? (
                        <Pin size={18} className="text-sky-600" />
                      ) : null}
                    </span>
                  </div>
                  <p>{item.title}</p>
                </div>
                {isEditing ? (
                  <button
                    onClick={() => handleDeleteAnn(item.id.toString())}
                    className="ml-auto text-red-500 bg-red-100 dark:bg-red-900/70 rounded-xl p-2"
                  >
                    <Trash2 />
                  </button>
                ) : (
                  <div className="ml-auto text-sky-600 dark:text-sky-300">
                    <ChevronRight />
                  </div>
                )}
              </button>
            );
          })}
      </div>
    </div>
  );
}
