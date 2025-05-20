"use client";
import { useState, useEffect } from "react";
import { urlBase64ToUint8Array } from "@/utils/base64ToUint8Array";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { updateSystemData } from "@/store/systemSlice";
import { Rss } from "lucide-react";

export default function NotificationPage() {
  const [status, setStatus] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const AppData = useAppSelector((state) => state.systemData);
  const userData = useAppSelector((state) => state.userData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const isSubscribe = AppData.isSubscribe;
        if (isSubscribe) {
          setIsSubscribed(true);
          setStatus("您已訂閱通知");
        } else {
          if (!userData.id) {
            setStatus("請先登入");
          } else {
            setStatus("您尚未訂閱通知");
          }
        }
      } catch (err) {
        console.error("檢查訂閱狀態出錯:", err);
        setStatus("檢查訂閱狀態時發生錯誤");
      }
    };

    checkSubscription();
  }, [AppData.isSubscribe]); // 只依賴於 AppData.isSubscribe，而不是整個 AppData

  const subscribeToNotifications = async () => {
    try {
      if (!vapidPublicKey) {
        setStatus("系統錯誤: VAPID 公鑰未設定，請聯繫管理員");
        console.error("VAPID 公鑰未在環境變數中設定");
        return;
      }

      setStatus("正在請求通知權限...");

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("通知權限被拒絕");
        return;
      }

      setStatus("正在註冊 Service Worker...");

      if (!("serviceWorker" in navigator)) {
        setStatus("您的瀏覽器不支援 Service Worker，無法接收通知");
        return;
      }

      const registration =
        await navigator.serviceWorker.register("/service-worker.js");

      if (registration.installing || registration.waiting) {
        setStatus("等待 Service Worker 啟用...");

        await new Promise((resolve) => {
          if (registration.installing) {
            registration.installing.addEventListener("statechange", (e) => {
              if ((e.target as ServiceWorker).state === "activated") {
                resolve(true);
              }
            });
          } else if (registration.waiting) {
            registration.waiting.addEventListener("statechange", (e) => {
              if ((e.target as ServiceWorker).state === "activated") {
                resolve(true);
              }
            });
          }
        });
      }

      if (!registration.active) {
        throw new Error("無法啟動 Service Worker");
      }

      setStatus("正在訂閱推送通知...");

      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      });

      localStorage.setItem(
        "lyps_subscription",
        JSON.stringify(pushSubscription),
      );

      const response = await fetch(
        "https://api.lyhsca.org/v1/lyps/radio/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subscription: pushSubscription }),
        },
      );

      if (!response.ok) {
        throw new Error("伺服器儲存訂閱失敗");
      }

      dispatch(
        updateSystemData({
          isSubscribe: true,
        }),
      );

      setIsSubscribed(true);
      setStatus("成功訂閱通知！");
    } catch (error) {
      if (error instanceof Error) {
        console.error("訂閱通知失敗:", error);
        setStatus(`訂閱通知失敗: ${error.message}`);
      }
    }
  };

  return (
    <div className="container pb-6 px-7">
      <div className="flex justify-between items-center mx-2 my-3">
        <div className="flex items-center gap-3">
          <Rss size={24} strokeWidth={3} />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">通知服務狀態</h2>
            <p className={`opacity-50`}>{status}</p>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <button
            disabled={isSubscribed || !userData.id}
            onClick={subscribeToNotifications}
            className={`py-2 px-4 rounded-full font-medium text-white flex items-center justify-center gap-3 ${
              isSubscribed ? "bg-green-600" : "bg-blue-600"
            } ${!userData.id && "bg-zinc-300 text-zinc-100 dark:bg-zinc-700 dark:text-zinc-600"}`}
          >
            {isSubscribed ? "已啟用" : "啟用"}
          </button>
        </div>
      </div>
      <div className="w-full bg-border h-[2px] rounded-full dark:bg-zinc-700 opacity-50 mt-1"></div>
      <div className="my-8 px-2">
        <h2 className="text-lg font-semibold mb-2">相關說明</h2>
        <ul className="list-inside text-foreground space-y-1">
          <li>訂閱通知需要您的瀏覽器授予權限</li>
          <li>您可以隨時取消訂閱</li>
          <li>通知會顯示學校重要公告和活動</li>
          <li>即使關閉網站，您也能收到通知</li>
        </ul>
      </div>
    </div>
  );
}
