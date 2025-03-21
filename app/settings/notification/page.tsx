"use client";
import { CaretLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function NotificationTestPage() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [status, setStatus] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const savedSubscription = localStorage.getItem("pushSubscription");
        if (savedSubscription) {
          setSubscription(JSON.parse(savedSubscription));
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
  }, []);

  const urlBase64ToUint8Array = (base64String: string) => {
    try {
      if (!base64String) {
        throw new Error("VAPID 公鑰為空");
      }

      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    } catch (error) {
      if (error instanceof Error) {
        console.error("轉換 VAPID 公鑰出錯:", error);
        throw new Error(`無法處理 VAPID 公鑰: ${error.message}`);
      }
    }
  };

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

      // 註冊 Service Worker
      const registration =
        await navigator.serviceWorker.register("/service-worker.js");

      // 確保 Service Worker 已激活
      if (registration.installing || registration.waiting) {
        setStatus("等待 Service Worker 激活...");

        // 等待 Service Worker 激活完成
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

      // 確保有活躍的 Service Worker
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
        "pushSubscription",
        JSON.stringify(pushSubscription),
      );
      setSubscription(pushSubscription);

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

      setIsSubscribed(true);
      setStatus("成功訂閱通知！");
    } catch (error) {
      if (error instanceof Error) {
        console.error("訂閱通知失敗:", error);
        setStatus(`訂閱通知失敗: ${error.message}`);
      }
    }
  };

  const unsubscribeFromNotifications = async () => {
    try {
      setStatus("正在取消訂閱...");

      if (!subscription) {
        throw new Error("無法找到訂閱信息");
      }

      await subscription.unsubscribe();

      const response = await fetch(
        "https://api.lyhsca.org/v1/lyps/radio/unsubscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subscription }),
        },
      );

      if (!response.ok) {
        console.warn("伺服器移除訂閱失敗，但本地已取消訂閱");
      }

      // 清除本地儲存
      localStorage.removeItem("pushSubscription");
      setSubscription(null);
      setIsSubscribed(false);
      setStatus("已取消訂閱通知");
    } catch (error) {
      if (error instanceof Error) {
        console.error("取消訂閱失敗:", error);
        setStatus(`取消訂閱失敗: ${error.message}`);
      }
    }
  };

  // 顯示VAPID公鑰狀態（僅用於調試）
  const debugInfo = () => {
    if (process.env.NODE_ENV === "development") {
      return (
        <div className="mt-2 pt-2 border-t border-borderColor bg-gray-100 rounded text-xs">
          <p>VAPID 公鑰狀態: {vapidPublicKey ? "已設定" : "未設定"}</p>
          {vapidPublicKey && (
            <p>公鑰前10個字符: {vapidPublicKey.substring(0, 10)}...</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 pb-6 max-w-lg">
      <Link
        href="/settings"
        className="flex items-center hover:bg-hoverbg justify-center rounded-full border border-border p-2 px-3 my-3 w-fit"
      >
        <CaretLeft size={20} />
        返回
      </Link>
      <div className="bg-gray-100 p-6 rounded-2xl mb-6">
        <h2 className="text-lg font-semibold mb-2">通知服務狀態</h2>
        <p
          className={`mb-4 ${isSubscribed ? "text-green-600" : "text-gray-600"}`}
        >
          {status}
        </p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={
              isSubscribed
                ? unsubscribeFromNotifications
                : subscribeToNotifications
            }
            className={`py-2 px-4 rounded-xl font-medium text-white ${
              isSubscribed
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubscribed ? "取消訂閱通知" : "訂閱通知"}
          </button>

          {isSubscribed && (
            <div className="text-sm text-gray-600 mt-2">
              <p>您將接收到來自 LYHS Plus 的通知</p>
            </div>
          )}

          {!isSubscribed && (
            <div className="text-sm text-gray-600 mt-2">
              <p>訂閱後，即使您未開啟網站，也能收到重要更新和通知</p>
            </div>
          )}
        </div>
        {debugInfo()}
      </div>

      {isSubscribed && (
        <div className="bg-green-50 p-4 rounded-2xl border border-green-200">
          <h3 className="font-medium text-green-800 mb-2">通知已開啟</h3>
          <p className="text-green-700 text-sm">
            您已成功訂閱通知。系統管理員發送的重要消息將會顯示在您的設備上。
          </p>
        </div>
      )}

      <div className="mt-8 px-2">
        <h2 className="text-lg font-semibold mb-2">相關說明</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>訂閱通知需要您的瀏覽器授予權限</li>
          <li>您可以隨時取消訂閱</li>
          <li>通知會顯示學校重要公告和活動</li>
          <li>即使關閉網站，您也能收到通知</li>
        </ul>
      </div>
    </div>
  );
}
