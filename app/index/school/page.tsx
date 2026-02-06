"use client";
import { apiService } from "@/services/api";
import { useAppSelector } from "@/store/hook";
import { updateSystemData } from "@/store/appSlice";
import { updateUserData } from "@/store/userSlice";
import { ChartPie, ChevronRight, CircleUser, Database } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Page() {
  const router = useRouter();
  const userData = useAppSelector((state) => state.userData);
  const [stdName, setStdName] = useState("");
  const [stdNo, setStdNo] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userData.JSESSIONID) {
      router.push("/school/login/openId");
    }
  }, [userData.JSESSIONID, router]);

  const getClassList = useCallback(async () => {
    if (!userData.school_session) {
      dispatch(
        updateSystemData({
          isLoading: false,
        }),
      );

      router.push("/school/login/openId");
      return;
    }

    dispatch(
      updateSystemData({
        isLoading: true,
      }),
    );

    try {
      const classList = await apiService.getSemeScore(
        userData.school_session,
        userData.JSESSIONID,
        userData.SRV,
      );

      const result = classList.result?.dataRows || [];

      if (result.length > 0) {
        setStdName(result[0]?.stdCname || "");
        setStdNo(result[0]?.stdNo || "");
      } else {
        setStdName("");
        setStdNo("");
      }

      dispatch(
        updateSystemData({
          isBack: false,
          isLoading: false,
        }),
      );
    } catch (error) {
      console.error("獲取學期成績時出錯:", error);
      window.alert("獲取成績資料時發生錯誤");

      dispatch(
        updateSystemData({
          isLoading: false,
        }),
      );
    }
  }, [dispatch, userData, setStdName, setStdNo, router]);

  useEffect(() => {
    getClassList();
  }, [getClassList]);

  const Logout = async () => {
    dispatch(
      updateSystemData({
        isLoading: true,
      }),
    );
    try {
      dispatch(
        updateUserData({
          JSESSIONID: "",
          school_session: "",
          SRV: "",
        }),
      );
    } catch (e) {
      console.error("登出時出錯:", e);
      window.alert("登出時發生錯誤");
    } finally {
      dispatch(
        updateSystemData({
          isLoading: false,
        }),
      );
    }
  };

  return (
    <div className="w-full relative">
      <div className="shadow-xl shadow-hoverbg  dark:shadow-zinc-800/50 bg-background flex items-center p-5 px-8 mb-3 justify-between">
        <div className="flex items-center gap-4">
          <CircleUser></CircleUser>
          <div>
            <h2 className="text-sm">林園高中 {stdNo}</h2>
            <h2 className="text-xl font-medium">{stdName} 同學</h2>
          </div>
        </div>
        <button
          onClick={() => Logout()}
          className="rounded-xl border border-inputPrimary font-medium p-2 px-3 hover:bg-inputPrimary hover:text-white transition-all"
        >
          登出
        </button>
      </div>
      <div className="my-2 w-full flex flex-col p-3 px-8">
        <div className="rounded-3xl overflow-hidden">
          <Link
            href={"/school/score"}
            className="p-3 border-b border-borderColor w-full flex justify-between items-center gap-2 text-lg hover:bg-hoverbg transition-colors"
          >
            <div className="flex items-center gap-3">
              <ChartPie />
              <p>成績查詢</p>
            </div>
            <ChevronRight className="opacity-50" />
          </Link>
          <Link
            href={"/school/absence"}
            className="p-3 w-full flex justify-between items-center gap-2 text-lg hover:bg-hoverbg transition-colors"
          >
            <div className="flex items-center gap-3">
              <Database />
              <p>缺曠課查詢</p>
            </div>
            <ChevronRight className="opacity-50" />
          </Link>
        </div>
      </div>
      <div className="px-5 mx-2">
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
  );
}
