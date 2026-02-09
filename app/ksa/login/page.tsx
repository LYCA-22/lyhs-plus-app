"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { turnOnBackLink } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { ToggleLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function KSALoginPage() {
  const userData = useAppSelector((state) => state.userData);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(turnOnBackLink("/"));
  });

  return (
    <div className="flex flex-col bg-sky-50 dark:bg-background h-full pt-10 gap-4">
      <div className="p-5 pt-7 pb-0 text-sky-900 dark:text-sky-100 space-y-2">
        <h1 className="font-medium text-2xl">KSA 服務登入</h1>
        <p className="opacity-50">
          KSA 服務是由LYHS
          Plus推出的數位學生個人化系統，此系統會透過您的允許，並連線至您在校務行政系統上的資料。
        </p>
      </div>
      <div className="grow bg-background dark:bg-blue-300/10 rounded-t-3xl pb-36 p-5">
        {!userData.ksa_enabled && (
          <div>
            <div className="flex items-center gap-4">
              <ToggleLeft
                size={30}
                className=" text-sky-900 dark:text-sky-100"
              />
              <div className="text-sky-900 dark:text-sky-100">
                <p className="font-medium">系統偵測到，您尚未啟用 KSA 服務。</p>
                <p className="text-sky-900 dark:text-sky-100">
                  請滑到最下面，進行啟用。
                </p>
              </div>
            </div>
            <div className="flex gap-3 text-sky-900 font-medium mt-5 pt-5 border-t border-border dark:border-zinc-700">
              <div>
                <p className="bg-sky-800 rounded-full flex items-center justify-center w-8 h-8 text-white">
                  Q
                </p>
              </div>
              <div>
                <p>為什麼要我啟用 KSA 服務？</p>
                <p className="font-normal">
                  此服務為確保您授權，否則不會連線至校務行政系統獲取您的資料。此服務授權只需一次，往後不再需要啟用。
                </p>
              </div>
            </div>
            <div className="flex gap-3 text-sky-900 font-medium mt-5 dark:border-zinc-700">
              <div>
                <p className="bg-sky-800 rounded-full flex items-center justify-center w-8 h-8 text-white">
                  Q
                </p>
              </div>
              <div>
                <p>啟用後，會獲得我的哪些資料？</p>
                <p className="font-normal">
                  當你每次使用此服務時，都會存取您的個人基本資料（例如：頭像、姓名、班級、座號）。此外，當你選擇查詢成績時，系統會獲取您的學期資料與該次段考的詳細資料。當您要查詢缺曠課時，會獲取您的缺曠課紀錄。
                </p>
              </div>
            </div>
            <div className="flex gap-3 text-sky-900 font-medium mt-5 dark:border-zinc-700">
              <div>
                <p className="bg-sky-800 rounded-full flex items-center justify-center w-8 h-8 text-white">
                  Q
                </p>
              </div>
              <div>
                <p>我的資料會留在哪裡？</p>
                <p className="font-normal">
                  你的資料只會留在校務行政系統上，並不會留存於LYHS
                  Plus的伺服器上，或是您的設備上。
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-5 font-medium text-sky-900">
              <Checkbox id="checkbox" />
              <label htmlFor="checkbox">
                我已詳細閱讀以上資訊，並同意啟用服務。
              </label>
            </div>
            <div className="flex w-full justify-between gap-5 mt-5">
              <Link
                href="/"
                className="bg-zinc-300 dark:bg-zinc-600 rounded-xl p-2 w-full text-center font-medium hover:opacity-50 transition-all"
              >
                返回
              </Link>
              <button
                type="submit"
                className="bg-sky-600 text-white rounded-xl p-2 w-full font-medium hover:opacity-50 transition-all"
              >
                啟用
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
