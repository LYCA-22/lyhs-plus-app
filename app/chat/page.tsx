"use client";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/services/apiClass";
import { turnOffBackLink, updatePageLoadingStatus } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import remarkGfm from "remark-gfm";

export default function ChatPage() {
  const [userInput, setUserInput] = useState("");
  const [userInputHistory, setUserInputHistory] = useState<string[]>([]);
  const [aiResponseHistory, setAiResponseHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const appData = useAppSelector((state) => state.appStatus);
  const dispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(turnOffBackLink());
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [aiResponseHistory, userInputHistory, isLoading]);

  const handleAiRes = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);
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

    setIsLoading(false);
  };

  return (
    <div
      className={`flex flex-col h-dvh ${appData.device_info.operate_type === "PWA" ? "pb-32" : "pb-24"}`}
    >
      <div className="flex items-center justify-center gap-2 py-3 bg-background border-b border-zinc-200 dark:border-zinc-600">
        <h1 className="text-lg font-medium">LYHS+ 智慧助理</h1>
        <p className="text-sm border-2 border-border dark:border-zinc-500 border-dashed rounded-full p-1 px-2 font-medium">
          測試版
        </p>
      </div>
      {userInputHistory.length === 0 && (
        <div className="bg-gradient-to-b from-hoverbg to-background p-6">
          <p className="text-4xl font-medium leading-[1.3] opacity-40">
            輸入問題，AI 會替您解答。
          </p>
          <p className="text-lg opacity-50 mt-5">
            此服務目前還只是測試版，使用時請勿透露個人資訊。並且，我們不會保留您的任何對話紀錄，如需保存，可於
            AI 回答後進行截圖。
          </p>
        </div>
      )}
      <div className="px-5 space-y-5 overflow-y-auto pb-40 grow pt-5">
        {userInputHistory.map((input, index) => (
          <div key={index} className="flex flex-col w-full gap-3">
            <div className="bg-sky-100 dark:bg-sky-950 dark:text-sky-200 rounded-full ml-auto p-2 px-3">
              {input}
            </div>
            <div>
              {isLoading && index === userInputHistory.length - 1 && (
                <div className="flex items-center my-2">
                  <DotLottieReact
                    src="https://lottie.host/3536a5ae-9726-4b6b-83f1-05d019cfe681/K3Bj9GzRYI.lottie"
                    loop
                    autoplay
                    speed={2.5}
                    style={{ width: "30px", height: "30px" }}
                  />
                  <p className="font-medium opacity-60">AI 生成中...</p>
                </div>
              )}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  ol: ({ children }) => (
                    <ol className="list-decimal ml-6 m-4">{children}</ol>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-3 my-4">{children}</ul>
                  ),
                }}
              >
                {aiResponseHistory[index]}
              </ReactMarkdown>
              <div className="bg-hoverbg rounded-full p-2 px-3 w-fit text-sm mt-4">
                <p className="opacity-50">訊息由 AI 生成，僅供參考。</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAiRes();
        }}
        className={`fixed bottom-0 px-5 flex justify-center flex-col w-full pt-5 pb-28 bg-white/80 dark:bg-[#141416]/80 backdrop-blur-lg`}
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
