"use client";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/services/apiClass";
import { turnOffBackLink, updatePageLoadingStatus } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function ChatPage() {
  const [userInput, setUserInput] = useState("");
  const [userInputHistory, setUserInputHistory] = useState<string[]>([]);
  const [aiResponseHistory, setAiResponseHistory] = useState<string[]>([]);
  const appData = useAppSelector((state) => state.appStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(turnOffBackLink());
  });

  const handleAiRes = async () => {
    if (!userInput.trim()) return;
    dispatch(updatePageLoadingStatus(true));
    const currentInput = userInput;
    setUserInput("");
    setUserInputHistory((prev) => [...prev, currentInput]);
    setAiResponseHistory((prev) => [...prev, ""]);

    const aiApiUrl = `${API_BASE_URL}/v1/lyps/ai/chat`;
    const response = await fetch(aiApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({ input: currentInput }),
    });

    if (!response.ok || !response.body) {
      throw new Error("Stream response not available");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (readerDone) break;

      buffer += decoder.decode(value, { stream: true });

      let lineBreakIndex;

      while ((lineBreakIndex = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, lineBreakIndex).trim();
        buffer = buffer.slice(lineBreakIndex + 1);

        if (!line) continue;
        if (!line.startsWith("data:")) continue;

        const data = line.replace(/^data:\s?/, "");

        if (data === "[DONE]") {
          done = true;
          break;
        }

        try {
          const json = JSON.parse(data);

          const text = json.response ?? "";

          setAiResponseHistory((prev) => {
            const next = [...prev];
            next[next.length - 1] += text;
            return next;
          });
        } catch (e) {
          setAiResponseHistory((prev) => {
            const next = [...prev];
            next[next.length - 1] = "伺服器發生錯誤，請重試。";
            return next;
          });
          console.error(e);
        } finally {
          dispatch(updatePageLoadingStatus(false));
        }
      }
    }
  };

  return (
    <div
      className={`flex flex-col h-dvh ${appData.device_info.operate_type === "PWA" ? "pb-32" : "pb-24"}`}
    >
      <div className="p-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-medium">LYHS+ 智慧助理</h1>
          <p className="text-sm border border-border rounded-full p-1 px-2 font-medium">
            測試版
          </p>
        </div>
        <p className="opacity-50 mt-1">
          此功能可以協助您找到學校的相關資訊，您的對話紀錄將不會保留。
        </p>
      </div>
      <div className="px-5 mt-3 space-y-5 overflow-y-auto pb-28 grow">
        {userInputHistory.map((input, index) => (
          <div key={index} className="flex flex-col w-full gap-5">
            <div className="bg-sky-100 dark:bg-sky-950 dark:text-sky-200 rounded-full ml-auto p-2 px-3">
              {input}
            </div>
            <div>
              <ReactMarkdown>{aiResponseHistory[index]}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAiRes();
        }}
        className={`fixed bottom-20 px-5 flex justify-center flex-col w-full pt-5 bg-white/80 dark:bg-[#141416]/80 backdrop-blur-lg`}
      >
        <Input
          placeholder="在這裡輸入你的問題..."
          className="bg-hoverbg dark:bg-[#1E272F] p-4 rounded-full px-6"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          onClick={() => handleAiRes()}
          className="bg-sky-600 text-white p-2 rounded-full absolute top-[30px] right-[32px]"
        >
          <SendHorizontal size={20} />
        </button>
        <p className="mt-2 opacity-50 text-sm pl-2">
          *本服務由AI提供，請勿輸入您的個人資訊。
        </p>
      </form>
    </div>
  );
}
