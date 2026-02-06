"use client";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hook";
import { Class, Grade } from "@/types";
import Image from "next/image";

export default function Page() {
  const userData = useAppSelector((state) => state.userData);

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
    <div className={`relative flex flex-col gap-5 w-full px-5 min-h-dvh`}>
      <div className="w-full">
        <div className="overflow-hidden relative bg-gradient-to-br from-sky-50 dark:from-sky-950 to-white dark:to-hoverbg border-zinc-200 dark:border-borderColor border p-6 pb-0 rounded-2xl shadow-lg shadow-zinc-200/50 dark:shadow-zinc-800 rotate-2 mt-3">
          <DotPattern
            className={cn(
              "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
              "opacity-50 z-0",
            )}
          />

          <div className="z-10 font-medium w-full flex flex-col gap-1.5 justify-center ">
            <Image
              alt="logo"
              src={`/logo.svg`}
              width={30}
              height={30}
              className="dark:invert"
            />
            <p className="text-sm opacity-50">LYHS+ 會員</p>
            <p className="text-3xl opacity-80">{userData.name}</p>
          </div>
          <div className="relative flex items-center text-sm w-full mt-2 border-t font-medium border-dashed border-borderColor pt-2">
            <div className="z-20 flex opacity-50">
              <p>會員編號 #{userData.id}</p>
            </div>
            <div className="z-20 flex opacity-50">
              <p>｜學校 林園高中</p>
            </div>
          </div>
          <div className="mt-32 mb-3">
            <p className="text-3xl opacity-30 font-custom2 font-bold">
              2025 © LYSA
            </p>
            <p className="text-sm font-medium opacity-30">
              此會員身份由林園高中學生會發行
            </p>
          </div>
        </div>
      </div>
      <div className="w-full relative flex flex-col gap-1 mb-32 mt-3 border-t border-borderColor pt-5">
        <div className="w-full px-3">
          <p className="opacity-50 text-[15px]">基本資料</p>
        </div>
        <div className="flex flex-col justify-start relative w-full gap-3 bg-hoverbg rounded-3xl p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px]">電子郵件</h3>
            <p className="text-[16px]">{userData.email}</p>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-[16px]">身份</h3>
            <p className="text-[16px]">
              {userData.type === "staff" ? "管理人員" : "一般使用者"}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-[16px]">班級</h3>
            <p className="text-[16px]">
              {Grade[userData.grade as keyof typeof Grade]}
              {Class[userData.class as keyof typeof Class]}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-[16px]">座號</h3>
            <p className="text-[16px] text-right">{userData.number}</p>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-[16px]">學號</h3>
            <p className="text-[16px] text-right">{userData.stu_id}</p>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-[16px]">ID</h3>
            <p className="text-[16px] text-right">{userData.id}</p>
          </div>
        </div>
        <div className="w-full relative mt-3">
          <button className="rounded-full bg-inputPrimary w-full p-2 flex items-center justify-center">
            會費繳交證明
          </button>
        </div>
      </div>
    </div>
  );
}
