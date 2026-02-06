"use client";
import { apiService } from "@/services/api";
import { turnOnBackLink, updatePageLoadingStatus } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { Info, Smile, SquareAsterisk, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export function LoginForm() {
  const dispatch = useDispatch();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [path, setPath] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const AppData = useAppSelector((state) => state.appStatus);

  useEffect(() => {
    dispatch(turnOnBackLink("/"));
  }, [dispatch]);

  useEffect(() => {
    if (searchParams.get("path")) {
      setPath(searchParams.get("path") || "");
    }
  }, [searchParams]);

  const StartLogin = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(updatePageLoadingStatus(true));
    const result = await apiService.getSessionKeyByOpenId(account, password);

    if (result.session_key) {
      dispatch(updatePageLoadingStatus(false));

      if (path) {
        router.push(path);
      } else {
        router.push("/school");
      }
    } else {
      dispatch(updatePageLoadingStatus(false));

      window.alert(`發生不明錯誤`);
      setAccount("");
      setPassword("");
    }
  };

  return (
    <div className="w-full relative">
      <div className="w-full flex flex-col items-center justify-center relative pb-32">
        <div className="flex font-medium text-sm items-center w-full p-3 px-5 bg-hoverbg gap-3">
          <Smile size={16} className="opacity-50" />
          <h1 className="opacity-50">歡迎使用 OpenId 登入！</h1>
        </div>
        <div className="p-5">
          <form onSubmit={StartLogin} className="relative w-full">
            <div className="flex flex-col justify-center gap-2 w-full relative px-4">
              <label
                htmlFor="account"
                className="text-sm opacity-50 flex items-center gap-2"
              >
                <User size={16} /> 帳號
              </label>
              <input
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Account"
                required
                className="p-3 focus:ring-0 bg-hoverbg rounded-[30px] outline-0 w-full focus:border-borderColor focus:scale-105 border border-transparent focus:shadow-xl focus:bg-background transition-all outline-none ring-0"
              ></input>
              <label
                htmlFor="password"
                className="text-sm opacity-50 flex items-center gap-2"
              >
                <SquareAsterisk size={16} /> 密碼
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                type="password"
                className="p-3 focus:ring-0 bg-hoverbg rounded-[30px] outline-0 w-full  focus:border-borderColor focus:scale-105 border border-transparent focus:shadow-xl focus:bg-background transition-all outline-none ring-0"
              ></input>
              <div className="mt-2 text-sm font-medium text-inputPrimary">
                <button
                  type="button"
                  onClick={() => {
                    window.alert("請聯絡教務處");
                  }}
                >
                  忘記密碼？
                </button>
                <Link href={"/school/getId"} type="button">
                  ｜我要查詢帳號
                </Link>
              </div>
              <div
                className={`${AppData.device_info.operate_type == "PWA" ? "pb-deviceBottom" : ""} fixed left-0 z-50 bottom-0 bg-background dark:bg-zinc-900 shadow-black shadow-xl w-full flex p-8 py-5 border-t-2 border-zinc-200 dark:border-zinc-800`}
              >
                <Link
                  href={"/"}
                  className="w-fit mr-3 text-sky-950 dark:text-white whitespace-nowrap p-3 px-8 font-medium rounded-[30px] bg-hoverbg hover:bg-buttonBg transition-all"
                >
                  取消
                </Link>
                <button className="dark:bg-foreground bg-sky-950 text-background p-3 rounded-[30px] font-medium w-full hover:opacity-80 transition-all">
                  繼續
                </button>
              </div>
            </div>
          </form>
          <div className="flex gap-3 items-center pt-5 w-full px-5 pb-3 mt-8 border-t border-borderColor">
            <Info />
            <div>
              <h1 className="font-medium text-[16px] flex items-center gap-2">
                使用須知
              </h1>
              <p className="text-[12px] opacity-50">
                當你按下繼續，即同意此使用須知。
              </p>
            </div>
          </div>
          <div className="px-5">
            <div className="w-full flex flex-col p-5 bg-zinc-100 dark:bg-hoverbg rounded-[30px] mt-2">
              <p className="opacity-50 text-sm whitespace-pre-line">
                此系統將會使用您提供之帳號密碼進行登入，並僅會獲取您請求的資料（例如：學期成績、單項段考成績）。所有資料皆不會直接儲存在任何地方，全部以雲端方式儲存在高雄市教育局校務行政系統伺服器。本APP為開源專案，如有疑慮可上
                Github 查詢程式碼或是聯絡林園高中學生會。
              </p>
              <Link
                href={"https://www.instagram.com/lyca_22nd"}
                className="bg-sky-950 dark:bg-white rounded-[20px] p-2 px-5 mt-5 text-background w-fit text-sm font-medium"
              >
                聯絡我們
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
