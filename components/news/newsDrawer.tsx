"use client";
import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { apiService } from "@/services/api";
import { Folder, ArrowDownToLine, X, Share } from "lucide-react";

interface Attachments {
  name: string;
  url: string;
}

interface AdItem {
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
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          text: `看看我發現了什麼！${adData?.publisher}發布了一個新公告：${adData?.title}\n\n點這裡看更多：${url}`,
        })
        .catch((error) => {
          // 可以顯示錯誤提示
          console.error("分享失敗", error);
        });
    } else {
      alert("此瀏覽器不支援分享功能");
    }
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
        <div className="p-4 bg-gradient-to-br from-background to-sky-50 dark:to-sky-950 border-y border-y-border flex flex-col border-l-4 border-inputPrimary">
          <div className="flex justify-between items-start relative w-full">
            <div className="flex flex-col w-full gap-1">
              <h1 className="text-xl font-medium">{adData?.title}</h1>
              <div className="flex items-center gap-2 justify-between w-full">
                <p className="opacity-50">發佈處室｜{adData?.publisher}</p>
                <button
                  onClick={handleShare}
                  className="flex border border-borderColor items-center gap-2 p-2 bg-hoverbg hover:bg-buttonBg transition-colors rounded-full text-sm"
                >
                  <Share size={16} />
                </button>
              </div>
            </div>
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
      <div className="flex gap-3 flex-col bg-background p-5 mt-auto">
        {adData?.attachments && adData?.attachments.length > 0 && (
          <div className="flex flex-col gap-2 border-b border-borderColor pb-5">
            <p className="text-lg font-medium flex items-center gap-2 m-1">
              <Folder />
              附件
            </p>
            {adData?.attachments.map((attachment, index) => (
              <div key={index} className="flex ml-8 max-sm:ml-4">
                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.ly.kh.edu.tw${attachment.url}`}
                    target="_blank"
                    className="hover:underline"
                  >
                    {attachment.name}
                  </a>
                </div>
                <div className="ml-auto flex items-center justify-center">
                  <a
                    href={`https://www.ly.kh.edu.tw${attachment.url}`}
                    target="_blank"
                    className="text-medium font-medium bg-background hover:bg-buttonBg p-2 rounded-full flex gap-2 items-center transition-all w-fit h-fit"
                  >
                    <ArrowDownToLine className="opacity-70" size={18} />
                  </a>
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
          <a
            className="underline underline-offset-4 bg-hoverbg hover:bg-buttonBg transition-all p-1"
            href={url}
          >
            或是點這裡到校網看
          </a>
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
        <div className="flex justify-between space-y-1.5 bg-white/0 p-4 sticky top-0">
          <DrawerTitle className="text-lg">公告詳細內容</DrawerTitle>
          <DrawerClose className="hover:bg-zinc-300 dark:hover:bg-zinc-700 bg-buttonBg transition-colors rounded-full p-2">
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
