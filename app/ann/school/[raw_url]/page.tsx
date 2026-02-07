"use client";
import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import { turnOnBackLink, updatePageLoadingStatus } from "@/store/appSlice";
import { ArrowUpRight, File, Folder, Share } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface AnnAttachMent {
  name: string;
  url: string;
}

interface AnnDetailData {
  attachments: AnnAttachMent[];
  author: string;
  content: string[];
  dateRange: string;
  publisher: string;
  title: string;
}

export default function SchoolAnnDetailPage({
  params,
}: {
  params: { raw_url: string };
}) {
  const rawUrl = params.raw_url;
  const [data, setData] = useState<AnnDetailData>();
  const dispatch = useDispatch();

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          text: `看看我發現了什麼！${data?.publisher}發布了一個新公告：${data?.title}\n\n點這裡看更多：${rawUrl}`,
        })
        .catch((error) => {
          // 可以顯示錯誤提示
          console.error("分享失敗", error);
        });
    } else {
      alert("此瀏覽器不支援分享功能");
    }
  };

  useEffect(() => {
    dispatch(turnOnBackLink("/ann/school"));

    const getAnnDetail = async () => {
      try {
        dispatch(updatePageLoadingStatus(true));
        const AnnDetailUrl = `${API_BASE_URL}/v1/lyps/detail/${rawUrl}`;
        const AnnDetail = new apiFetch(AnnDetailUrl);
        const result = await AnnDetail.GET();
        const data = result as AnnDetailData;
        setData(data);
        document.title = data.title || "公告詳細資料";
      } catch (e) {
        console.error(e);
      } finally {
        dispatch(updatePageLoadingStatus(false));
      }
    };

    if (rawUrl) {
      getAnnDetail();
    }
  }, [rawUrl, dispatch]);

  return (
    <>
      <div className="absolute top-0 w-full text-center py-5 font-medium text-sky-900 dark:text-sky-100 pt-6">
        公告詳細資料
      </div>
      <div className="flex flex-col bg-sky-50 dark:bg-background h-full pt-10 gap-4">
        <div className="p-5 pt-7 pb-0 text-sky-900 dark:text-sky-100">
          <p className="text-[16px] mb-2">{data?.publisher}</p>
          <h1 className="text-xl">{data?.title}</h1>
        </div>
        <div className="px-5 pb-5 flex items-center gap-4">
          <button
            onClick={handleShare}
            className="font-medium flex items-center gap-2 p-2 px-5 bg-sky-400/20 dark:bg-sky-900 rounded-xl text-sky-900 dark:text-sky-100 hover:opacity-50 transition-all"
          >
            <Share size={18} strokeWidth={2.5} />
            <p>分享</p>
          </button>
          <Link
            href={decodeURIComponent(rawUrl)}
            target="_blank"
            className="font-medium flex items-center gap-2 p-2 px-5 bg-sky-400/20 dark:bg-sky-900 rounded-xl text-sky-900 dark:text-sky-100 hover:opacity-50 transition-all"
          >
            <ArrowUpRight size={18} strokeWidth={2.5} />
            <p>前往校網查看</p>
          </Link>
        </div>
        <div className="grow bg-background dark:bg-blue-300/10 rounded-t-3xl pb-20">
          <div className="space-y-3 relative">
            <div className="space-y-2 opacity-70 w-full overflow-x-auto px-4 mt-6">
              {data?.content.map((content, index) => (
                <p
                  key={index}
                  dangerouslySetInnerHTML={{ __html: content }}
                  className="leading-relaxed"
                />
              ))}
            </div>
            <div className="flex gap-3 flex-col p-5 mt-auto">
              {data?.attachments && data?.attachments.length > 0 && (
                <div className="flex flex-col gap-2 border-b border-borderColor pb-5">
                  <p className="text-lg font-medium flex items-center gap-2 m-1">
                    <Folder />
                    附件資料
                  </p>
                  {data?.attachments.map((attachment, index) => (
                    <div key={index} className="flex">
                      <div className="flex items-center gap-2 px-2">
                        <Link
                          key={index}
                          href={`https://www.ly.kh.edu.tw${attachment.url}`}
                          target="_blank"
                          className="flex items-center bg-sky-50 dark:bg-sky-900 rounded-lg p-2 gap-2 w-fit px-3"
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
                  <p>{data?.author}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <p>日期</p>
                  <p>{data?.dateRange}</p>
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
        </div>
      </div>
    </>
  );
}
