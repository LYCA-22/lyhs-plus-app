"use client";
import { Check, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [isCopied, setIsCopied] = useState(false);

  const copyLink = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
    } catch (err) {
      console.error("複製失敗:", err);
      setIsCopied(false);
    } finally {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  return (
    <div className="font-custom fixed top-0 left-0 z-[2000] bg-white w-full h-dvh">
      <div className="w-full h-dvh flex flex-col gap-3 justify-between items-center text-black">
        <Image
          alt="logo"
          src={"/logo.svg"}
          className="mt-8"
          width={50}
          height={50}
        />
        <div className="flex flex-col gap-2 items-center justify-center">
          <h1 className="font-medium text-4xl">
            您正在使用
            <span className="text-inputPrimary">電腦或平板</span>
          </h1>
          <p>本平台是專為手機設計，請使用手機輸入此網址或掃描下方QRCode。</p>
          <div className="p-2 border-2 border-zinc-100 rounded-3xl flex items-center gap-4 w-fit pr-5 mt-5">
            <Image
              alt="phone-qrcode"
              src={"/phone-qrcode.png"}
              width={100}
              height={100}
              className={`opacity-100 transition-all`}
            />
            <div className="flex flex-col gap-1">
              <h1 className="font-medium text-xl">
                使用您的手機掃描左方的QRCode
              </h1>
              <h1 className="flex items-center">
                或在網址列輸入
                <button
                  onClick={() => copyLink("app.lyhsca.org")}
                  className="p-2 px-4 rounded-full flex gap-3 items-center bg-zinc-100 hover:bg-zinc-300 transition-all m-1"
                >
                  app.lyhsca.org
                  {isCopied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mb-8 opacity-50 items-center justify-center text-sm pl-3 p-1">
          <p>Copyright © 2024 - 2025 LYSA.</p>
          <p>
            此系統由林園高中學生會資訊組建置與維護，如有任何問題歡迎
            <Link
              href={"https://www.instagram.com/lyca_22nd"}
              className="bg-zinc-200 underline underline-offset-4 p-1 px-2 mx-1 text-sm"
            >
              聯絡我們
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
