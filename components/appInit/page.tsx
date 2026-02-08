import Image from "next/image";
import { DotPattern } from "../ui/dot-pattern";
import { cn } from "@/lib/utils";
import { InitFunction } from "./autoInit";
import { useAppSelector } from "@/store/hook";

export function InitPage() {
  const appData = useAppSelector((state) => state.appStatus);

  return (
    <div
      className={`fixed top-0 flex z-[10000] w-full h-dvh bg-white text-black flex-col items-center justify-center opacity-100 ${appData.initialize ? "hidden" : ""}`}
    >
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]",
        )}
      />
      <div className="mb-20 flex flex-col items-center justify-center gap-3">
        <Image
          alt="logo"
          src="/assets/icon_with_text.svg"
          width={250}
          height={100}
        />
        <p className="opacity-60 text-[15px]">
          Creating infinite possibilities
        </p>
      </div>
      <InitFunction />
    </div>
  );
}
