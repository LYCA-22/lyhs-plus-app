import Image from "next/image";
import { InitFunction } from "./autoInit";
import { useAppSelector } from "@/store/hook";

export function InitPage() {
  const appData = useAppSelector((state) => state.appStatus);

  return (
    <div
      className={`fixed top-0 flex z-[10000] w-full h-dvh bg-white text-black flex-col items-center justify-center opacity-100 ${appData.initialize ? "hidden" : ""}`}
    >
      <div className="mb-20 flex flex-col items-center justify-center gap-3">
        <Image
          alt="logo"
          src="/assets/icon-128x128.png"
          width={50}
          height={50}
        />
        <div className="w-5 h-5 rounded-full border-[2px] border-buttonBg border-t-primary dark:border-t-white animate-spin"></div>
      </div>
      <InitFunction />
    </div>
  );
}
