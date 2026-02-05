"use client";
import { setAppError } from "@/store/appSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";

export function LoadingSvg() {
  const AppData = useAppSelector((state) => state.appStatus);
  const dispatch = useAppDispatch();
  const cleanError = () => {
    dispatch(
      setAppError({
        type: "client",
        status: 0,
        message: "",
        code: "",
        detail: "",
      }),
    );
  };

  return (
    <div
      className={`transition-all ${AppData.service_status.pageIsLoading || AppData.app_error.message ? "scale-100 opacity-100" : "scale-0 opacity-0"} z-[5000] fixed overflow-hidden bg-transparent h-full w-full flex items-center justify-center top-0 left-0`}
    >
      {AppData.service_status.pageIsLoading ? (
        <div className="bg-zinc-800/50  dark:bg-zinc-700/50 backdrop-blur-lg rounded-[15px] p-4 shadow-lg">
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
        </div>
      ) : (
        <div className="bg-zinc-300/50  dark:bg-zinc-700/50 backdrop-blur-lg rounded-[30px] p-5 mx-10 relative shadow-lg">
          <div>
            <h2 className="font-medium text-xl">系統錯誤資訊</h2>
            <p className="opacity-50">{AppData.app_error.message}</p>
            <p className="opacity-50">錯誤代碼 {AppData.app_error.code}</p>
          </div>
          <div className="w-full relative mt-3 flex flex-col gap-2">
            <button
              onClick={() => cleanError()}
              className="bg-foreground text-background opacity-90 p-3 w-full rounded-full hover:opacity-50"
            >
              關閉
            </button>
            <button
              onClick={() => cleanError()}
              className="bg-background text-foreground opacity-90 p-3 w-full rounded-full hover:opacity-50"
            >
              請求技術支援
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
