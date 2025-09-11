export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.error("This browser does not support notifications");
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

// 後端 API 的基礎 URL
const API_BASE_URL = "https://api.lyhsca.org";

// 訂閱推送通知
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.error("Push notifications not supported");
      return null;
    }

    // 等待 Service Worker 準備就緒
    const registration = await navigator.serviceWorker.ready;

    // 檢查現有訂閱
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
      });
    }

    await sendSubscriptionToBackend(subscription);
    saveSubscriptionToLocalStorage(subscription);
    return subscription;
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    return null;
  }
}

// 發送訂閱信息到後端
async function sendSubscriptionToBackend(
  subscription: PushSubscription,
): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}/v1/lyps/radio/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subscription }),
  });

  if (!response.ok) {
    throw new Error("Failed to send subscription to server");
  }

  return await response.json();
}

// 將訂閱保存到 localStorage
function saveSubscriptionToLocalStorage(subscription: PushSubscription): void {
  try {
    localStorage.setItem("pushSubscription", JSON.stringify(subscription));
  } catch (error) {
    console.error("Error saving subscription to localStorage:", error);
  }
}

// 從 localStorage 獲取訂閱
export function getSubscriptionFromLocalStorage(): PushSubscription | null {
  try {
    const subscriptionString = localStorage.getItem("pushSubscription");
    if (!subscriptionString) return null;
    return JSON.parse(subscriptionString) as PushSubscription;
  } catch (error) {
    console.error("Error getting subscription from localStorage:", error);
    return null;
  }
}

// Base64 URL 轉 Uint8Array (用於 applicationServerKey)
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
