self.addEventListener("push", function (event) {
  if (!event.data) return;

  try {
    const data = event.data.json();

    const options = {
      body: data.content || "新公告",
      icon: "/icon-192x192.png",
      badge: "/icon-64x64.png",
      data: {
        url: data.url || "/",
      },
      vibrate: [100, 50, 100],
      timestamp: Date.now(),
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

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }),
  );
});
