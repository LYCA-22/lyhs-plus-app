self.addEventListener("push", function (event) {
  if (!event.data) return;

  try {
    const data = event.data.json();

    const options = {
      body: data.content || "有新消息",
      icon: "/icons/notification-icon.png", // 您需要提供這個圖標文件
      badge: "/icons/badge-icon.png", // 您需要提供這個圖標文件
      data: {
        url: data.url || "/", // 點擊通知後的跳轉網址
      },
      vibrate: [100, 50, 100], // 振動模式 (如果設備支持)
      timestamp: Date.now(), // 時間戳
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || "LYHS Plus 通知",
        options,
      ),
    );
  } catch (e) {
    console.error("顯示通知時出錯:", e);
  }
});

// 處理通知點擊
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // 嘗試找到已開啟的窗口並聚焦
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      // 如果沒有開啟的窗口，則開啟新窗口
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }),
  );
});
