"use client";
import { useState, useEffect } from "react";
import { urlBase64ToUint8Array } from "@/utils/base64ToUint8Array";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { updateSystemData } from "@/store/systemSlice";
import { CircleCheck, Rss } from "lucide-react";

export default function NotificationPage() {
  const [status, setStatus] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const AppData = useAppSelector((state) => state.systemData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      updateSystemData({
        isBack: true,
        BackLink: "/more",
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const isSubscribe = AppData.subscribe.status;
        if (isSubscribe) {
          setIsSubscribed(true);
          setStatus("您已訂閱通知");
        } else {
          setStatus("您尚未訂閱通知");
        }
      } catch (err) {
        console.error("檢查訂閱狀態出錯:", err);
        setStatus("檢查訂閱狀態時發生錯誤");
      }
    };

    checkSubscription();
  }, [AppData.subscribe.status]); // 只依賴於 AppData.isSubscribe，而不是整個 AppData

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

      const subscribeInfoData = {
        endpoint: pushSubscription.endpoint,
        expirationTime: pushSubscription.expirationTime?.toString() || "",
        keys: {
          p256dh: pushSubscription.getKey("p256dh")
            ? btoa(
                String.fromCharCode(
                  ...new Uint8Array(pushSubscription.getKey("p256dh")!),
                ),
              )
            : "",
          auth: pushSubscription.getKey("auth")
            ? btoa(
                String.fromCharCode(
                  ...new Uint8Array(pushSubscription.getKey("auth")!),
                ),
              )
            : "",
        },
      };

      localStorage.setItem(
        "lyps_subscription",
        JSON.stringify(subscribeInfoData),
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
          subscribe: {
            status: true,
            info: subscribeInfoData,
          },
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
    <div className="pb-6 px-7">
      <div className="flex justify-between items-center mx-2 my-3">
        <div className="flex items-center justify-center flex-col gap-6 w-full p-5">
          <Rss size={40} strokeWidth={3} />
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold">通知服務狀態</h2>
            <p className={`opacity-50 text-sm`}>{status}</p>
          </div>
        </div>
      </div>
      <div className="my-8 rounded-3xl bg-hoverbg p-5">
        <h2 className="text-lg font-semibold mb-2">相關說明</h2>
        <ul className="list-inside text-foreground space-y-1">
          <li className="flex items-center gap-2">
            <CircleCheck /> <p>不漏掉任何最新資訊</p>
          </li>
          <li className="flex items-center gap-2">
            <CircleCheck /> <p>即使關閉網站，您也能收到通知</p>
          </li>
        </ul>
      </div>
      <div className="flex flex-col space-y-4">
        <button
          disabled={isSubscribed}
          onClick={subscribeToNotifications}
          className={`py-2 rounded-full text-lg font-medium text-white flex items-center justify-center gap-3 ${
            isSubscribed ? "bg-green-600" : "bg-inputPrimary"
          }`}
        >
          {isSubscribed ? "已啟用" : "啟用"}
        </button>
      </div>
    </div>
  );
}
