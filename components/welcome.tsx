"use client";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import Image from "next/image";
import { updateSystemData } from "@/store/systemSlice";
import SplitText from "./ui/SplitText";

export default function BetaAlert() {
  const systemStatus = useAppSelector((state) => state.systemData);
  const [start, setStart] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!systemStatus.isLoading && !systemStatus.used) {
      setTimeout(() => {
        setStart(true);
      }, 900);
    } else {
      setStart(false);
    }
  }, [systemStatus]);

  const handleAccept = () => {
    localStorage.setItem("lyps_used", "true");
    dispatch(updateSystemData({ used: true }));
  };

  return (
    <>
      {!systemStatus.used && start ? (
        <div
          className={`w-full fixed z-40 h-dvh bg-black/50 backdrop-blur-xl flex justify-center items-center px-5 transition-all delay-75 ease-in-out ${start ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        >
          <div
            className={`p-7 pt-0 bg-transparent gap-3 rounded-3xl flex flex-col justify-center items-center text-center max-w-[500px] text-white`}
          >
            <Image
              src={"postImage/welcome/post-photo-1-light.svg"}
              width={200}
              height={100}
              alt="logo"
              priority
              loading="eager"
            />
            <SplitText
              text="Welcome!"
              className="text-5xl font-semibold text-center"
              delay={100}
              animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
              animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
              threshold={0.2}
              rootMargin="-50px"
            />
            <p>
              非常感謝你願意支持我們的應用程式！提醒您此應用程式正處於測試階段，可能會發生一些錯誤和無效回應。
            </p>
          </div>
          <button
            onClick={handleAccept}
            className="absolute bottom-8 w-5/6 p-3 bg-foreground text-background rounded-full mt-4 font-medium hover:opacity-60 transition-all"
          >
            了解
          </button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
