"use client";
import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import { apiService } from "@/services/api";
import { Folder, X, Share, Bookmark, Info, File } from "lucide-react";
import Link from "next/link";
import { useFavorites, FavoriteAnnouncement } from "./favoritesDB";

interface Attachments {
  name: string;
  url: string;
}

export interface AdItem {
  title: string;
  content: string[];
  attachments: Attachments[];
  publisher: string;
  author: string;
  dateRange: string;
}

const ContentBlock = ({
  loading,
  error,
  adData,
  url,
}: {
  loading: boolean;
  error: string | null;
  adData: AdItem | null;
  url: string;
}) => {
  const { isFavorite, toggleFavorite, checkIsFavorite } = useFavorites();

  useEffect(() => {
    if (url && adData) {
      checkIsFavorite(url);
    }
  }, [url, adData, checkIsFavorite]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          text: `看看我發現了什麼！${adData?.publisher}發布了一個新公告：${adData?.title}\n\n點這裡看更多：${url}`,
        })
        .catch((error) => {
          console.error("分享失敗", error);
        });
    } else {
      alert("此瀏覽器不支援分享功能");
    }
  };

  const handleBookmark = async () => {
    await toggleFavorite(url, adData);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center flex-col gap-2 pb-20">
        <div className="h-6 w-6 rounded-full border-2 border-t-foreground border-inputPrimary animate-spin"></div>
        <p>載入中，請稍候</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 font-custom h-full relative flex flex-col justify-between">
      <div>
        <div className="z-20 sticky top-0 p-5 bg-gradient-to-br from-background to-sky-50 dark:to-sky-950 rounded-bl-3xl flex flex-col gap-2">
          <p className="text-[16px]">
            <span className="opacity-50">校園公告｜</span>
            <span className="text-inputPrimary font-medium">
              {adData?.publisher}
            </span>
          </p>
          <h1 className="text-xl font-medium pr-12">{adData?.title}</h1>
          <div className="flex items-center gap-4 w-full mt-4">
            <button
              onClick={handleShare}
              className="font-medium opacity-70 flex border border-borderColor items-center gap-2 p-2 px-3 bg-gradient-to-br from-buttonBg to-background hover:bg-buttonBg transition-colors rounded-full text-sm"
            >
              <Share size={16} strokeWidth={2.5} />
              <p>分享</p>
            </button>
            <button
              onClick={handleBookmark}
              className={`font-medium flex border border-borderColor items-center gap-2 p-2 px-3 bg-gradient-to-br from-buttonBg to-background hover:bg-buttonBg transition-colors rounded-full text-sm ${
                isFavorite(url)
                  ? "opacity-100 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                  : "opacity-70"
              }`}
            >
              <Bookmark
                size={16}
                strokeWidth={2.5}
                fill={isFavorite(url) ? "currentColor" : "none"}
              />
              <p>{isFavorite(url) ? "已收藏" : "收藏"}</p>
            </button>
            <Link
              className="font-medium opacity-70 flex border border-borderColor items-center gap-2 p-2 px-3 bg-gradient-to-br from-buttonBg to-background hover:bg-buttonBg transition-colors rounded-full text-sm"
              href={url}
              target="_blank"
            >
              <Info size={16} strokeWidth={2.5} />
              <p>資料來源</p>
            </Link>
          </div>
        </div>
        <div className="space-y-4 opacity-70 w-full overflow-x-auto px-4 mt-6">
          {adData?.content.map((content, index) => (
            <p
              key={index}
              dangerouslySetInnerHTML={{ __html: content }}
              className="leading-relaxed"
            />
          ))}
        </div>
      </div>
      <div className="flex gap-3 flex-col bg-background rounded-tl-3xl p-5 mt-auto">
        {adData?.attachments && adData?.attachments.length > 0 && (
          <div className="flex flex-col gap-2 border-b border-borderColor pb-5">
            <p className="text-lg font-medium flex items-center gap-2 m-1">
              <Folder />
              附件資料
            </p>
            {adData?.attachments.map((attachment, index) => (
              <div key={index} className="flex">
                <div className="flex items-center gap-2 px-2">
                  <Link
                    key={index}
                    href={`https://www.ly.kh.edu.tw${attachment.url}`}
                    target="_blank"
                    className="flex items-center bg-hoverbg rounded-lg p-2 gap-2 w-fit px-3"
                  >
                    <div>
                      <File size={18} />
                    </div>
                    <p>{attachment.name}</p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="whitespace-nowrap text-sm flex justify-start gap-5 opacity-55 w-full overflow-x-auto">
          <div className="flex gap-2 items-center">
            <p>發布者</p>
            <p>{adData?.author}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p>日期</p>
            <p>{adData?.dateRange}</p>
          </div>
        </div>
        <p className="opacity-70 text-sm leading-6">
          所有資料皆來自
          <a
            className="underline underline-offset-4 bg-hoverbg hover:bg-buttonBg transition-all p-1"
            href="https://www.ly.kh.edu.tw/index.php?WebID=336"
          >
            林園高中校網
          </a>
          ，如有任何問題，請聯絡該處室。
        </p>
      </div>
    </div>
  );
};

export function NewView({
  url,
  setUrlAction,
}: {
  url: string;
  setUrlAction: (url: string) => void;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [adData, setAdData] = useState<AdItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const getData = async (url: string) => {
    setLoading(true);
    const result = await apiService.getAnnouncement(url, setError, setLoading);
    setAdData(result.data);
    setLoading(false);
  };

  useEffect(() => {
    if (url !== "") {
      getData(url);
    }
  }, [url]);

  useEffect(() => {
    if (url !== "") {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [url]);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
      onClose={() => setUrlAction("")}
    >
      <DrawerContent className="transition-transform duration-300 ease-out h-[90dvh] mx-2 rounded-[35px] rounded-t-3xl bg-white/90 backdrop-blur-[10px] overflow-x-hidden dark:bg-zinc-800/70 border-0 flex flex-col">
        <div className="w-full flex bg-transparent p-4 absolute top-0 z-50 justify-end">
          <DrawerClose className="hover:bg-zinc-300 dark:hover:bg-zinc-700 bg-background bg-opacity-50 backdrop-blur-md border border-border shadow-lg transition-colors rounded-full p-2">
            <X size={20} strokeWidth={3} className="opacity-50" />
          </DrawerClose>
        </div>
        <div className="overflow-y-auto grow relative">
          <ContentBlock
            loading={loading}
            error={error}
            adData={adData}
            url={url}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// 導出收藏功能的 hook 和類型，供其他組件使用
export { useFavorites, type FavoriteAnnouncement };
