import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { icons } from "./icons";
import { apiService } from "@/services/api";
import {
  Folder,
  FileText,
  Signature,
  User,
  CalendarDays,
  ArrowDownToLine,
  X,
} from "lucide-react";

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
}: {
  loading: boolean;
  error: string | null;
  adData: AdItem | null;
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-56">
        <div className="h-8 w-8 rounded-full border-4 border-t-primary animate-spin" />
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
    <div className="space-y-6 max-sm:pt-20">
      <h1 className="text-xl font-bold">{adData?.title}</h1>
      <div className="space-y-4 opacity-70">
        {adData?.content.map((content, index) => (
          <p
            key={index}
            dangerouslySetInnerHTML={{ __html: content }}
            className="leading-relaxed"
          />
        ))}
      </div>
      <div className="flex gap-3 flex-col bg-hoverbg p-5 rounded-2xl mb-2">
        {adData?.attachments && adData?.attachments.length > 0 && (
          <div className="flex flex-col gap-2 border-b border-borderColor pb-5">
            <p className="text-lg font-medium flex items-center gap-2 m-1">
              <Folder />
              附件
            </p>
            {adData?.attachments.map((attachment, index) => (
              <div key={index} className="flex ml-8 max-sm:ml-4">
                <div className="flex items-center gap-2">
                  <div>
                    <FileText size={20} />
                  </div>
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
        <div className="text-medium sm:flex justify-between">
          <div className="flex gap-2 justify-between items-center mt-1">
            <div className="flex items-center gap-2">
              <Signature />
              <p className="font-medium">發布處室</p>
            </div>
            <p>{adData?.publisher}</p>
          </div>
          <div className="flex gap-2 justify-between items-center my-3">
            <div className="flex items-center gap-2">
              <User />
              <p className="font-medium">發布者</p>
            </div>
            <p>{adData?.author}</p>
          </div>
          <div className="flex gap-2 justify-between items-center">
            <div className="flex items-center gap-2">
              <CalendarDays />
              <p className="font-medium">日期</p>
            </div>
            <p>{adData?.dateRange}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export function NewView({ url }: { url: string }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [adData, setAdData] = useState<AdItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // 檢測設備類型
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640); // 'sm' breakpoint is typically 640px
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const getData = async (url: string) => {
        setLoading(true);
        const result = await apiService.getAnnouncement(
          url,
          setError,
          setLoading,
        );
        setAdData(result.data);
        setLoading(false);
      };
      getData(url);
    }
  }, [isOpen, url]);

  useEffect(() => {
    if (isOpen) {
      window.postMessage(
        {
          type: "Open",
          payload: "視窗打開",
        },
        "*",
      );
    } else {
      window.postMessage(
        {
          type: "Close",
          payload: "視窗關閉",
        },
        "*",
      );
    }
  }, [isOpen]);

  // 共用的觸發器按鈕
  const triggerButtonContent = (
    <>
      <div className="opacity-50 flex items-center gap-1 font-normal text-sm z-20">
        {icons["eye"]()}
        詳細資訊
      </div>
      <div className="absolute w-full h-full bg-hoverbg scale-75 z-10 opacity-0 top-0 right-0 rounded-full transition-all group-hover:opacity-100 group-hover:scale-100 group-active:bg-buttonBg" />
    </>
  );

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <div>
      {/* 根據螢幕大小決定使用哪個組件 */}
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger
            onClick={handleClick}
            className="flex gap-1 p-2 px-3 w-fit rounded-full mt-2 bg-transparent relative group -translate-x-3 cursor-pointer"
          >
            {triggerButtonContent}
          </DrawerTrigger>
          <DrawerContent className="h-[85vh]">
            <DrawerHeader className="flex justify-between items-center">
              <DrawerTitle className="text-lg">公告詳細內容</DrawerTitle>
              <DrawerClose className="bg-rootBg hover:bg-foreground hover:text-background transition-colors rounded-full p-2">
                <X size={20} />
              </DrawerClose>
            </DrawerHeader>
            <div className="px-4 pb-8 overflow-y-auto">
              <ContentBlock loading={loading} error={error} adData={adData} />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            onClick={handleClick}
            className="flex gap-1 p-2 px-3 w-fit rounded-full mt-2 bg-transparent relative group -translate-x-3 cursor-pointer"
          >
            {triggerButtonContent}
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] w-[90vw] max-w-3xl">
            <DialogHeader className="flex justify-between items-center">
              <DialogTitle className="text-xl">公告詳細內容</DialogTitle>
            </DialogHeader>
            <div className="mt-4 overflow-y-auto">
              <ContentBlock loading={loading} error={error} adData={adData} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
