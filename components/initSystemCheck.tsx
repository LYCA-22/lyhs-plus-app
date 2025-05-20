"use client";
import { useEffect, useState } from "react";
import { store } from "@/store/store";
import { systemLoad } from "@/utils/systemCheck";
import { getDeviceInfo } from "@/utils/getDeviceInfo";

export default function SystemCheck() {
  const [os, setOS] = useState("");
  const [browser, setBrowser] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  useEffect(() => {
    getDeviceInfo(setOS, setBrowser);
    systemLoad(store.dispatch, os, browser, isMobile);
    const version = process.env.NEXT_PUBLIC_APP_VERSION;
    if (version) {
      localStorage.setItem("lyps_ver", version);
    }
  }, [os, browser, isMobile]);

  return null;
}
