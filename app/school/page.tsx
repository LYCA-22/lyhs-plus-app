"use client";

import { updateSystemData } from "@/store/systemSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();

  const firstCheck = () => {
    dispatch(
      updateSystemData({
        isLoading: true,
      }),
    );
    const isUsed = localStorage.getItem("lyps_school_used");
    if (isUsed) {
      router.push("school/verify");
    }
    setTimeout(() => {
      dispatch(
        updateSystemData({
          isLoading: false,
        }),
      );
    }, 500);
  };

  useEffect(() => {
    dispatch(
      updateSystemData({
        isBack: true,
        BackLink: "/",
      }),
    );

    firstCheck();
  });

  const accept = () => {
    localStorage.setItem("lyps_school_used", "1");
    router.push("/school/verify");
  };

  return (
    <div className="w-full flex items-center justify-center flex-col gap-2 p-5 relative">
      <div className="flex flex-col justify-center items-start gap-1">
        <h1 className="text-xl font-bold">您好</h1>
        <p className="opacity-55">
          我們發現您為初次使用此服務的用戶，以下為本服務注意事項：
        </p>
      </div>
      <div className="flex flex-col items-start p-5 bg-hoverbg rounded-xl my-3">
        <ol type="1" start={1} className="font-custom list-decimal pl-8">
          <li className="pb-2 border-b border-borderColor">
            您即將使用LYHS+校務系統，此服務將會存取您的帳號密碼。
          </li>
          <li className="py-2 border-b border-borderColor">
            使用前，請確保您同意將您的帳號密碼供本系統使用查詢資料。
          </li>
          <li className="py-2 border-b border-borderColor">
            我們系統僅會用來查詢您所請求的服務，不會進行其他動作。
          </li>
        </ol>
        <div className="pt-4">
          本系統為開源程式碼專案，如能有疑慮可上 Github
          查看本系統程式碼。使用安心有保障！
        </div>
      </div>
      <button
        onClick={accept}
        className="rounded-xl bg-sky-950 text-white dark:bg-white dark:text-black w-full p-3 flex items-center justify-center"
      >
        同意並繼續
      </button>
    </div>
  );
}
