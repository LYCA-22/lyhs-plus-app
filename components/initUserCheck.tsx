"use client";
import { useEffect } from "react";
import { store } from "@/store/store";
import { useAppDispatch } from "@/store/hook";
import { checkUserSession } from "@/utils/userCheck";
import { updateSystemData } from "@/store/systemSlice";

interface DeviceInfo {
  os: string;
  browser: string;
}

const getDeviceInfo = async (): Promise<DeviceInfo> => {
  const userAgent = navigator.userAgent;
  let os = "Unknown";
  let browser = "Unknown";

  // 檢測操作系統
  if (userAgent.indexOf("Win") !== -1) os = "Windows";
  if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
  if (userAgent.indexOf("Linux") !== -1) os = "Linux";
  if (userAgent.indexOf("Android") !== -1) os = "Android";
  if (userAgent.indexOf("iPhone") !== -1) os = "iOS";

  // 檢測瀏覽器
  if (userAgent.indexOf("Chrome") !== -1) browser = "Chrome";
  if (userAgent.indexOf("Firefox") !== -1) browser = "Firefox";
  if (userAgent.indexOf("Safari") !== -1) browser = "Safari";
  if (userAgent.indexOf("Edge") !== -1) browser = "Edge";
  if (userAgent.indexOf("Opera") !== -1) browser = "Opera";

  return { os, browser };
};

export default function UserCheck() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initDevice = async () => {
      const info = await getDeviceInfo();
      dispatch(updateSystemData(info));
    };

    initDevice();
  }, [dispatch]);

  useEffect(() => {
    checkUserSession(store.dispatch);
  }, []);

  return null;
}
