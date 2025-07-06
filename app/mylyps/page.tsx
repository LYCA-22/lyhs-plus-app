"use client";

import { useAppSelector } from "@/store/hook";

export default function Page() {
  const userData = useAppSelector((state) => state.userData);

  const AppData = useAppSelector((state) => state.systemData);

  /*
    const dispatch = useAppDispatch();
    import { updateSystemData } from "@/store/systemSlice";
    import { apiService } from "@/services/api";
  const Logout = async (sessionId: string) => {
    try {
      dispatch(
        updateSystemData({
          isLoading: true,
        }),
      );
      await apiService.Logout(sessionId);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        dispatch(
          updateSystemData({
            isLoading: false,
          }),
        );
      }, 500);
    }
  };
  */

  return (
    <div
      className={`relative flex flex-col gap-5 w-full p-5 min-h-dvh ${AppData.isPwa ? "pt-deviceTop" : "pt-5"}`}
    >
      <p className="font-custom font-bold mb-2">MyLYPS 帳號管理中心</p>
      <div className="bg-white w-full p-5 rounded-[30px]">
        <h2 className="text-3xl font-custom font-medium">{userData.name}</h2>
        <div className="flex items-center justify-evenly relative pt-3 border-t-2 border-t-borderColor mt-3">
          <div className="flex flex-col items-center justify-center w-20">
            <h3 className="text-sm">身份</h3>
            <p className="text-[16px]">
              {userData.type === "staff" ? "管理人員" : "一般使用者"}
            </p>
          </div>
          <div className="h-10 w-[2px] bg-borderColor"></div>
          <div className="flex flex-col items-center justify-center w-20">
            <h3 className="text-sm">班級</h3>
            <p className="text-lg">{userData.class}</p>
          </div>
          <div className="h-10 w-[2px] bg-borderColor"></div>
          <div className="flex flex-col items-center justify-center w-20">
            <h3 className="text-sm">年級</h3>
            <p className="text-lg">{userData.grade}</p>
          </div>
        </div>
      </div>
      <div className="bg-white font-custom w-full p-5 rounded-[30px] flex relative">
        <div className="flex flex-col justify-start relative w-full gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px]">電子郵件</h3>
            <p className="text-[16px]">{userData.email}</p>
          </div>
          <div className="w-full bg-border h-[2px] rounded-full dark:bg-zinc-700 opacity-50 mt-1"></div>

          <div className="flex items-center justify-between">
            <h3 className="text-[16px]">身份</h3>
            <p className="text-[16px]">
              {userData.type === "staff" ? "管理人員" : "一般使用者"}
            </p>
          </div>
          <div className="w-full bg-border h-[2px] rounded-full dark:bg-zinc-700 opacity-50 mt-1"></div>

          <div className="flex items-center justify-between">
            <h3 className="text-[16px]">班級</h3>
            <p className="text-[16px]">{userData.class}</p>
          </div>
          <div className="w-full bg-border h-[2px] rounded-full dark:bg-zinc-700 opacity-50 mt-1"></div>

          <div className="flex items-center justify-between">
            <h3 className="text-[16px]">年級</h3>
            <p className="text-[16px]">{userData.grade}</p>
          </div>
          <div className="w-full bg-border h-[2px] rounded-full dark:bg-zinc-700 opacity-50 mt-1"></div>

          <div className="flex items-center justify-between">
            <h3 className="text-[16px]">ID</h3>
            <p className="text-[14px]">{userData.id}</p>
          </div>
          <div className="w-full bg-border h-[2px] rounded-full dark:bg-zinc-700 opacity-50 mt-1"></div>
        </div>
      </div>
    </div>
  );
}
