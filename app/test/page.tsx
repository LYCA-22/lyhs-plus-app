"use client";
import { useState } from "react";

const API_BASE_URL = "https://api.lyhsca.org";

interface NotificationStatus {
  type: "idle" | "loading" | "success" | "error";
  message?: string;
}

export default function SendNotificationPage() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [url, setUrl] = useState<string>("/");
  const [status, setStatus] = useState<NotificationStatus>({ type: "idle" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading" });

    try {
      const response = await fetch(`${API_BASE_URL}/v1/lyps/radio/push`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("伺服器回應錯誤");
      }

      const result = await response.json();
      setStatus({
        type: "success",
        message: `通知已發送！成功: ${result.success || 0}, 失敗: ${result.failed || 0}`,
      });

      // 清空表單
      setTitle("");
      setContent("");
      setUrl("/");
    } catch (error) {
      console.error("Error sending notification:", error);
      setStatus({
        type: "error",
        message: "發送通知時發生錯誤，請稍後再試",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">發送測試通知</h1>

      {status.type !== "idle" && (
        <div
          className={`mb-4 p-3 rounded ${
            status.type === "loading"
              ? "bg-blue-50 text-blue-700"
              : status.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
          }`}
        >
          {status.type === "loading" ? "發送中..." : status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            標題
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            內容
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            點擊通知後跳轉的網址 (選填)
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="/"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={status.type === "loading"}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {status.type === "loading" ? "發送中..." : "發送通知"}
          </button>
        </div>
      </form>
    </div>
  );
}
