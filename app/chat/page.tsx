"use client";
import { Input } from "@/components/ui/input";
import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import { updatePageLoadingStatus } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function ChatPage() {
  const [userInput, setUserInput] = useState("");
  const [userInputHistory, setUserInputHistory] = useState<string[]>([]);
  const [aiResponseHistory, setAiResponseHistory] = useState<string[]>([]);
  const appData = useAppSelector((state) => state.appStatus);
  const dispatch = useDispatch();

  const handleAiRes = async () => {
    dispatch(updatePageLoadingStatus(true));
    try {
      setUserInputHistory((prev) => [...prev, userInput]);
      const aiApiUrl = `${API_BASE_URL}/v1/lyps/ai/chat`;
      const aiApi = new apiFetch(aiApiUrl);
      const response = await aiApi.POST({ input: userInput });
      setAiResponseHistory((prev) => [...prev, response.text]);
      setUserInput("");
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(updatePageLoadingStatus(false));
    }
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <div className="p-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-medium">AI 聊天</h1>
          <p className="text-sm border border-border rounded-full p-1 px-2">
            BETA
          </p>
        </div>
        <p className="opacity-50">此功能可以協助您找到學校的相關資訊。</p>
      </div>
      <div className="px-5 mt-3 space-y-5">
        {userInputHistory.map((input, index) => (
          <div key={index} className="flex flex-col w-full gap-5">
            <div className="bg-sky-100 rounded-full ml-auto p-2 px-3">
              {input}
            </div>
            <div>{aiResponseHistory[index]}</div>
          </div>
        ))}
      </div>
      <div
        className={`fixed w-full left-0 px-5 flex justify-center flex-col ${appData.device_info.operate_type === "PWA" ? "bottom-[104px]" : "bottom-24"}`}
      >
        <Input
          placeholder="在這裡輸入你的問題..."
          className="bg-background border border-border p-4 rounded-2xl shadow-md"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          onClick={() => handleAiRes()}
          className="bg-sky-600 text-white p-2 rounded-xl absolute bottom-[38px] right-[32px]"
        >
          <SendHorizontal size={20} />
        </button>
        <p className="mt-2 opacity-50 text-sm pl-2">
          *本服務由AI提供，請勿輸入您的個人資訊。
        </p>
      </div>
    </div>
  );
}
