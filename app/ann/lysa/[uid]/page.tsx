"use client";
import { turnOnBackLink } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { File, Folder, Share } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const runtime = "edge";

export default function LysaAnnDetailPage() {
  const params = useParams();
  const uid = params.uid as string;
  const dispatch = useDispatch();
  const lysaAnnData = useAppSelector((state) => state.annData.lysaAnnDatas);
  const data = lysaAnnData.find((x) => x.id.toString() === uid);
  const attachments = Array.isArray(data?.attachments) ? data.attachments : [];

  useEffect(() => {
    dispatch(turnOnBackLink("/ann/lysa"));
  });

  return (
    <>
      <div className="absolute top-0 w-full text-center py-5 font-medium text-sky-900 dark:text-sky-100 pt-6">
        公告詳細資料
      </div>
      <div className="flex flex-col bg-sky-50 dark:bg-background h-full pt-10 gap-4">
        <div className="p-5 pt-7 pb-0 text-sky-900 dark:text-sky-100">
          <p className="text-[16px] mb-2">{data?.category}</p>
          <h1 className="text-xl">{data?.title}</h1>
        </div>
        <div className="px-5 pb-5 flex items-center gap-4">
          <button className="font-medium flex items-center gap-2 p-2 px-5 bg-sky-400/20 dark:bg-sky-900 rounded-xl text-sky-900 dark:text-sky-100 hover:opacity-50 transition-all">
            <Share size={18} strokeWidth={2.5} />
            <p>分享</p>
          </button>
        </div>
        <div className="grow bg-background dark:bg-blue-300/10 rounded-t-3xl pb-20">
          <div className="space-y-3 relative">
            <div className="space-y-2 opacity-70 w-full overflow-x-auto px-4 mt-6">
              <p
                dangerouslySetInnerHTML={{ __html: data?.content || "" }}
                className="leading-relaxed"
              />
            </div>
            <div className="flex gap-3 flex-col p-5 mt-auto">
              {attachments.length > 0 && (
                <div className="flex flex-col gap-2 border-b border-borderColor pb-5">
                  <p className="text-lg font-medium flex items-center gap-2 m-1">
                    <Folder />
                    附件資料
                  </p>
                  {attachments.map((attachment, index) => (
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
