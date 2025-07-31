"use client";
import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { studentData } from "@/types/index";
import { icons } from "@/components/icons";
import {
  RectangleEllipsis,
  Copy,
  Info,
  FileText,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { useAppDispatch } from "@/store/hook";
import { updateSystemData } from "@/store/systemSlice";

export default function Page() {
  const [code, setCode] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState<studentData>();
  const [copied, setCopied] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      updateSystemData({
        isBack: true,
        BackLink: "/lyca",
      }),
    );
  });

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleSubmit = async () => {
    if (code.length < 6) {
      setError("請輸入完整的六位數代碼");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const data = await apiService.getProjectData(code);
      setProjectData(data);
      setIsOpen(true);
      setCode("");
    } catch (err) {
      setError("查詢失敗，請確認代碼是否正確");
      setCode("");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const setProjectCode = async (value: string) => {
    setCode(value);
    if (code.length < 6) {
      setError("Code must be 6 digits");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 space-y-2 px-6">
      <div className="flex flex-col w-full max-w-md gap-3">
        <p className="text-foreground text-xl font-medium mt-3">
          請在下方輸入六位數查詢代碼
        </p>
        <p className="text-sm opacity-50">
          查詢代碼可以在一開始投信成功的頁面找到。
        </p>
        <InputOTP
          maxLength={6}
          value={code}
          onChange={setProjectCode}
          disabled={isLoading}
        >
          <InputOTPGroup>
            {[...Array(6)].map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={code.length < 6 || isLoading}
            className="flex justify-center items-center bg-foreground text-background p-2 px-4 my-2 w-fit rounded-lg active:scale-95 hover:opacity-70 transition-all disabled:text-borderColor disabled:bg-hoverbg"
          >
            {isLoading ? <></> : "查詢"}
          </button>
          {/*
          <button className="flex justify-center items-center bg-buttonBg text-foreground p-2 px-4 my-2 w-fit rounded-lg active:scale-95 hover:opacity-70 transition-all disabled:text-borderColor disabled:bg-hoverbg">
            專人聯絡
          </button>
          */}
        </div>
      </div>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="max-h-screen-56 overflow-y-auto p-5 mx-2">
          <DrawerTitle>
            <div className="flex flex-col">
              <p className="text-lg">信件資訊</p>
            </div>
          </DrawerTitle>
          {projectData ? (
            <ul className="my-2 list-none w-full flex flex-col">
              <li className="bg-hoverbg rounded-lg relative rounded-bl-none rounded-br-none border-b border-borderColor">
                <p className="text-medium p-4 py-3 rounded-xl w-full bg-green-600 dark:bg-green-800 text-green-50 font-medium rounded-bl-none rounded-br-none">
                  {projectData.status}
                </p>
                <div className="p-3 px-4">
                  <p className="text-medium text-foreground font-medium">
                    信件承辦人
                  </p>
                  <p className="text-foreground">
                    {projectData.handler === "" ? (
                      <div className="flex gap-2 mt-2">
                        <div className="pt-1">
                          <Info size={20} />
                        </div>
                        <div className="flex">
                          <p>
                            尚未有幹部承辦此信件，請稍作等待。若您的信件有任何更新時，我們會透過電子信箱聯絡您。
                          </p>
                        </div>
                      </div>
                    ) : (
                      projectData.handler
                    )}
                  </p>
                </div>
              </li>
              <li className="w-full flex-col bg-hoverbg rounded-tl-none rounded-tr-none text-foreground text-medium font-medium p-4 flex justify-center rounded-xl relative">
                <p className="text-medium text-foreground font-medium">
                  信件資訊
                </p>
                <div className="flex gap-2 items-center mt-2">
                  <RectangleEllipsis size={20} />
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-foreground font-medium">
                      信件專用代碼
                    </p>
                    <p className="text-sm text-inputPrimary font-bold">
                      {projectData.searchCode}
                    </p>
                  </div>
                </div>
                <p className="font-normal text-xs text-foreground opacity-60 ml-7">
                  請務必記得代碼，以讓你可以追蹤此信件。
                </p>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center p-2 rounded-lg
                                 text-sm text-foreground hover:bg-background transition-colors absolute right-5"
                >
                  {copied ? icons["copyDone"]() : <Copy size={20} />}
                </button>
              </li>
              <li className="mt-6 text-white rounded-xl flex-col gap-2 bg-gradient-to-br from-inputPrimary to-background p-4">
                <div className="flex gap-2 items-center">
                  <ShieldCheck size={25} />
                  <p className="font-bold text-[14px]">
                    您的信件正安全的被我們保護。
                  </p>
                </div>
                {/*
                <button className="rounded-lg border text-white border-white p-2 px-3 mt-2 ml-8 hover:opacity-55 text-sm flex gap-2 items-center">
                  了解我們怎麼保護你的資料
                  <SquareArrowOutUpRight size={15} />
                </button>
                */}
              </li>
              <li className="mt-6 text-foreground border border-hoverbg rounded-xl pb-2">
                <p className="text-medium text-foreground font-medium m-4 flex gap-2 items-center">
                  <FileText size={20} />
                  寄件者資料
                </p>
                <div className="flex items-center mx-4">
                  <p className="text-sm mr-2 min-w-[70px]">姓名</p>
                  <p className="text-sm font-normal flex grow justify-end py-2 border-b border-border">
                    {projectData.name}
                  </p>
                </div>
                <div className="flex items-center mx-4">
                  <p className="text-sm mr-2 min-w-[70px]">電子郵件</p>
                  <p className="text-sm font-normal flex grow justify-end py-2 border-b border-border">
                    {projectData.email}
                  </p>
                </div>
                <div className="flex items-center mx-4">
                  <p className="text-sm mr-2 min-w-[70px]">班級</p>
                  <p className="text-sm font-normal flex grow justify-end py-2 border-b border-border">
                    {projectData.class}
                  </p>
                </div>
                <div className="flex items-center mx-4">
                  <p className="text-sm mr-2 min-w-[70px]">座號</p>
                  <p className="text-sm font-normal flex grow justify-end py-2">
                    {projectData.number}
                  </p>
                </div>
              </li>
              <li className="mt-6 font-bold text-foreground border border-hoverbg rounded-xl pb-2">
                <p className="text-foreground font-medium m-4 flex gap-2 items-center">
                  <Mail size={20} />
                  信件內容
                </p>
                <div className="flex items-center mx-4">
                  <p className="text-sm mr-2 min-w-[70px]">大綱</p>
                  <p className="text-sm font-normal flex grow justify-end py-2 border-b border-border">
                    {projectData.title}
                  </p>
                </div>
                <div className="flex items-center mx-4">
                  <p className="text-sm mr-2 min-w-[70px]">說明</p>
                  <p className="text-sm font-normal flex grow justify-end py-2 border-b border-border">
                    {projectData.description}
                  </p>
                </div>
                <div className="flex items-center mx-4">
                  <p className="text-sm mr-2 min-w-[70px]">解決方式</p>
                  <p className="text-sm font-normal flex grow justify-end py-2">
                    {projectData.solution}
                  </p>
                </div>
              </li>
              <li className="mt-6 flex max-sm:flex-col gap-4">
                <button
                  className="bg-foreground text-background w-full rounded-xl p-3 px-4 flex items-center justify-center hover:opacity-75 font-medium"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  關閉
                </button>
                <button
                  className="bg-buttonBg text-foreground w-full rounded-xl p-3 px-4 flex items-center justify-center hover:opacity-75 font-medium"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  錯誤回報
                </button>
              </li>
            </ul>
          ) : (
            <p>無法載入案件資料</p>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
