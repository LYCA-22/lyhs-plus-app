"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { icons } from "@/components/icons";
import Link from "next/link";
import { useAppDispatch } from "@/store/hook";
import { updateSystemData } from "@/store/appSlice";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
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

  useEffect(() => {
    const verificationCode = searchParams.get("code");

    if (!verificationCode) {
      window.alert("Invalid mailbox verification code.");
      router.push("/mailbox/student");
    } else {
      setCode(verificationCode);
    }
  }, [searchParams, router]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center m-3 space-y-4 py-6">
      <h1 className="font-bold text-2xl">我們已收到你的信件</h1>
      <div className="text-center space-y-3">
        <p>這是您案件的查詢代碼</p>
        <div className="flex flex-col items-center gap-3 my-2">
          <div className="flex gap-2">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="p-2 px-4 border border-borderColor rounded-lg font-medium
                           bg-background shadow-md transition-all duration-200
                           hover:border-blue-500"
              >
                {code[index]}
              </div>
            ))}
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 p-2 px-4 rounded-lg
                       text-sm text-foreground hover:bg-hoverbg transition-colors mb-2"
          >
            {copied ? icons["copyDone"]() : icons["copy"]()}
            {copied ? "已複製" : "複製代碼"}
          </button>
        </div>
      </div>
      <div className="w-full h-[1px] bg-hoverbg mb-2"></div>
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2 bg-green-200 dark:bg-green-900 rounded-full p-2 px-4">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <p className="text-medium text-green-500">提交成功</p>
        </div>
        <Link
          className="p-2 px-4 rounded-full bg-hoverbg hover:bg-buttonBg
                     transition-colors duration-200 flex items-center gap-2"
          href="/mailbox/view"
        >
          前往查看詳細資料
          <span className="text-lg">→</span>
        </Link>
      </div>
    </div>
  );
}

// 創建一個加載狀態組件
function LoadingState() {
  return (
    <div className="flex flex-col justify-center items-center h-full py-12">
      <div className="animate-spin h-8 w-8 border-4 border-t-blue-500 rounded-full"></div>
      <p className="mt-4">載入中...</p>
    </div>
  );
}

// 主頁面組件
export default function Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SuccessContent />
    </Suspense>
  );
}
