"use client";
import { useAppSelector } from "@/store/hook";
import { useEffect, useState } from "react";

export function LoadingSvg() {
  const AppData = useAppSelector((state) => state.systemData);
  const [mode, setMode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode != "") {
      setName("scale-100 opacity-100");
    } else {
      setName("scale-0 opacity-0");
    }
  }, [mode]);

  useEffect(() => {
    if (AppData.isLoading) {
      setMode("LOADING");
    } else if (AppData.Error) {
      setMode("ERROR");
      setError(AppData.Error);
    } else {
      setMode("");
    }
  }, [AppData.isLoading, AppData.Error]);

  return (
    <div
      className={`${name} transition-all z-[5000] fixed overflow-hidden bg-transparent h-full w-full flex items-center justify-center top-0 left-0`}
    >
      <div className="bg-zinc-800 dark:bg-zinc-700 backdrop-blur-3xl rounded-[15px] p-4">
        {mode == "LOADING" ? (
          <svg
            width="50"
            height="50"
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
                <stop
                  offset="100%"
                  stopOpacity="0.5"
                  stopColor="currentColor"
                />
              </linearGradient>
              <linearGradient id="spinner-firstHalf">
                <stop offset="0%" stopOpacity="1" stopColor="currentColor" />
                <stop
                  offset="100%"
                  stopOpacity="0.5"
                  stopColor="currentColor"
                />
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
        ) : (
          <p>{error}</p>
        )}
      </div>
    </div>
  );
}
