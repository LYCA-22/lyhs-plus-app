"use client";

import { useAppSelector } from "@/store/hook";
import { updateSystemData } from "@/store/systemSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Page() {
  const userData = useAppSelector((state) => state.userData);
  const router = useRouter();
  const dispatch = useDispatch();

  // 確認資料正確
  useEffect(() => {
    if (!userData.school_session) {
      router.push("/school");
    }
  }, [userData.school_session, router]);

  useEffect(() => {
    const getAllCredit = async () => {
      try {
        dispatch(
          updateSystemData({
            isLoading: true,
          }),
        );
      } catch (error) {
        dispatch(
          updateSystemData({
            Error: (error as string) || "發生不明錯誤",
          }),
        );
      } finally {
        dispatch(
          updateSystemData({
            isLoading: false,
          }),
        );
      }
    };

    getAllCredit();
  }, [dispatch]);

  return;
}
