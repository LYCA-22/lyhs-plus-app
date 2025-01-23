"use client";
import { useState } from "react";
import { apiService } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { studentData } from "@/types/index";
import { icons } from "@/components/icons";
import { CircularProgress } from "@heroui/react";

export default function Page() {
  const [code, setCode] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState<studentData>();
  const [copied, setCopied] = useState(false);

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
    <div className="flex flex-col items-center justify-center p-4 space-y-2 pt-10">
      <h1 className="text-2xl font-bold m-1">查詢案件</h1>
      <div className="flex flex-col items-center space-y-4 w-full max-w-md">
        <p className="text-foreground font-medium">請輸入六位數查詢代碼</p>

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

        <button
          onClick={handleSubmit}
          disabled={code.length < 6 || isLoading}
          className="flex justify-center items-center w-full bg-foreground text-background p-2 px-4 rounded-full active:scale-95 hover:opacity-70 transition-all disabled:text-borderColor disabled:bg-hoverbg"
        >
          {isLoading ? (
            <CircularProgress color={"default"} size={"sm"} strokeWidth={3} />
          ) : (
            "查詢"
          )}
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex flex-col">
                <p className="text-xl">案件編號</p>
                {projectData && <p className="text-medium">{projectData.id}</p>}
              </div>
            </DialogTitle>
            <DialogDescription>
              {projectData ? (
                <ul className="my-2 list-none w-full flex flex-col gap-5">
                  <li className="w-full bg-hoverbg text-foreground text-medium font-medium p-4 flex items-center justify-center rounded-xl relative">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm opacity-60">查詢代碼</p>
                      <p className="text-inputPrimary font-bold">{code}</p>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center p-2 rounded-lg
                                 text-sm text-foreground hover:bg-buttonBg transition-colors absolute right-5"
                    >
                      {copied ? icons["copyDone"]() : icons["copy"]()}
                    </button>
                  </li>
                  <li className="text-xl font-bold text-foreground py-2 border-b border-borderColor">
                    寄件者資料
                  </li>
                  <li>
                    <p>姓名</p>
                    <p className="text-medium">{projectData.name}</p>
                  </li>
                  <li>
                    <p>電子郵件</p>
                    <p className="text-medium">{projectData.email}</p>
                  </li>
                  <li>
                    <p>班級</p>
                    <p className="text-medium">{projectData.class}</p>
                  </li>
                  <li>
                    <p>座號</p>
                    <p className="text-medium">{projectData.number}</p>
                  </li>
                  <li className="text-xl font-bold text-foreground py-2 border-b border-borderColor">
                    案件資料
                  </li>
                  <li>
                    <p>案件大綱</p>
                    <p className="text-medium">{projectData.title}</p>
                  </li>
                  <li>
                    <p>案件說明</p>
                    <p className="text-medium">{projectData.description}</p>
                  </li>
                  <li>
                    <p>提交時間</p>
                    <p className="text-medium">{projectData.createdTime}</p>
                  </li>
                  <li>
                    <p>更新時間</p>
                    <p className="text-medium">{projectData.updatedTime}</p>
                  </li>
                  <li className="text-xl font-bold text-foreground py-2 border-b border-borderColor">
                    處理進度
                  </li>
                  <li>
                    <p>案件狀態</p>
                    <p className="text-sm p-2 px-4 rounded-lg bg-green-200 dark:bg-green-800 w-fit my-2 text-green-600 dark:text-green-100 font-medium">
                      {projectData.status}
                    </p>
                  </li>
                  <li>
                    <p>處理人</p>
                    <p className="text-medium">
                      {projectData.handler === ""
                        ? "尚未有幹部接手"
                        : projectData.handler}
                    </p>
                  </li>
                </ul>
              ) : (
                <p>無法載入案件資料</p>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
