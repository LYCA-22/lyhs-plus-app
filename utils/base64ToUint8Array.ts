export const urlBase64ToUint8Array = (base64String: string) => {
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
