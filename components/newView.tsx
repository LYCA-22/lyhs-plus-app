import { useState, useEffect } from "react";
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
import { Folder, File, Signature, User, CalendarDays } from "lucide-react";

interface attachments {
  name: string;
  url: string;
}

interface adItem {
  title: string;
  content: [];
  attachments: attachments[];
  publisher: string;
  author: string;
  dateRange: string;
}

export function NewView({ url }: { url: string }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [adData, setAdData] = useState<adItem>();
  const [error, setError] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger
        asChild
        onClick={() => {
          setIsOpen(true);
          window.postMessage(
            {
              type: "Open",
              payload: "視窗打開",
            },
            "*",
          );
        }}
      >
        <button className="flex gap-1 p-2 px-3 w-fit rounded-full mt-2 bg-transparent relative group -translate-x-3">
          <div className="opacity-50 flex items-center gap-1 font-normal text-sm z-20">
            {icons["eye"]()}
            詳細資訊
          </div>
          <div className="absolute w-full h-full bg-hoverbg scale-75 z-10 opacity-0 top-0 right-0 rounded-full transition-all group-hover:opacity-100 group-hover:scale-100 group-active:bg-buttonBg"></div>
        </button>
      </DrawerTrigger>
      <DrawerContent className="size-11/12 w-full">
        <DrawerHeader className="flex justify-between">
          <DrawerTitle>公告查閱</DrawerTitle>
          <DrawerClose
            onClick={() => {
              setIsOpen(false);
              window.postMessage(
                {
                  type: "Close",
                  payload: "視窗關閉",
                },
                "*",
              );
              console.log("關閉");
            }}
            className="bg-rootBg flex font-medium text-sm items-center justify-center p-2 px-4 rounded-full hover:bg-foreground hover:text-background transition-all"
          >
            關閉
          </DrawerClose>
        </DrawerHeader>
        <div className="grow overflow-y-auto pt-16 flex">
          {loading ? (
            <div className="grow items-center justify-center flex">
              <div className="h-8 w-8 rounded-full border-4 border-t-primary animate-spinner-linear-spin"></div>
            </div>
          ) : (
            <>
              {error ? (
                <div> {error}</div>
              ) : (
                <div className="p-6 flex gap-4 flex-col sm:px-24 overflow-y-auto">
                  <h1 className="text-xl font-bold">{adData?.title}</h1>
                  <div className="text-medium opacity-70 flex flex-col gap-3 z-0">
                    {adData?.content.map((item, index) => {
                      return <p key={index}>{item}</p>;
                    })}
                  </div>
                  <div className="flex gap-3 flex-col bg-hoverbg p-5 rounded-2xl mb-2">
                    {adData?.attachments && adData?.attachments.length > 0 && (
                      <div className="flex flex-col gap-2 border-b border-borderColor pb-5">
                        <p className="text-lg font-medium flex items-center gap-2 m-1">
                          <Folder />
                          附件
                        </p>
                        {adData?.attachments.map((attachment, index) => (
                          <a
                            key={index}
                            href={`https://www.ly.kh.edu.tw${attachment.url}`}
                            target="_blank"
                            className="text-medium font-medium bg-background hover:bg-buttonBg p-4 py-3 rounded-xl flex gap-2 items-center transition-all"
                          >
                            <div>
                              <File size={18} />
                            </div>
                            {attachment.name}
                          </a>
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
                          <p className="font-medium">作者</p>
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
              )}
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
