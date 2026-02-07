"use client";
import { setAppError } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { TriangleAlert, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export function ServiceStatus() {
  return (
    <>
      <LoadingState />
      <ErrorState />
    </>
  );
}

function LoadingState() {
  const AppData = useAppSelector((state) => state.appStatus);
  const [hidden, setHidden] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!AppData.service_status.pageIsLoading) {
      setIsLoading(false);
      setTimeout(() => setHidden(true), 200);
    } else {
      setHidden(false);
      setTimeout(() => setIsLoading(true), 100);
    }
  }, [AppData.service_status.pageIsLoading]);

  return (
    <div
      className={`transition-all duration-200 ${hidden ? "hidden" : ""} ${isLoading ? "scale-100 opacity-100" : "scale-90 opacity-0"} z-[5000] fixed overflow-hidden bg-transparent h-full w-full flex items-center justify-center top-0 left-0`}
    >
      <div className="bg-zinc-700  dark:bg-zinc-600 backdrop-blur-lg rounded-2xl p-3 shadow-lg">
        <svg
          width="40"
          height="40"
          viewBox="0 0 200 200"
          color="#ffffff"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-spin"
          style={{
            transformOrigin: "center",
            animation: "spin 1.3s linear infinite",
          }}
        >
          <defs>
            <linearGradient id="spinner-secondHalf">
              <stop offset="0%" stopOpacity="0" stopColor="currentColor" />
              <stop offset="100%" stopOpacity="0.5" stopColor="currentColor" />
            </linearGradient>
            <linearGradient id="spinner-firstHalf">
              <stop offset="0%" stopOpacity="1" stopColor="currentColor" />
              <stop offset="100%" stopOpacity="0.5" stopColor="currentColor" />
            </linearGradient>
          </defs>

          <g strokeWidth="8">
            <path
              stroke="url(#spinner-secondHalf)"
              d="M 4 100 A 96 96 0 0 1 196 100"
            />
            <path
              stroke="url(#spinner-firstHalf)"
              d="M 196 100 A 96 96 0 0 1 4 100"
            />

            <path
              stroke="currentColor"
              strokeLinecap="round"
              d="M 4 100 A 96 96 0 0 1 4 98"
            />
          </g>

          <animateTransform
            from="0 0 0"
            to="360 0 0"
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="1300ms"
          />
        </svg>
      </div>
    </div>
  );
}

function ErrorState() {
  const error = useAppSelector((state) => state.appStatus.app_error);
  const dispatch = useDispatch();
  const cleanError = () => {
    dispatch(
      setAppError({
        type: "client",
        code: "",
        message: "",
        detail: "",
        status: 0,
      }),
    );
  };

  useEffect(() => {
    if (error.code) {
      setTimeout(() => {
        cleanError();
      }, 8000);
    }
  }, [error.code]);

  return (
    <div
      className={`fixed bottom-0 w-full z-50 p-6 ${error.code ? "opacity-100 translate-y-0" : "opacity-0 translate-y-36"} transition-all`}
    >
      <div
        className={`overflow-hidden relative rounded-xl p-3 bg-background dark:bg-zinc-800 shadow-lg shadow-buttonBg dark:shadow-zinc-800 dark:border-zinc-600 border border-border`}
      >
        <div className="flex items-center gap-2">
          <div className="bg-red-100 rounded-lg p-1 text-red-500 dark:bg-red-900">
            <TriangleAlert size={18} />
          </div>
          <p className="font-medium text-red-600">
            {error.type === "server" ? "伺服器" : "客戶端"}發生錯誤
          </p>
          <button
            className="bg-buttonBg rounded-lg p-1 text-zinc-500 dark:text-zinc-300 dark:bg-zinc-600 ml-auto"
            onClick={() => cleanError()}
          >
            <X size={18} />
          </button>
        </div>
        {error.message && (
          <div className="pl-9 pt-1">
            <p className="opacity-50 text-sm">{error.message}</p>
          </div>
        )}
        <div className="flex flex-wrap gap-2 whitespace-normal mt-2 ml-9 text-xs text-zinc-800 dark:text-zinc-500 dark:border-zinc-500">
          <p className="bg-hoverbg dark:bg-zinc-700/50 rounded-lg p-1 px-2 whitespace-nowrap">
            錯誤代碼 {error.code}
          </p>
          <p className="bg-hoverbg dark:bg-zinc-700/50 rounded-lg p-1 px-2 whitespace-nowrap">
            錯誤類型 {error.type}
          </p>
          <p className="bg-hoverbg dark:bg-zinc-700/50 rounded-lg p-1 px-2 whitespace-nowrap">
            HTTPS代碼 {error.status}
          </p>
        </div>
      </div>
    </div>
  );
}
